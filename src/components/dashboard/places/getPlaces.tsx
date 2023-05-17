import { Address, Place } from '../../../utils/dtos';
// import AppContext from '../../../context/AppContext';
import { server } from '../../..';

/**
 * Gets the top n events/places from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link Place} array promise
 */
export default async function getPlaces(
  address: Address,
  n: number
): Promise<Place[]> {
  const addressValues = Object.values(address) as string[];

  const addressString = addressValues.reduce(
    (prev, cur) => `${prev} ${cur}`,
    ''
  );

  const response = await fetch(`${server}/api/places/${addressString}`);
  const body = (await response.json()) as Place[];
 
  for (const p of body) {
    const decodedBlob = atob(p.photo);
    const regex = /<A\s+HREF="([^"]+)">/;
    const match = regex.exec(decodedBlob);
  
    let imageUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F5337799-icon-image-not-found-vector&psig=AOvVaw1wbUFbMuFK2oERCOXvUTnl&ust=1684302173572000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCNiE79eQ-f4CFQAAAAAdAAAAABAJ';
    if (match) {
      imageUrl = match[1];
    } else {
      imageUrl = '';
    }
    p.photo = imageUrl;
  }
  return body;
}
