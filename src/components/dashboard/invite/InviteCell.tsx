import styled from '@emotion/styled';
import { memo } from 'react';
import { theme } from '../../../utils/styles';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function InviteCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.invite, resId)}
      child={'Invite'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.purple};
`;

export default memo(InviteCell);
