/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { server } from '../..';

let stompClient: any = null;
const hostUserName: string = 'Host Chat';
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
  const { user } = useContext(AppContext);

  const { resId } = useParams() as { resId: string };

  const [userData, setUserData] = useState({
    username: user!.username,
    isHost: false,
    receivername: '',
    connected: false,
    message: '',
    userLoaded: false
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
  const [groupChat, setGroupChat] = useState<Message[]>([]);

  /* use this trick to prevent double loading of data. It looks like that an additional loading erases GroupChat array.
  I have no idea why this not happened to Map. Probably, I'll put Group Chat into a Map */

  const [pageState] = useState<{ loaded: boolean }>({ loaded: false });
  /* set as a string
   */
  const [tab, setTab] = useState(groupChatName);

  useEffect(() => {
    setUserData({
      ...userData,
      connected: true,
      isHost: user?.role === 'host',
      userLoaded: true
    });
  }, []);

  useEffect(() => {
    // return if loading happened;
    if (pageState.loaded) {
      return;
    }
    if (userData.userLoaded) {
      pageState.loaded = true;
      const loadUrl: string = userData.isHost
        ? `${server}/api/chat/load/host/${resId}`
        : `${server}/api/chat/load/guest/${resId}/${userData.username}`;
      fetch(loadUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async (response) => await response.json())
        .then((chats: ChatsServerResponse) => {
          // const Sock = new SockJS('http://localhost:8080/ws');
          const Sock = new SockJS(`${server}/ws`);

          stompClient = over(Sock);
          stompClient.connect(
            {},
            () => {
              onConnected(chats);
            },
            onError
          );
        });
    }
  }, [userData]);

  const onConnected = (chats: ChatsServerResponse) => {
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
    // setGroupChat([...groupChat, ...groupMesages]);

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

  return (
    <Container>
      <SideBar>
        <SideBarHeader>
          <ChatHeader>Chats</ChatHeader>
        </SideBarHeader>
        <ChatList>
          <ChatRoom
            onClick={() => {
              setTab('Group');
            }}
          >
            {' '}
            Group Chat{' '}
          </ChatRoom>
          {Array.from(privateChats.keys()).map((chatName, index) => (
            <ChatRoom
              key={index}
              onClick={() => {
                setTab(chatName);
              }}
            >
              {chatName}
            </ChatRoom>
          ))}
        </ChatList>
      </SideBar>
      <ChatContent>
        <ChatName>{tab === groupChatName ? groupHeader : tab} </ChatName>
        <ChatMessages id="chat-messages">
          {(tab === groupChatName
            ? [...groupChat]
            : [...privateChats.get(tab)!]
          ).map((message: any, index) => (
            <MessageBlockWrapper
              self={message.senderName === userData.username}
              key={index}
            >
              <MessageBlock id="message-block">
                {message.senderName !== userData.username && (
                  <Avatar>{message.senderName}</Avatar>
                )}
                {message.senderName === userData.username && (
                  <AvatarSelf>{message.senderName}</AvatarSelf>
                )}
                <MessageData id="message-data">{message.message}</MessageData>
                
              </MessageBlock>
            </MessageBlockWrapper>
          ))}
          <LastMessage id="last-message" ref={messageEndRef}></LastMessage>
        </ChatMessages>
        <SendMessage id="send-message">
          <Input
            id="input"
            userType={userData.username}
            placeholder="enter the message"
            value={userData.message}
            onChange={handleMessage}
          />
          <SendButton type="button" onClick={sendMessage}>
            send
          </SendButton>
        </SendMessage>
      </ChatContent>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 250px;
  //background-color: red;
  gap: 20px;
  padding: 16px;
`;
const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  // background-color: blue;
  gap: 15px;
  padding: 16px;
`;
const SideBarHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: #ededed;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 10px;
  margin: 5px;
`;
const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  background-color: #ededed;
  gap: 10px;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 15px;
`;

const ChatRoom = styled.button`
  display: flex;
  background-color: #ffffff;
  margin-top: 13px;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  // border-color: #539174;
  border-radius: 10px;
  border: none;
`;
const ChatName = styled.h1`
  display: flex;
  align-items: center;

  ${theme.font.displayXL}
`;

const ChatMessages = styled.div`
  height: 90%;
  width: 75%;
  padding-left: 5;
  background-color: #ededed;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 15px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  ${theme.screen.small} {
    width: 90%;
  }
`;

const MessageBlockWrapper = styled.div<{ self: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.self ? 'end' : '')};
  width: 100%;
  margin: 10px 0;
`;

const MessageBlock = styled.div`
  padding: 5px;
  display: flex;
  flex-basis: auto;
  flex-direction: column;
  max-width: fit-content;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-radius: 10px;
  margin: 0 10px;
  background-color: #ffffff;
`;
const Input = styled.input<{ userType: string }>`
  flex-grow: 1;
  margin-top: 3px;
  margin-bottom: 3 px;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 15px;
  ${theme.font.body}
`;
const Avatar = styled.div`
  display: flex;
  color: #c5c752;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const AvatarSelf = styled.div`
  display: flex;
  color: #52a782;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const MessageData = styled.li`
  display: flex;
  max-width: fit-content;
  padding: 3px;
  border-radius: 10px;
  background-color: whitesmoke;
`;
const SendMessage = styled.div`
  width: 75%;
  display: flex;
`;
const SendButton = styled.button`
  border: none;
  padding: 10px;
  background: #b61616;
  color: #ffff;
  font-weight: bold;
  width: 100px;
  border-radius: 30px;
  margin-left: 5px;
  cursor: pointer;
  ${theme.screen.small} {
    width: 100%;
  }
`;

const LastMessage = styled.div`
  ${theme.screen.small} {
    width: 100%;
  }
`;

const ChatHeader = styled.h1`
  margin-left: 20px;
  ${theme.font.heading}
`;
export default Chat;
