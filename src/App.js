import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Userpage from './components/UserPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/users/:id" >
          <div className="fade-in">
            <Userpage />
          </div>
        </Route>
        <Route exact path="/users" component={Userpage} >
          <Userpage />
        </Route>
        <Route path = "*" >
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
