import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GridCellWrapper } from './DashboardCellWrapper';

export interface DashboardCellClickableProps {
  className?: string;
  cell: string;
  to: string;
  child?: ReactNode;
  state?: any;
}

function DashboardCellClickable({
  className,
  cell,
  to,
  child,
  state
}: DashboardCellClickableProps) {
  return (
    <Container className={className} gridArea={cell}>
      <DashboardCellLink to={to} state={state}>
        {child}
      </DashboardCellLink>
    </Container>
  );
}

const Container = styled(GridCellWrapper)<{ gridArea: string }>`
  grid-area: ${(props) => props.gridArea};
  align-items: center;
  justify-content: center;
  min-width: fit-content;
  padding: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 24px;
  color: ${theme.color.white};
`;

export const DashboardCellLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: inherit;

  :hover {
    color: inherit;
  }
`;

export default DashboardCellClickable;
