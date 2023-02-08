import styled from '@emotion/styled';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../..';
import { ReservationDetail } from '../../utils/dtos';
import { theme } from '../../utils/styles';
import ChatPreview from './ChatPreview';
import ImagePreview from './ImagePreview';
import WeatherForecastTile, { weatherTypes } from './WeatherForecastTile';

function Dashboard() {
  // TODO: replace hard coded value
  const reservation: ReservationDetail = {
    id: '1234',
    hostId: 'test-host-1',
    propertyId: 'test-prop-1',
    guestId: 'test-guest-1',
    numGuests: 2,
    checkIn: '2023-03-31T12:00',
    checkOut: '2023-12-31T:12:00',
    reasonForStay: 'vacation',
    propertyName: 'Cabin in the Woods',
    address: '12331 23rd Ave NE, Seattle, WA 98125'
  };

  const { checkIn, checkOut, address } = reservation;

  /**
   * Gets the check-in/out date/time as a formatted string
   *
   * @param event in for checkIn, or out for checkOut
   * @returns Check-in/out time string in the format: MMM D @ H:MM A/PM
   */
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

  // TODO: replace this with real forecast data from the API
  /**
   * Generates a random weather forecast tile
   * @param time A time period
   * @returns A weather forecast tile
   */
  const randomForecast = (time: string) => {
    return (
      <WeatherForecastTile
        time={time}
        weather={weatherTypes[Math.floor(Math.random() * weatherTypes.length)]}
        temp={Math.floor(Math.random() * 110)}
      />
    );
  };

  return (
    <Container>
      <InfoCell>{address}</InfoCell>
      <CheckInCell>
        Check-in
        <div>{getFormattedCheckInOut('in')}</div>
      </CheckInCell>
      <GuidebookCell>
        {/* TODO: guidebook route on matthew's branch */}
        <StyledLink to={routes.home}>Guidebook</StyledLink>
      </GuidebookCell>
      <InviteCell>
        <StyledLink to={routes.invite}>Invite</StyledLink>
      </InviteCell>
      <WeatherCell>
        <StyledLink to={routes.weather}>
          {/* TODO: replace with actual forecast from api */}
          {['Now', '4pm', '5pm', '6pm', '7pm'].map((time) => (
            <Fragment key={time}>{randomForecast(time)}</Fragment>
          ))}
        </StyledLink>
      </WeatherCell>
      <RestaurantsCell>
        <ImagePreview
          title="Nearby Restaurants"
          viewMoreLink={routes.restaurants}
          previewSlides={[
            {
              // image: '/images/national-fast-food-day.webp',
              // link: '/'
            },
            {
              image: '/images/pizza-with-pineapple-and-thin-crust.webp',
              link: '/'
            }
          ]}
        />
      </RestaurantsCell>
      <EventsCell>
        <ImagePreview
          title="Events and Places"
          viewMoreLink={routes.eventsAndPlaces}
          previewSlides={[
            {
              image: '/images/national-fast-food-day.webp',
              link: '/'
            },
            {
              image: '/images/pizza-with-pineapple-and-thin-crust.webp',
              link: '/'
            }
          ]}
        />
      </EventsCell>
      <ChatCell>
        <StyledLink to={routes.chat}>Chat</StyledLink>
      </ChatCell>
      <LargeChatCell>
        <ChatPreview />
      </LargeChatCell>
      {/* TODO: replace image with dynamic map based on address */}
      <MapCell img="/images/maps-button.png">
        <StyledLink to={routes.map} />
      </MapCell>
      <ReviewCell>
        {/* TODO: review route from hieu's branch */}
        <StyledLink to={routes.home}>Review</StyledLink>
      </ReviewCell>
    </Container>
  );
}

const GridCellWrapper = styled.div`
  display: flex;
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

const LargeChatCell = styled(GridCellWrapper)`
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

const Container = styled.div`
  display: grid;
  align-items: center;
  width: 85%;
  padding: 32px 0;
  row-gap: 32px;
  column-gap: 16px;
  grid-template-columns: repeat(3, 1fr) 0px 3fr;
  grid-template-rows: 80px 96px 72px 72px 72px 72px 72px 72px;
  grid-template-areas:
    '${info}    ${info}    ${info}    . ${chat}   ${chat}   ${chat}'
    '${check}   ${guide}   ${invite}  . ${chat}   ${chat}   ${chat}'
    '${weather} ${weather} ${weather} . ${chat}   ${chat}   ${chat}'
    '${weather} ${weather} ${weather} . ${map}    ${map}    ${map}'
    '${rest}    ${rest}    ${rest}    . ${map}    ${map}    ${map}'
    '${rest}    ${rest}    ${rest}    . ${map}    ${map}    ${map}'
    '${event}   ${event}   ${event}   . ${map}    ${map}    ${map}'
    '${event}   ${event}   ${event}   . ${review} ${review} ${review}';

  ${theme.screen.medium} {
    width: 100%;
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 64px 80px 144px 320px 320px 192px 192px 64px;
    grid-template-areas:
      '${info}    ${info}    ${info}'
      '${check}   ${guide}   ${invite}'
      '${weather} ${weather} ${weather}'
      '${chat}    ${chat}    ${chat}'
      '${map}     ${map}     ${map}'
      '${rest}    ${rest}    ${rest}'
      '${event}   ${event}   ${event}'
      '${review}  ${review}  ${review}';
  }
  /* ${theme.screen.medium} {
    width: 100%;
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 64px 96px 144px 320px 192px 192px 64px;
    grid-template-areas:
      '${info}    ${info}    ${info}    ${info}    ${info}    ${info}'
      '${check}   ${check}   ${guide}   ${guide}   ${invite}  ${invite}'
      '${weather} ${weather} ${weather} ${weather} ${weather} ${weather}'
      '${chat}    ${chat}    ${chat}    ${map}     ${map}     ${map}'
      '${rest}    ${rest}    ${rest}    ${rest}    ${rest}    ${rest}'
      '${event}   ${event}   ${event}   ${event}   ${event}   ${event}'
      '${review}  ${review}  ${review}  ${review}  ${review}  ${review}';
  } */

  ${theme.screen.small} {
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
  }
`;

export default Dashboard;
