import { Restaurant, RestaurantFilters } from '../../../utils/dtos';
import { server } from '../../../index';

/**
 * Gets the top n restaurants from the given address
 *
 * @param filters A ${@link RestaurantFilters}
 * @returns A {@link Restaurant} array promise
 */
export default async function getRestaurants(
  filters: RestaurantFilters
): Promise<Restaurant[]> {
  const { address, radius, keywords, maxPrice, openNow, numResults } = filters;
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
  addParam('radius', radius);
  addParam('keywords', keywords?.join(', '));
  addParam('maxPrice', maxPrice);
  addParam('openNow', String(openNow ?? ''));
  addParam('numResults', numResults);

  if (queryString) queryString = `?${queryString}`;

  const response = await fetch(`${server}/api/restaurants${queryString}`);
  const body = await response.json();
  return body.data;
}
