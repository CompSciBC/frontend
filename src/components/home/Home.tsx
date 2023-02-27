import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

interface HomeProps {
  logo?: string;
}

function Home({ logo }: HomeProps) {
  return (
    <Container>
      <h1>process.env.REACT_APP_ENV === {process.env.REACT_APP_ENV}</h1>
      <h1>Welcome to</h1>
      <Logo src={logo} />
      <Description>
        <p>
          BeMyGuest’s mobile-responsive hospitality web application will
          facilitate communication between vacation renters (guests) and their
          hosts.
        </p>
        <p>
          Guests will be able to securely check-in, check-out and view important
          information about each rental, such as house rules, local attractions,
          and restaurants. Furthermore, guests can communicate with hosts using
          the secure in-app chat.
        </p>
        <p>
          Hosts can welcome their guests with a tailored hospitality experience.
          Using the Property Management portal, hosts can view all rental
          properties and reservations. For each property, the host can create
          custom profiles to highlight unique features, share instructions and
          recommend restaurants, attractions in the area. The integrated chat
          allows hosts to easily communicate with their guests.
        </p>
      </Description>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 32px;
  font-size: 18px;
  padding-bottom: 32px;
`;

const Logo = styled.img`
  width: 512px;

  ${theme.screen.small} {
    width: 256px;
  }
`;

const Description = styled.div`
  display: block;
  background-color: lightgrey;
  box-shadow: 0 4px 8px gray;
  border-radius: 16px;
  padding: 16px;
  text-align: center;

  width: 50%;

  ${theme.screen.small} {
    width: 85vw;
  }
`;

export default Home;
