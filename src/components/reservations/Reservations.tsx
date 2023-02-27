import styled from '@emotion/styled';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import {
  ReservationStatus,
  SortedReservationDetailSet
} from '../../utils/dtos';
import { theme } from '../../utils/styles';
import AccordionDropdown from './AccordionDropdown';
import ReservationCard from './ReservationCard';
import { server } from '../../index';

function Reservations() {
  const { user } = useContext(AppContext);

  const [resDetails, setResDetails] = useState<SortedReservationDetailSet>({
    current: [],
    upcoming: [],
    past: []
  });

  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (user) {
        const index = user.role;
        const id = user.userId;

        // gets a sorted reservation detail set
        const response = await fetch(
          `${server}/api/reservations-by-status?index=${index!}&id=${id}`
        );
        const body = await response.json();
        const data: SortedReservationDetailSet = body.data[0];

        // TODO: images need to be pulled from the backend
        let randomImage = 0;
        const images = [
          'images/seattle-loft.jpg',
          'images/downtown-apartment.jpg',
          'images/beach-house.jpg',
          'images/mountain-cabin.jpg'
        ];

        // for each status type and each reservation within, add a random image
        for (const statusName of Object.keys(data)) {
          const status = statusName as ReservationStatus;

          for (const reservation of data[status])
            reservation.image = images[randomImage++ % images.length];
        }

        subscribed && setResDetails(data);
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [user]);

  // maps the reservation/property objects into a list of reservation cards to be
  // rendered on the screen
  const getCards = (status: ReservationStatus) => (
    <DropdownContent>
      {resDetails?.[status].map((resProp) => (
        <ReservationCard key={resProp.id} reservationDetail={resProp} />
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
