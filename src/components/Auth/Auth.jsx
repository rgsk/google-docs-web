import React from 'react';
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router';
import Signup from './Signup';
import PrivateRoute from '../PrivateRoute';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import UpdateProfile from './UpdateProfile';
function Auth() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
      }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: '400px',
        }}
      >
        <Switch>
          <Route path="/auth/signup" exact component={Signup}></Route>
          <PrivateRoute path="/auth" exact component={Dashboard}></PrivateRoute>
          <PrivateRoute
            path="/auth/update-profile"
            exact
            component={UpdateProfile}
          ></PrivateRoute>
          <Route path="/auth/login" exact component={Login}></Route>
          <Route
            path="/auth/forgot-password"
            exact
            component={ForgotPassword}
          ></Route>
        </Switch>
      </div>
    </Container>
  );
}

export default Auth;
