import React, { Component } from 'react';
import rtc from 'webrtc.io';
import logo from './logo.svg';
import './App.css';

var connection = null;
var clientID = Math.floor(Math.random() * 100);

var WebSocket = window.WebSocket || window.MozWebSocket;

class App extends Component {
  componentDidMount() {
    // const configuration = {
    //
    // }
    // const pc = new RTCPeerConnection([configuration]);
    // console.log('pc',pc);
    //
    // pc.ontrack = function(event) {
    //   document.getElementById("received_video").srcObject = event.streams[0];
    //   document.getElementById("hangup-button").disabled = false;
    // };
  }

  setUsername = () => {
    var msg = {
      name: document.getElementById('name').value,
      date: Date.now(),
      id: clientID,
      type: 'username',
    };
    connection.send(JSON.stringify(msg));
  };

  send = () => {
    var msg = {
      text: document.getElementById('text').value,
      type: 'message',
      id: clientID,
      date: Date.now(),
    };
    connection.send(JSON.stringify(msg));
    document.getElementById('text').value = '';
  };

  handleKey = evt => {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      if (!document.getElementById('send').disabled) {
        this.send();
      }
    }
  };

  connect = () => {
    var serverUrl = 'ws://' + window.location.hostname + ':8080';

    connection = new WebSocket(serverUrl);

    connection.onopen = function(evt) {
      document.getElementById('text').disabled = false;
      document.getElementById('send').disabled = false;
    };

    connection.onmessage = function(evt) {
      var f = document.getElementById('chatbox').contentDocument;
      var text = '';
      var msg = JSON.parse(evt.data);
      var time = new Date(msg.date);
      var timeStr = time.toLocaleTimeString();

      switch (msg.type) {
        case 'id':
          clientID = msg.id;
          this.setUsername();
          break;
        case 'username':
          text =
            '<b>User <em>' +
            msg.name +
            '</em> signed in at ' +
            timeStr +
            '</b><br>';
          break;
        case 'message':
          text =
            '(' + timeStr + ') <b>' + msg.name + '</b>: ' + msg.text + '<br>';
          break;
        case 'rejectusername':
          text =
            '<b>Your username has been set to <em>' +
            msg.name +
            '</em> because the name you chose is in use.</b><br>';
          break;
        case 'userlist':
          var ul = '';
          var i;

          for (i = 0; i < msg.users.length; i++) {
            ul += msg.users[i] + '<br>';
          }
          document.getElementById('userlistbox').innerHTML = ul;
          break;
      }

      if (text.length) {
        f.write(text);
        document.getElementById('chatbox').contentWindow.scrollByPages(1);
      }
    };
  };

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

        <p>
          This is a simple chat system implemented using WebSockets. It works by
          sending packets of JSON back and forth with the server.
        </p>
        <p class="mdn-disclaimer">
          This text and audio/video chat example is offered as-is for
          demonstration purposes only, and should not be used for any other
          purpose.
        </p>
        <p>
          Enter a username:{' '}
          <input id="name" type="text" maxLength="12" placeholder="Your name" />
          <input
            type="button"
            name="login"
            value="Log in"
            onClick={this.connect}
          />
        </p>
        <table border="0" width="100%">
          <tr height="100%">
            <td width="120px" align="top" border="1" height="100%">
              <div
                id="userlistbox"
                style={{
                  border: '1px solid black',
                  width: '100%',
                  height: '100%',
                }}
              />
            </td>
            <td>
              <iframe width="100%" height="400px" id="chatbox" />
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <p>
                Chat:
                <input
                  id="text"
                  type="text"
                  name="text"
                  size="80"
                  value=""
                  maxLength="256"
                  placeholder="Chat with us!"
                  autoComplete="off"
                  onKeyUp={e => this.handleKey(e)}
                  disabled
                />
                <input
                  type="button"
                  id="send"
                  name="send"
                  value="Send"
                  onClick={this.send}
                  disabled
                />
              </p>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default App;
