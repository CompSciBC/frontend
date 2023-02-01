import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';

function GuestLanding() {
  const { signOut, user } = useAuthenticator();

  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const navigateToHostLanding = () => navigate('/hostLanding');
  
  const userGroup = getUserGroup(user);
  if (typeof userGroup === 'boolean') {
    assignUserToRole(user.username, 'unassigned', 'guest');
  };

  if (userGroup[0] === 'host'){
    return (
      <>
        <h1>You have logged in with Host Credentials</h1>
        <button onClick={navigateToHostLanding}>Go to Host Landing Page</button>
      </>
    );
  } else {
    return (
      <>
        <h1>WELCOME TO THE GUEST LANDING PAGE!</h1>
        <p> role = {userGroup[0]}</p>
        <p> User Name = { user.username }</p>
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(GuestLanding);