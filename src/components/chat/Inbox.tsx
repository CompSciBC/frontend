/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
// import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { server } from '../..';
import { SortedReservationDetailSet, Reservation } from '../../utils/dtos';

let stompClient: any = null;
// const hostUserName: string = 'Host';
let firstChatId: string = ' ';
let firstChatTitle: string = ' ';
let chatRoomTitle: string = '';
// const resId: string = '';
let propertyName: string = '';

interface Message {
  reservationId: string;
  timestamp: Number;
  senderName: string;
  message: string;
  receiverName: string | undefined;
  chatId: string;
  userId: string;
}

interface ChatsServerResponse {
  [id: string]: Message[];
}

function Inbox() {
  const { user } = useContext(AppContext);
  const [userData, setUserData] = useState({
    userId: user!.userId,
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
  const [inboxChats, setInboxChats] = useState(new Map<string, Message[]>());
  const [chatTitle, setChatTitle] = useState(new Map<string, string>());

  // const [groupChat, setGroupChat] = useState<Message[]>([]);

  /* use this trick to prevent double loading of data. It looks like that an additional loading erases GroupChat array.
  I have no idea why this not happened to Map. Probably, I'll put Group Chat into a Map */

  const [pageState] = useState<{ loaded: boolean }>({ loaded: false });
  /* set as a string
   */
  const [tab, setTab] = useState('');

  const onError = (err: any) => {
    console.log(err);
  };

  const onInboxMessage = (payload: any) => {
    const payloadData: Message = JSON.parse(payload.body);
    console.log(payloadData);
    const chatName: string = payloadData.chatId;

    inboxChats.get(chatName)!.push(payloadData);
    setInboxChats(new Map(inboxChats));
  };

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
      // Join two API calls for messages and reservation details
      // define urls for API calls
      const loadUrl = `${server}/api/chat/load/inbox/${userData.userId}`;
      const reservationUrl = `${server}/api/reservations-by-status?index=${user?.role}&id=${user?.userId}`;

      // load promise for both calls
      // these promises are then passed as an array to Promise.all(), which waits for both promises to resolve before continuing.
      // Once both promises are resolved, the then() callback for Promise.all() is called with an array of the results from both promises.

      const loadPromise = fetch(loadUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then(async (response) => await response.json());

      const reservationPromise = fetch(reservationUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async (response) => await response.json())
        .then((responseJson) => {
          const data: SortedReservationDetailSet = responseJson.data[0];
          const reservations: Reservation[] = Object.values(data).flat();
          const reservationMap = new Map<string, Reservation>();
          for (const reservation of reservations) {
            reservationMap.set(reservation.id, reservation);
          }
          // Return the reservationMap in the promise to be accessed by Promise.all
          return reservationMap;
        });

      Promise.all([loadPromise, reservationPromise]).then(
        ([chats, reservationsMap]) => {
          const Sock = new SockJS(`${server}/ws`);

          stompClient = over(Sock);
          stompClient.connect(
            {},
            () => {
              onConnected(chats, reservationsMap);
            },
            onError
          );
        }
      );
    }
  }, [userData]);

  const onConnected = (
    chats: ChatsServerResponse,
    reservationsMap: Map<string, Reservation>
  ) => {
    stompClient.subscribe(`/user/${userData.userId}/inbox`, onInboxMessage);

    for (const chatId in chats) {
      const chatName = chatId;
      const messages = chats[chatId];
      console.log('chatName', chatName);
      inboxChats.set(chatName, messages);

      const reservationId = chatName.includes('_')
        ? chatName.split('_')[0]
        : chatName;

      //  console.log('reservationId', reservationId);
        if (chatName.includes('_')) {
        propertyName =
          'Host ' + reservationsMap.get(reservationId)!.property.name;
      } else {
        propertyName =
          'Group ' + reservationsMap.get(reservationId)!.property.name;
      }
      console.log('chatTitle', propertyName);
      chatTitle.set(chatName, propertyName);
    }
    setInboxChats(inboxChats);
    setChatTitle(chatTitle);

    firstChatId = inboxChats.keys().next().value;
    console.log(firstChatId);
    setTab(firstChatId);

    firstChatTitle = chatTitle.keys().next().value;
    console.log(firstChatTitle);
    
    // setTab(firstChatId);  

  };

  // const handleMessage = (event: any) => {
  //   const { value } = event.target;
  //   setUserData({ ...userData, message: value });
  // };

  // const sendMessage = () => {
  //   let chatId: string = '';
  //   let receiverName: string | undefined;

  //   if (tab.includes('Group')) {
  //     chatId = resId; // Group chat Id is Reservation id.
  //     receiverName = undefined; // No message receiver for a group chat
  //   } else {
  //     // private chat
  //     if (userData.isHost) {
  //       // For a host, Tab is the receiver guest
  //       const name: string = tab.split(' ')[0];

  //       chatId = `${resId}_${name}`;
  //       receiverName = name;
  //     } else {
  //       chatId = `${resId}_${userData.username}`;
  //       receiverName = hostUserName;
  //     }
  //   }

  //   if (stompClient) {
  //     const chatMessage: Message = {
  //       senderName: userData.username,
  //       message: userData.message,
  //       reservationId: resId,
  //       timestamp: new Date().getTime(),
  //       receiverName,
  //       chatId,
  //       userId: userData.userId
  //     };

  //     if (tab.includes('Group')) {
  //       inboxChats.get(chatId)!.push(chatMessage);
  //       stompClient.send('/app/inbox', {}, JSON.stringify(chatMessage));
  //     } else {
  //       inboxChats.get(chatId)!.push(chatMessage);
  //       stompClient.send('/app/inbox', {}, JSON.stringify(chatMessage));
  //     }

  //     setUserData({ ...userData, message: '' });
  //   }
  // };

  return (
    <Container>
      <SideBar>
        <SideBarHeader>
          <ChatHeader>Inbox</ChatHeader>
        </SideBarHeader>
        <ChatList>
          {Array.from(chatTitle.keys()).map((chatTitleKey, index) => {
            return (
              <ChatRoom
                key={index}
                onClick={() => {
                  chatRoomTitle = chatTitle.has(chatTitleKey) ? chatTitle.get(chatTitleKey)! : "";                  
                  setTab(chatTitleKey);
                }}
              >
                {chatRoomTitle}
              </ChatRoom>
            );
          })}
        </ChatList>
      </SideBar>

      {tab !== '' && inboxChats.has(tab) ? (
        <ChatContent>
          <ChatName> {chatRoomTitle} </ChatName>
          <ChatMessages id="chat-messages">
            {[...inboxChats.get(tab)!].map((message: any, index) => (
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
          </ChatMessages>
          <SendMessage id="send-message">
            <SendButton type="button" onClick={() => {window.location.href = 'https://localhost:3000';}}>
              To send a new message go to Chat page 
            </SendButton>
          </SendMessage>
        </ChatContent>
      ) : (
        <br />
      )}
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
  margin-top: 10px;
  margin-left: 10px;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 5px;
  padding: 10px;
  max-width: 200px;
  border: none;
`;
const ChatName = styled.h1`
  display: flex;
  align-items: center;

  ${theme.font.displaySmall}
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
// const Input = styled.input<{ userType: string }>`
//   flex-grow: 1;
//   margin-top: 3px;
//   margin-bottom: 3 px;
//   box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
//   border-color: #539174;
//   border-radius: 15px;
//   ${theme.font.body}
// `;

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
  width: 400px;
  border-radius: 30px;
  margin-left: 5px;
  cursor: pointer;
  ${theme.screen.small} {
    width: 100%;
  }
`;

// const LastMessage = styled.div`
//   ${theme.screen.small} {
//     width: 100%;
//   }
// `;

const ChatHeader = styled.h1`
  margin-left: 20px;
  ${theme.font.heading}
`;
export default Inbox;
