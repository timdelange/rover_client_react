import React, {Component}  from 'react';
import ReactDOM  from 'react-dom';
import { Provider } from 'react-redux';
import Store from './imports/store';
import RoverApp from './imports/rover-app';
import xtests from './imports/xtests';
import initReactFastclick from 'react-fastclick';

initReactFastclick();

class RoverAppRoot extends Component {
  componentWillMount() {
    //window.xtests = xtests;
    window.history.replaceState({scene: 'first',bottom: true}, 'first');
    Reloader.configure({check: false, refresh: 'start'} );
  }
  componentWillUnmount() {
  }
  render () {
    return (
        <div className='rover-top-container'>
          <Provider store={Store}>
            <RoverApp/>
          </Provider>
        </div>
    );
  }
}

Meteor.startup(()=> {
  ReactDOM.render(
    <RoverAppRoot />,
      document.getElementById('app')
  );
});
