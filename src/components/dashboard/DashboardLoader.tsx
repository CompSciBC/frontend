import {
  Address,
  EventOrPlace,
  Forecast,
  Message,
  ReservationDetail,
  Restaurant
} from '../../utils/dtos';
import { DashboardData } from './Dashboard';
import { weatherTypes } from './WeatherForecastTile';

/**
 * Gets a five day weather forecast
 *
 * @returns A {@link Forecast} array promise
 */
async function getForecast(): Promise<Forecast[]> {
  // TODO: replace this with real forecast data from the API
  // Generates a random weather forecast
  const randomForecast = (time: string): Forecast => {
    return {
      office: '',
      gridX_gridY: '',
      forecast_content: '',
      timestamp: time,
      weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      temp: Math.floor(Math.random() * 110)
    };
  };

  return ['Now', '4pm', '5pm', '6pm', '7pm'].map((time) =>
    randomForecast(time)
  );
}

/**
 * Gets the top n restaurants from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link Restaurant} array promise
 */
async function getRestaurantsPreview(
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

/**
 * Gets the top n events/places from the given address
 *
 * @param address A physical address to search
 * @param n The maximum number of results to return
 * @returns A {@link EventOrPlace} array promise
 */
async function getEventsAndPlacesPreview(
  address: Address,
  n: number
): Promise<EventOrPlace[]> {
  // TODO: get from events and places api
  return await getRestaurantsPreview(address, n);
}

/**
 * Gets the n most recent messages for the given reservation
 *
 * @param reservationId A reservation id
 * @param n The maximum number of results to return
 * @returns A {@link Message} array promise
 */
async function getMessagesPreview(
  reservationId: string,
  n: number
): Promise<Message[]> {
  // TODO: replace hard coded value with messages from api
  return [
    {
      name: 'JP',
      me: false,
      time: new Date(2023, 0, 1),
      message: 'Lorem ipsum dolor.'
    },
    {
      name: 'EO',
      me: true,
      time: new Date(2023, 0, 3),
      message:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, hic. Perspiciatis placeat eos ipsum vero totam temporibus officiis voluptatibus eligendi molestiae? Animi qui quos expedita, dolorum nulla error quae labore?'
    }
  ];
}

/**
 * Loads dashboard data for the current reservation
 *
 * @returns A {@link DashboardData} promise
 */
export default async function DashboardLoader(): Promise<DashboardData> {
  // TODO: replace hard coded value
  const reservation: ReservationDetail = {
    id: '1234',
    hostId: 'test-host-1',
    propertyId: 'test-prop-1',
    guestId: 'test-guest-1',
    numGuests: 2,
    checkIn: '2023-03-31T12:00',
    checkOut: '2023-12-31T:12:00',
    reasonForStay: 'vacation',
    propertyName: 'Cabin in the Woods',
    address: '12331 23rd Ave NE, Seattle, WA 98125'
  };

  // TODO: get from reservation object (which should have an Address type field instead of string)
  const address: Address = {
    line1: '12331 23rd Ave NE',
    city: 'Seattle',
    stateProvince: 'WA',
    postalCode: '98155',
    country: 'USA'
  };

  return {
    reservation,
    forecast: await getForecast(),
    restaurants: await getRestaurantsPreview(address, 2),
    eventsAndPlaces: await getEventsAndPlacesPreview(address, 2),
    messages: await getMessagesPreview('1234', 3)
  };
}
