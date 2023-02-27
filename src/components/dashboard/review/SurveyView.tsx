import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { guestSurveyJson } from './GuestSurveyJson';
import { useEffect, useState } from 'react';

interface GuestSurvey {
  id: string;
  guestId: string;
  hostId: string;
  reservationId: string;
  propertyId: string;
  submissionTime: string;
  surveyResponse: string;
}

function SurveyViewComponent() {
  const [guestSurvey, setGuestSurvey] = useState<GuestSurvey>();
  const survey = new Model(guestSurveyJson);
  const reservationId = localStorage.getItem('currentReservation');
  const guestId = localStorage.getItem('guestId');
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `/api/survey/${reservationId!}/${guestId!}/find-survey`
      );
      const responseJson = await response.json();
      setGuestSurvey(responseJson);
      console.log(responseJson);
    })();
  }, []);

  if (guestSurvey !== undefined) {
    survey.data = JSON.parse(guestSurvey?.surveyResponse);
    console.log(JSON.parse(guestSurvey?.surveyResponse));
    survey.mode = 'display';
  }
  return (
    <>
      <h1>Survey Result</h1>
      <p>Guest = {guestSurvey?.guestId}</p>
      <p>Property = {guestSurvey?.propertyId}</p>
      <p>Reservation = {guestSurvey?.reservationId}</p>
      <p>Submission Time = {guestSurvey?.submissionTime}</p>
      <Survey model={survey} />
    </>
  );
}

export default SurveyViewComponent;
