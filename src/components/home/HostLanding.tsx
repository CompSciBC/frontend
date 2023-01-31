import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
import jwt from 'jwt-decode';

function HostLanding() {
  const { signOut, user } = useAuthenticator();

  function handleLogout() {
    signOut();
  };

  function assignUserAsHost(username : any, currentRole : string, assignedRole: string) {
    const jsonData = {
      username, 
      currentRole,
      assignedRole
    };
    // Send data to the backend via POST
    fetch('https://fw9br1u38l.execute-api.us-west-2.amazonaws.com/default/bmg_assign_user_role', {  // Enter your IP address here
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(jsonData) // body data type must match 
    });
    
  }

  // https://stackoverflow.com/questions/41828359/how-do-i-access-the-group-for-a-cognito-user-account=
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  
  let userGroup;
  if (token) {
    const decoded = jwt(token);
    if (decoded) {
      userGroup = Object.entries(decoded)[1][1];
      if (typeof userGroup === 'boolean') {
        userGroup = 'unassigned';
        // assignUserAsHost(user.username, 'unassigned', 'host');
      };
    };
  }

  return (
    <>
      <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
      <p> User Group = { userGroup }</p>
      <button onClick={handleLogout}>Sign out</button>
    </>
  );
}

export default withAuthenticator(HostLanding);