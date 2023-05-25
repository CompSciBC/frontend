import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { guestSurveyJson } from '../dashboard/review/GuestSurveyJson';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { SurveyData } from '../../utils/dtos';

interface SurveyViewButtonProps {
  state: boolean;
  content: string;
  surveyMetadata: SurveyData;
}

export default function SurveyViewButton(props: SurveyViewButtonProps) {
  const survey = new Model(guestSurveyJson);
  survey.data = JSON.parse(props.content);
  survey.mode = 'display';
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const metadata = JSON.parse(JSON.stringify(props.surveyMetadata));
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        View
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          Survey submitted by {props.surveyMetadata.guest.firstName}{' '}
          {props.surveyMetadata.guest.lastName} on {metadata.timestamp}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h6>Property: {metadata.property}</h6>
            <h6>ReservationId: {metadata.reservation}</h6>
          </DialogContentText>
          <Survey model={survey} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
