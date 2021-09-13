import { useEffect } from "react";
import Particles from "react-particles-js";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { particleParams, particleStyle } from "../constants/particle";
import queryString from "query-string";

function Homepage() {
  const history = useHistory()
  const query = queryString.parse(useLocation().search)

  useEffect(() => {
    if (query && query.code) {
      fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}&code=${query.code}`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json())
      .then(res => {
        console.log(res)
      })
    }
  }, [])

  return (
    <div className="homepage-container">
      <Particles height="100vh" width="100vw" style={particleStyle} params={particleParams}/>
      <div className="homepage-main">
        <span className="title">Welcome to Github Tracker</span>
        <i className="fab fa-github-alt" />
        <a href="https://github.com/login/oauth/authorize?client_id=842ec07a2cc3f8f442ce"><div className="start-tracking">Start Tracking!</div></a>
      </div>
    </div>
  );
}

export default Homepage;
