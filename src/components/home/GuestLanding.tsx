import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate, Link } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';

function GuestLanding() {
  const { signOut, user } = useAuthenticator();
  const navigate = useNavigate();
  
  function handleSignOut(){
    window.localStorage.clear();
    signOut();
    navigate("/");
  }

  let userGroup = getUserGroup(user);
  if (typeof userGroup === 'boolean') {
    userGroup = ['guest'];
    assignUserToRole(user.username, 'unassigned', 'guest');
  };

  localStorage.setItem('role', userGroup[0]);

  if (localStorage.getItem('role') === 'host'){
    return (
      <>
        <h1>You have logged in with Host Credentials</h1>
        <Link to="/hostLanding">
          <button>Go to Host Landing Page</button>
        </Link>
      </>
    );
  } else {
    localStorage.setItem('username', user.username!);
    return (
      <>
        <h1>WELCOME TO THE GUEST LANDING PAGE!</h1>
        <p> role = { localStorage.getItem('role') }</p>
        <p> User Name = { localStorage.getItem('username') }</p>
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
}

export default withAuthenticator(GuestLanding);