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
  // https://stackoverflow.com/questions/41828359/how-do-i-access-the-group-for-a-cognito-user-account=
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  let userGroup;
  if (token) {
    const decoded = jwt(token);
    if (decoded) {
      userGroup = Object.entries(decoded)[1][1];
      if (typeof userGroup === 'boolean') {
        userGroup = 'unassigned';
        // Invoke lambda to assign user to group and copy info to the Guest MySQL table
      };
    };
  }
  return (<>
    <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
    <p> User Group = { userGroup }</p>
    <button onClick={handleLogout}>Sign out</button>
  </>
  );
}

export default withAuthenticator(HostLanding);