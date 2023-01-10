import styled from '@emotion/styled';
import { Property, Reservation } from '../../utils/dtos';
import { theme } from '../../utils/styles';
import AccordionDropdown from './AccordionDropdown';
import ReservationCard from './ReservationCard';

function Reservations() {
  // TODO: replace with real data
  const fakeProperties: Property[] = [
    {
      id: 1,
      hostId: 10,
      name: 'Seattle Loft',
      address: '129 Warren Avenue N Unit 19, Seattle, WA 98109',
      image: 'images/seattle-loft.jpg'
    },
    {
      id: 2,
      hostId: 10,
      name: 'Downtown Apartment',
      address: '100 W 57th St Unit 4JK, New York, NY 10019',
      image: 'images/downtown-apartment.jpg'
    },
    {
      id: 3,
      hostId: 10,
      name: 'House on the Beach',
      address: '2303 E Ocean Blvd, Long Beach, CA 90803',
      image: 'images/beach-house.jpg'
    },
    {
      id: 4,
      hostId: 10,
      name: 'Mountain Retreat',
      address: '27 Timber Ridge Ln, Snowmass Village, CO 81615',
      image: 'images/mountain-cabin.jpg'
    }
  ];

  const fakeReservations: Reservation[] = [
    {
      id: 1000,
      propertyId: 1,
      guestId: 100,
      numGuests: 1,
      startDate: new Date('11/23/22'),
      endDate: new Date('11/30/22'),
      checkInTime: '12:00pm',
      checkOutTime: '12:00pm',
      reasonForStay: 'Anniversary'
    },
    {
      id: 1001,
      propertyId: 2,
      guestId: 101,
      numGuests: 2,
      startDate: new Date('11/30/22'),
      endDate: new Date('12/5/22'),
      checkInTime: '12:00pm',
      checkOutTime: '12:00pm',
      reasonForStay: 'Holiday'
    },
    {
      id: 1002,
      propertyId: 3,
      guestId: 102,
      numGuests: 3,
      startDate: new Date('12/1/22'),
      endDate: new Date('12/6/22'),
      checkInTime: '12:00pm',
      checkOutTime: '12:00pm',
      reasonForStay: 'Business'
    },
    {
      id: 1003,
      propertyId: 4,
      guestId: 103,
      numGuests: 4,
      startDate: new Date('1/4/23'),
      endDate: new Date('1/7/23'),
      checkInTime: '12:00pm',
      checkOutTime: '12:00pm',
      reasonForStay: 'n/a'
    }
  ];

  // TODO: replace with card
  const fakeContent = (
    <DropdownContent>
      {fakeReservations.map((reservation) => {
        const property = fakeProperties.find(
          (property) => property.id === reservation.propertyId
        );
        return (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            property={property!}
          />
        );
      })}
    </DropdownContent>
  );

  return (
    <Container>
      <Title>My Reservations</Title>
      <ListContainer>
        <StyledAccordionDropdown
          label="Current"
          isOpen={true}
          content={fakeContent}
        />
        <StyledAccordionDropdown
          label="Upcoming"
          isOpen={true}
          content={fakeContent}
        />
        <StyledAccordionDropdown
          label="Past"
          isOpen={true}
          content={fakeContent}
        />
      </ListContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;

  ${theme.screen.small} {
    width: 100%;
  }
`;

const Title = styled.h1`
  ${theme.font.displayLarge}
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 50%;
  min-width: 512px;

  ${theme.screen.small} {
    width: 85%;
    min-width: auto;
  }
`;

const StyledAccordionDropdown = styled(AccordionDropdown)`
  ${theme.font.body}
`;

const DropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

export default Reservations;
