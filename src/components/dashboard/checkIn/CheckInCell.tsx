import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext, useMemo, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function CheckInCell({ className, cell }: DashboardCellProps) {
  const { reservationDetail } = useContext(AppContext);
  // TODO: need to dynamically set the event type based on the current date
  const [eventType] = useState<'Check in' | 'Check out'>('Check in');

  const formattedDateTime = useMemo(() => {
    if (reservationDetail) {
      const dateTime =
        eventType === 'Check in'
          ? reservationDetail.checkIn
          : reservationDetail.checkOut;

      const date = new Date(dateTime).toLocaleDateString('default', {
        month: 'short',
        day: 'numeric'
      });

      const time = new Date(dateTime).toLocaleTimeString('default', {
        timeStyle: 'short'
      });

      return `${date} @ ${time}`;
    }
  }, [eventType]);

  return (
    <Container
      className={className}
      cell={cell}
      to={'/'}
      child={
        <div>
          {eventType}
          <div>{formattedDateTime}</div>
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
