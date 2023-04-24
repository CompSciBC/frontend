import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import AppContext from '../../../context/AppContext';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput
} from '@aws-sdk/client-sqs';
import { server } from '../../..';
import AlertPopup from '../../stuff/AlertPopup';
import ConfirmCancelDialog from '../../stuff/ConfirmCancelDialog';
import { AlertColor } from '@mui/material';

type EventType = 'in' | 'out';

const sqsClient = new SQSClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!
  }
});

function CheckInCell({ className, cell }: DashboardCellProps) {
  const { reservationDetail, refreshReservationDetail, user } =
    useContext(AppContext);
  const [eventType, setEventType] = useState<EventType>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: AlertColor;
    message: string;
  }>({
    open: false,
    severity: 'error',
    message: ''
  });

  const formattedDateTime = useMemo(() => {
    if (reservationDetail) {
      const dateTime =
        eventType === 'in'
          ? reservationDetail.checkIn
          : reservationDetail.checkOut;

      const date = new Date(dateTime).toLocaleDateString('default', {
        month: 'short',
        day: 'numeric'
      });

      const time = new Date(dateTime).toLocaleTimeString('default', {
        timeStyle: 'short'
      });

      return `${date} @ ${time}`;
    }
  }, [eventType]);

  // initialize event type
  useEffect(() => {
    let subscribed = true;

    if (reservationDetail) {
      const { checkOut, checkedIn } = reservationDetail;

      // convert date/time strings to pure dates (with no time)
      const checkOutDate = new Date(checkOut).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);

      const type: EventType =
        checkedIn || currentDate >= checkOutDate ? 'out' : 'in';

      subscribed && setEventType(type);
    }

    return () => {
      subscribed = false;
    };
  }, [reservationDetail]);

  // sends a message to the AWS SQS
  const sendSqsMessage = useCallback(() => {
    if (reservationDetail && user && eventType) {
      const reservationId = reservationDetail.id;

      const input: SendMessageCommandInput = {
        QueueUrl: process.env.REACT_APP_AWS_CHECK_IN_OUT_QUEUE,
        MessageGroupId: eventType,
        MessageDeduplicationId: `${reservationId}${eventType}`,
        MessageBody: JSON.stringify({
          guestId: user.userId,
          reservationId,
          type: eventType
        })
      };
      sqsClient.send(new SendMessageCommand(input));
    }
  }, [reservationDetail, user, eventType]);

  // sets the reservation checkIn field to true
  const handleCheckIn = useCallback(async (): Promise<boolean> => {
    let result = false;

    if (reservationDetail) {
      const response = await fetch(
        `${server}/api/reservations/${reservationDetail.id}`,
        {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ checkedIn: true })
        }
      );
      result = (await response.json()).status === 200;
    }
    return result;
  }, [reservationDetail]);

  // checks the guest in/out
  const checkInOut = useCallback(() => {
    if (eventType) {
      (async function () {
        if (eventType === 'out' || (await handleCheckIn())) {
          setAlert({
            open: true,
            severity: 'success',
            message: `You've been checked-${eventType}. Thanks!`
          });
          refreshReservationDetail();
        } else {
          // checkIn failed
          setAlert({
            open: true,
            severity: 'error',
            message: 'Sorry, something went wrong. Please try again.'
          });
        }
      })();
    }
  }, [eventType]);

  // handles the check in/out event
  const handleCheckInOut = useCallback(() => {
    sendSqsMessage();
    checkInOut();
  }, [sendSqsMessage, checkInOut]);

  return (
    <>
      <Container
        className={className}
        cell={cell}
        onClick={() => setConfirmDialogOpen(true)}
        child={
          <div>
            {eventType && `Check ${eventType}`}
            <div>{formattedDateTime}</div>
          </div>
        }
      />
      <ConfirmCancelDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        text={`Are you sure you want to check ${eventType!}?`}
        confirm={{
          text: 'Yes',
          action: () => {
            setConfirmDialogOpen(false);
            handleCheckInOut();
          }
        }}
        cancel={{ text: 'No' }}
      />
      <AlertPopup
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </>
  );
}

const Container = styled(DashboardCellClickable)`
  flex-direction: column;
  row-gap: 8px;
  background-color: ${theme.color.teal};
  text-align: center;

  div div {
    font-size: 14px;
    text-align: center;
  }
`;

export default memo(CheckInCell);
