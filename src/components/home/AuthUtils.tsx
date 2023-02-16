import jwt from 'jwt-decode';
export function assignUserToRole(
  username: any,
  currentRole: string,
  assignedRole: string
) {
  const jsonData = {
    username,
    currentRole,
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
