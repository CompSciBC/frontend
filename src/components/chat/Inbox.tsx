// import AppContext from '../../context/AppContext';
// import { useContext, useEffect, useState } from 'react';
// import { Reservation } from '../../utils/dtos';
import styled from '@emotion/styled';
// import { theme } from '../../utils/styles';

function Inbox() {

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
    <SendMessageController>Send!</SendMessageController>
  </ChatContent>
</Container>
);
}

const Container = styled.div `
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
  width: 100%;
  flex-grow: 1;
  background-color: purple;
`;

const SendMessageController = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
`;





export default Inbox;