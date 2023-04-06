import '@aws-amplify/ui-react/styles.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

function HostLanding() {
  const { user } = useContext(AppContext);

  if (user?.role === 'guest') {
    return (
      <>
        <h1>You have logged in with Guest Credentials</h1>
        <Link to={routes.hostLanding}>
          <button>Go to Guest Landing Page</button>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <ReservationsWidgetTitle>
          <h3 style={{float: 'left'}}> Your Reservations </h3>
          <p style={{float: 'right'}}> All reservations (100) </p>
          {/* <span></span> */}
          {/* <p style={}> Right </p> */}
        </ReservationsWidgetTitle>
        <ReservationsButtons>
          <button> Currently hosting (10) </button>
          <button> Arriving soon (9) </button>
          <button> Checking out (8) </button>
          <button> Upcoming (8)  </button>
          <button> Pending review (8)  </button>
        </ReservationsButtons>
      </>
      
    );
  }
}

export default HostLanding;

// TODO: how to make text not spill out
const ReservationsButtons = styled.div`
  width: 80vw;
  height: 8%;
  display: flex;
  overflow-x: scroll;
  button {
    background-color: white;
    border: 4ptx;
    border-color: grey;
    color: black; // text color
    padding: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    border-radius: 16px;
    ${theme.font.button}

    :hover {
      filter: brightness(0.9) contrast(1.2);
      border-color: dodgerblue;
      color: dodgerblue
    }
  }
`;

const ReservationsWidgetTitle = styled.div`
  width: 80vw;
  height: 10%;
  display: flex;
  padding: 30px 0;
  background-color: grey;
  justify-content: space-between;
  
  h3 {
    font-size: 50px;
    ${theme.font.heading}
  }

  p {
    font-size: 20px;
    ${theme.font.body}
  }
`;

// const Container = styled.div`
//   display: flex;
//   /* flex-direction: column;
//   justify-content: center;
//   align-items: center; */
//   width: 80vw;
//   height: 30%;
//   text-align: center;
//   background-color: ${theme.color.gray};
//   /* color: ${theme.color.red}; */

//   h3 {
//     font-size: 50px;
//     text-align: left;
//     ${theme.font.heading}
//   }

//   h2 {
//     font-size: 64px;
//   }

  
// `;

