import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { routes } from '../..';

function Logout() {
  const { signOut } = useAuthenticator();
  const { clearAppContext } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    let subscribed = true;

    subscribed && clearAppContext();
    signOut();
    navigate(routes.home);

    return () => {
      subscribed = false;
    };
  });

  return <>Goodbye</>;
}

export default withAuthenticator(Logout);
