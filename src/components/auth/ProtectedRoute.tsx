import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { Outlet } from 'react-router-dom';
import Login from './Login';

/**
 * A wrapper for content requiring authentication before view. If the user
 * is not authenticated, displays the login page. Upon login, displays the
 * protected content
 *
 * @returns A JSX element
 */
function ProtectedRoute() {
  const { authenticated } = useContext(AppContext);
  return authenticated ? <Outlet /> : <Login />;
}

export default ProtectedRoute;
