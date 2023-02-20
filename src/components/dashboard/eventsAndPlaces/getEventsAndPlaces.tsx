import { Address, EventOrPlace } from '../../../utils/dtos';
import getRestaurantsPreview from '../restaurants/getRestaurants';

/**
 * Gets the top n events/places from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link EventOrPlace} array promise
 */
export default async function getEventsAndPlaces(
  address: Address,
  n: number
): Promise<EventOrPlace[]> {
  // TODO: get from events and places api
  return await getRestaurantsPreview(address, n);
}
