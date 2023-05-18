import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function GuidebookCell({ className, cell }: DashboardCellProps) {
  const { reservation } = useContext(AppContext);

  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.guidebook, reservation?.id)}
      child={'Guidebook'}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.red};
`;

export default memo(GuidebookCell);
