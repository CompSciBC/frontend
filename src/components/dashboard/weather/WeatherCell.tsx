import styled from '@emotion/styled';
import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { Forecast } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import { DashboardCellLink } from '../DashboardCellClickable';
import DashboardCellWrapper from '../DashboardCellWrapper';
import getWeatherForecast from './getWeatherForecast';
import WeatherForecastTile from './WeatherForecastTile';

function WeatherCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed && setForecast(await getWeatherForecast());
    })();

    return () => {
      subscribed = false;
    };
  }, [resId]);

  return (
    <Container
      className={className}
      cell={cell}
      child={
        <DashboardCellLink to={paramRoute(routes.weather, resId)}>
          {forecast.map((f) => (
            <WeatherForecastTile
              key={f.timestamp}
              time={f.timestamp}
              weather={f.weather}
              temp={f.temp}
            />
          ))}
        </DashboardCellLink>
      }
    />
  );
}

const Container = styled(DashboardCellWrapper)`
  // entire cell is one link
  a {
    justify-content: space-between;
    column-gap: 8px;

    div {
      flex-grow: 1;
    }
  }
`;

export default memo(WeatherCell);
