import { Forecast } from '../../../utils/dtos';
import { weatherTypes } from './WeatherForecastTile';

/**
 * Gets a five day weather forecast
 *
 * @returns A {@link Forecast} array promise
 */
export default async function getWeatherForecast(): Promise<Forecast[]> {
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
