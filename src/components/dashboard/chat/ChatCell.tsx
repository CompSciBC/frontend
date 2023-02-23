import styled from '@emotion/styled';
import { memo } from 'react';
import { theme } from '../../../utils/styles';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function ChatCell({ className, cell }: DashboardCellProps) {
  const { resId } = useParams();

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.chat, resId)}
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
