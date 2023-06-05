import { useEffect, useState } from 'react';
import { Property } from '../../utils/dtos';
import { server } from '../../index';
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

export default function ReservationCard({ property }: PropertyCardProps) {
  const [propertyPhoto, setPropertyPhoto] = useState<string>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    fetch(`${server}/api/guidebook/${property.id}/images/featured`).then(
      async (res) => {
        setPropertyPhoto(await res.text());
      }
    );
  }, []);
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ maxWidth: 345, height: 320 }}>
        <CardMedia
          component="img"
          height="140"
          image={propertyPhoto}
          alt={property.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {property.name}
            <Button
              onClick={() => {
                if (property.id) {
                  navigate(`/hostLanding/${property.id}/guidebook/edit`);
                }
              }}
            >
              {' '}
              Edit{' '}
            </Button>
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
      </Card>
    </Grid>
  );
}
