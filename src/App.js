import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Homepage from './components/Homepage';
import UserDetails from './components/UserDetails';
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
    </Router>
  );
}

export default App;
