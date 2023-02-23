import styled from '@emotion/styled';
import { memo } from 'react';
import { theme } from '../../../utils/styles';
import { useParams } from 'react-router';
import { paramRoute } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function ReviewCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute('/review', resId)} // TODO: replace route
      child={'Review'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.green};
`;

export default memo(ReviewCell);
