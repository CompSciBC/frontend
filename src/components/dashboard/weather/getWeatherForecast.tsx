import { Forecast, Address } from '../../../utils/dtos';
// import { weatherTypes } from './WeatherForecastTile';
import { server } from '../../../index';

/**
 * Get the next five forecasts for dashboard view
 *
 * @returns A {@link Forecast} array promise
 */
export default async function getWeatherForecast(
  address: Address,
  quantity: number
): Promise<Forecast[]> {
  const addressString = `${address.line1} ${
    address.city
  } ${address.stateProvince!} ${address.postalCode!}`;
  // console.log(addressString);
  const response = await fetch(
    `${server}/api/weather?address=${encodeURI(addressString)}`
  );
  const body = await response.json();

  const forecast = (number: number): Forecast => {
    const detailedForecast = body[number].detailedForecast.toLowerCase();
    let weatherType = '';
    if (
      detailedForecast.includes('rain') &&
      detailedForecast.includes('cloud')
    ) {
      weatherType = 'showers';
    } else if (
      detailedForecast.includes('rain') &&
      detailedForecast.includes('storm')
    ) {
      weatherType = 'thunderstorm-showers';
    } else if (
      detailedForecast.includes('snow') &&
      detailedForecast.includes('storm')
    ) {
      weatherType = 'thunderstorm-snow';
    } else if (
      detailedForecast.includes('snow') &&
      detailedForecast.includes('cloud')
    ) {
      weatherType = 'snow';
    } else if (
      detailedForecast.includes('snow') &&
      detailedForecast.includes('rain')
    ) {
      weatherType = 'sleet';
    } else if (detailedForecast.includes('snow')) {
      weatherType = 'snow';
    } else if (detailedForecast.includes('cloud')) {
      weatherType = 'cloudy';
    } else if (detailedForecast.includes('rain')) {
      weatherType = 'showers';
    } else if (detailedForecast.includes('windy')) {
      weatherType = 'windy';
    } else if (detailedForecast.includes('fog')) {
      weatherType = 'fog';
    } else if (detailedForecast.includes('overcast')) {
      weatherType = 'overcast';
    } else {
      if (body[number].isDaytime === 'true') {
        weatherType = 'clear-day';
      } else {
        weatherType = 'clear-night';
      }
    }

    return {
      weather: weatherType,
      temp: body[number].temperature,
      number,
      name: body[number].name,
      shortName: body[number].name
        .replace('Sunday', 'Sun')
        .replace('Monday', 'Mon')
        .replace('Tuesday', 'Tue')
        .replace('Wednesday', 'Wed')
        .replace('Thursday', 'Thu')
        .replace('Friday', 'Fri')
        .replace('Saturday', 'Sat')
        .replace('This Afternoon', 'Noon'),
      detailedForecast: body[number].detailedForecast,
      shortForecast: body[number].shortForecast
    };
  };

  const arr = [...Array(quantity).keys()];
  return arr.map((number) => forecast(number));
}
