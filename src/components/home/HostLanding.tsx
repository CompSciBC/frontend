import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
// import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';

function HostLanding() {
  const { 
    signOut, 
    user } = useAuthenticator();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const navigateToGuestLanding = () => navigate('/guestLanding');

  function handleSignOut(){
    
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('role');  
    setTimeout(signOut, 1000);
    user.signOut();
  }

  let userGroup = getUserGroup(user);
  if (typeof userGroup === 'boolean') {
    userGroup = ['host'];
    assignUserToRole(user.username, 'unassigned', 'host');
  };
  
  localStorage.setItem('role', userGroup[0]);

  if (localStorage.getItem('role') === 'guest'){
    return (
      <>
        <h1>You have logged in with Guest Credentials</h1>
        <p> User Name = { user.username }</p>
        <button onClick={navigateToGuestLanding}>Go to Guest Landing Page</button>
      </>
    );
  } else {
    localStorage.setItem('username', user.username!);
    return (
      <>
        <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
        <p> role = { localStorage.getItem('role') }</p>
        <p> User Name = { localStorage.getItem('username') }</p>
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(HostLanding);