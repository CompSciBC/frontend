import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { memo, useContext, useState, useEffect } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';
import { server } from '../../../index';

function ReviewCell({ className, cell }: DashboardCellProps) {
  const { reservationDetail, user } = useContext(AppContext);
  const {
    id: reservationId,
    checkIn: checkInDate,
    checkOut: checkOutDate
  } = reservationDetail ?? {};
  const guestId = user?.userId;

  const [buttonText, setButtonText] = useState<String>();
  const [buttonDisplay, setButtonDisplay] = useState<boolean>(false);
  const [surveyRecord, setSurveyRecord] = useState<Response>();
  useEffect(() => {
    const surveyExpirationDate = new Date(Date.parse(checkOutDate!));
    surveyExpirationDate.setDate(surveyExpirationDate.getDate() + 10);
    (async function () {
      const response = await fetch(
        `${server}/api/surveys/${reservationId!}/${guestId!}`
      );
      if (response.status === 204) {
        if (
          Date.parse(checkInDate!) < Date.now() &&
          Date.now() < surveyExpirationDate.getTime()
        ) {
          setButtonDisplay(true);
          setButtonText('Review Your Rental Experience');
          console.log('Prompt guest to complete survey');
        }
      } else {
        const body = await response.json();
        if (body.data) {
          setButtonDisplay(true);
          setSurveyRecord(body.data);
          setButtonText('View Survey Response');
          console.log('Allow guest to view submitted survey response');
        }
      }
    })();
  }, [reservationDetail]);

  if (buttonDisplay) {
    return (
      <Container
        className={className}
        cell={cell}
        to={paramRoute(routes.review, reservationId, guestId)}
        child={buttonText}
        state={{ surveyRecord }}
      />
    );
  } else {
    return <></>;
  }
}

const Container = styled(DashboardCellClickable)`
  background-color: ${theme.color.green};
`;

export default memo(ReviewCell);
