/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { User, Property } from '../../utils/dtos';
import { theme } from '../../utils/styles';
import Rating from '@mui/material/Rating';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography
} from '@mui/material';

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
    // <Container>
    //   <ReviewQuote>
    //     <h5> {property.name}</h5>
    //     <Rating
    //       name="half-rating-read"
    //       value={averageRating}
    //       precision={0.5}
    //       readOnly
    //     />
    //     {/* <p> {averageRating} / 5 </p> */}
    //   </ReviewQuote>
    //   <UserLogo>
    //     <p>
    //       {guest.firstName.charAt(0)}
    //       {guest.lastName.charAt(0)}
    //     </p>
    //   </UserLogo>
    //   <SurveyMetadata>
    //     <h6>
    //       {guest.firstName} {guest.lastName}
    //     </h6>
    //     <p>
    //       {month[timestamp.getMonth()]} {timestamp.getDate()},{' '}
    //       {timestamp.getFullYear()}
    //     </p>
    //   </SurveyMetadata>
    // </Container>
    <Card
      sx={{ width: 275, display: 'inline-block', mr: 2 }}
      variant="outlined"
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="body2"
          component="div"
          color={theme.color.gray}
          sx={{ fontSize: 16, fontWeight: 'medium' }}
        >
          {property.name}
        </Typography>
        <Rating
          name="half-rating-read"
          value={averageRating}
          precision={0.5}
          readOnly
        />
        <p> {averageRating} / 5 </p>

        <CardHeader
          avatar={
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{
                bgcolor: theme.color.BMGteal,
                color: theme.color.white,
                width: 55,
                height: 55
              }}
            >
              {guest.firstName.charAt(0)}
              {guest.lastName.charAt(0)}
            </Avatar>
          }
          title={
            <Typography
              gutterBottom
              variant="body1"
              component="div"
              color={theme.color.gray}
              sx={{ fontSize: 16, fontWeight: 'medium' }}
            >
              {guest.firstName} {guest.lastName}
              <br />
              {month[timestamp.getMonth()]} {timestamp.getDate()},{' '}
              {timestamp.getFullYear()}
            </Typography>
          }
        />
      </CardContent>
    </Card>
  );
}
