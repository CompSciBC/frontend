import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext, useState, useEffect } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes, server } from '../../..';
import { ReviewCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';

function ReviewCell({ className, cell, survey }: ReviewCellProps) {
  const { reservationDetail, user } = useContext(AppContext);
  const reservationId = reservationDetail?.id;
  const guestId = user?.userId;

  const [buttonText, setButtonText] = useState<String>('Hi');
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server}/api/surveys/${reservationId!}/${guestId!}`
      );
      if (response.status === 200) {
        setButtonText('View Review Response');
      } else {
        // TODO: handle 404 Not found
        setButtonText('Review Your Rental Experience');
      }
    })();
  }, []);
  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(
        routes.review,
        reservationDetail?.id,
        reservationDetail?.guestId
      )}
      child={buttonText}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.green};
`;

export default memo(ReviewCell);
