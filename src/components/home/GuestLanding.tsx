import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
import jwt from 'jwt-decode';

function GuestLanding() {
  const { signOut, user } = useAuthenticator();

  function handleLogout() {
    signOut();
  };
  // https://stackoverflow.com/questions/41828359/how-do-i-access-the-group-for-a-cognito-user-account=
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  let userGroup;
  if (token) {
    const decoded = jwt(token);
    if (decoded) {
      userGroup = Object.entries(decoded)[1][1];
      if (typeof userGroup === 'boolean') {
        userGroup = 'unassigned';
        // Invoke lambda to assign user to group and copy info to the Guest MySQL table
      };
    };
  }

  return (
    <Container>
      <h1>WELCOME TO THE GUEST LANDING PAGE!</h1>
      <p> User Group = { userGroup }</p>
      <button onClick={handleLogout}>Sign out</button>
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
export default withAuthenticator(GuestLanding);