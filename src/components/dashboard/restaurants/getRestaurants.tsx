import { Address, Restaurant } from '../../../utils/dtos';

/**
 * Gets the top n restaurants from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link Restaurant} array promise
 */
export default async function getRestaurants(
  address: Address,
  n: number
): Promise<Restaurant[]> {
  const { line1, line2, city, stateProvince, postalCode, country } = address;

  let queryString: string = '';

  // Adds the given parameter to the query string if its value is defined
  const addParam = (name: string, value?: string | number) => {
    queryString += `${queryString && value ? '&' : ''}`;
    queryString += `${value ? `${name}=${value}` : ''}`;
  };

  addParam('line1', line1);
  addParam('line2', line2);
  addParam('city', city);
  addParam('stateProvince', stateProvince);
  addParam('postalCode', postalCode);
  addParam('country', country);
  addParam('numResults', n);

  if (queryString) queryString = `?${queryString}`;

  const response = await fetch(`/api/restaurants${queryString}`);
  const body = await response.json();
  return body.data;
}
