import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { assignUserToRole } from '../home/AuthUtils';


function GuestLanding() {
  const { signOut, user } = useAuthenticator();

  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const navigateToHostLanding = () => navigate('/hostLanding');

  // https://stackoverflow.com/questions/41828359/how-do-i-access-the-group-for-a-cognito-user-account=
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  
  let userGroup;
  if (token) {
    const decoded = jwt(token);
    if (decoded) {
      userGroup = Object.entries(decoded)[1][1];
      if (typeof userGroup === 'boolean') {
        userGroup = 'unassigned';
        assignUserToRole(user.username, 'unassigned', 'guest');
      };
    };
  }

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
        <p> User Group = { userGroup }</p>
        <p> User Name = { user.username }</p>
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(GuestLanding);