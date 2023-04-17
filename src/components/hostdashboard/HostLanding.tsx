import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import ReservationCard from './ReservationCard';
import ReviewCard from './ReviewCard';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import reservationsJson from './mock_data_delete_later/reservations.json';
import surveysJson from './mock_data_delete_later/surveys.json';
import propertiesJson from './mock_data_delete_later/properties.json';

interface CellProps {
  cellContent?: string;
  cellColor?: string;
  cellWidth?:string;
}

function HostLanding() {
  const reservations = reservationsJson.data;
  const reviews = surveysJson.data;
  const properties = propertiesJson.data;
  const photos = [
    '/images/mountain-cabin.jpg',
    '/images/beach-house.jpg',
    '/images/downtown-apartment.jpg',
    '/images/log-cabin-interior.jpg',
    '/images/seattle-loft.jpg'
  ];
  const weekday = [
    'Sun.',
    'Mon.',
    'Tue.',
    'Wed.',
    'Thur.',
    'Fri.',
    'Sat.'
  ];
  const colors = [theme.color.orange, theme.color.white];
  const now = new Date();
  const rows = [];
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const initialEndDate = startDate!.add(7, 'day');
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);
  for (let y = 0; y < properties.length + 1; y++) {
    // Build the cells in an array
    const cells = [];
    let cellContent;
    let cellColor;

    for (let x = 0; x < 8; x++) {
      if (y === 0) {
        if (x > 0) {
          const day = weekday[(now.getDay() + x - 1) % 7];
          cells.push(
            <Cell>
              {' '}
              {day} <br /> {now.getMonth() + 1}/{now.getDate() + x - 1}{' '}
            </Cell>
          );
        } else {
          cells.push(<Cell />);
        }
      } else {
        if (x === 0) {
          cellContent = `${properties[y - 1].name}`;
          cells.push(<Cell cellWidth="200px"> {cellContent}</Cell>);
        } else {
          cellContent = undefined;
          cellColor = colors[Math.floor(Math.random() * colors.length)];
          cells.push(<Cell cellColor={cellColor}> {cellContent}</Cell>);
        }
        
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
        {reservations.map((f) => (
          <ReservationCard
            key={f.id}
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
        {reviews.map((f) => (
          <ReviewCard
            key={f.propertyId}
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
      
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickers>
            <DatePicker
                label="Start"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="End"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
          </DatePickers>
       
        </LocalizationProvider>
      
      <table>
        <tbody>{rows}</tbody>
      </table>
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

const Cell = styled('td')<CellProps>`
  /* width: 100px; */
  width: ${(props) => (props.cellWidth ? props.cellWidth: `75px`)};
  height: 50px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: ${(props) => (props.cellColor ? props.cellColor : `none`)};
  font-weight: bold;
`;

const DatePickers = styled.div`
  /* display: inline-block; */
  gap: 10%;
`;