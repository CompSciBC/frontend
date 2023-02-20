import styled from '@emotion/styled';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../../context/AppContext';
import { theme } from '../../../utils/styles';
import Modal from '../../Modal';
import SendInviteForm from './SendInviteForm';

export interface InviteProps {
  className?: string;
}

/**
 * A page for sending invitations to other guests
 *
 * @param props {@link InviteProps}
 * @returns A JSX element
 */
function Invite({ className }: InviteProps) {
  const { resId } = useParams();
  const { user } = useContext(AppContext);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [emailFormOpen, setEmailFormOpen] = useState(false);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (resId) {
        const response = await fetch(`/api/invites/${resId}/qr-code`);
        const body = await response.json();

        subscribed && setQrCodeUrl(body.data[0]);
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [resId]);

  return (
    <Container className={className}>
      <Title>Invite Others</Title>
      <QRCode src={qrCodeUrl} />
      <ButtonContainer>
        <TextCode>
          <div>Invite Code</div>
          <span>F7URJ372JE75</span> {/* TODO: replace hard coded value */}
        </TextCode>
        <InviteButton type="button" onClick={() => setEmailFormOpen(true)}>
          Send via Email
        </InviteButton>
        <InviteButton type="button">Send via SMS</InviteButton>
        {emailFormOpen && (
          <Modal
            content={
              <SendInviteForm
                onClose={() => setEmailFormOpen(false)}
                resId={resId!}
                userName={user?.username ?? 'Your friend'}
              />
            }
            blur={true}
          />
        )}
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
