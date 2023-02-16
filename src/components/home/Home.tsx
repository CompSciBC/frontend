import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import { Link } from 'react-router-dom';

interface HomeProps {
  logo?: string;
}

function Home({ logo }: HomeProps) {
  return (
    <Container>
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
      <CallToActionButton>Get Started</CallToActionButton>
      <Link to="/guestLanding">
        <CallToActionButton>I am a Guest</CallToActionButton>
      </Link>
      <Link to="/hostLanding">
        <CallToActionButton>I am a Host</CallToActionButton>
      </Link>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  row-gap: 32px;
  font-size: 18px;
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

const CallToActionButton = styled.button`
  background-color: #47a347;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 16px;
  font-size: 32px;
  color: white;
  box-shadow: 0 4px 4px grey;

  :hover {
    background-color: #4fb94f;
    cursor: pointer;
  }
`;

export default Home;
