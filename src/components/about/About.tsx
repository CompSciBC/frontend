import styled from '@emotion/styled';
import {
  Box,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography
} from '@mui/material';

const content = [
  {
    name: 'Hieu Do',
    desc: 'Likes: plants Favorite class: Cloud Computing',
    url: '/images/hieu.jpeg'
  },
  {
    name: 'Matthew Granger',
    desc: 'Likes: tea and art. Favorite class: Computer Architecture',
    url: '/images/matthew.png'
  },
  {
    name: 'Elena Ochkina',
    desc: 'Likes: cooking and traveling. Favorite class: Data Structures',
    url: '/images/elena.png'
  },
  {
    name: 'Joe Prado',
    desc: 'Likes: the color green. Favorite class: Capstone',
    url: '/images/joe.png'
  }
];

function About() {
  return (
    <Container>
      <Grid container spacing={{ xs: 0, md: 2 }}>
        <RightPaddingGrid item mt={10} xs={12} md={6}>
          <img
            width="100%"
            height="auto"
            src={`/images/downtown-apartment.jpg`}
          />
        </RightPaddingGrid>
        <Grid item mt={8} xs={12} md={6}>
          <Box color="#142340">
            <Typography variant="h1" fontSize={60} fontWeight={500}>
              We are changing the guest hospitality experience
            </Typography>
            <Typography variant="h1" fontSize={60} fontWeight={500}>
              - one stay at a time.
            </Typography>
          </Box>
          {/* <br /> */}
          <Box color="gray">
            <Typography variant="body1" paddingTop={{ xs: 1, md: 2 }}>
              {' '}
              <b>BeMyGuest</b> offers a personalized vacation rental experience,
              with online check-in, seamless communication between rental host
              and reservation party, as well as essential information about the
              property.
            </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12} md={6}>
          <Box color="#142340">
            <Typography
              variant="h1"
              fontSize={50}
              fontWeight={500}
              marginBottom={5}
              textAlign={'center'}
            >
              <b>Our Focus</b>{' '}
            </Typography>
          </Box>
          <Box color="gray">
            <Typography variant="body1">
              {' '}
              We focus on <b>Guests</b> who book on platforms - such as airbnb,
              expedia, and vrbo - and offer them a central web application where
              they can view information relevant to their stay.
            </Typography>
            <br />
            <Typography variant="body1">
              {' '}
              In addition to guests, <b>Hosts</b> are a critical component where
              we provide an application for them to communicate and inform
              guests of details about their property. We also provide a means of
              submitting guest surveys that hosts may view in a dashboard to
              understand trends in guest feedback.
            </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12} md={6}>
          <Box color="#142340">
            <Typography
              variant="h1"
              fontSize={50}
              fontWeight={500}
              marginBottom={5}
              textAlign={'center'}
            >
              {' '}
              <b>Our Mission</b>
            </Typography>
          </Box>
          <Box color="gray">
            <Typography variant="body1">
              {' '}
              The <b>Mission </b>of the BeMyGuest team is to add value to the
              Guest Hospitality and Vacation Rental field by offering a product
              made with the guest experience in mind, in one full-stack web
              application.
            </Typography>
            <br />
            <Typography variant="body1">
              {' '}
              <b>Core Values</b> of BeMyGuest can be attributed to our parent
              company in industry, Expedia, whose aim and mission to be a Global
              Leader in the Travel and Hospitality field reaches a wide
              audience.
            </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12}>
          <Box color="#142340">
            <Typography
              variant="h1"
              fontSize={50}
              fontWeight={500}
              marginBottom={5}
              textAlign={'center'}
            >
              {' '}
              <b>Our Team</b>{' '}
            </Typography>
          </Box>
        </Grid>
        {content.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <CardMedia
              sx={{
                height: 200,
                width: 200,
                borderRadius: '50%',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
              image={item.url}
              title={item.name}
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </CardContent>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const RightPaddingGrid = styled(Grid)`
  @media only screen and (min-width: 900px) {
    padding: 0 40px 0 0;
  }
`;

export default About;
