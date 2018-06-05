import React, { Component } from 'react';
import { sceneChange, logOut } from '../actions/';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Backend from '../backend';
import { deepGet } from "../../../imports/utils";

const backend = new Backend();

class MenuItem extends Component {
  render() {
    return (
      <div className='menu-item col-xs-6 col-md-3'>
        {this.props.item.display &&
          <div className="thumbmail menu-link">
            <div  onClick={this.props.item.onClick}>
              <img className="menu-icon-img" src={this.props.item.icon}/>
              <p className="menu-item-text">{this.props.item.desc}</p>
            </div>
          </div>
        }
      </div>
    );
  }
}

class MainMenu extends Component {
  render() {
    //Keep back button from going back to login
    history.pushState({scene: 'main', bottom: true }, 'main');
    history.pushState({scene: 'main', bottom: true }, 'main');
    const menuItemDefinitions = [
      {
        desc: 'Deliveries',
        display: true,
        icon: '/images/truck-icon.png',
        url: '/#/deliveries',
        onClick: () => {
          this.props.sceneChange('deliveries');
        }
      }, {
        desc: 'Logout',
        display: this.props.connected,
        icon: '/images/logout.png',
        url: '/#/logout',
        onClick: () => {
          this.props.logOut(backend)
        }
      },
    ];

    return (
        <div>
	<div className='container bf-page'>
		<div className='menu-div' >
      {
        menuItemDefinitions.map((item,index) => {
          return (<MenuItem key={index} item={item} />);
        })
      }
		</div>
		<br/>

		<div id="logged_in_as_msg" className="alert alert-info">You are logged in as {this.props.userName}</div>

    <br/>
		<div  className="menu-logo"><img src={Meteor.settings.public.menuLogo}/></div>
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
      sceneChange,
      logOut
    }
);

const meteorHOC =  withTracker(props => {
  return {
    connected: Meteor.connection.status().connected,
    userName: deepGet(Accounts.user(), 'username'),
    userId: Meteor.userId()
  };
});

export default compose(meteorHOC,reduxHOC)(MainMenu);
