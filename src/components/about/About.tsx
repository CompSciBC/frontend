/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

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

function About() {
  return (
    <Container>
      <Grid container spacing={2}>
        
        <Grid item mt={10} xs={12} md={6}>
          <img
            width={500}
            height={300}
            src={`/images/downtown-apartment.jpg`}
          />
        </Grid>
        <Grid item mt={8} xs={12} md={6}>
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
  );
}

export default About;
