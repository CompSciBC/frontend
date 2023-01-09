import styled from '@emotion/styled';
import AccordionDropdown from './AccordionDropdown';

function Reservations() {
  // TODO: replace with real data
  const fakeReservations = [
    {
      id: 1234,
      property: 'Seattle Loft',
      address: '129 Warren Avenue N Unit 19, Seattle, WA 98109',
      host: 'Bob Ross',
      dates: '11/23 - 11/31/2022',
      image: 'images/seattle-loft.jpg'
    },
    {
      id: 2345,
      property: 'Downtown Apartment',
      address: '100 W 57th St Unit 4JK, New York, NY 10019',
      host: 'Roger Rabbit',
      dates: '11/30 - 12/5/2022',
      image: 'images/downtown-apartment.jpg'
    },
    {
      id: 3456,
      property: 'House on the Beach',
      address: '2303 E Ocean Blvd, Long Beach, CA 90803',
      host: 'Zack Morris',
      dates: '12/1 - 12/6/2022',
      image: 'images/beach-house.jpg'
    },
    {
      id: 4567,
      property: 'Mountain Retreat',
      address: '27 Timber Ridge Ln, Snowmass Village, CO 81615',
      host: 'Raven Baxter',
      dates: '1/4 - 1/7/2022',
      image: 'images/mountain-cabin.jpg'
    }
  ];

  // TODO: replace with card
  const fakeContent = fakeReservations.map((res) => {
    return (
      <div key={res.id}>
        <img src={res.image} width="64px" />
        <div>{res.property}</div>
        <div>{res.host}</div>
        <div>{res.dates}</div>
        <div>{res.address}</div>
      </div>
    );
  });

  return (
    <Container>
      <h1>Reservations</h1>
      <ListContainer>
        <AccordionDropdown
          label="Current"
          isOpen={true}
          content={fakeContent}
        />
        <AccordionDropdown
          label="Upcoming"
          isOpen={true}
          content={fakeContent}
        />
        <AccordionDropdown label="Past" isOpen={true} content={fakeContent} />
      </ListContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;

  @media only screen and (max-width: 700px) {
    width: 100%;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 85%;
`;

export default Reservations;
