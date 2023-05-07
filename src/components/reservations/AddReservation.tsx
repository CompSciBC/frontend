import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { paramRoute, routes } from '../..';
import { postReservation } from './postReservation';

function AddReservation() {
  const { resId } = useParams();
  const { user, reservation } = useContext(AppContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let subscribed = true;

    if (user && reservation) {
      (async function () {
        const { userId } = user;

        const result = await postReservation(reservation, userId);

        if (result) {
          subscribed && setSuccess(result);
          console.log(`Reservation #${resId!} added to guestId ${userId}`);
        }
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [user, reservation]);

  useEffect(() => {
    success &&
      reservation &&
      navigate(paramRoute(routes.dashboard, reservation.id));
  }, [success]);

  return <></>;
}

export default AddReservation;
