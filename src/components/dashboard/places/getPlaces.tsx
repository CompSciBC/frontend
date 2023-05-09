import { Address, Place } from '../../../utils/dtos';
// import AppContext from '../../../context/AppContext';
import { server } from '../../..';

/**
 * Gets the top n events/places from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link EventOrPlace} array promise
 */
export default async function getPlaces(
  address: Address,
  n: number
): Promise<Place[]> {
  // TODO: get from events and places api

    // const addressValues = Object.values(address) as string[];

    // const addressString = addressValues.reduce( (prev, cur) => `${prev} ${cur}`, '');
    const addressString = address.city;

    // const response = await fetch(
    //   `${server}/api/places/${addressString}/`
    // );

  const response = await fetch( `${server}/api/places/${addressString}`);
  const body = await response.json() as Place[];
  // const e = process.env.REACT_APP_GOOGLE_MAPS_KEY as string;

  // for (const p of body) {
  //   const photoResponse = await fetch( `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${p.userPhotoReference}&key=${e}`);
  //   const photoBlob = await photoResponse.json() as Blob;
  //   p.photo = photoBlob;
  // }
  return body;
}
