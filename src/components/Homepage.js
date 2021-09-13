import { useHistory } from "react-router";

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
