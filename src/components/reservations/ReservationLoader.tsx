import {
  ReservationStatus,
  SortedReservationDetailSet
} from '../../utils/dtos';

/**
 * Loads reservation data for the current user
 *
 * @returns An object containing a list of reservation/property details,
 *          grouped according to their status (current, upcoming, or past)
 */
export default async function ReservationLoader() {
  // TODO: index and id should be determined by the current user
  const index = 'guest';
  const id = 'test-guest-1';

  // gets a sorted reservation detail set
  const response = await fetch(
    `/api/reservations-by-status?index=${index}&id=${id}`
  );
  const body = await response.json();
  const data: SortedReservationDetailSet = body.data[0];

  // TODO: images need to be pulled from the backend
  let randomImage = 0;
  const images = [
    'images/seattle-loft.jpg',
    'images/downtown-apartment.jpg',
    'images/beach-house.jpg',
    'images/mountain-cabin.jpg'
  ];

  // for each status type and each reservation within, add a random image
  for (const statusName of Object.keys(data)) {
    const status = statusName as ReservationStatus;

    for (const reservation of data[status])
      reservation.image = images[randomImage++ % images.length];
  }

  return data;
}
