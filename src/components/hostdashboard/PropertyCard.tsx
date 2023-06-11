import { useEffect, useState } from 'react';
import { Property } from '../../utils/dtos';
import { paramRoute, routes, server } from '../../index';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [propertyPhoto, setPropertyPhoto] = useState<string>();
  useEffect(() => {
    fetch(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${server}/api/guidebook/${property.id}/images/featured?dimensions=345x345`
    ).then(async (res) => {
      setPropertyPhoto(await res.text());
    });
  }, []);
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={propertyPhoto}
          alt={property.name}
        />
        <CardContent sx={{ height: 150 }}>
          <Typography gutterBottom variant="h6" component="div">
            {property.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.address.line1}
            {property.address.line2 ? `, ${property.address.line2}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.address.city}, {property.address.stateProvince},{' '}
            {property.address.country}, {property.address.postalCode}
          </Typography>
        </CardContent>
        <Button
          fullWidth
          onClick={() => {
            if (property.id) {
              navigate(paramRoute(routes.guidebookEdit, property.id));
            }
          }}
        >
          {' '}
          Edit{' '}
        </Button>
      </Card>
    </Grid>
  );
}
