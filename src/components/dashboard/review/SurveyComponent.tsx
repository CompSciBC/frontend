import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { guestSurveyJson } from './GuestSurveyJson';
import { useContext, useEffect } from 'react';
import AppContext from '../../../context/AppContext';
import { server } from '../../..';

function SurveyComponent() {
  const { reservationDetail, user } = useContext(AppContext);
  const reservationId = reservationDetail?.id;
  const guestId = user?.userId;

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
  });

  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server}/api/surveys/${reservationId!}/${guestId!}`
      );
      if (response.status === 200) {
        const responseJson = await response.json();
        survey.data = JSON.parse(responseJson.surveyResponse);
        survey.mode = 'display';
      }
      // TODO: handle 404 Not found
    })();
  }, []);

  return (
    <>
      <Survey model={survey} />
    </>
  );
}

export default SurveyComponent;
