import React, { useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';


let stompClient: any = null;

function Chat() {
  const { resId } = useParams() as {resId: string};
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
    fetch('/api/chat/private-message/' + resId, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async response => await response.json())
      .then (messages => {
        const Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, () => {onConnected(messages);}, onError);
      });
  };
  /* set a key for private chat map object: guest or hust depending who signs in
  */
  const onConnected = (messages: []) => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe('/user/' + userData.username + resId + '/private', onPrivateMessage);
    if (userData.username === 'Guest') {
      const list: never[] = messages;
      privateChats.set('Host', list);
      setPrivateChats(new Map(privateChats));
      setTab('Host');
    } else {
      const list: never[] = messages;
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
        reservationId: resId,
        message: userData.message                     
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }

      stompClient.send(`/app/private-message`, {}, JSON.stringify(chatMessage));
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
    <Container id='container'>
      {userData.connected
        ? <><ChatBox id='chat-box'>
          {<ChatContent id='chat-content'>
            <ChatMessages id='chat-messages'>
              {[...privateChats.get(tab)].map((chat, index) => (
                <Message id='message' self={chat.senderName === userData.username} key={index}>
                  {chat.senderName !== userData.username && <Avatar>{chat.senderName}</Avatar>}.
                  <MessageData id='message-data'>{chat.message}</MessageData>
                  {chat.senderName === userData.username && <AvatarSelf>{chat.senderName}</AvatarSelf>}
                </Message>
              ))}
            </ChatMessages>
          </ChatContent>}
        </ChatBox>
        <SendMessage id='send-message'>
          <Input id='input' userType={userData.username} placeholder="enter the message" value={userData.message} onChange={handleMessage} />
          <SendButton onClick={sendPrivateValue}>send</SendButton>
        </SendMessage></>
        : <Register id='register'>
          <InputRegister 
            id='user-name'
            placeholder='Enter your name'
            name='userName'
            value={userData.username}
            onChange={handleUsername}
          />
          <Button type='button' onClick={registerUser}>connect</Button>
        </Register>      
      }      
    </Container>
  );  
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  align-content: center;  
  justify-content: center;
  height: 100%; 
  width: 85%;  
  ${theme.screen.small} {
    width: 100%;
  }
`;
const ChatBox = styled.div`
  display: flex; 
  align-items: center;
  width: 100%;
  height: 80%;
  //padding: 8px;  
`;
const ChatContent = styled.div`
  display: flex; 
  align-items: left;
  width: 100%;
  height: 100%;
  flex-direction: column; 
  justify-content: center;  
`;
const ChatMessages = styled.ul`
  height: 90%;
  width: 75%;
  padding-left: 0;
  border: 0px solid #000;
  overflow: scroll;  
  ${theme.screen.small} {
  width: 90%;
}  
`;
const Message = styled.li <{ self: boolean }>`
justify-content: ${(props) => props.self ? 'end' : ''};
padding:5px;
display: flex;
flex-direction: row;
box-shadow: 0 3px 5px rgb(59 26 85 / 0.2);
margin: 10px;
${theme.screen.small} {
  width: 90%;
}
`;
const Input = styled.input<{ userType: string }>`
  flex-grow: 1;
  ${theme.font.body}  
`;
const Avatar = styled.div`
display: flex;
  background-color: cornflowerblue;
  padding: 3px 5px;
  border-radius: 5px;
  color:#fff;
  ${theme.screen.small} {
    width: 100%;
  }
`;

const AvatarSelf = styled.div`
  display: flex;
  color:#000;
  background-color: #47a347;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const MessageData = styled.div`  
  padding:3px;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const SendMessage = styled.div`
  width: 75%;
  display: flex;  
`;
const SendButton = styled.button`
  border: none;
  padding: 10px;
  background: #47a347;
  color:#fff;  
  font-weight: bold;
  width:100px;
  border-radius: 30px;
  margin-left: 5px;
  cursor: pointer;  
  ${theme.screen.small} {
    width: 100%;
  }

`;
const Register = styled.div`
  position: fixed;
  padding:10px;
  box-shadow:0 2.8px 2.2px rgba(0, 0, 0, 0.034),0 6.7px 5.3px rgba(0, 0, 0, 0.048),0 12.5px 10px rgba(0, 0, 0, 0.06),0 22.3px 17.9px rgba(0, 0, 0, 0.072),0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.12);
  top:35%;
  left:10%;
  display: flex;
  flex-direction: row;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const InputRegister = styled.input`
  ${theme.font.body}  
`;

const Button = styled.button`
  border: none;
  padding: 10px;
  background: green;
  color:#fff;    
  ${theme.font.button} 
`;





export default Chat;
