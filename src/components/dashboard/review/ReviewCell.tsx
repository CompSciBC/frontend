import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function ReviewCell({ className, cell }: DashboardCellProps) {
  const { reservationDetail } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute('/review', reservationDetail?.id)} // TODO: replace route
      child={'Review'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.green};
`;

export default memo(ReviewCell);
