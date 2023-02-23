import styled from '@emotion/styled';
import { memo } from 'react';
import { DashboardCellProps } from './Dashboard';
import DashboardCellWrapper from './DashboardCellWrapper';

export interface InfoCellProps extends DashboardCellProps {
  address: string;
}

function ReviewCell({ className, cell, address }: InfoCellProps) {
  return <Container className={className} cell={cell} child={address} />;
}

const Container = styled(DashboardCellWrapper)`
  padding: 8px;
  background-color: white;
  border: 1px solid black;
`;

export default memo(ReviewCell);
