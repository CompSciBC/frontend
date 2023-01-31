import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react';
import jwt from 'jwt-decode';
// import axios from 'axios';

// let lambdaError:boolean = true;

// interface CreateUserResponse {
//   username: string;
//   role: string;
//   id: string;
//   createdAt: string;
// };

// async function assignUserAsGuest() {
//   try {
//     // 👇️ const data: CreateUserResponse
//     const { data } = await axios.post<CreateUserResponse>(
//       'https://fw9br1u38l.execute-api.us-west-2.amazonaws.com/default/bmg_assign_user_role',
//       { name: 'John Smith', job: 'manager' },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       },
//     );
//     lambdaError = false;

//     console.log(JSON.stringify(data, null, 4));

//     return data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.log('error message: ', error.message);
//       // 👇️ error: AxiosError<any, any>
//       return error.message;
//     } else {
//       console.log('unexpected error: ', error);
//       return 'An unexpected error occurred';
//     }
//   }
// }

function HostLanding() {
  const { signOut, user } = useAuthenticator();

  function handleLogout() {
    signOut();
  };





  function assignUserAsHost(username : any, currentRole : string, assignedRole: string) {
    const jsonData = {
      username: username, 
      currentRole: currentRole,
      assignedRole: assignedRole
    };
    // Send data to the backend via POST
    fetch('https://fw9br1u38l.execute-api.us-west-2.amazonaws.com/default/bmg_assign_user_role', {  // Enter your IP address here
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(jsonData) // body data type must match "Content-Type" header
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
        assignUserAsHost(user.username, 'unassigned', 'host');
      };
    };
  }

  return (<>
    <h1>WELCOME TO THE HOST LANDING PAGE!</h1>
    <p> User Group = { userGroup }</p>
    {/* <p> Lambda Error = { String(lambdaError) }</p> */}
    <button onClick={handleLogout}>Sign out</button>
    {/* <button onClick={assignUserAsHost(user.username, 'unassigned', 'host')}>Invoke Lambda</button> */}
  </>
  );
}

export default withAuthenticator(HostLanding);