import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
// import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';

function HostLanding() {
  const { signOut, user } = useAuthenticator();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const navigateToGuestLanding = () => navigate('/guestLanding');

  const userGroup = getUserGroup(user);
  if (typeof userGroup === 'boolean') {
    assignUserToRole(user.username, 'unassigned', 'host');
  };
  
  if (userGroup[0] === 'guest'){
    return (
      <>
        <h1>You have logged in with Guest Credentials</h1>
        <p> User Name = { user.username }</p>
        <button onClick={navigateToGuestLanding}>Go to Guest Landing Page</button>
      </>
    );
  } else {
    return (
      <>
        <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
        <p> User Name = { user.username }</p>
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(HostLanding);