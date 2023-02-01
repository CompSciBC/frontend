import styled from '@emotion/styled';
import { Invitation } from '../../../utils/dtos';
import { theme } from '../../../utils/styles';

export interface SendInviteFormProps {
  className?: string;
  onClose: CallableFunction;
}

/**
 * A user form for sending an invitation
 *
 * @param props {@link SendInviteFormProps}
 * @returns A JSX element
 */
function SendInviteForm({ className, onClose }: SendInviteFormProps) {
  // TODO: replace hardcoded values
  const guestName = 'GUEST NAME';
  const resId = 'test-res';

  const recipientsInputId = 'invite-recipients';
  const messageInputId = 'invite-message';

  /**
   * Sends an invitation email message via the api
   *
   * @param invite An {@link Invitation}
   * @returns True if the invitation was sent successfully, or false otherwise
   */
  const sendInvitations = async (invite: Invitation): Promise<boolean> => {
    const send = async () => {
      const response = await fetch(`/api/invites/${resId}/send-email`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(invite)
      });
      return await response.json();
    };
    return (await send()).status === 200; // 200 = ok
  };

  /**
   * Handles the send action when the send button is clicked
   */
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

        // TODO: replace alert with custom notification
        if (success) {
          onClose();
          window.alert('Invitation sent successfully.');
        } else {
          window.alert('Failed to send invitation.');
        }
      })();
    }
  };

  /**
   * Removes the required class if input has value
   *
   * @param event The triggering event
   */
  const handleBlur = (event: any) => {
    if ((event.target as HTMLInputElement).value)
      document.getElementById(recipientsInputId)?.classList.remove('required');
  };

  return (
    <Container className={className}>
      <Title>Invite Your Friends</Title>
      <Field>
        <label htmlFor={recipientsInputId}>Recipient Emails</label>
        <input
          id={recipientsInputId}
          type="email"
          placeholder="Enter multiple separated with commas"
          onBlur={handleBlur}
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
        <SendButton type="button" onClick={handleSend}>
          Send
        </SendButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
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

export default SendInviteForm;
