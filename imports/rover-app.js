import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import Router from './components/router';
import classnames from 'classnames';
import { sceneChange } from "./actions";



class RoverApp extends React.Component {

  reconnect() {
    Meteor.connection.reconnect();
  }

  onHeaderLogoClick() {
    //history.back();
    this.props.sceneChange('main');
  }

  renderDisconnectedIcon() {
    const classes = {'hidden': true, 'pull-right': true, 'disconnect-icon': true };
    if (! this.props.connected ) {
      classes.hidden = false;
    }
    return (
        <img onClick={this.reconnect} className={classnames(classes)}
             src="/images/disconnected.png"/>
    );
  }
  render() {
    let messageStyle = {};
    if (_.has(Meteor.settings.public,'VersionMessage')) {
      messageStyle={display: 'block'};
    }


    return (
        <div className="rover-container">
          <nav className="navbar navbar-default bf-navbar-top">
            <div>
              <div className="header-logo">
                <div onClick={this.onHeaderLogoClick.bind(this)}>
                  <img src={Meteor.settings.public.headerLogo} />
                </div>
              </div>
              {this.renderDisconnectedIcon()}
            </div>
            <div style={messageStyle}
                 className="text-center version-message pull-right">
              {Meteor.settings.public.VersionMessage}<br/>{Meteor.settings.public.Build}
            </div>
          </nav>
          <div className='rover-container'>
            <Router/>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  const { loggedIn } = auth;
  return { loggedIn };
};

const reduxHOC =  connect(mapStateToProps, {
      sceneChange
    }
);

const meteorHOC =  withTracker(props => {
  let updateAvailable = false;
  if (_.has(Reloader, 'updateAvailable'))
    updateAvailable=Reloader.updateAvailable.get();
  return {
    connected: Meteor.connection.status().connected,
    updateAvailable: updateAvailable
  };
});

export default compose(meteorHOC,reduxHOC)(RoverApp);
