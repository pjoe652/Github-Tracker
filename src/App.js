import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import UserSearch from './components/UserSearch';
import Homepage from './components/Homepage';

function App() {
  return (
    <Router>
      <Route exact path="users/:id">
        <UserSearch />
      </Route>
      <Route exact path="users">
        <UserSearch />
      </Route>
      <Route exact path="/">
        <Homepage />
      </Route>
    </Router>
  );
}

export default App;
