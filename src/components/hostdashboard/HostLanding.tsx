/* eslint-disable @typescript-eslint/no-unused-vars */
import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import ReservationCard from './ReservationCard';
import ReviewCard from './ReviewCard';
import GanttChart from './GanttChart';
import AppContext from '../../context/AppContext';
import { useContext } from 'react';

import reservationsJson from './mock_data_delete_later/reservations.json';
import surveysJson from './mock_data_delete_later/surveys.json';

function HostLanding() {
  const { user } = useContext(AppContext);
  const reservations = reservationsJson.data;
  const reviews = surveysJson.data;
  const photos = [
    '/images/mountain-cabin.jpg',
    '/images/beach-house.jpg',
    '/images/downtown-apartment.jpg',
    '/images/log-cabin-interior.jpg',
    '/images/seattle-loft.jpg'
  ];

  return (
    <Container>
      <WidgetTitle>
        <h3 style={{ float: 'left' }}> Your Reservations </h3>
        <a style={{ float: 'right' }} href="host-reservations">
          All reservations ({reservations.length})
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
        {reservations.map((f, index) => (
          <ReservationCard
            key={index}
            reservationId={f.id}
            propertyName={f.propertyId}
            propertyPhoto={photos[Math.floor(Math.random() * photos.length)]}
            primaryGuestName={f.guestId}
            reservationEndDate={f.checkOut}
            reservationStartDate={f.checkIn}
          />
        ))}
      </ReservationsScroll>
      <WidgetTitle>
        <h3 style={{ float: 'left' }}> Newest Reviews </h3>
        <a style={{ float: 'right' }} href="host-reservations">
          All reviews ({reviews.length})
        </a>
      </WidgetTitle>
      <Reviews>
        {reviews.map((f, index) => (
          <ReviewCard
            key={index}
            propertyName={f.propertyId}
            primaryGuestName={f.guestId}
            submissionTime={f.submissionTime}
            content={f.surveyResponse}
          />
        ))}
      </Reviews>
      <WidgetTitle>
        <h3 style={{ float: 'left' }}> Your Week at a Glance </h3>
      </WidgetTitle>
      <GanttChart
        hostId={user!.userId}
        ganttStart={new Date()}
        ganttDuration={20}
      />
    </Container>
  );
}

export default HostLanding;

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
  height: 225px;
  overflow-x: scroll;
  white-space: nowrap;
  display: inline-block;
  align-items: center;
  justify-content: space-evenly;
`;

const WidgetTitle = styled.div`
  width: 80vw;
  /* background-color: grey; */
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
