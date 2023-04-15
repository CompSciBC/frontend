import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GridCellWrapper } from './DashboardCellWrapper';

export interface DashboardCellClickableProps {
  className?: string;
  cell: string;
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  child?: ReactNode;
  state?: any;
}

function DashboardCellClickable({
  className,
  cell,
  to,
  onClick,
  child,
  state
}: DashboardCellClickableProps) {
  return (
    <Container className={className} gridArea={cell}>
      {to ? (
        <DashboardCellLink to={to} state={state}>
          {child}
        </DashboardCellLink>
      ) : (
        <DashboardCellButton onClick={onClick}>{child}</DashboardCellButton>
      )}
    </Container>
  );
}

const Container = styled(GridCellWrapper)<{ gridArea: string }>`
  grid-area: ${(props) => props.gridArea};
  align-items: center;
  justify-content: center;
  min-width: fit-content;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 24px;
  color: ${theme.color.white};
`;

const DashboardCellButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border: none;
  border-radius: inherit;
  padding: 0;
  text-decoration: none;
  background-color: inherit;
  color: inherit;

  :hover {
    color: inherit;
  }
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
