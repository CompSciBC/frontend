import styled from '@emotion/styled';
import { memo } from 'react';
import { theme } from '../../../utils/styles';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function GuidebookCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.guidebook, resId)}
      child={'Guidebook'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.red};
`;

export default memo(GuidebookCell);
