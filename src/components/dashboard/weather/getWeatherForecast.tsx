import { Forecast, Address } from '../../../utils/dtos';
import { weatherTypes } from './WeatherForecastTile';
import { server } from '../../../index';

/**
 * Gets a five day weather forecast
 *
 * @returns A {@link Forecast} array promise
 */
export default async function getWeatherForecast(
  address: Address
): Promise<Forecast[]> {
  const addressString = `${address.line1} ${
    address.city
  } ${address.stateProvince!} ${address.postalCode!}`;
  console.log(addressString);
  const response = await fetch(
    `${server}/api/weather?address=${encodeURI(addressString)}`
  );
  const body = await response.json();
  // console.log(body);

  // TODO: replace this with real forecast data from the API
  // Generates a random weather forecast
  const randomForecast = (number: number): Forecast => {
    console.log(body[number]);
    const detailedForecast = body[number].detailedForecast;
    console.log(detailedForecast);
    // determine the weather type
    return {
      // timestamp: 'time',
      weather: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      temp: body[number].temperature,
      number,
      name: body[number].name
    };
  };

  return [0, 1, 2, 3, 4].map((number) => randomForecast(number));
}
