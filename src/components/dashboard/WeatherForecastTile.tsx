import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

export const weatherTypes = [
  'clear-day',
  'clear-night',
  'cloudy',
  'fog',
  'heavy-showers',
  'heavy-sleet',
  'heavy-snow',
  'overcast',
  'partly-cloudy-day',
  'partly-cloudy-night',
  'showers',
  'sleet',
  'snow',
  'thunderstorm-showers',
  'thunderstorm-snow',
  'windy'
];
export type WeatherType = typeof weatherTypes[number];

export interface WeatherForecastTileProps {
  className?: string;
  time: string;
  weather: WeatherType;
  temp: number;
}

/**
 * A tile displaying the time period, temperature, and an icon representing
 * the weather type
 *
 * @param props {@link WeatherForecastTileProps}
 * @returns A JSX element
 */
function WeatherForecastTile({
  className,
  time,
  weather,
  temp
}: WeatherForecastTileProps) {
  return (
    <Container className={className}>
      <Time>{time}</Time>
      <Icon src={`images/weather/${weather}.png`} />
      <Temperature>{temp}</Temperature>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  height: 100%;
  row-gap: 8px;
  padding: 8px;
  background-color: ${theme.color.lightBlue};
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: white;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  height: 33%;
`;

const Icon = styled.img`
  height: 33%;
`;

const Temperature = styled.div`
  display: flex;
  align-items: center;
  height: 33%;
  color: ${theme.color.yellow};
  font-size: 32px;
`;

export default WeatherForecastTile;
