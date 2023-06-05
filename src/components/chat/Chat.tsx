/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { server } from '../..';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
  receiverId: String | undefined;
  chatId: String;
  userId: String;
}

interface ChatsServerResponse {
  [id: string]: Message[];
}

function Chat() {
  const { user } = useContext(AppContext);
  const { reservation } = useContext(AppContext);

  const { resId } = useParams() as { resId: string };

  const [userData, setUserData] = useState({
    username: user!.username,
    userId: user!.userId,
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
      `/user/${userData.userId}/private/${resId}`,
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
    let receiverId: string | undefined;
    console.log(reservation);

    if (tab === groupChatName) {
      chatId = resId; // Group chat Id is Reservation id.
      receiverName = undefined; // No message receiver for a group chat
      receiverId = reservation!.property.hostId; // get a hostId for saving a group messafe in a host inbox
    } else {
      // private chat
      if (userData.isHost) {
        // For a host, Tab is the receiver guest.
        chatId = `${resId}_${tab}`;
        receiverName = tab;
        receiverId = undefined;
      } else {
        chatId = `${resId}_${userData.username}`;
        receiverName = undefined;
        receiverId = reservation!.property.hostId;
      }
    }

    if (stompClient) {
      const chatMessage: Message = {
        senderName: userData.username,
        message: userData.message,
        reservationId: resId,
        timestamp: new Date().getTime(),
        receiverName,
        receiverId,
        chatId,
        userId: userData.userId
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

  const [view, setView] = React.useState('Group');

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="h6">Conversations</Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setTab('Group');
            }}
            sx={{ mt: 1 }}
          >
            {' '}
            Group Chat{' '}
          </Button>
          {Array.from(privateChats.keys()).map((chatName, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              onClick={() => {
                setTab(chatName);
              }}
              sx={{ mt: 1 }}
            >
              {chatName}
            </Button>
          ))}
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6">
              {tab === groupChatName ? groupHeader : tab}
            </Typography>
          </Box>
          <Box
            sx={{
              overflowY: 'scroll',
              p: 2,
              borderRadius: '5px',
              backgroundColor: '#FAF9F6',
              height: '50vh'
            }}
          >
            {(tab === groupChatName
              ? [...groupChat]
              : [...privateChats.get(tab)!]
            ).map((message: any, index) => (
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
                </Box>
              </Box>
            ))}
            <LastMessage id="last-message" ref={messageEndRef}></LastMessage>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: '16px',
              height: '20vh',
              alignContent: 'flex-end'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <TextField
                  fullWidth
                  id="input"
                  multiline
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                  maxRows={4}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  aria-label="send"
                  onClick={sendMessage}
                  size="large"
                >
                  <SendIcon style={{ color: theme.color.BMGdarkblue }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
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
// const SideBar = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   width: 250px;
//   background-color: red;
//   gap: 20px;
//   padding: 16px;
// `;
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
  background-color: red;
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
// const Avatar = styled.div`
//   display: flex;
//   color: #c5c752;
//   ${theme.screen.small} {
//     width: 100%;
//   }
// `;
// const AvatarSelf = styled.div`
//   display: flex;
//   color: #52a782;
//   ${theme.screen.small} {
//     width: 100%;
//   }
// `;
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
  background-color: red;
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
