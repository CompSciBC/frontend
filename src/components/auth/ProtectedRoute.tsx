import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { paramRoute, routes } from '../..';
import AppContext from '../../context/AppContext';

export interface ProtectedRouteProps {
  redirect?: string;
}

function ProtectedRoute({ redirect = routes.login }: ProtectedRouteProps) {
  const { authenticated, reservationDetail } = useContext(AppContext);
  const { resId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    !authenticated && navigate(redirect);
  }, [authenticated]);

  // checks if no path variable was passed to a :resId parameterized route
  // if no variable was passed and a resId is available in context, navigate there
  useEffect(() => {
    if (resId === ':resId' && reservationDetail?.id) {
      navigate(paramRoute(location.pathname, reservationDetail.id));
    } // TODO: else got to error page
  }, [location]);

  return authenticated ? <Outlet /> : <></>;
}

export default ProtectedRoute;
