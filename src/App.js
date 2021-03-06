import React, { Component } from 'react';
import './App.css';

import ChatList from './ChatList';
import Chatroom from './Chatroom';
import LoginBox from './LoginBox';

import { newNKNClient, getNKNAddr } from './nkn';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      chatWith: null,
      messages: {},
    };
  }

  login = (username) => {
    // bluezelle: initialize client
    // bluezelle: get chat history
    // bluezelle: get friends

    this.nknClient = newNKNClient(username);
    this.nknClient.on('message', (src, payload, payloadType) => {
      let username = src.split('.')[0];
      this.receiveMessage(username, username, payload);
    });

    this.setState({
      username: username,
      messages: {},
    });
  }

  receiveMessage = (chat, username, message) => {
    let messageList = this.state.messages[chat] || [];

    messageList.push({
      username: username,
      content: <p>{message}</p>,
      img: "http://i.imgur.com/Tj5DGiO.jpg",
    });

    this.setState({
      messages: Object.assign(this.state.messages, { [chat]: messageList }),
    });
  }

  sendMessage = (username, message) => {
    this.nknClient.send(getNKNAddr(username), message);
  }

  enterChatroom = (chat) => {
    this.setState({
      chatWith: chat,
    });
  }

  render() {
    return (
      <div className="App">
        {
          this.state.username ?
          (
            this.state.chatWith ?
            <Chatroom
              myUsername={this.state.username}
              friendUsername={this.state.chatWith}
              messages={this.state.messages[this.state.chatWith] || []}
              receiveMessage={this.receiveMessage}
              sendMessage={this.sendMessage}
              leaveChatroom={() => this.enterChatroom(null)}
              />
            :
            <ChatList
              chats={this.state.messages}
              enterChatroom={this.enterChatroom}
              />
          )
          :
          <LoginBox login={this.login}/>
        }
      </div>
    );
  }
}

export default App;
