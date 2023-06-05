import { Container, Grid } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import AppContext from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { server } from '../../index';
import { Property } from '../../utils/dtos';
import PropertyCard from './PropertyCard';

export function ManageListings() {
  const { user } = useContext(AppContext);
  const [properties, setProperties] = useState<Property[]>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    fetch(`${server}/api/properties?hostId=${user?.userId}`)
      .then(async (res) => {
        return await res.json();
      })
      .then((response) => {
        setProperties(response.data);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WidgetTitle>
            <h3 style={{ float: 'left' }}> Manage Listings </h3>
          </WidgetTitle>
        </Grid>
        {properties?.map((p: Property, index: number) => {
          return <PropertyCard key={index} property={p} />;
        })}
      </Grid>
    </Container>
  );
}

const WidgetTitle = styled.div`
  width: 80vw;
  /* background-color: grey; */
  justify-content: space-between;

  h3 {
    font-size: 50px;
    ${theme.font.displayLarge}
  }

  a {
    font-size: 20px;
    text-decoration: underline;
    color: black;
    ${theme.font.body}
  }
`;
