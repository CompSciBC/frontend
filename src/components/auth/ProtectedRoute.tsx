import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { paramRoute } from '../..';
import AppContext from '../../context/AppContext';
import Login from './Login';

function ProtectedRoute() {
  const { authenticated, reservationDetail } = useContext(AppContext);
  const { resId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // checks if no path variable was passed to a :resId parameterized route
  // if no variable was passed and a resId is available in context, navigate there
  useEffect(() => {
    if (resId === ':resId' && reservationDetail?.id) {
      navigate(paramRoute(location.pathname, reservationDetail.id));
    } // TODO: else go to error page
  }, [location]);

  return authenticated ? <Outlet /> : <Login />;
}

export default ProtectedRoute;
