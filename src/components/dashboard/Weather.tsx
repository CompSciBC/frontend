import { Navigate } from 'react-router-dom';

function Weather() {
  if (localStorage.getItem('username') === null) {    
    return <Navigate replace to="/" />;
  };
  return <>Weather</>;
}

export default Weather;
