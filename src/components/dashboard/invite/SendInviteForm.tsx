import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState } from 'react';
import { Invitation } from '../../../utils/dtos';
import { server } from '../../../index';
import Loading from '../../Loading';

type EmailSentStatus = 'notSent' | 'sent' | 'failed';

interface SentStatus {
  status: EmailSentStatus;
  recipients: string;
}

export interface SendInviteFormProps {
  className?: string;
  resId: string;
  guestName: string;
  onClose: CallableFunction;
  recipientEmail?: string;
}

/**
 * A user form for sending an invitation
 *
 * @param props {@link SendInviteFormProps}
 * @returns A JSX element
 */
function SendInviteForm({
  className,
  resId,
  guestName,
  onClose,
  recipientEmail
}: SendInviteFormProps) {
  const recipientsInputId = 'invite-recipients';
  const messageInputId = 'invite-message';
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<SentStatus>({
    status: 'notSent',
    recipients: ''
  });

  // sends an invitation email message via the api
  const sendInvitations = async (invite: Invitation): Promise<boolean> => {
    const send = async () => {
      const response = await fetch(
        `${server}/api/invites/${resId}/send-email`,
        {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(invite)
        }
      );
      return await response.json();
    };
    return (await send()).status === 200; // 200 = ok
  };

  // send emails
  useEffect(() => {
    let subscribed = true;

    if (sending) {
      const handleSend = () => {
        const recipientsInput = document.getElementById(
          recipientsInputId
        ) as HTMLInputElement;

        const messageInput = document.getElementById(
          messageInputId
        ) as HTMLTextAreaElement;

        const recipients = recipientsInput?.value;

        if (!recipients) {
          // email field is empty, mark field as required
          recipientsInput.classList.add('required');
        } else {
          recipientsInput.classList.remove('required');

          const invite: Invitation = {
            recipients: recipients.split(','),
            guestName,
            message: messageInput?.value
          };

          // send email and close form if successful
          (async function () {
            const success = await sendInvitations(invite);

            if (success) {
              setStatus({ status: 'sent', recipients });
            } else {
              setStatus({ status: 'failed', recipients });
            }
            subscribed && setSending(false);
          })();
        }
      };

      setTimeout(() => handleSend(), 1000);
    }
    return () => {
      subscribed = false;
    };
  }, [sending]);

  useEffect(() => {
    let subscribed = true;

    switch (status.status) {
      case 'notSent':
        break;

      case 'sent':
        subscribed && setTimeout(() => onClose(), 3000);
        break;

      case 'failed':
        subscribed &&
          setTimeout(() => {
            subscribed && setStatus({ status: 'notSent', recipients: '' });
          }, 3000);
    }

    return () => {
      subscribed = false;
    };
  }, [status]);

  // removes the required class if input has value
  const handleBlur = (event: any) => {
    if ((event.target as HTMLInputElement).value)
      document.getElementById(recipientsInputId)?.classList.remove('required');
  };

  return (
    <Container className={className}>
      {status.status === 'notSent' && (
        <>
          <Title>Invite Your Friends</Title>
          <Field>
            <label htmlFor={recipientsInputId}>Recipient Emails</label>
            <input
              id={recipientsInputId}
              type="email"
              placeholder="Enter multiple separated with commas"
              onBlur={handleBlur}
              defaultValue={recipientEmail}
            />
          </Field>
          <Field>
            <label htmlFor={messageInputId}>Optional Message</label>
            <textarea
              id={messageInputId}
              placeholder="Hi friend, join me on BeMyGuest!"
              rows={8}
            />
          </Field>
          <ButtonContainer>
            <CancelButton type="button" onClick={() => onClose()}>
              Cancel
            </CancelButton>
            <SendButton type="button" onClick={() => setSending(true)}>
              Send
            </SendButton>
          </ButtonContainer>
          {sending && <Loading text="Sending" />}
        </>
      )}
      {status.status === 'sent' && (
        <SentStatusMessage>{`Email sent successfully to ${status.recipients}.`}</SentStatusMessage>
      )}
      {status.status === 'failed' && (
        <SentStatusMessage>Failed to send email.</SentStatusMessage>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  padding: 32px;
  width: 384px;
  border-radius: 8px;
  background-color: ${theme.color.white};

  ${theme.screen.small} {
    width: 100%;
    height: 100%;
    border-radius: 0;
    justify-content: start;
  }
`;

const Title = styled.h2`
  display: none;

  ${theme.screen.small} {
    display: block;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100%;
  ${theme.font.body}

  input,
  textarea {
    padding: 8px;
    resize: none;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 4px;

    font-family: Arial, Helvetica, sans-serif;

    ::placeholder {
      color: lightgray;
    }
  }

  .required {
    border: 1px solid red;
    animation: horizontal-shaking 0.15s;

    @keyframes horizontal-shaking {
      0% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(5px);
      }
      50% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

const FormButton = styled.button`
  border: none;
  padding: 8px;
  border-radius: 4px;
  min-width: 96px;
  box-shadow: 0 2px 2px gray;
  ${theme.font.button};

  :hover {
    cursor: pointer;
  }
`;

const SendButton = styled(FormButton)`
  background-color: ${theme.color.blue};
  color: white;
`;

const CancelButton = styled(FormButton)`
  background-color: lightgray;
  color: black;
`;

const SentStatusMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;

export default SendInviteForm;
