/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const photos = ['/images/mountain-cabin.jpg', '/images/beach-house.jpg', '/images/downtown-apartment.jpg', '/images/log-cabin-interior.jpg', '/images/seattle-loft.jpg'];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const colors = ["green", "red", "blue", "yellow"];
  const now = new Date();
  for (let i = 1; i < 10; i++) {
    reservations.push({
      propertyId: i,
      propertyName: `property ${i}`,
      primaryGuestName: `guest ${i}`,
      reservationStartDate: now.getDate() - i,
      reservationEndDate: now.getDate() + i
    });
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
    const rows = [];
    for (let y = 0; y < reservations.length + 1; y++) {
        // Build the cells in an array
        const cells = [];
        let cellContent;
        let cellColor;
        
        for (let x = 0; x < 8; x++) {
            if(y === 0) {
              if (x > 0) {
                const day = weekday[(now.getDay() + x - 1)%7];
                cells.push(<Cell> {day} <br/> {now.getMonth() + 1}/{now.getDate() + x - 1}  </Cell>);
              } else {
                cells.push(<Cell/>);
              }
              
            } else {
              if (x === 0) {
                cellContent = `${reservations[y -1 ].propertyName}`;
              } else {
                cellContent = `${x}, ${y}`;
                cellColor = colors[Math.floor(Math.random()*colors.length)];
              }
              cells.push(<Cell> {cellContent}</Cell>);

            }
            
        }
        // Put them in the row
        rows.push(<tr>{cells}</tr>);
    }
  
    return (
      <Container>
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Your Reservations </h3>
          <a style={{ float: 'right' }} href="host-reservations">
            All reservations (100)
          </a>
        </WidgetTitle>
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
              propertyPhoto={photos[Math.floor(Math.random()*photos.length)]}
              primaryGuestName={f.primaryGuestName}
              reservationEndDate={f.reservationEndDate}
              reservationStartDate={f.reservationStartDate}
            />
          ))}
        </ReservationsScroll>
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Newest Reviews </h3>
        </WidgetTitle>
        
        <Reviews>
          <select>
            {photos.map( (x,y) => 
              <option key={y}>{x}</option> )
            }
          </select>
          <ReservationsScroll>
          {reservations.map((f) => (
            <ReservationCard
              key={f.propertyId}
              propertyName={f.propertyName}
              propertyPhoto={photos[Math.floor(Math.random()*photos.length)]}
              primaryGuestName={f.primaryGuestName}
              reservationEndDate={f.reservationEndDate}
              reservationStartDate={f.reservationStartDate}
            />
          ))}
        </ReservationsScroll>
          

        </Reviews>
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Your Week at a Glance </h3>
        </WidgetTitle>
        <table><tbody>{rows}</tbody></table>
      </Container>
    );
  }
}

export default HostLanding;

// TODO: how to make text not spill out
const ReservationsButtons = styled.div`
  width: 80vw;
  display: flex;
  overflow-x: scroll;
  button {
    background-color: white;
    border: 1px solid black;
    color: black; // text color
    text-align: center;
    display: inline-block;
    margin: 0px 4px;
    border-radius: 16px;
    padding: 10px;
    ${theme.font.button}

    :hover {
      filter: brightness(0.9) contrast(1.2);
      border-color: dodgerblue;
      color: dodgerblue;
    }
  }
`;

const ReservationsScroll = styled.div`
  width: 80vw;
  height: 190px;
  overflow-x: scroll;
  white-space: nowrap;
`;

const Reviews = styled.div`
  width: 80vw;
  /* height: 190px; */
  overflow-x: scroll;
  white-space: nowrap;
  display: inline-block;
  align-items: center;
  justify-content: space-evenly;

  select {
    width: 100%;
    min-width: 15ch;
    max-width: 30ch;
    border: 1px solid ${theme.color.gray};
    border-radius: 0.25em;
    padding: 0.25em 0.5em;
    cursor: pointer;
    line-height: 1.1;
    background-color: transparent;
    ${theme.font.displaySmall}
  }
`;



const RatingsAggregate = styled.div`
  width: 200px;
  /* height: 250px; */
  display: inline-block;
  vertical-align: middle;
  margin-right: 16px;
  background: pink;
  text-align: center;
`;





const LatestReviews = styled.div`
  width: 500px;
  height: 250px;
  display: inline-block;
  vertical-align: middle;
  background: green;
`;

const WidgetTitle = styled.div`
  width: 80vw;
  background-color: grey;
  justify-content: space-between;

  h3 {
    font-size: 50px;
    ${theme.font.displayLarge}
  }

  a {
    font-size: 20px;
    text-decoration: underline;
    color: black;
    ${theme.font.body}
  }
`;


const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  gap: 16px;
  padding: 32px 0;

  ${theme.screen.small} {
    width: 100%;
    padding: 16px;
  }
`;

const Cell = styled.td`
  width: 100px;
  /* height: 50px; */
  border: 1px solid #ddd;
  text-align: center;
  
`;
