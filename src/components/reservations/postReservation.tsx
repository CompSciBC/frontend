import { server } from '../..';
import { Reservation } from '../../utils/dtos';

/**
 * Makes a post request to add a new reservation entry with the given user id
 *
 * @param reservation A reservation
 * @param userId A user id
 * @returns True if the api returned with a 201 created response
 */
export const postReservation = async (
  reservation: Reservation,
  userId: string
) => {
  const response = await fetch(`${server}/api/reservations`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify([
      {
        ...reservation,
        guestId: userId
      }
    ])
  });
  const body = await response.json();
  return body.status === 201;
};
