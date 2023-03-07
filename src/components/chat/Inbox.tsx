// import AppContext from '../../context/AppContext';
import { useState } from 'react';
// import { Reservation } from '../../utils/dtos';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

function Inbox() {
  const [message, setMessage] = useState('');

  //   const { user } = useContext(AppContext);

  //   const [reservations, setReservations] = useState<Reservation[]>([]);
  // // query reservation
  //   useEffect(() => {
  //     // user != undefined
  //     // query reservation
  //     // set reservation to the query
  //   }, [user]);

  // // load a chat
  // useEffect(() => {
  //   // if reservation != empty
  //   // load chat messages
  //   // set chat messages
  // }, [reservations]);

  return (
    <Container>
      <SideBar>
        <SideBarHeader> GroupChat</SideBarHeader>
        <ChatList>
          <ChatRoom>Chat w/Res_1236</ChatRoom>
          <ChatRoom>Chat w/Res_1236</ChatRoom>
          <ChatRoom>Chat w/Res_1236</ChatRoom>
        </ChatList>
      </SideBar>
      <ChatContent>
        <Conversation>Hello!</Conversation>
        <SendMessageController>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendButton type="button"> send </SendButton>
        </SendMessageController>
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
  //background-color: blue;
  gap: 15px;
  padding: 16px;
`;

const SideBarHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
`;
const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  background-color: black;
  gap: 16px;
`;

const ChatRoom = styled.button`
  display: flex;
  background-color: green;
`;

const Conversation = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  flex-grow: 1;
  padding: 20px;
  background-color: purple;
`;

const SendMessageController = styled.div`
  display: flex;
  width: 75%;
  background-color: white;
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
  // flex-grow: 1;
  ${theme.screen.small} {
    width: 100%;
  }
`;
const Input = styled.input`
  flex-grow: 1;
  margin-top: 3px;
  flex-grow: 1;
  width: 100%;
  ${theme.font.body}
`;

export default Inbox;
