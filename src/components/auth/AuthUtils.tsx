import jwt from 'jwt-decode';
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
      userGroup = Object.entries(decoded)[1][1];
    }
  }
  return userGroup;
}
