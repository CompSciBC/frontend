import '@aws-amplify/ui-react/styles.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import ReservationCard from '../hostdashboard/ReservationCard';

function HostLanding() {
  const { user } = useContext(AppContext);
  const reservations = [];
  const now = new Date();
  for (let i = 1; i < 10; i++) {
    reservations.push(
      {
        propertyId: i,
        propertyName: `propertyropertyroperty ${i}`,
        primaryGuestName: `guest ${i}`,
        reservationStartDate: now.getDate() - i,
        reservationEndDate: now.getDate() + i
      }
    );
  }



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
          <h3 style={{ float: 'left' }}> Your Reservations </h3>
          <a style={{ float: 'right' }} href="host-reservations">
            All reservations (100)
          </a>
          {/* <span></span> */}
          {/* <p style={}> Right </p> */}
        </ReservationsWidgetTitle>
        <ReservationsButtons>
          <button> Currently hosting (10) </button>
          <button> Arriving soon (9) </button>
          <button> Checking out (8) </button>
          <button> Upcoming (8) </button>
          <button> Pending review (8) </button>
        </ReservationsButtons>
        <ReservationsScroll>
          {reservations.map((f) => (
            <ReservationCard
              key={f.propertyId}
              propertyName={f.propertyName}
              primaryGuestName={f.primaryGuestName}
              reservationEndDate={f.reservationEndDate}
              reservationStartDate={f.reservationStartDate}
            />
          ))}
        </ReservationsScroll>
        
        

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
      color: dodgerblue;
    }
  }
`;

const ReservationsScroll = styled.div`
  width:80vw;
  height:200px;
  overflow-x:scroll;
  white-space: nowrap;
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

  a {
    font-size: 20px;
    text-decoration: underline;
    color: black;
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
