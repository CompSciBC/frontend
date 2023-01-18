import {
  Property,
  Reservation,
  SortedReservationPropertySet,
  SortedReservationSet
} from '../../utils/dtos';

export default async function ReservationLoader() {
  const response = await fetch('/api/reservations-by-status?index=host&id=h1');
  const body = await response.json();
  const data: SortedReservationSet = body.data[0];

  const getProperty = async (propertyId: string): Promise<Property> => {
    const response = await fetch(`/api/properties/${propertyId}`);
    const body = await response.json();
    return body.data[0];
  };

  const images = [
    'images/seattle-loft.jpg',
    'images/downtown-apartment.jpg',
    'images/beach-house.jpg',
    'images/mountain-cabin.jpg'
  ];

  const resWithPropDetails: SortedReservationPropertySet = {
    current: [],
    upcoming: [],
    past: []
  };

  const current: Reservation[] = data.current;
  const upcoming: Reservation[] = data.upcoming;
  const past: Reservation[] = data.past;

  let randomImage = 0;

  for (const reservation of current) {
    const property = await getProperty(reservation.propertyId);
    resWithPropDetails.current.push({
      ...reservation,
      name: property.name,
      address: property.address,
      image: images[randomImage++ % images.length]
    });
  }

  for (const reservation of upcoming) {
    const property = await getProperty(reservation.propertyId);
    resWithPropDetails.upcoming.push({
      ...reservation,
      name: property.name,
      address: property.address,
      image: images[randomImage++ % images.length]
    });
  }

  for (const reservation of past) {
    const property = await getProperty(reservation.propertyId);
    resWithPropDetails.past.push({
      ...reservation,
      name: property.name,
      address: property.address,
      image: images[randomImage++ % images.length]
    });
  }

  return resWithPropDetails;
}
