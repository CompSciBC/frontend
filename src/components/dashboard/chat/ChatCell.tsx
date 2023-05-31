import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function ChatCell({ className, cell }: DashboardCellProps) {
  const { reservation } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.chat, reservation?.id)}
      child={'Chat'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.orange};
  display: none;

  ${theme.screen.small} {
    display: flex;
  }
`;

export default memo(ChatCell);
