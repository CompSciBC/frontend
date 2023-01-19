import {
  Property,
  ReservationStatus,
  SortedReservationPropertySet,
  SortedReservationSet
} from '../../utils/dtos';

/**
 * Loads reservation data for the current user
 *
 * @returns An object containing a list of reservation/property details,
 *          grouped according to their status (current, upcoming, or past)
 */
export default async function ReservationLoader() {
  // TODO: index and id should be determined to the current user
  const index = 'host';
  const id = 'h1';

  // gets a sorted reservation set; this contains only reservation data
  const response = await fetch(
    `/api/reservations-by-status?index=${index}&id=${id}`
  );
  const body = await response.json();
  const data: SortedReservationSet = body.data[0];

  // gets the property data for the specified property id
  const getProperty = async (propertyId: string): Promise<Property> => {
    const response = await fetch(`/api/properties/${propertyId}`);
    const body = await response.json();
    return body.data[0];
  };

  const resWithPropDetails: SortedReservationPropertySet = {
    current: [],
    upcoming: [],
    past: []
  };

  // TODO: images need to be pulled from the backend
  let randomImage = 0;
  const images = [
    'images/seattle-loft.jpg',
    'images/downtown-apartment.jpg',
    'images/beach-house.jpg',
    'images/mountain-cabin.jpg'
  ];

  // for each status type and each reservation within, get the
  // associated property and merge the property data with the
  // reservation data into a single reservation/property object
  for (const statusName of Object.keys(data)) {
    const status = statusName as ReservationStatus;

    for (const reservation of data[status]) {
      const property = await getProperty(reservation.propertyId);

      resWithPropDetails[status].push({
        ...reservation,
        name: property.name,
        address: property.address,
        image: images[randomImage++ % images.length]
      });
    }
  }

  return resWithPropDetails;
}
