import { Auth } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { routes } from '../..';

function Logout() {
  const { clearAppContext } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    let subscribed = true;

    subscribed && clearAppContext();
    Auth.signOut();
    navigate(routes.home);

    return () => {
      subscribed = false;
    };
  });

  return <>Goodbye</>;
}

export default Logout;
