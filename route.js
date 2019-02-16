import React, { Component } from 'react';
import {Router, Scene , Actions } from 'react-native-router-flux';
import Home from './components/home'
import Results from './components/results';

export default class Route extends Component{
  render() {
    return (
      <Router>
        <Scene key="root">
            <Scene 
            key="home"
            component={Home}
            hideNavBar={true}
            initial={true}
            />
            <Scene 
            key="results"
            component={Results}
            hideNavBar={true}
            initial={false}
            />
          </Scene>
        </Router>
  );
  }
}

