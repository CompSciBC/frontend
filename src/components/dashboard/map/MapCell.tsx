import styled from '@emotion/styled';
import { memo } from 'react';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function MapCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.map, resId)}
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
