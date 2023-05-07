import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import '../../../index.css';
import { guestSurveyJson } from './GuestSurveyJson';
import { useContext, useEffect } from 'react';
import AppContext from '../../../context/AppContext';
import { server } from '../../..';
import { useLocation, useNavigate } from 'react-router-dom';

function SurveyComponent() {
  const { reservation, user } = useContext(AppContext);
  const reservationId = reservation?.id;
  const guestId = user?.userId;
  const location = useLocation();
  const navigate = useNavigate();
  const { surveyRecord } = location.state;

  const survey = new Model(guestSurveyJson);
  survey.onComplete.add((sender, options) => {
    const surveyResponse = JSON.stringify(sender.data, null, 3);
    fetch(
      `${server}/api/surveys/save?resId=${reservationId!}&guestId=${guestId!}`,
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: surveyResponse
      }
    );
    setTimeout(() => {
      navigate(`/reservations/${reservationId!}/dashboard`);
    }, 3000);
  });

  useEffect(() => {
    if (surveyRecord) {
      survey.data = JSON.parse(surveyRecord[0].surveyResponse);
      survey.mode = 'display';
    }
  }, [survey]);

  return (
    <>
      <Survey model={survey} />
    </>
  );
}

export default SurveyComponent;
