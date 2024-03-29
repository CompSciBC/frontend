/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { server } from '../..';
import { SortedReservationDetailSet, Reservation } from '../../utils/dtos';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Container,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';

let stompClient: any = null;
let firstChatId: string = ' ';
let firstChatTitle: string = ' ';
let currentChatTitle: string = '';
let propertyName: string = '';
let firstReservationIdLink: string = '';
let currentReservationIdLink: string = '';

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
  const navigate = useNavigate();

  /* scrol till the latest message. The latest message is popped up aitomatically
   */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [userData.message, userData.connected]);

  /* use a map object where key is a receiver and value is a message
   */
  const [inboxChats, setInboxChats] = useState(new Map<string, Message[]>());
  const [chatTitlesMap, setChatTitlesMap] = useState(new Map<string, string>());
  const [reservationIdLinksMap, setReservationIdLinks] = useState(
    new Map<string, string>()
  );

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

      inboxChats.set(chatName, messages);

      const reservationId = chatName.includes('_')
        ? chatName.split('_')[0]
        : chatName;
      try {
        if (chatName.includes('_') && user?.role === 'guest') {
          propertyName =
            'Host ' + reservationsMap.get(reservationId)!.property.name;
        } else if (chatName.includes('_') && user?.role === 'host') {
          propertyName =
            chatName.split('_')[1] +
            ' ' +
            reservationsMap.get(reservationId)!.property.name;
        } else {
          propertyName =
            'Group ' + reservationsMap.get(reservationId)!.property.name;
        }
      } catch (Error) {
        console.log(Error);
      }
      console.log('chatTitle', propertyName);
      chatTitlesMap.set(chatName, propertyName);
      reservationIdLinksMap.set(propertyName, reservationId);
    }
    setInboxChats(inboxChats);
    setChatTitlesMap(chatTitlesMap);
    setReservationIdLinks(reservationIdLinksMap);

    firstChatId = inboxChats.keys().next().value;
    setTab(firstChatId);
    // setActiveTab(firstChatId);
    console.log(firstChatTitle);
    currentChatTitle = chatTitlesMap.get(firstChatId)!;

    firstChatTitle = chatTitlesMap.keys().next().value;

    currentReservationIdLink = reservationIdLinksMap.get(currentChatTitle)!;
    console.log(currentReservationIdLink + 'curentLinkResId');
    firstReservationIdLink = reservationIdLinksMap.keys().next().value;
    console.log(firstReservationIdLink + 'FirstResIdLink');
  };

  const isSameDay = (date1: any, date2: any) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isSameWeek = (date1: any, date2: any) => {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const diffDays = Math.round(
      Math.abs((date1.getTime() - date2.getTime()) / oneDay)
    );
    return diffDays <= 6;
  };

  const isSameYear = (date1: any, date2: any) => {
    return date1.getFullYear() === date2.getFullYear();
  };

  const getMessageDateToDisplay = (timestamp: number) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();

    if (isSameDay(messageDate, currentDate)) {
      return messageDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } else if (isSameWeek(messageDate, currentDate)) {
      return messageDate
        .toLocaleString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
        .replace('at', ',');
    } else if (isSameYear(messageDate, currentDate)) {
      return messageDate
        .toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
        .replace('at', ',');
    } else {
      return messageDate
        .toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
        .replace('at', ',');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="h6">Inbox</Typography>
          {Array.from(chatTitlesMap.keys()).map((chatTitleKey, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              onClick={() => {
                currentChatTitle = chatTitlesMap.has(chatTitleKey)
                  ? chatTitlesMap.get(chatTitleKey)!
                  : '';
                setTab(chatTitleKey);
              }}
              sx={{
                mt: 1,
                backgroundColor: tab === chatTitleKey ? '#bdd9ff' : '#ffffff'
              }}
            >
              {chatTitlesMap.get(chatTitleKey)}
            </Button>
          ))}
        </Grid>
        <Grid item xs={9}>
          {tab !== '' && inboxChats.has(tab) ? (
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6">{currentChatTitle}</Typography>
              <Box
                sx={{
                  overflowY: 'scroll',
                  p: 2,
                  borderRadius: '5px',
                  backgroundColor: '#FAF9F6',
                  height: '80vh'
                }}
              >
                {[...inboxChats.get(tab)!].map((message: any, index) => (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent:
                        message.senderName === userData.username
                          ? 'flex-end'
                          : 'flex-start'
                    }}
                    key={index}
                  >
                    <Box
                      sx={{
                        width: '45%',
                        p: 1,
                        m: 0.25,
                        borderRadius: 2,
                        backgroundColor:
                          message.senderName === userData.username
                            ? '#FFD95A'
                            : theme.color.lightGray,
                        color:
                          message.senderName === userData.username
                            ? '#4C3D3D'
                            : theme.color.black
                      }}
                    >
                      <Typography variant="h6" style={{ fontSize: '16px' }}>
                        {message.senderName}
                      </Typography>
                      <Typography variant="body1">{message.message}</Typography>
                      <Typography
                        variant="body1"
                        style={{ fontSize: '12px', color: '#636060', textAlign: 'right' }}
                      >
                        {getMessageDateToDisplay(message.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <LastMessage
                  id="last-message"
                  ref={messageEndRef}
                ></LastMessage>
              </Box>
            </Box>
          ) : (
            <br />
          )}

          <Button
            fullWidth
            variant="contained"
            color="info"
            onClick={() => {
              currentReservationIdLink = reservationIdLinksMap.has(
                currentChatTitle
              )
                ? reservationIdLinksMap.get(currentChatTitle)!
                : '';

              navigate(`/reservations/${currentReservationIdLink}/chat`);
            }}
            sx={{ mt: 1 }}
          >
            <Typography variant="h6" style={{ fontSize: '16px' }}>
              To send a new message go to Chat page
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
// const Container = styled.div`
//   display: flex;
//   width: 100%;
//   height: 100%;
// `;
const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 250px;
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
  // background-color:
  margin-top: 10px;
  margin-left: 10px;
  box-shadow: 0 3px 3px rgb(18 58 39 / 0.4);
  border-color: #539174;
  border-radius: 5px;
  padding: 10px;
  max-width: 200px;
  border: none;
`;

const ChatRoomWrapper = styled.div<{ isActive: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isActive ? '#FFD95A' : '#ffffff')};
  width: 100%;
  margin: 10px 0;
  justify-content: flex-start;
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

// const Avatar = styled.div`
//   display: flex;
//   color: #c5c752;
//   ${theme.screen.small} {
//     width: 100%;
//   }
// `;
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
  width: 400px;
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
export default Inbox;
