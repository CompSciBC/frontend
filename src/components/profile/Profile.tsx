import styled from '@emotion/styled';
// import { useContext } from "react";
// import UserContext from '../home/UserContext';

function Profile() {
  // const context = useContext(UserContext);
  return (
    <Container>
      <h1>Profile</h1>
      {/* <p>context = {context} </p> */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  row-gap: 32px;
  font-size: 18px;
`;
export default Profile;
