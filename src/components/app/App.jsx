import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import { history } from '../../_helpers';
import { Dashboard, Login, Keytool, Banner } from '..';

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
      <div name="container" className="container">
        <Banner title={title} />

        <Route path="/login" component={Login} />
        <Route path="/" exact component={Dashboard} />
        <Route path="/keytool" component={Keytool} />
        <Redirect from="*" to="/" />
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
