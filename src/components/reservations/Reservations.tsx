import styled from '@emotion/styled';
import { useLoaderData } from 'react-router-dom';
import {
  ReservationStatus,
  SortedReservationPropertySet
} from '../../utils/dtos';
import { theme } from '../../utils/styles';
import AccordionDropdown from './AccordionDropdown';
import ReservationCard from './ReservationCard';

function Reservations() {
  const reservationProperties = useLoaderData() as SortedReservationPropertySet;

  const getCards = (status: ReservationStatus) => (
    <DropdownContent>
      {reservationProperties?.[status].map((resProp) => (
        <ReservationCard key={resProp.id} reservationProperty={resProp} />
      ))}
    </DropdownContent>
  );

  return (
    <Container>
      <Title>My Reservations</Title>
      <ListContainer>
        <StyledAccordionDropdown
          label="Current"
          isOpen={true}
          content={getCards('current')}
        />
        <StyledAccordionDropdown
          label="Upcoming"
          isOpen={true}
          content={getCards('upcoming')}
        />
        <StyledAccordionDropdown
          label="Past"
          isOpen={true}
          content={getCards('past')}
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
