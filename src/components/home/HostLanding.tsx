import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate, Link } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';

function HostLanding() {
  const { signOut, user } = useAuthenticator();
  const navigate = useNavigate();

  function handleSignOut() {
    window.localStorage.clear();
    signOut();
    navigate('/');
  }

  let userGroup = getUserGroup(user);
  if (typeof userGroup === 'boolean') {
    userGroup = ['host'];
    assignUserToRole(user.username, 'unassigned', 'host');
  }

  localStorage.setItem('role', userGroup[0]);

  if (localStorage.getItem('role') === 'guest') {
    return (
      <>
        <h1>You have logged in with Guest Credentials</h1>
        <Link to="/guestLanding">
          <button>Go to Guest Landing Page</button>
        </Link>
      </>
    );
  } else {
    localStorage.setItem('username', user.username!);
    return (
      <>
        <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
        <p> role = {localStorage.getItem('role')}</p>
        <p> User Name = {localStorage.getItem('username')}</p>
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(HostLanding);
