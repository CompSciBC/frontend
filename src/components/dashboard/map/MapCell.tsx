import styled from '@emotion/styled';
import { memo, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function MapCell({ className, cell }: DashboardCellProps) {
  const { reservationDetail } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.map, reservationDetail?.id)}
      img={'/images/maps-button.png'}
    />
  );
}

const Container = styled(DashboardCellClickable)<{ img: string }>`
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center;
`;

export default memo(MapCell);
