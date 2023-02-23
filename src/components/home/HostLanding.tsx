import '@aws-amplify/ui-react/styles.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';

function HostLanding() {
  const { user } = useContext(AppContext);

  if (user?.role === 'guest') {
    return (
      <>
        <h1>You have logged in with Guest Credentials</h1>
        <Link to={routes.hostLanding}>
          <button>Go to Guest Landing Page</button>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
        <p> role = {user?.role}</p>
        <p> User Name = {user?.username}</p>
      </>
    );
  }
}

export default HostLanding;
