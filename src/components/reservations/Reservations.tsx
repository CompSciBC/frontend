/* eslint-disable @typescript-eslint/no-unused-vars */
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
import CloseX from '../page/CloseX';
import Modal from '../Modal';
import AddReservationForm from './AddReservationForm';
import { Grid } from '@mui/material';

function Reservations() {
  const { user } = useContext(AppContext);
  const [addFormOpen, setAddFormOpen] = useState(false);

  const [resDetails, setResDetails] = useState<SortedReservationDetailSet>({
    current: [],
    upcoming: [],
    past: []
  });

  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (user && !addFormOpen) {
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
            reservation.property.image = images[randomImage++ % images.length];
        }

        subscribed && setResDetails(data);
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [user, addFormOpen]);

  // maps the reservation/property objects into a list of reservation cards to be
  // rendered on the screen
  const getCards = (status: ReservationStatus) => (
    <Grid container spacing={5}>
      {resDetails?.[status].map((resProp) => (
        <Grid item key={resProp.id} xs={12} sm={12} md={4} xl={3}>
          <ReservationCard reservation={resProp} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container>
      <Header>
        <h1>My Reservations</h1>
        <AddButton
          fill="white"
          size={16}
          onClick={() => setAddFormOpen(true)}
        />
      </Header>
      {getCards('upcoming')}
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
      {addFormOpen && (
        <Modal
          content={<AddReservationForm onClose={() => setAddFormOpen(false)} />}
          blur={true}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  gap: 16px;
  padding: 32px 0;

  ${theme.screen.small} {
    width: 100%;
    padding: 16px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 512px;
  text-align: center;
  height: 32px;

  ${theme.screen.small} {
    width: 100%;
    min-width: auto;
  }

  h1 {
    ${theme.font.displayLarge}
    margin: 0;
  }
`;

const AddButton = styled(CloseX)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%) rotate(45deg);
  border: none;
  border-radius: 100vh;
  padding: 8px;
  background-color: ${theme.color.red};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  ${theme.font.button}
  color: white;

  :hover {
    filter: contrast(2);
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  min-width: 80vw;

  ${theme.screen.small} {
    width: 100%;
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
