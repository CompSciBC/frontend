import React, { useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './chat.css';
import { useParams } from 'react-router-dom';

let stompClient: any = null;

function Chat() {
  const { resId } = useParams();
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: ''
  });
  /* use a map on=bject where key is a receiver and value is a message
  */
  const [privateChats, setPrivateChats] = useState(new Map());
  /* set as a string
  */
  const [tab, setTab] = useState('');

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };
  /* set a key for private chat map object: guest or hust depending who signs in
  */
  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe('/user/' + userData.username + (resId ?? 'unknown') + '/private', onPrivateMessage);
    if (userData.username === 'Guest') {
      const list: never[] = [];
      privateChats.set('Host', list);
      setPrivateChats(new Map(privateChats));
      setTab('Host');
    } else {
      const list: never[] = [];
      privateChats.set('Guest', list);
      setPrivateChats(new Map(privateChats));
      setTab('Guest');
    }
  };

  const onPrivateMessage = (payload: any) => {
    console.log(payload);
    const payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      const list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const handleMessage = (event: any) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };
  const sendPrivateValue = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        reservationID: resId,
        message: userData.message,
        status: 'MESSAGE'
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };
  return (
    <div className="container">
      {userData.connected
        ? <div className="chat-box">

          {<div className="chat-content">
            <ul className="chat-messages">
              {[...privateChats.get(tab)].map((chat, index) => (
                <li className={`message ${chat.senderName === userData.username ? 'self' : ''}`} key={index}>
                  {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
              <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
            </div>
          </div>}
        </div>
        : <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            // margin="normal"
          />
          <button type="button" onClick={registerUser}>
                    connect
          </button>
        </div>}
    </div>

  );
}

export default Chat;
