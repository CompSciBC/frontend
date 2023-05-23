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
import { Reservation, SurveyData } from '../../utils/dtos';
import surveysJson from './mock_data_delete_later/surveys.json';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function HostReviewsDashboard() {
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
//   console.log(surveysJson.surveyResponses);
//   const [reviews, setReviews] = useState<SurveyData[]>(surveysJson.surveyResponses);
//   setReviews(surveysJson);
//   useEffect(() => {
//     fetch(`${server}/api/surveys/hostmetrics?id=${user!.userId}`)
//       .then(async (res) => {
//         return await res.json();
//       })
//       .then((data) => {
//         setReviews(data);
//       });
//   }, []);
    const reviews = surveysJson;
//   console.log('reviews');
    console.log(reviews.surveyResponses[0]);
    function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
        return { name, calories, fat, carbs, protein };
    }
    
    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

  const [host, setHost] = useState<HostContextType>({
    reservations,
    reviews
  });
  
  // console.log('reservations');
  // console.log(reservations);
  // console.log('host');
  // console.log(host);
  return (
    <HostProvider value={host}>
      <Container>
        <WidgetTitle>
          <h3 style={{ float: 'left' }}> Reviews </h3>
        </WidgetTitle>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Container>
    </HostProvider>
  );
}

export default HostReviewsDashboard;

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
