/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { theme } from '../../utils/styles';

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
        style={{ backgroundImage: "url('/images/downtown-apartment.jpg')", height: 400, width: '100%', font: theme.font.guidebookBody }}
      >
        <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', height: 400  }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <div className='text-white'>
              <Typography variant="h1" fontSize={45} fontWeight={500} marginBottom={5} textAlign={'center'}>Welcome to BeMyGuest</Typography>
              <Typography variant="h4" fontSize={30} fontWeight={500} marginBottom={5} textAlign={'center'}>Subheading Lorem ipsum....</Typography>
            </div>
          </div>
        </div>
      </div>
      <Box>        
        <Container>
        <Grid container spacing={2}>
        <Grid item mt={5} xs={12} md={6}>
          <img
            width={500}
            height={300}
            src={`/images/downtown-apartment.jpg`}
          />
        </Grid>
        <Grid item mt={5} xs={12} md={6}>
          <Box color="blue">
            <Typography variant="h1" fontSize={60} fontWeight={500} >We are streamlining real estate valuation</Typography>
          </Box>
          <Box color="gray">
            <Typography variant="body1"> We’re reshaping the future of home valuation by empowering the industry’s best appraisal team with leading-edge technology and tools. </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12} md={6}>
          <Box color="blue">
            <Typography variant="h1" fontSize={50} fontWeight={500} marginBottom={5} textAlign={'center'}>Our Focus </Typography>
          </Box>
          <Box color="gray">
            <Typography variant="body1"> We are a technology company with a hyper-intense focus on bringing modern solutions to the real estate industry.  After going to market in 2021 with our appraisal firm channel, we continue to develop our proprietary platform to craft data analytics and valuation tools with an emphasis on efficiency.  With products built by engineers and tested by appraisers, Aloft is streamlining how valuations can be more data-driven, defensible, and save lenders, AMCs, and appraisers both time and money.
           </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12} md={6}>
          <Box color="blue">
            <Typography variant="h1" fontSize={50} fontWeight={500} marginBottom={5} textAlign={'center'}> Our Mission</Typography>
          </Box>
          <Box color="gray">
            <Typography variant="body1"> At Aloft, our mission is to empower people to make informed real estate decisions. We provide insight for the homebuyer purchasing a first home, the lender originating a 10,000th loan, and the appraiser who wants to build a data-driven, well-supported report.
           </Typography>
           <br/>
           <Typography variant="body1"> Our clients need data to inform their decision-making and Aloft is here to enable a seamless process that benefits the real estate community.
           </Typography>
          </Box>
        </Grid>
        <Grid item mt={5} xs={12}>
          <Box color="blue">
            <Typography variant="h1" fontSize={50} fontWeight={500} marginBottom={5} textAlign={'center'}> Our Team </Typography>
          </Box>
        </Grid>
        {content.map((item, index) => (
          
          <Grid item key={index} xs={12} sm={3}>
            <CardMedia
              sx={{ height: 200, width: 200, borderRadius: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
              image={item.url}
              title={item.name}
            />
            <CardContent sx={{textAlign:'center'}}>
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </CardContent>
        </Grid>
        ))};
        
        
       
      </Grid>
      </Container>
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

// const Container = styled.div`
//   padding-top: 10px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   row-gap: 32px;
//   font-size: 18px;
//   padding-bottom: 32px;
// `;

// const Logo = styled.img`
//   width: 512px;

//   ${theme.screen.small} {
//     width: 256px;
//   }
// `;

// const Description = styled.div`
//   display: block;
//   background-color: lightgrey;
//   box-shadow: 0 4px 8px gray;
//   border-radius: 16px;
//   padding: 16px;
//   text-align: center;

//   width: 50%;

//   ${theme.screen.small} {
//     width: 85vw;
//   }
// `;

export default Home;
