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
import {
  Container,
  Grid,
  Box,
  Button,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContentText,
  TextField,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Countertops,
  CountertopsOutlined,
  AccessTime,
  AccessTimeOutlined,
  MenuBook,
  MenuBookOutlined,
  LocationOn,
  LocationOnOutlined,
  Chair,
  ChairOutlined,
  CleaningServices,
  CleaningServicesOutlined,
  Sms,
  SmsOutlined,
  Paid,
  PaidOutlined
} from '@mui/icons-material';
import SurveyViewButton from './SurveyModel';

interface metricsDecoration {
  friendlyName: string;
  filledIcon: React.ReactNode;
  unfilledIcon: React.ReactNode;
}

const metricsColors = new Map<number, string>([
  [1, theme.color.gray],
  [2, theme.color.red],
  [3, theme.color.orange],
  [4, theme.color.yellow],
  [5, theme.color.green]
]);
const metricsNames: Map<string, metricsDecoration> = new Map();
metricsNames.set('amenities', {
  friendlyName: 'Amenities',
  filledIcon: <Countertops />,
  unfilledIcon: <CountertopsOutlined />
});
metricsNames.set('value-for-money', {
  friendlyName: 'Value for Money',
  filledIcon: <Paid />,
  unfilledIcon: <PaidOutlined />
});
metricsNames.set('host-communication-timeliness', {
  friendlyName: 'Responsive Communication',
  filledIcon: <AccessTime />,
  unfilledIcon: <AccessTimeOutlined />
});
metricsNames.set('guidebook', {
  friendlyName: 'Guidebook Helpfulness',
  filledIcon: <MenuBook />,
  unfilledIcon: <MenuBookOutlined />
});
metricsNames.set('location', {
  friendlyName: 'Location',
  filledIcon: <LocationOn />,
  unfilledIcon: <LocationOnOutlined />
});
metricsNames.set('comfort', {
  friendlyName: 'Comfort',
  filledIcon: <Chair />,
  unfilledIcon: <ChairOutlined />
});
metricsNames.set('cleanliness', {
  friendlyName: 'Cleanliness',
  filledIcon: <CleaningServices />,
  unfilledIcon: <CleaningServicesOutlined />
});
metricsNames.set('host-communication-ease', {
  friendlyName: 'Ease of Communication',
  filledIcon: <Sms />,
  unfilledIcon: <SmsOutlined />
});

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'property', headerName: 'Property', width: 200 },
  {
    field: 'guest',
    headerName: 'Guest Name',
    width: 120,
    renderCell: (params: GridRenderCellParams<User>) => (
      <strong>
        {/* {params.value} */}
        <Avatar sx={{ bgcolor: theme.color.purple, width: 40, height: 40 }}>
          {params.value.firstName.charAt(0)}
          {params.value.lastName.charAt(0)}
        </Avatar>
      </strong>
    )
  },
  { field: 'timestamp', headerName: 'Submission Time', width: 150 },
  {
    field: 'qualityMetricsAverage',
    headerName: 'Quality - Average Score',
    width: 200
  },
  {
    field: 'qualityMetrics',
    headerName: 'Quality Ratings',
    sortable: false,
    width: 300,
    renderCell: (params: GridRenderCellParams<User>) => (
      <strong>
        <Box sx={{ width: 300, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={1}>
            {Object.keys(params.value).map((f: string, index: number) => (
              <Grid key={index} item xs={3}>
                <Box style={{ color: metricsColors.get(params.value[f]) }}>
                  {metricsNames.get(f)?.filledIcon}
                </Box>
                <Box style={{ color: theme.color.gray }}>
                  {params.value[f]}/5
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </strong>
    )
  },
  {
    field: 'surveyResponse',
    headerName: 'Survey Response',
    sortable: false,
    width: 300,
    renderCell: (params: GridRenderCellParams<SurveyData>) => (
      <strong>
        <Box sx={{ width: 300, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={1}>
            <SurveyViewButton 
                state={true} 
                content={params.value}
                surveyMetadata = {params.row} />
          </Grid>
        </Box>
      </strong>
    )
  }
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

function createRows(surveyData: SurveyData[]) {
  const rows = [];

  for (let i: number = 0; i < surveyData.length; i++) {
    const s = surveyData[i];
    const submissionTime = new Date(s.submissionTime);
    rows.push({
      id: i + 1,
      reservation: s.reservationId,
      property: s.property.name,
      guest: s.guest,
      timestamp: `${
        months[submissionTime.getMonth()]
      } ${submissionTime.getFullYear()}`,
      qualityMetrics: s.qualityMetrics,
      qualityMetricsAverage: s.qualityMetricsAverage,
      surveyResponse: s.surveyResponse
    });
  }
  return rows;
}

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
      <Container maxWidth="xl">
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
    </HostProvider>
  );
}

export default HostReviewsDashboard;

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
