/* eslint-disable @typescript-eslint/no-unused-vars */
import { theme } from '../../utils/styles';
import { useState, useEffect, useContext } from 'react';
import { server } from '../../index';
import { User } from '../../utils/dtos';
import Button from '@mui/material/Button';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import Modal from '../Modal';
import SendInviteForm from '../dashboard/invite/SendInviteForm';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export interface ReservationCardProps {
  reservationId: string;
  propertyName: string;
  propertyId: string;
  primaryGuestEmail: string;
  reservationStartDate: string;
  reservationEndDate: string;
}

export default function ReservationCard({
  reservationId,
  propertyName,
  propertyId,
  primaryGuestEmail,
  reservationStartDate,
  reservationEndDate
}: ReservationCardProps) {
  const { user } = useContext(AppContext);
  const checkInDate = new Date(reservationStartDate);
  const checkOutDate = new Date(reservationEndDate);
  const chatLink = `/reservations/${reservationId}/chat`;
  const [propertyPhoto, setPropertyPhoto] = useState<string>();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    fetch(`${server}/api/guidebook/${propertyId}/images/featured`).then(
      async (res) => {
        setPropertyPhoto(await res.text());
      }
    );
  }, [propertyId]);
  const [primaryGuest, setPrimaryGuest] = useState<string>();
  const [newGuest, setNewGuest] = useState<boolean>(false);
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server}/api/users?index=email&id=${primaryGuestEmail}`
      );
      const body = await response.json();
      const data: User = body.data[0];
      try {
        const primaryGuestName = `${data.firstName} ${data.lastName}`;
        setPrimaryGuest(primaryGuestName);
        setNewGuest(false);
      } catch {
        setPrimaryGuest(primaryGuestEmail);
        setNewGuest(true);
      }
    })();
  }, [primaryGuestEmail]);
  const [color, setColor] = useState<string>();
  const [action, setAction] = useState<string>();
  useEffect(() => {
    if (newGuest) {
      setColor(theme.color.teal);
      setAction('email');
    } else {
      setColor(theme.color.BMGnavyblue);
      setAction('message');
    }
  });

  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Card
      sx={{ width: 275, display: 'inline-block', mr: 2 }}
      variant="outlined"
    >
      <CardMedia
        sx={{ height: 135 }}
        image={propertyPhoto}
        title={propertyName}
        component="img"
      />
      <CardContent>
        <Typography gutterBottom variant="caption" component="div">
          {propertyName}
        </Typography>
        <Typography
          gutterBottom
          variant="h6"
          color={color}
          component="div"
          sx={{ mt: 2 }}
        >
          {primaryGuest}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check-in: {checkInDate.getMonth() + 1}/{checkInDate.getDate()}
          <br />
          Check-out: {checkOutDate.getMonth() + 1}/{checkOutDate.getDate()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" sx={{ bgcolor: color }} onClick={() => {
              if (action === 'email') {
                setEmailFormOpen(true);
              } else if (action === 'message') {
                navigate(`/reservations/${reservationId}/chat`);
              }
            }}>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            color="white"
          >
            {action}
          </Typography>
        </Button>
        {emailFormOpen && (
          <Modal
            content={
              <SendInviteForm
                onClose={() => setEmailFormOpen(false)}
                resId={reservationId}
                guestName={(() => {
                  const { firstName, lastName } = user!;
                  let name = '';

                  if (typeof firstName === 'string') name += `${firstName}`;
                  if (typeof lastName === 'string') name += ` ${lastName}`;

                  return name;
                })()}
                recipientEmail={primaryGuestEmail}
              />
            }
            blur={true}
          />
        )}
      </CardActions>
    </Card>
  );
}
