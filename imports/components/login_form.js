import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  usernameChanged,
  passwordChanged,
  requestLogin
} from '../actions';

import Backend from '../backend';

const backend = new Backend();

class LoginForm extends Component {
    state = { logoClicked: 0, loginMessage: null };
    onLoginPressed() {
      this.props.requestLogin(this.props.username, this.props.password, backend);
    }

    onLogoClicked() {
        this.setState({logoClicked: this.state.logoClicked + 1});
    }

    renderLoginMessage() {
      if (this.props.loginMessage) {
        return (<div className="alert alert-danger" >{this.props.loginMessage}</div>);
      }
    }

    targetValue(actionCreator) {
     return (e) => {
        actionCreator(e.target.value);
     };
    }

    render() {
      history.pushState({scene: 'login', bottom: true }, 'login');
      history.pushState({scene: 'login', bottom: true }, 'login');
        return (
            <div className="container loginForm" >
              <form role="form">
                  <div className="form-group">
                    <label htmlFor="username">Login</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder="eg. frikkie"
                        value={this.props.username}
                        onChange={this.targetValue(this.props.usernameChanged)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="**secret**"
                        value={this.props.password}
                        onChange={this.targetValue(this.props.passwordChanged)}
                    />
                  </div>
                {this.renderLoginMessage()}
                <button type="button" className="btn btn-primary login-button" onClick={this.onLoginPressed.bind(this)}>Sign In</button>
                <div id="login-logo-wrapper">
                  <br/><br/>
                  <img onClick={this.onLogoClicked.bind(this)} className="login-logo" src={Meteor.settings.public.logo}/>
                  <div style={{'fontSize': 'x-small'}} >{this.props.logoClicked}</div>
                </div>
              </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  const { username, password, inProgress, loginMessage } = auth;
  return { username, password, inProgress, loginMessage };
};

export default connect(mapStateToProps, {
    usernameChanged,
    passwordChanged,
    requestLogin
  }
)(LoginForm);
