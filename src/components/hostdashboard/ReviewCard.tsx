/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

export interface ReviewCardProps {
  propertyName: string;
  primaryGuestName: string;
  submissionTime: string;
  content: string;
}

export default function ReviewCard({
  propertyName,
  primaryGuestName,
  submissionTime,
  content
}: ReviewCardProps) {
  const timestamp = new Date(submissionTime);
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return (
    <Container>
      <ReviewQuote>
        <p> &ldquo; {content.substring(0, 200)} ... &rdquo; </p>
      </ReviewQuote>
      <UserLogo>
        <p>
          {characters.charAt(Math.floor(Math.random() * characters.length))}
          {characters.charAt(Math.floor(Math.random() * characters.length))}
        </p>
      </UserLogo>
      <SurveyMetadata>
        <h6>Guest Name</h6>
        <p>
          {month[timestamp.getMonth()]} {timestamp.getFullYear()}
        </p>
      </SurveyMetadata>
    </Container>
  );
}

const Container = styled.div`
  /* padding: 20px 0; */
  margin: 0px 6px;
  display: inline-block;
  width: 300px;
  border: 1px solid grey;
  border-radius: 16px;
  /* background: pink; */
`;

const ReviewQuote = styled.div`
  /* background: yellow; */
  margin: 15px 10px 15px 15px;
  p {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    ${theme.font.displayXSmall}
  }
`;

const SurveyMetadata = styled.div`
  position: relative;
  left: 10%;
  display: inline-block;
  /* background: blue; */
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  width: 50%;

  h6 {
    ${theme.font.displaySmall}
    font-weight: bold;
    color: ${theme.color.blue};
  }

  p {
    ${theme.font.displayXSmall}
    color: ${theme.color.gray}
  }
`;

const UserLogo = styled.div`
  position: relative;
  left: 15px;
  bottom: 30px;
  background: ${theme.color.lightBlue};
  align-items: center;
  height: 60px;
  width: 60px;
  text-align: center;
  display: inline-block;
  border-radius: 60px;
  text-transform: uppercase;
  padding: 15px 10px;

  p {
    ${theme.font.displayLarge}
    font-weight: bold;
    text-transform: uppercase;
    color: ${theme.color.white};
  }
`;
