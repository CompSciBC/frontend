/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const [buttonText, setButtonText] = useState<String>();
  useEffect(() => {
    if (survey) {
      setButtonText('View Survey Response');
    } else {
      setButtonText('Review Your Rental Experience');
    }
  }, []);
  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(
        routes.review,
        reservationId,
        guestId
      )}
      child={buttonText}
      state={{surveyRecord : survey}}
    />
  );
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.green};
`;

export default memo(ReviewCell);
