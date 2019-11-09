import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import './App.css';
import { history } from '../../_helpers';
import { Dashboard, Login, Keytool, Banner, Menu, PrivateRoute } from '..';

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      // this.props.clearAlerts();
    });
  }

  render() {
    const title = "PLS Self Service"

    return (
      <div>
        <Banner title={title} />

        <Router history={history}>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/" render={({ location, history }) => (
              <React.Fragment>
                <div
                  style={{
                    position: 'relative',
                    height: 'calc(100vh - 61px)'
                  }}>
                  <Menu location={location} history={history} />
                  <Main>
                    <Switch>
                      <PrivateRoute path="/dashboard" exact component={Dashboard} />
                      <PrivateRoute path="/keytool" component={Keytool} />
                      <Redirect from="*" to="/dashboard" />
                    </Switch>
                  </Main>
                </div>
              </React.Fragment>
            )} />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const actionCreators = {

}

const connectedApp = connect(mapStateToProps, actionCreators)(App);
export { connectedApp as App };
