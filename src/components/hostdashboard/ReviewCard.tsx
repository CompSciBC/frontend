/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { User, Property } from '../../utils/dtos';
import { theme } from '../../utils/styles';
import Rating from '@mui/material/Rating';

export interface ReviewCardProps {
  property: Property;
  guest: User;
  submissionTime: string;
  qualityMetrics: any;
  content: string;
}

export default function ReviewCard({
  property,
  guest,
  submissionTime,
  qualityMetrics,
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

  let averageRating: number = 0;
  for (const key in qualityMetrics) {
    const value: number = qualityMetrics[key];
    averageRating += value;
  }
  averageRating = averageRating / Object.keys(qualityMetrics).length;
  // console.log(averageRating);
  return (
    <Container>
      <ReviewQuote>
        <h5> {property.name}</h5>
        <Rating
          name="half-rating-read"
          value={averageRating}
          precision={0.5}
          readOnly
        />
        {/* <p> {averageRating} / 5 </p> */}
      </ReviewQuote>
      <UserLogo>
        <p>
          {guest.firstName.charAt(0)}
          {guest.lastName.charAt(0)}
        </p>
      </UserLogo>
      <SurveyMetadata>
        <h6>
          {guest.firstName} {guest.lastName}
        </h6>
        <p>
          {month[timestamp.getMonth()]} {timestamp.getDate()},{' '}
          {timestamp.getFullYear()}
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
  height: 175px;
  border: 1px solid grey;
  border-radius: 16px;
  /* background: pink; */
`;

const ReviewQuote = styled.div`
  /* background: yellow; */
  margin: 15px 10px;
  height: 100px;
  h5 {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    ${theme.font.displayXSmall}
    font-weight:500;
  }
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
  bottom: 40px;
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
  bottom: 75px;
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

function printStars(numStars: number) {
  let starString = '';
  for (let i = 0; i < numStars; i++) {
    starString += '*';
  }
  console.log(starString);
}
