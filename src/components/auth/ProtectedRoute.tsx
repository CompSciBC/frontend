import { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import ErrorPage from '../ErrorPage';
import Login from './Login';

function ProtectedRoute() {
  const { authenticated, reservationDetail } = useContext(AppContext);
  const { resId } = useParams();
  const [element, setElement] = useState<JSX.Element>(<></>);

  useEffect(() => {
    let subscribed = true;

    if (!authenticated) {
      subscribed && setElement(<Login />);
    } else if (!resId || reservationDetail?.id === resId) {
      subscribed && setElement(<Outlet />);
    } else {
      subscribed && setElement(<ErrorPage />);
    }

    return () => {
      subscribed = false;
    };
  }, [authenticated, resId, reservationDetail]);

  return element;
}

export default ProtectedRoute;
