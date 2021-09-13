import { useEffect, useState } from "react";
import GitHubColors from "github-colors";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import moment from "moment";

const options = {
  hover: {
    mode: "nearest",
  },
  tooltips: {
    mode: "nearest"
  },
  animation: {
    duration: 0
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true
      },
      grid: {
        display: false,
        color: "rgba(255, 255, 255, 0.1)"
      },
      min: 0
    },
    x: {
      grid: {
        display: false,
        color: "rgba(255, 255, 255, 0.1)"
      }
    }
  }
};

function UserDetails(props) {
  const { activeUserDetail } = props;
  const [userRepos, setUserRepos] = useState([])
  const [repoDatapoints, setRepoDatapoints] = useState([])

  useEffect(() => {
    fetch(activeUserDetail.repos_url, {
      mode: "cors",
      headers: {
        Authorization: process.env.REACT_APP_GITHUB_API_KEY
      }
    })
    .then(res => res.json())
    .then(res => {
      setUserRepos(res.sort((a, b) => {return Date.parse(b.updated_at) - Date.parse(a.updated_at)}))
    })
  }, [activeUserDetail])

  useEffect(() => {
    getRepoCommits().then(res => {
      setRepoDatapoints(res)
    })
  }, [userRepos])

  const getRepoCommits = () => {
    return Promise.all(userRepos.map(repo => {
      return fetch(`https://api.github.com/repos/${activeUserDetail.login}/${repo.name}/commits`, {
        mode: "cors",
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_API_KEY
        }
      })
      .then(res => res.json())
      .then((res) => {
        if (!res.message) {
          // Initialize an array with 0 commits across 30 days
          const monthDatapoints = Array.from(Array(30), (ele, i) => { return {x: new moment().subtract(30 - i, 'days').format('DD-MM-YYYY'), y: 0} });
          const currentDate = new moment()
          const previousDate = new moment().subtract(30, 'days')

          res.forEach(commit => {
            // Check if commit was within the last 30 days
            const commitDate = moment(commit.commit.committer.date)
            if (commitDate.isBetween(previousDate, currentDate)) {
              const day = currentDate.diff(commitDate, 'days')
              monthDatapoints[29 - day].y = monthDatapoints[29 - day].y + 1;
            }
          })
          return monthDatapoints;
        }
      })
    }))
  }
  
  return (
    <div className="user-details-container">
      <div className="user-details-main">
        <img src={activeUserDetail.avatar_url} />
        <div className="user-personal-details">
          <span className="name">{activeUserDetail.login}</span>
          { activeUserDetail.name ? <span className="name">{activeUserDetail.name}</span> : null }
          { activeUserDetail.company ? <span className="company">{activeUserDetail.company}</span> : null }
          { activeUserDetail.email ? <span className="email">{activeUserDetail.email}</span> : null }
          <span className="minor"><b>{activeUserDetail.public_repos}</b> public repositories</span>
          <span className="minor"><b>{activeUserDetail.followers}</b> {activeUserDetail.followers === 1 ? "follower" : "followers"}</span>
          <span className="minor"><b>{activeUserDetail.following}</b> following</span>
          <Link to={{pathname: activeUserDetail.html_url}} target="_blank"><i className="fab fa-github-square" />Profile Page</Link>
        </div>
      </div>
      <div className="user-repo-container">
        {
          userRepos.length > 0 ? userRepos.map((repo, i) => 
          <div className="repo-container">
            <div className="language-ring" style={{"--languageColor": repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black"}}/>
            <Link to={{pathname: activeUserDetail.html_url}} target="_blank"><i className="fab fa-github-square" /> {repo.name}</Link>
            <span className="repo-language">{repo.language}</span>
            <span>Last Updated <b>{new Date(repo.updated_at).toLocaleDateString("en-US")}</b></span>
            <span className="repo-description">{repo.description}</span>
            <span className="graph-title">Recent Commit Activity (30 days)</span>
            <Line data={
              { 
                datasets: [
                  {
                    label: "# of commits", 
                    data: repoDatapoints[i], 
                    fill: false, 
                    backgroundColor: repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black",
                    borderColor: repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black",
                  }
                ]
              }
              } options={options}/>
          </div>
          )
          :
          null
        }
      </div>
    </div>
  );
}

export default UserDetails;
