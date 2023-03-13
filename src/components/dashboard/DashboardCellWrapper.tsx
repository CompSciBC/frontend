import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { ReactNode } from 'react';

export interface DashboardCellWrapperProps {
  className?: string;
  cell: string;
  child?: ReactNode;
}

function DashboardCellWrapper({
  className,
  cell,
  child
}: DashboardCellWrapperProps) {
  return (
    <GridCellWrapper className={className} gridArea={cell}>
      {child}
    </GridCellWrapper>
  );
}

export const GridCellWrapper = styled.div<{ gridArea: string }>`
  grid-area: ${(props) => props.gridArea};
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  ${theme.font.body}
`;

export default DashboardCellWrapper;
