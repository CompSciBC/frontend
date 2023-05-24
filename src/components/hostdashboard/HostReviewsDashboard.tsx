/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import AppContext from '../../context/AppContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { HostProvider, HostContextType } from './hostContext';
import { server } from '../../index';
import { Reservation, SurveyData, SurveyMetrics, User } from '../../utils/dtos';
import surveysJson from './mock_data_delete_later/surveys.json';
import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Container, Grid, Box, Button, Avatar } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'property', headerName: 'Property', width: 200 },
  { field: 'guest', headerName: 'Guest Name', width: 100,
    renderCell: (params: GridRenderCellParams<User>) => (
        <strong>
            {/* {params.value} */}
            <Avatar 
                sx={{ bgcolor: theme.color.purple, width: 40, height: 40  }}
            >
                {params.value.firstName.charAt(0)}{params.value.lastName.charAt(0)}
            </Avatar>
            {/* <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
            >
                {params.value.firstName.charAt(0)}{params.value.lastName.charAt(0)}
            </Button> */}
        </strong>
    ),
    },
  { field: 'timestamp', headerName: 'Submission Time', width: 150 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params: GridValueGetterParams) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`
//   }
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
// ];


function createRows(surveyData: SurveyData[]) {
    const rows = [];

    for (let i: number = 0; i < surveyData.length; i++) {
        const s = surveyData[i];
        rows.push({
            id: i,
            reservation: s.reservationId,
            property: s.property.name,
            guest: s.guest,
            timestamp: `${s.submissionTime}`
        });
      }
    return rows;
};

function HostReviewsDashboard() {
  const { user } = useContext(AppContext);
  const [reservationButton, setReservationButton] =
    useState<string>('getCurrent');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const reviews: SurveyMetrics = JSON.parse(JSON.stringify(surveysJson));
  const surveyResponses = reviews.surveyResponses;
//   console.log(surveyResponses);
    const rows = createRows(surveyResponses);
    // console.log(rows);

  const [host, setHost] = useState<HostContextType>({
    reservations,
    reviews
  });

  return (
    <HostProvider value={host}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item xs={12}>
              <WidgetTitle>
                <h3 style={{ float: 'left' }}> Reviews </h3>
              </WidgetTitle>
            </Grid>
          </Grid>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }
              }
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            // checkboxSelection
            sx={{ 
                m: 2,
                '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
            }}
            getRowHeight={() => 'auto'}
            getEstimatedRowHeight={() => 200}
            density='comfortable'
          />
        </Box>
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
