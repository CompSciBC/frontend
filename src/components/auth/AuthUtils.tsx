import jwt from 'jwt-decode';
import { NavigateFunction, Location } from 'react-router-dom';
import { routes } from '../..';
import { UserRole } from '../../utils/dtos';

export function assignUserToRole(username: any, assignedRole: UserRole) {
  const jsonData = {
    username,
    assignedRole
  };
  fetch(
    'https://fw9br1u38l.execute-api.us-west-2.amazonaws.com/default/bmg_assign_user_role',
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(jsonData)
    }
  );
}

export function getUserGroup(user: any): any {
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();

  let userGroup;
  if (token) {
    const decoded = jwt(token);
    if (decoded) {
      userGroup = Object.entries(decoded)[1][1][0];
    }
  }
  return userGroup;
}

export function redirectAfterLogin(
  location: Location,
  navigate: NavigateFunction,
  role: UserRole
) {
  let path: string = '/';
  const redirect = location.state;

  if (redirect && typeof redirect === 'string') {
    // redirect to specified path from location state
    path = redirect;
  } else {
    // redirect to a landing if at one of the auth routes
    if ([routes.login, routes.signUp].includes(location.pathname)) {
      switch (role) {
        case 'guest':
          path = routes.guestLanding;
          break;

        case 'host':
          path = routes.hostLanding;
          break;
      }
    }
  }
  navigate(path, { replace: true });
}
