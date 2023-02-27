import styled from '@emotion/styled';
import { useEffect, useMemo, useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import InfoCell from './InfoCell';
import CheckInCell from './checkIn/CheckInCell';
import GuidebookCell from './guidebook/GuidebookCell';
import InviteCell from './invite/InviteCell';
import WeatherCell from './weather/WeatherCell';
import RestaurantsCell from './restaurants/RestaurantsCell';
import EventsAndPlacesCell from './eventsAndPlaces/EventsAndPlacesCell';
import ChatCell from './chat/ChatCell';
import ChatPreview from './chat/ChatPreview';
import MapCell from './map/MapCell';
import ReviewCell from './review/ReviewCell';

export interface DashboardCellProps {
  className?: string;
  cell: string;
}

const info = 'info';
const check = 'check';
const guide = 'guide';
const invite = 'invite';
const weather = 'weather';
const rest = 'rest';
const event = 'event';
const chat = 'chat';
const map = 'map';
const review = 'review';

function Dashboard() {
  const { resId } = useParams();
  const { reservationDetail } = useContext(AppContext);

  const infoCell = <InfoCell cell={info} />;
  const checkCell = <CheckInCell cell={check} />;
  const guideCell = <GuidebookCell cell={guide} />;
  const inviteCell = <InviteCell cell={invite} />;
  const weatherCell = <WeatherCell cell={weather} />;
  const restCell = <RestaurantsCell n={2} cell={rest} />;
  const eventCell = <EventsAndPlacesCell n={2} cell={event} />;
  const chatCell = <ChatCell cell={chat} />;
  const chatPreviewCell = <ChatPreview n={3} cell={chat} />;
  const mapCell = <MapCell cell={map} />;
  const reviewCell = <ReviewCell cell={review} />;

  const [width, setWidth] = useState(window.innerWidth);

  // updates the screen width variable
  useEffect(() => {
    let subscribed = true;

    const updateWidth = () => {
      subscribed && setWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWidth);

    return () => {
      subscribed = false;
      window.removeEventListener('resize', updateWidth);
    };
  });

  // choose layout according to screen width
  const layout = useMemo(() => {
    let container: JSX.Element;

    if (reservationDetail?.id !== resId) {
      // prevent split-second flash of dashboard components while reservationDetail loads;
      // i.e., display a blank screen
      container = <></>;
    } else if (width <= 700) {
      container = (
        <SmallScreenContainer>
          {infoCell}
          {inviteCell}
          {guideCell}
          {chatCell}
          {checkCell}
          {mapCell}
          {weatherCell}
          {restCell}
          {eventCell}
          {reviewCell}
        </SmallScreenContainer>
      );
    } else if (width <= 1024) {
      container = (
        <MediumScreenContainer>
          {infoCell}
          {checkCell}
          {guideCell}
          {inviteCell}
          {weatherCell}
          {chatPreviewCell}
          {mapCell}
          {restCell}
          {eventCell}
          {reviewCell}
        </MediumScreenContainer>
      );
    } else {
      container = (
        <LargeScreenContainer>
          <div>
            {infoCell}
            {checkCell}
            {guideCell}
            {inviteCell}
            {weatherCell}
            {restCell}
            {eventCell}
          </div>
          <div>
            {chatPreviewCell}
            {mapCell}
            {reviewCell}
          </div>
        </LargeScreenContainer>
      );
    }

    return container;
  }, [width, resId, reservationDetail]);

  return layout;
}

const SmallScreenContainer = styled.div`
  display: grid;
  align-items: center;
  width: 100%;
  padding: 16px;
  gap: 16px;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 64px 112px 112px 112px 140px 140px 64px;
  grid-template-areas:
    '${info}    ${info}    ${info}    ${info}    ${invite}  ${invite}  ${invite}'
    '${guide}   ${guide}   ${guide}   ${guide}   ${chat}    ${chat}    ${chat}'
    '${check}   ${check}   ${check}   ${map}     ${map}     ${map}     ${map}'
    '${weather} ${weather} ${weather} ${weather} ${weather} ${weather} ${weather}'
    '${rest}    ${rest}    ${rest}    ${rest}    ${rest}    ${rest}    ${rest}'
    '${event}   ${event}   ${event}   ${event}   ${event}   ${event}   ${event}'
    '${review}  ${review}  ${review}  ${review}  ${review}  ${review}  ${review}';
`;

const MediumScreenContainer = styled.div`
  display: grid;
  align-items: center;
  width: 100%;
  padding: 16px;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 64px 80px 144px 1fr 256px 192px 192px 64px;
  grid-template-areas:
    '${info}    ${info}    ${info}'
    '${check}   ${guide}   ${invite}'
    '${weather} ${weather} ${weather}'
    '${chat}    ${chat}    ${chat}'
    '${map}     ${map}     ${map}'
    '${rest}    ${rest}    ${rest}'
    '${event}   ${event}   ${event}'
    '${review}  ${review}  ${review}';
`;

const LargeScreenContainer = styled.div`
  display: flex;
  column-gap: 32px;
  width: 85%;
  padding: 32px 0;

  // left column
  > div:nth-of-type(1) {
    width: 50%;
    display: grid;
    align-items: center;
    row-gap: 32px;
    column-gap: 16px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 80px 96px 144px 192px 192px;
    grid-template-areas:
      '${info}    ${info}    ${info}'
      '${check}   ${guide}   ${invite}'
      '${weather} ${weather} ${weather}'
      '${rest}    ${rest}    ${rest}'
      '${event}   ${event}   ${event}';
  }

  // right column
  > div:nth-of-type(2) {
    width: 50%;
    height: fit-content;
    display: grid;
    row-gap: 32px;
    grid-template-rows: 1fr 320px 64px;
    grid-template-areas:
      '${chat}'
      '${map}'
      '${review}';
  }
`;

export default Dashboard;
