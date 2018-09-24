import React, { Component } from 'react';
import rtc from 'webrtc.io';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    const configuration = {
    
    }
    const pc = new RTCPeerConnection([configuration]);
    console.log('pc',pc);
  
    pc.ontrack = function(event) {
      document.getElementById("received_video").srcObject = event.streams[0];
      document.getElementById("hangup-button").disabled = false;
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <video id="local" autoPlay="autoplay" />
        <video id="received_video" autoPlay="autoplay" />
        <button id="hangug-button"> hang up </button>
      </div>
    );
  }
}

export default App;
