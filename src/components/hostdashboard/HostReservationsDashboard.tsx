/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import AppContext from '../../context/AppContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { HostProvider, HostContextType } from './hostContext';
import { server } from '../../index';
import {
  Property,
  Reservation,

} from '../../utils/dtos';
import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams,  } from '@mui/x-data-grid';
import { Container, Grid, Box, Typography, Button, } from '@mui/material';
import { Link } from 'react-router-dom';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 200 },
  { 
    field: 'property', headerName: 'Property', width: 200,
    renderCell: (params: GridRenderCellParams<Property>) => (
      <strong>
        <Link style={{ float: 'right', textDecoration: 'none', color: theme.color.BMGteal }} to={`/hostLanding/${params.value.id}/guidebook/edit`}>
          <Typography sx={{ fontWeight: 500 }} variant='body2'>
            {params.value.name}
          </Typography>
        </Link>
      </strong>
    )
  },
  { field: 'numGuests', headerName: 'Number of Guests', width: 150 },
  { field: 'checkIn', headerName: 'Check-in Date', width: 150 },
  { field: 'checkOut', headerName: 'Check-out Date', width: 150 },
  { field: 'reasonForStay', headerName: 'Reason for Stay', width: 200 },
  { field: 'checkedIn', headerName: 'Checked-in?', width: 150 },
  { 
    field: 'chatLink', headerName: '', width: 100,
    renderCell: (params: GridRenderCellParams<String>) => {
      if (params.value !== "") {
        return(
            <strong>
              <Link style={{ float: 'right', textDecoration: 'none', color: theme.color.BMGteal }} to={params.value}>
                <Button size="small" variant='outlined'>
                  Chat
                </Button>
              </Link>
            </strong>
        );
      }
    }
  },
  
];

const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const checkEmailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;



function createRows(reservations: Reservation[]) {
  const rows = [];
  for (let i: number = 0; i < reservations.length; i++) {
    const res = reservations[i];
    const checkInDate = new Date(res.checkIn);
    const checkOutDate = new Date(res.checkOut);
    rows.push({
      id: res.id,
      property: res.property,
      numGuests: res.numGuests,
      checkIn: `${
        months[checkInDate.getMonth()]
      } ${checkInDate.getDate()}, ${checkInDate.getFullYear()}`,
      checkOut: `${
        months[checkOutDate.getMonth()]
      } ${checkOutDate.getDate()}, ${checkOutDate.getFullYear()}`,
      reasonForStay: res.reasonForStay,
      checkedIn: res.checkedIn? JSON.stringify(res.checkedIn) : 'unknown',
      chatLink: checkEmailRegEx.test(res.guestId) ?  "" : `/reservations/${res.id}/chat`,
    });
  }
  return rows;
}

function HostReservationsDashboard() {
  const { user } = useContext(AppContext);
  const [reservations, setReservations] = useState<Reservation[]>();
  useEffect(() => {
    fetch(`${server}/api/reservations?index=host&id=${user?.userId}`)
      .then(async (res) => {
        return await res.json();
      })
      .then((data) => {
        setReservations(data.data);
      });
  }, []);
  
  if (reservations !== undefined) {
    const rows = createRows(reservations);
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <WidgetTitle>
                <h3 style={{ float: 'left' }}> Reservations </h3>
              </WidgetTitle>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }
              }
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            sx={{
              m: 2,
              '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                py: '10px'
              },
              boxShadow: 1
            }}
            getRowHeight={() => 'auto'}
            getEstimatedRowHeight={() => 200}
            density="comfortable"
          />
        </Box>
      </Container>
    );
  } else {
    return <></>;
  }
}

export default HostReservationsDashboard;

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
