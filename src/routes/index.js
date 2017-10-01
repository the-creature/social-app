import { Switch, Route, Link } from 'react-router-dom';
import AsyncHomePage from 'routes/homepage';
import AsyncProfile from 'routes/profile';

const Routing = () => (
  <div>
    <Link to="/">HomePage</Link>
    <Link to="/profile">Profile</Link>
    <Switch>
      <Route path="/profile" component={AsyncProfile} />
      <Route path="/" component={AsyncHomePage} />
    </Switch>
  </div>
);

export default Routing;
