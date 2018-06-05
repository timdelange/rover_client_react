import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import LoginForm from './login_form';
import MainMenu from './main';
import Deliveries from './deliveries';
import Delivery from './delivery';
import DeliveryCustomerOrder from './delivery/delivery_customer_order';
import DeliveryDocumentForm  from './delivery/delivery_document_form';
import ImageView from './image_view';
import TankForm from './delivery/tank_form';
import SignaturePad from './signature_pad';
import Backend from '../backend';
import {
  sceneChange,
  loginInProgress,
  loginSuccess,
  logOut
} from '../actions';

const backend = new Backend();

class Router extends Component {
  componentWillMount() {
    window.onpopstate = (event) => {
      //prevent user from backing out with back button
      if (event.state) {
        if (event.state.bottom === true){
          this.props.sceneChange(event.state.scene,{pushState: true, bottom: true});
        } else {
          this.props.sceneChange(event.state.scene,{pushState: false, bottom: false});
        }
      }
    };
    //always present login when not logged in
    if (this.props.userId) {
      this.props.loginSuccess(true);
      if (this.props.scene === 'login')
      {
        this.props.sceneChange('main');
      } else {
        this.props.sceneChange(this.props.scene);
      }
    } else {
      console.log('show login, no userid');
      this.props.logOut(backend);
      //this.props.loginSuccess(false);
      //this.props.sceneChange('login');
    }
  }

  renderRoutes() {
    switch (this.props.scene) {
      case 'login':
        return (<LoginForm />);
      case 'deliveries':
        return (<Deliveries/>);
      case 'delivery':
        return (<Delivery/>);
      case 'customer_order':
        return (<DeliveryCustomerOrder/>);
      case 'image_view':
        return (<ImageView/>);
      case 'signature_pad':
        return (<SignaturePad/>);
      case 'tank_form':
        return (<TankForm/>);
      case 'delivery_document_form':
        return (<DeliveryDocumentForm/>);
      case 'main':
        return (<MainMenu/>);
      }
      //default
      return (<MainMenu/>);
    }
    render() {
    // console.log({ scene: this.props.scene});
      if (_.isNull(this.props.userId)) return (<LoginForm/>);
      return this.renderRoutes();
    }
}

const mapStateToProps = (state) => {
  const { scene } = state.route;
  const { loggedIn } = state.auth;
  return { scene, loggedIn };
};

const reduxHOC = connect(mapStateToProps, {
  sceneChange,
  loginInProgress,
  loginSuccess,
  logOut
 });
const meteorHOC = withTracker(props => {
  return { userId: Meteor.userId(), user: Meteor.user()};
});

export default compose(meteorHOC, reduxHOC)(Router);

