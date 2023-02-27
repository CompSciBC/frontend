import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';
import { paramRoute, routes } from '../..';
import { Reservation } from '../../utils/dtos';
import { server } from '../../index';

function AddReservation() {
  const { resId } = useParams();
  const { user, reservationDetail } = useContext(AppContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let subscribed = true;

    // makes a post request to add a new reservation entry with the current user's id
    const postReservation = async (reservation: Reservation) => {
      const response = await fetch(`${server}/api/reservations`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify([
          {
            ...reservation,
            guestId: user!.userId
          }
        ])
      });
      const body = await response.json();
      return body.status === 201;
    };

    if (user && reservationDetail) {
      (async function () {
        const { property, image, ...reservation } = reservationDetail;

        if (reservation) {
          subscribed && setSuccess(await postReservation(reservation));
          console.log('success');
        } else {
          console.log(`Reservation #${resId!} does not exist.`);
        }
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [user]);

  useEffect(() => {
    success &&
      reservationDetail &&
      navigate(paramRoute(routes.dashboard, reservationDetail.id));
  }, [success]);

  return <>Add Reservation</>;
}

export default AddReservation;
