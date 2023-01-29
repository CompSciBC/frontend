import styled from '@emotion/styled';
import { useLoaderData } from 'react-router-dom';
import { theme } from '../../../utils/styles';

export interface InviteProps {
  className?: string;
}

function Invite({ className }: InviteProps) {
  const qrCodeUrl = useLoaderData() as string;

  return (
    <Container className={className} id="hello">
      <Title>Invite Others</Title>
      <QRCode src={qrCodeUrl} />
      <ButtonContainer>
        <TextCode>
          <div>Invite Code</div>
          <span>F7URJ372JE75</span>
        </TextCode>
        <InviteButton type="button">Send via Email</InviteButton>
        <InviteButton type="button">Send via SMS</InviteButton>
      </ButtonContainer>
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
  ${theme.font.displayXL};
  margin: 20px 0px 0px;
`;

const QRCode = styled.img`
  width: 384px;
`;

const TextCode = styled.div`
  ${theme.font.displayMedium}
  text-align: center;
  font-weight: bold;

  span {
    color: ${theme.color.blue};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 24px;
`;

const InviteButton = styled.button`
  width: 256px;
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: ${theme.color.blue};
  color: ${theme.color.white};
  ${theme.font.button};
  box-shadow: 0 4px 4px gray;

  :hover {
    cursor: pointer;
  }
`;

export default Invite;
