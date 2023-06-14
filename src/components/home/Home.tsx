/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Box,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { theme } from '../../utils/styles';
import About from '../about/About';

interface HomeProps {
  logo?: string;
}

const content = [
  {
    name: 'Hieu Do',
    desc: 'lorem ipsum',
    url: '/images/hieu.jpeg'
  },
  {
    name: 'Matthew Granger',
    desc: 'lorem ipsum',
    url: '/images/no-image-available.jpeg'
  },
  {
    name: 'Elena Ochkina',
    desc: 'lorem ipsum',
    url: '/images/no-image-available.jpeg'
  },
  {
    name: 'Joe Prado',
    desc: 'lorem ipsum',
    url: '/images/no-image-available.jpeg'
  }
];

function Home({ logo }: HomeProps) {
  return (
    <>
      {/* Hero banner example: https://mdbootstrap.com/docs/react/extended/hero/ */}
      <div
        style={{
          backgroundImage: "url('/images/homeimage.jpg')",
          width: '100%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div
          className="mask"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', height: 500 }}
        >
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <Typography
                variant="h1"
                fontSize={45}
                fontWeight={500}
                marginBottom={5}
                textAlign={'center'}
              >
                Welcome to BeMyGuest
              </Typography>
              <Typography
                variant="h4"
                fontSize={30}
                fontWeight={500}
                marginBottom={5}
                textAlign={'center'}
              >
                A Full-Stack Web Application Made for Property Management Hosts
                and Guests
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <Box>
        <About />
      </Box>
    </>
    // <Container maxWidth= 'xl'>

    // </Container>
    // <Container>
    //   <h1>Welcome to</h1>
    //   <Logo src={logo} />
    //   <Description>
    //     <p>
    //       BeMyGuest’s mobile-responsive hospitality web application will
    //       facilitate communication between vacation renters (guests) and their
    //       hosts.
    //     </p>
    //     <p>
    //       Guests will be able to securely check-in, check-out and view important
    //       information about each rental, such as house rules, local attractions,
    //       and restaurants. Furthermore, guests can communicate with hosts using
    //       the secure in-app chat.
    //     </p>
    //     <p>
    //       Hosts can welcome their guests with a tailored hospitality experience.
    //       Using the Property Management portal, hosts can view all rental
    //       properties and reservations. For each property, the host can create
    //       custom profiles to highlight unique features, share instructions and
    //       recommend restaurants, attractions in the area. The integrated chat
    //       allows hosts to easily communicate with their guests.
    //     </p>
    //   </Description>
    // </Container>
  );
}

export default Home;
