import styled from '@emotion/styled';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { routes } from '../..';
import {
  EventOrPlace,
  Forecast,
  Message,
  ReservationDetail,
  Restaurant
} from '../../utils/dtos';
import { theme } from '../../utils/styles';
import ChatPreview from './ChatPreview';
import ImagePreview from './ImagePreview';
import WeatherForecastTile from './WeatherForecastTile';

export interface DashboardData {
  reservation: ReservationDetail;
  forecast: Forecast[];
  restaurants: Restaurant[];
  eventsAndPlaces: EventOrPlace[];
  messages: Message[];
}

function Dashboard() {
  const { reservation, forecast, restaurants, eventsAndPlaces, messages } =
    useLoaderData() as DashboardData;

  const { checkIn, checkOut, address } = reservation;

  // Gets the check-in/out date/time as a formatted string
  const getFormattedCheckInOut = (event: 'in' | 'out'): string => {
    const eventType = event === 'in' ? checkIn : checkOut;

    const date = new Date(eventType).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric'
    });

    const time = new Date(eventType).toLocaleTimeString('default', {
      timeStyle: 'short'
    });

    return `${date} @ ${time}`;
  };

  const infoCell = useMemo(() => <InfoCell>{address}</InfoCell>, []);

  const checkInCell = useMemo(
    () => (
      <CheckInCell>
        Check-in
        <div>{getFormattedCheckInOut('in')}</div>
      </CheckInCell>
    ),
    []
  );

  const guidebookCell = useMemo(
    () => (
      <GuidebookCell>
        {/* TODO: guidebook route on matthew's branch */}
        <StyledLink to={routes.home}>Guidebook</StyledLink>
      </GuidebookCell>
    ),
    []
  );

  const inviteCell = useMemo(
    () => (
      <InviteCell>
        <StyledLink to={routes.invite}>Invite</StyledLink>
      </InviteCell>
    ),
    []
  );

  const weatherCell = useMemo(
    () => (
      <WeatherCell>
        <StyledLink to={routes.weather}>
          {forecast.map((f) => (
            <WeatherForecastTile
              key={f.timestamp}
              time={f.timestamp}
              weather={f.weather}
              temp={f.temp}
            />
          ))}
        </StyledLink>
      </WeatherCell>
    ),
    []
  );

  const restaurantsCell = useMemo(
    () => (
      <RestaurantsCell>
        <ImagePreview
          title="Nearby Restaurants"
          viewMoreLink={routes.restaurants}
          previewSlides={restaurants.map((r) => {
            return {
              image: r.imageUrl,
              link: r.url
            };
          })}
        />
      </RestaurantsCell>
    ),
    []
  );

  const eventsCell = useMemo(
    () => (
      <EventsCell>
        <ImagePreview
          title="Events and Places"
          viewMoreLink={routes.eventsAndPlaces}
          previewSlides={eventsAndPlaces.map((e) => {
            return {
              image: e.imageUrl,
              link: e.url
            };
          })}
        />
      </EventsCell>
    ),
    []
  );

  const chatCell = useMemo(
    () => (
      <ChatCell>
        <StyledLink to={routes.chat}>Chat</StyledLink>
      </ChatCell>
    ),
    []
  );

  const chatPreviewCell = useMemo(
    () => (
      <ChatPreviewCell>
        <ChatPreview messages={messages} />
      </ChatPreviewCell>
    ),
    [] // TODO: this should update whenever new messages arrive
  );

  const mapCell = useMemo(
    () => (
      // TODO: replace image with dynamic map based on address
      <MapCell img="/images/maps-button.png">
        <StyledLink to={routes.map} />
      </MapCell>
    ),
    []
  );

  const reviewCell = useMemo(
    () => (
      <ReviewCell>
        {/* TODO: replace with route from hieu's branch */}
        <StyledLink to={routes.home}>Review</StyledLink>
      </ReviewCell>
    ),
    []
  );

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

    if (width <= 700) {
      container = (
        <SmallScreenContainer>
          {infoCell}
          {inviteCell}
          {guidebookCell}
          {chatCell}
          {checkInCell}
          {mapCell}
          {weatherCell}
          {restaurantsCell}
          {eventsCell}
          {reviewCell}
        </SmallScreenContainer>
      );
    } else if (width <= 1024) {
      container = (
        <MediumScreenContainer>
          {infoCell}
          {checkInCell}
          {guidebookCell}
          {inviteCell}
          {weatherCell}
          {chatPreviewCell}
          {mapCell}
          {restaurantsCell}
          {eventsCell}
          {reviewCell}
        </MediumScreenContainer>
      );
    } else {
      container = (
        <LargeScreenContainer>
          <div>
            {infoCell}
            {checkInCell}
            {guidebookCell}
            {inviteCell}
            {weatherCell}
            {restaurantsCell}
            {eventsCell}
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
  }, [width]);

  return layout;
}

const GridCellWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  ${theme.font.body}
`;

const GridCellClickable = styled(GridCellWrapper)`
  align-items: center;
  justify-content: center;
  min-width: fit-content;
  padding: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 24px;
  color: ${theme.color.white};
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: inherit;
`;

const info = 'info';
const InfoCell = styled(GridCellWrapper)`
  grid-area: ${info};
  padding: 8px;
  background-color: white;
  border: 1px solid black;
`;

const check = 'check';
const CheckInCell = styled(GridCellClickable)`
  grid-area: ${check};
  flex-direction: column;
  row-gap: 8px;
  background-color: ${theme.color.teal};

  div {
    font-size: 14px;
    text-align: center;
  }
`;

const guide = 'guide';
const GuidebookCell = styled(GridCellClickable)`
  grid-area: ${guide};
  background-color: ${theme.color.red};
`;

const invite = 'invite';
const InviteCell = styled(GridCellClickable)`
  grid-area: ${invite};
  background-color: ${theme.color.purple};
`;

const weather = 'weather';
const WeatherCell = styled(GridCellWrapper)`
  grid-area: ${weather};

  // entire cell is one link
  a {
    justify-content: space-between;
    column-gap: 8px;

    div {
      flex-grow: 1;
    }
  }
`;

const rest = 'rest';
const RestaurantsCell = styled(GridCellWrapper)`
  grid-area: ${rest};
`;

const event = 'event';
const EventsCell = styled(GridCellWrapper)`
  grid-area: ${event};
`;

const chat = 'chat';
const ChatCell = styled(GridCellClickable)`
  grid-area: ${chat};
  background-color: ${theme.color.orange};
  display: none;

  ${theme.screen.small} {
    display: flex;
  }
`;

const ChatPreviewCell = styled(GridCellWrapper)`
  grid-area: ${chat};

  ${theme.screen.small} {
    display: none;
  }
`;

const map = 'map';
const MapCell = styled(GridCellClickable)<{ img: string }>`
  grid-area: ${map};
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center;
`;

const review = 'review';
const ReviewCell = styled(GridCellClickable)`
  grid-area: ${review};
  background-color: ${theme.color.green};
`;

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
