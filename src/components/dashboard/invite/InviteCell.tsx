import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function InviteCell({ className, cell }: DashboardCellProps) {
  const { reservation } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.invite, reservation?.id)}
      child={'Invite'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.BMGnavyblue};
`;

export default memo(InviteCell);
