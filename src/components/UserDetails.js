import { useEffect, useState } from "react";

function UserDetails(props) {
  const { activeUserDetail } = props;
  // const [additionalDetails, setAdditionalDetails] = useState({})
  const [userRepos, setUserRepos] = useState([])

  useEffect(() => {
    fetch(activeUserDetail.repos_url, {
      mode: "cors",
      headers: {
        Authorization: process.env.REACT_APP_GITHUB_API_KEY
      }
    })
    .then(res => res.json())
    .then(res => {
      setUserRepos(res)
    })
  }, [])
  
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
        </div>
      </div>
      <div>
        {/* {
          userRepos.length > 0 ? userRepos.map(repo => 
              <div className="">

              </div>
            )
        } */}
      </div>
    </div>
  );
}

export default UserDetails;
