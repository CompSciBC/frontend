import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';

export interface ProtectedRouteProps {
  redirect?: string;
  route: JSX.Element;
}

function ProtectedRoute({
  redirect = routes.home,
  route
}: ProtectedRouteProps) {
  const { authenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    !authenticated && navigate(redirect);
  }, [authenticated]);

  return authenticated ? route : <></>;
}

export default ProtectedRoute;
