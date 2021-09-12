import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

function Homepage() {
  const history = useHistory()

  return (
    <div className="homepage-container">
      <div className="homepage-main">
        <span className="title">Welcome to Github Tracker</span>
        <i class="fab fa-github-alt" />
        <div className="start-tracking" onClick={() => history.push("/users")}>Start Tracking!</div>
      </div>
    </div>
  );
}

export default Homepage;
