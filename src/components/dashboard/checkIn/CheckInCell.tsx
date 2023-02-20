import styled from '@emotion/styled';
import { memo } from 'react';
import { theme } from '../../../utils/styles';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

export interface CheckInCellProps extends DashboardCellProps {
  checkIn: string;
  checkOut: string;
}

function CheckInCell({ className, cell, checkIn, checkOut }: CheckInCellProps) {
  // Gets the check-in/out date/time as a formatted string
  const getFormattedCheckInOut = (event: 'in' | 'out'): string => {
    const eventType = event === 'in' ? checkIn : checkOut;

    const date = new Date(eventType).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric'
    });

    const time = new Date(eventType).toLocaleTimeString('default', {
      timeStyle: 'short'
    });

    return `${date} @ ${time}`;
  };

  return (
    <Container
      className={className}
      cell={cell}
      to={'/'}
      child={
        <div>
          {/* TODO: dynamically set this to checkIn/checkOut based on status */}
          Check in
          <div>{getFormattedCheckInOut('in')}</div>
        </div>
      }
    />
  );
}

const Container = styled(DashboardCellClickable)`
  flex-direction: column;
  row-gap: 8px;
  background-color: ${theme.color.teal};
  text-align: center;

  div div {
    font-size: 14px;
    text-align: center;
  }
`;

export default memo(CheckInCell);
