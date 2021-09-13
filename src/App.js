import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Userpage from './components/UserPage';

function App() {
  return (
    <Router>
      <Route exact path="/users/:id">
        <Userpage />
      </Route>
      <Route exact path="/users">
        <Userpage />
      </Route>
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Router>
  );
}

export default App;
