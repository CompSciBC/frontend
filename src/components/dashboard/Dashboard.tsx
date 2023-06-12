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
import PlacesCell from './places/PlacesCell';
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
  const { reservation } = useContext(AppContext);
  const [checkCellVisible, setCheckCellVisible] = useState(false);

  // determine if check-in/out cell is visible
  useEffect(() => {
    let subscribed = true;

    if (reservation) {
      const { checkIn, checkOut } = reservation;

      // convert date/time strings to pure dates (with no time)
      const checkInDate = new Date(checkIn).setHours(0, 0, 0, 0);
      const checkOutDate = new Date(checkOut).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);

      subscribed &&
        setCheckCellVisible(
          // only visible during reservation period
          currentDate >= checkInDate && currentDate <= checkOutDate
        );
    }

    return () => {
      subscribed = false;
    };
  }, [reservation]);

  const infoCell = <InfoCell cell={info} />;
  const checkCell = checkCellVisible ? <CheckInCell cell={check} /> : null;
  const guideCell = <GuidebookCell cell={guide} />;
  const inviteCell = <InviteCell cell={invite} />;
  const weatherCell = <WeatherCell cell={weather} />;
  const restCell = <RestaurantsCell n={2} cell={rest} />;
  const eventCell = <PlacesCell n={2} cell={event} />;
  const chatCell = <ChatCell cell={chat} />;
  const chatPreviewCell = <ChatPreview n={3} cell={chat} />;
  const getMapCell = (interactive: boolean, zoom: number) => (
    <MapCell cell={map} interactive={interactive} zoom={zoom} />
  );
  const reviewCell = <ReviewCell cell={review} />;

  const [width, setWidth] = useState(window.innerWidth);

  // updates the screen width variable
  useEffect(() => {
    let subscribed = true;

    //  The && operator is used to ensure that setWidth is only called if subscribed is still true.
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

    if (reservation?.id !== resId) {
      // prevent split-second flash of dashboard components while reservation loads;
      // i.e., display a blank screen
      container = <></>;
    } else if (width <= 700) {
      container = (
        <SmallScreenContainer checkCellVisible={checkCellVisible}>
          {infoCell}
          {inviteCell}
          {guideCell}
          {chatCell}
          {checkCell}
          {getMapCell(false, 8)}
          {weatherCell}
          {restCell}
          {eventCell}
          {reviewCell}
        </SmallScreenContainer>
      );
    } else if (width <= 1024) {
      container = (
        <MediumScreenContainer checkCellVisible={checkCellVisible}>
          {infoCell}
          {checkCell}
          {guideCell}
          {inviteCell}
          {weatherCell}
          {chatPreviewCell}
          {getMapCell(true, 12)}
          {restCell}
          {eventCell}
          {reviewCell}
        </MediumScreenContainer>
      );
    } else {
      container = (
        <LargeScreenContainer checkCellVisible={checkCellVisible}>
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
            {getMapCell(true, 12)}
            {reviewCell}
          </div>
        </LargeScreenContainer>
      );
    }

    return container;
  }, [width, resId, reservation, reviewCell]);

  return layout;
}

interface ScreenContainerProps {
  checkCellVisible: boolean;
}

const SmallScreenContainer = styled.div<ScreenContainerProps>`
  display: grid;
  align-items: center;
  width: 100%;
  padding: 16px;
  gap: 16px;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 64px 112px 112px 112px 140px 140px 64px;
  grid-template-areas: ${(props) => {
    const checkOrMap = props.checkCellVisible ? check : map;
    return `
      '${info}       ${info}       ${info}       ${info}    ${invite}  ${invite}  ${invite}'
      '${guide}      ${guide}      ${guide}      ${guide}   ${chat}    ${chat}    ${chat}'
      '${checkOrMap} ${checkOrMap} ${checkOrMap} ${map}     ${map}     ${map}     ${map}'
      '${weather}    ${weather}    ${weather}    ${weather} ${weather} ${weather} ${weather}'
      '${rest}       ${rest}       ${rest}       ${rest}    ${rest}    ${rest}    ${rest}'
      '${event}      ${event}      ${event}      ${event}   ${event}   ${event}   ${event}'
      '${review}     ${review}     ${review}     ${review}  ${review}  ${review}  ${review}'
    `;
  }};
`;

const MediumScreenContainer = styled.div<ScreenContainerProps>`
  display: grid;
  align-items: center;
  width: 100%;
  padding: 16px;
  gap: 16px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 64px 80px 144px 1fr 256px 192px 192px 64px;
  grid-template-areas: ${(props) => {
    const checkOrGuide = props.checkCellVisible ? check : guide;
    const guideOrInvite = props.checkCellVisible ? guide : invite;
    return `
      '${info}         ${info}         ${info}    ${info}          ${info}    ${info}'
      '${checkOrGuide} ${checkOrGuide} ${guide}   ${guideOrInvite} ${invite}  ${invite}'
      '${weather}      ${weather}      ${weather} ${weather}       ${weather} ${weather}'
      '${chat}         ${chat}         ${chat}    ${chat}          ${chat}    ${chat}'
      '${map}          ${map}          ${map}     ${map}           ${map}     ${map}'
      '${rest}         ${rest}         ${rest}    ${rest}          ${rest}    ${rest}'
      '${event}        ${event}        ${event}   ${event}         ${event}   ${event}'
      '${review}       ${review}       ${review}  ${review}        ${review}  ${review}'
    `;
  }};
`;

const LargeScreenContainer = styled.div<ScreenContainerProps>`
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
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 80px 96px 144px 192px 192px;
    grid-template-areas: ${(props) => {
      const checkOrGuide = props.checkCellVisible ? check : guide;
      const guideOrInvite = props.checkCellVisible ? guide : invite;
      return `
        '${info}         ${info}         ${info}    ${info}          ${info}    ${info}'
        '${checkOrGuide} ${checkOrGuide} ${guide}   ${guideOrInvite} ${invite}  ${invite}'
        '${weather}      ${weather}      ${weather} ${weather}       ${weather} ${weather}'
        '${rest}         ${rest}         ${rest}    ${rest}          ${rest}    ${rest}'
        '${event}        ${event}        ${event}   ${event}         ${event}   ${event}'
      `;
    }};
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
