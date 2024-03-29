// import styled from '@emotion/styled';
// import { theme } from '../../utils/styles';
// import { Link } from 'react-router-dom';
import { paramRoute, routes, server } from '../../index';
import { Reservation } from '../../utils/dtos';
import { useMemo } from 'react';
import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';

interface ReservationCardProps {
  className?: string;
  reservation: Reservation;
}

export default function ReservationCard({
  className,
  reservation
}: ReservationCardProps) {
  const { id, checkIn, property, checkOut } = reservation;

  const checkInDate = new Date(checkIn).toLocaleDateString('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const checkInTime = new Date(checkIn).toLocaleTimeString('default', {
    timeStyle: 'short'
  });

  const checkOutDate = new Date(checkOut).toLocaleDateString('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const checkOutTime = new Date(checkOut).toLocaleTimeString('default', {
    timeStyle: 'short'
  });

  const address = useMemo(() => {
    let addressString = '';

    const appendToAddress = (part: string | undefined, separator: string) => {
      if (part)
        addressString = addressString
          ? `${addressString}${separator}${part}`
          : part;
    };

    if (property) {
      const { line1, line2, city } = property.address;
      appendToAddress(line1, '');
      appendToAddress(line2, ' ');
      appendToAddress(city, ', ');
    }
    return addressString;
  }, [reservation]);
  const [propertyPhoto, setPropertyPhoto] = React.useState<string>();
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    fetch(`${server}/api/guidebook/${property.id}/images/featured`).then(
      async (res) => {
        setPropertyPhoto(await res.text());
      }
    );
  }, []);
  return (
    <Link
      to={paramRoute(routes.dashboard, id)}
      style={{ textDecoration: 'none' }}
    >
      <Card sx={{ width: '100%', height: '100%' }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image={propertyPhoto}
            alt={property.id}
          />
          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 'bold' }}
            >
              {`${property.name}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${address}`}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ mt: 3, fontSize: '18px' }}
            >
              {`Check In: ${checkInDate}, ${checkInTime}`}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ fontSize: '18px' }}
            >
              {`Check Out: ${checkOutDate}, ${checkOutTime}`}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

// function ReservationCard({ className, reservation }: ReservationCardProps) {
//   const { id, checkIn, property } = reservation;

//   const checkInDate = new Date(checkIn).toLocaleDateString('default', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric'
//   });

//   const checkInTime = new Date(checkIn).toLocaleTimeString('default', {
//     timeStyle: 'short'
//   });

//   const address = useMemo(() => {
//     let addressString = '';

//     const appendToAddress = (part: string | undefined, separator: string) => {
//       if (part)
//         addressString = addressString
//           ? `${addressString}${separator}${part}`
//           : part;
//     };

//     if (property) {
//       const { line1, line2, city } = property.address;
//       appendToAddress(line1, '');
//       appendToAddress(line2, ' ');
//       appendToAddress(city, ', ');
//     }
//     return addressString;
//   }, [reservation]);

//   return (
//     <Wrapper
//       className={className}
//       image={property.image ?? ''}
//       to={paramRoute(routes.dashboard, id)}
//     >
//       <Container>
//         <CheckInInfoBox>
//           <CheckInDate>{`Check In : ${checkInDate}`}</CheckInDate>
//           <CheckInTime>{checkInTime}</CheckInTime>
//         </CheckInInfoBox>
//         <AddressInfoBox>
//           <div>{`YOUR RENTAL : ${address}`}</div>
//         </AddressInfoBox>
//       </Container>
//     </Wrapper>
//   );
// }

// const Wrapper = styled(Link)<{ image: string }>`
//   padding: 12px;
//   border-radius: 12px;
//   background-image: ${(props) => `url(${props.image})`};
//   text-decoration: none;
// `;

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   row-gap: 12px;
//   width: 100%;
//   height: 100%;
// `;

// const InfoBox = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: calc(100% - 24px); // 24px = 2 x Container row-gap
//   max-width: fit-content;
//   row-gap: 12px;
//   padding: 12px;
//   border-radius: 12px;
//   background: linear-gradient(180deg, #262626 0%, rgba(4, 4, 4, 0.21) 73.96%);
//   color: white;
// `;

// const CheckInInfoBox = styled(InfoBox)`
//   width: fit-content;
// `;

// const CheckInDate = styled.div`
//   ${theme.font.displayLarge}
// `;

// const CheckInTime = styled.div`
//   ${theme.font.caption}
// `;

// const AddressInfoBox = styled(InfoBox)`
//   ${theme.font.subHeading}

//   div {
//     width: calc(100%);
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
// `;

// export default ReservationCard;
