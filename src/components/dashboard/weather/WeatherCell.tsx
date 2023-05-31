import styled from '@emotion/styled';
import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { Forecast } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import { DashboardCellLink } from '../DashboardCellClickable';

import getWeatherForecast from './getWeatherForecast';
import WeatherForecastTile from './WeatherForecastTile';
import DashboardCellWrapper from '../DashboardCellWrapper';

function WeatherCell({ className, cell }: DashboardCellProps) {
  const { reservation } = useContext(AppContext);
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (reservation?.property.address) {
        subscribed &&
          setForecast(
            await getWeatherForecast(reservation?.property.address, 5)
          );
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [reservation]);

  return (
    <Container
      className={className}
      cell={cell}
      child={
        <DashboardCellLink to={paramRoute(routes.weather, reservation?.id)}>
          {forecast.map((f) => (
            <WeatherForecastTile
              key={f.number}
              time={f.name}
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
