import { useEffect, useState } from "react";
import GitHubColors from "github-colors";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import moment from "moment";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          beginAtZero: true
        },
      }
    ]
  }
};

const daysArray = Array.from(Array(30), (ele, i) => ``)

function UserDetails(props) {
  const { activeUserDetail } = props;
  console.log(GitHubColors.get("C++"))
  // const [additionalDetails, setAdditionalDetails] = useState({})
  const [userRepos, setUserRepos] = useState([])
  const [repoDatapoints, setRepoDatapoints] = useState([])
  const history = useHistory()

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
          const monthDatapoints = Array.from(Array(30), () => 0);
          const currentDate = new moment()
          const previousDate = new moment().subtract(30, 'days')

          res.forEach(commit => {
            // Check if commit was within the last 30 days
            const commitDate = moment(commit.commit.committer.date)
            if (commitDate.isBetween(previousDate, currentDate)) {
              const day = currentDate.diff(commitDate, 'days')
              monthDatapoints[30 - day] = monthDatapoints[30 - day] + 1;
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
          <Link to={{pathname: activeUserDetail.html_url}} target="_blank"><i class="fab fa-github-square" />Profile Page</Link>
        </div>
      </div>
      <div className="user-repo-container">
        {
          userRepos.length > 0 ? userRepos.map((repo, i) => 
          <div className="repo-container">
            <div className="language-ring" style={{"--languageColor": repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black"}}/>
            <Link to={{pathname: activeUserDetail.html_url}} target="_blank"><i class="fab fa-github-square" /> {repo.name}</Link>
            <span className="repo-language">{repo.language}</span>
            <span>Last Updated <b>{new Date(repo.updated_at).toLocaleDateString("en-US")}</b></span>
            <span className="repo-description">{repo.description}</span>
            <Line data={
              { 
                labels: daysArray, 
                datasets: [
                  {
                    label: "# of commits", 
                    data: repoDatapoints[i], 
                    fill: false, 
                    backgroundColor: repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black",
                    borderColor: repo.language && GitHubColors.get(repo.language) ? GitHubColors.get(repo.language).color : "black",
                    pointRadius: 0
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
