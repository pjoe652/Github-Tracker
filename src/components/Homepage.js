import { useEffect } from "react";
import Particles from "react-particles-js";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { particleParams, particleStyle } from "../constants/particle";
import queryString from "query-string";

function Homepage() {
  const history = useHistory()

  return (
    <div className="homepage-container">
      <Particles height="100vh" width="100vw" style={particleStyle} params={particleParams}/>
      <div className="homepage-main">
        <span className="title">Welcome to Github Tracker</span>
        <i className="fab fa-github-alt" />
        <div className="start-tracking" onClick={() => history.push("/users")}>Start Tracking!</div>
      </div>
    </div>
  );
}

export default Homepage;
