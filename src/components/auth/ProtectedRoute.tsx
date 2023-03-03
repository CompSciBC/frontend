import { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import ErrorPage from '../ErrorPage';
import Login from './Login';

function ProtectedRoute() {
  const { authenticated, reservationDetail, user } = useContext(AppContext);
  const { resId, userId } = useParams();
  const [element, setElement] = useState<JSX.Element>(<></>);

  useEffect(() => {
    let subscribed = true;

    if (!authenticated) {
      subscribed && setElement(<Login />);
    } else if ((!resId || reservationDetail?.id === resId) || (!userId || user?.userId === userId)) {
      subscribed && setElement(<Outlet />);
    } else {
      subscribed && setElement(<ErrorPage />);
    }

    return () => {
      subscribed = false;
    };
  }, [authenticated, resId, reservationDetail, userId, user]);

  return element;
}

export default ProtectedRoute;
