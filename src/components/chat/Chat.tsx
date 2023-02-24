import React, { useState, useRef, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

let stompClient: any = null;
const hostUserName: string = 'Host';
const groupChatName: string = 'Group';
const groupHeader: string = 'Group Chat';

interface Message {
  reservationId: String;
  timestamp: Number;
  senderName: String;
  message: String;
  receiverName: String | undefined;
  chatId: String;
}

interface ChatsServerResponse {
  [id: string]: Message[];
}

function Chat() {
  const { resId } = useParams() as { resId: string };

  const [userData, setUserData] = useState({
    username: '',
    isHost: false,
    receivername: '',
    connected: false,
    message: ''
  });

  const messageEndRef = useRef<null | HTMLDivElement>(null);

  /* scrol till the latest message. The latest message is popped up aitomatically
   */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [userData.message, userData.connected]);

  /* use a map object where key is a receiver and value is a message
   */
  const [privateChats, setPrivateChats] = useState(
    new Map<string, Message[]>()
  );
  const [groupChat, setGroupChat] = useState(new Array<Message>());
  /* set as a string
   */
  const [tab, setTab] = useState(groupChatName);

  const connect = () => {
    const loadUrl: string = userData.isHost
      ? `/api/chat/load/host/${resId}`
      : `/api/chat/load/guest/${resId}/${userData.username}`;
    fetch(loadUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (response) => await response.json())
      .then((chats: ChatsServerResponse) => {
        const Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect(
          {},
          () => {
            onConnected(chats);
          },
          onError
        );
      });
  };
  /* set a key for private chat map object: guest or host depending who signs in
   */
  const onConnected = (chats: ChatsServerResponse) => {
    setUserData({ ...userData, connected: true });
    // subscribe to group message
    stompClient.subscribe(`/group/${resId}`, onGroupMessage);
    // subscribe to private message
    stompClient.subscribe(
      `/user/${userData.username}/private/${resId}`,
      onPrivateMessage
    );

    const groupMesages = chats[resId];
    groupChat.push(...groupMesages);
    setGroupChat([...groupChat]);

    for (const chatId in chats) {
      if (chatId === resId) {
        continue;
      }
      const chatName = userData.isHost ? chatId.split('_')[1] : hostUserName;
      const messages = chats[chatId];
      privateChats.set(chatName, messages);
    }
    setPrivateChats(privateChats);
  };

  const onGroupMessage = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    groupChat.push(payloadData as never);
    setGroupChat([...groupChat]);
  };

  const onPrivateMessage = (payload: any) => {
    const payloadData: Message = JSON.parse(payload.body);
    const chatId = payloadData.chatId;
    const chatName = userData.isHost ? chatId.split('_')[1] : hostUserName;

    privateChats.get(chatName)!.push(payloadData);
    setPrivateChats(new Map(privateChats));
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const handleMessage = (event: any) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendMessage = () => {
    let chatId: string = '';
    let receiverName: string | undefined;

    if (tab === groupChatName) {
      chatId = resId; // Group chat Id is Reservation id.
      receiverName = undefined; // No message receiver for a group chat
    } else {
      // private chat
      if (userData.isHost) {
        // For a host, Tab is the receiver guest.
        chatId = `${resId}_${tab}`;
        receiverName = tab;
      } else {
        chatId = `${resId}_${userData.username}`;
        receiverName = hostUserName;
      }
    }

    if (stompClient) {
      const chatMessage: Message = {
        senderName: userData.username,
        message: userData.message,
        reservationId: resId,
        timestamp: new Date().getTime(),
        receiverName,
        chatId
      };

      console.log(chatMessage);

      if (tab === groupChatName) {
        groupChat.push(chatMessage);
        stompClient.send('/app/group-message', {}, JSON.stringify(chatMessage));
      } else {
        privateChats.get(tab)!.push(chatMessage);
        stompClient.send(
          '/app/private-message',
          {},
          JSON.stringify(chatMessage)
        );
      }

      setUserData({ ...userData, message: '' });
    }
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData({
      ...userData,
      username: value,
      isHost: value === hostUserName
    });
  };

  const registerUser = () => {
    connect();
  };
  return (
    <Container id="container">
      {userData.connected ? (
        <>
          <ChatBox id="chat-box">
            <ChatListContainer>
              <ChatList
                onClick={() => {
                  setTab('Group');
                }}
              >
                {' '}
                Group Chat{' '}
              </ChatList>
              {Array.from(privateChats.keys()).map((chatName, index) => (
                <ChatList
                  onClick={() => {
                    setTab(chatName);
                  }}
                  key={index}
                >
                  {chatName}
                </ChatList>
              ))}
            </ChatListContainer>

            {
              <ChatContent id="chat-content">
                <ChatName>
                  {tab === groupChatName ? groupHeader : tab}{' '}
                </ChatName>
                <ChatMessages id="chat-messages">
                  {(tab === groupChatName
                    ? [...groupChat]
                    : [...privateChats.get(tab)!]
                  ).map((message: any, index) => (
                    <MessageBlock
                      id="message"
                      self={message.senderName === userData.username}
                      key={index}
                    >
                      {message.senderName !== userData.username && (
                        <Avatar>{message.senderName}</Avatar>
                      )}
                      .
                      <MessageData id="message-data">
                        {message.message}
                      </MessageData>
                      {message.senderName === userData.username && (
                        <AvatarSelf>{message.senderName}</AvatarSelf>
                      )}
                    </MessageBlock>
                  ))}
                  <LastMessage
                    id="last-message"
                    ref={messageEndRef}
                  ></LastMessage>
                </ChatMessages>
              </ChatContent>
            }
          </ChatBox>

          <SendMessage id="send-message">
            <Input
              id="input"
              userType={userData.username}
              placeholder="enter the message"
              value={userData.message}
              onChange={handleMessage}
            />
            <SendButton onClick={sendMessage}>send</SendButton>
          </SendMessage>
        </>
      ) : (
        <Register id="register">
          <InputRegister
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
          />
          <Button type="button" onClick={registerUser}>
            connect
          </Button>
        </Register>
      )}
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  height: 90%;
  width: 75%;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const ChatBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 80%;
`;
const ChatName = styled.h1`
  display: flex;
  //Sjustify-content: center;
  align-items: center;

  ${theme.font.displayXL}
`;

const ChatListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatList = styled.button`
  display: flex;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  border-radius: 20px;
  background: green;
  color: #fff;

  ${theme.font.button}
`;
const ChatContent = styled.div`
  display: flex;
  align-items: left;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;
const ChatMessages = styled.div`
  height: 90%;
  width: 75%;
  padding-left: 5;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  ${theme.screen.small} {
    width: 90%;
  }
`;
const MessageBlock = styled.div<{ self: boolean }>`
  justify-content: ${(props) => (props.self ? 'end' : '')};
  padding: 5px;
  display: flex;
  flex-direction: row;
  box-shadow: 0 3px 3px rgb(59 26 85 / 0.2);
  margin: 10px;
  ${theme.screen.small} {
    width: 90%;
  }
`;
const Input = styled.input<{ userType: string }>`
  flex-grow: 1;
  margin-top: 3px;
  ${theme.font.body}
`;
const Avatar = styled.div`
  display: flex;
  color: red;
  ${theme.screen.small} {
    width: 100%;
  }
`;

const AvatarSelf = styled.div`
  display: flex;
  color: green;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const MessageData = styled.div`
  padding: 3px;
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
  color: #fff;
  font-weight: bold;
  width: 100px;
  border-radius: 30px;
  margin-left: 5px;
  cursor: pointer;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const Register = styled.div`
  position: fixed;
  padding: 10px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  top: 35%;
  left: 10%;
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
  color: #fff;
  ${theme.font.button}
`;

const LastMessage = styled.div`
  padding: 3px;
  ${theme.screen.small} {
    width: 100%;
  }
`;

export default Chat;
