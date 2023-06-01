/* eslint-disable @typescript-eslint/no-unused-vars */
import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import ReservationCard from './ReservationCard';
import ReviewCard from './ReviewCard';
import GanttChart from './GanttChart';
import AppContext from '../../context/AppContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { HostProvider, HostContextType } from './hostContext';
import { server } from '../../index';
import { Reservation, SurveyMetrics } from '../../utils/dtos';

// http://localhost:8080/api/reservations/checkoutafter?index=host&id=652ac46b-f438-45e6-95c0-bb7cc6029db8&primaryOnly=true&checkOutCutOff=2023-05-13T00:00:00.000
// Upcoming
// http://localhost:8080/api/reservations/checkinafter?index=host&id=652ac46b-f438-45e6-95c0-bb7cc6029db8&primaryOnly=true&checkInCutOff=2023-05-14T00:00:00.000
// Currently hosting
// http://localhost:8080/api/reservations/checkinonorbeforecheckoutafter?index=host&id=652ac46b-f438-45e6-95c0-bb7cc6029db8&primaryOnly=true&checkInCutOff=2023-05-14T00:00:00.000&checkOutCutOff=2023-05-14T00:00:00.000

// http://localhost:8080/api/surveys/hostmetrics?id=652ac46b-f438-45e6-95c0-bb7cc6029db8

function HostLanding() {
  const { user } = useContext(AppContext);
  // const reservations = reservationsJson.data;
  // const surveys = JSON.stringify(surveysJson);
  // const reviews: SurveyMetrics = JSON.parse(surveys);
  // console.log('reservations');
  // console.log(JSON.stringify(reservationsJson));
  // console.log('reviews');
  // console.log(JSON.stringify(reviews));
  const [reservationButton, setReservationButton] =
    useState<string>('getCurrent');
  const [reservations, setReservations] = useState<Reservation[] | null>([]);

  const [reviews, setReviews] = useState<SurveyMetrics>();
  useEffect(() => {
    fetch(`${server}/api/surveys/hostmetrics?id=${user!.userId}`)
      .then(async (res) => {
        return await res.json();
      })
      .then((data) => {
        setReviews(data);
      });
  }, []);
  // console.log('reviews');
  // console.log(reviews);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const formattedString = tomorrow.toISOString().slice(0, -1);
    let queryString = '';
    if (reservationButton === 'getCurrent') {
      queryString = `${server}/api/reservations/checkinonorbeforecheckoutafter?index=host&id=${
        user!.userId
      }&primaryOnly=true&checkInCutOff=${formattedString}&&checkOutCutOff=${formattedString}`;
    } else if (reservationButton === 'getUpcoming') {
      queryString = `${server}/api/reservations/checkinafter?index=host&id=${
        user!.userId
      }&primaryOnly=true&checkInCutOff=${formattedString}`;
    }
    fetch(queryString)
      .then(async (res) => {
        if (res.status === 404) {
          throw new Error(`API returned an error: ${res.status}`);
        }
        return await res.json();
      })
      .then((data) => {
        // console.log(data);
        setReservations(data.data);
      })
      .catch((error) => {
        console.log(error);
        setReservations(null);
      });
  }, [reservationButton]);

  const [host, setHost] = useState<HostContextType>({
    reservations,
    reviews
  });

  return (
    <HostProvider value={host}>
      <Container>
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Your Reservations </h3>
          <a style={{ float: 'right' }} href="host-reservations">
            All reservations
          </a>
        </WidgetTitle>
        <ReservationsButtons>
          <button autoFocus onClick={() => setReservationButton('getCurrent')}>
            {' '}
            Currently hosting{' '}
          </button>
          <button onClick={() => setReservationButton('getUpcoming')}>
            {' '}
            Upcoming{' '}
          </button>
        </ReservationsButtons>
        {reservations === null ? (
          <Placeholder>
            <h3> You have no reservations at the moment </h3>
          </Placeholder>
        ) : (
          <ReservationsScroll>
            {reservations.map((f, index) => (
              <ReservationCard
                key={index}
                reservationId={f.id}
                propertyName={f.property.name}
                propertyId={f.property.id!}
                primaryGuestEmail={f.guestId}
                reservationEndDate={f.checkOut}
                reservationStartDate={f.checkIn}
              />
            ))}
          </ReservationsScroll>
        )}
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Newest Reviews </h3>
          <a style={{ float: 'right' }} href="hostReviewsDashboard">
            All reviews
          </a>
        </WidgetTitle>
        {reviews?.surveyResponses.length === 0 ? (
          <Placeholder>
            <h3> You have no reviews at the moment </h3>
          </Placeholder>
        ) : (
          <Reviews>
            {reviews?.surveyResponses.map((f: any, index: any) => (
              <ReviewCard
                key={index}
                property={f.property}
                guest={f.guest}
                submissionTime={f.submissionTime}
                qualityMetrics={f.qualityMetrics}
                content={f.surveyResponse}
              />
            ))}
          </Reviews>
        )}
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Your Week at a Glance </h3>
        </WidgetTitle>
        <GanttChart hostId={user!.userId} ganttDuration={20} />
      </Container>
    </HostProvider>
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

    :focus {
      background-color: dodgerblue;
      color: white;
      border: 1px dodgerblue;
    }
  }
`;

const ReservationsScroll = styled.div`
  width: 80vw;
  height: 200px;
  overflow-x: scroll;
  white-space: nowrap;
`;

const Reviews = styled.div`
  width: 80vw;
  height: 240px;
  overflow-x: scroll;
  white-space: nowrap;
  display: inline-block;
  align-items: center;
  justify-content: space-evenly;
`;

const Placeholder = styled.div`
  width: 80vw;
  height: 200px;
  align-items: center;
  padding: 75px;

  text-align: center;
  justify-content: center;
  border-radius: 16px;
  ${theme.font.placeholder}
  background-color: #FBFCFC
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
