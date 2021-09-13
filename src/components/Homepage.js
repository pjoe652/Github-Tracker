import Particles from "react-particles-js";
import { useHistory } from "react-router";
import { particleParams, particleStyle } from "../constants/particle";

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
