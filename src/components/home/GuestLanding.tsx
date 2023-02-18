import '@aws-amplify/ui-react/styles.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';

function GuestLanding() {
  const { user } = useContext(AppContext);

  if (user?.role === 'host') {
    return (
      <>
        <h1>You have logged in with Host Credentials</h1>
        <Link to={routes.hostLanding}>
          <button>Go to Host Landing Page</button>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <h1>WELCOME TO THE GUEST LANDING PAGE!</h1>
        <p> role = {user?.role}</p>
        <p> User Name = {user?.username}</p>
      </>
    );
  }
}

export default GuestLanding;
