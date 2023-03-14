import styled from '@emotion/styled';
import { useEffect, useState, useContext } from 'react';
import { server } from '../..';
import AppContext from '../../context/AppContext';
import { Reservation } from '../../utils/dtos';
import { theme } from '../../utils/styles';
import InputField, { getInputValue } from '../forms/InputField';
import Loading from '../Loading';
import { postReservation } from './postReservation';

export interface AddReservationFormProps {
  className?: string;
  onClose: CallableFunction;
}

/**
 * Allows user to enter an invite code to add a reservation to their account
 *
 * @param props {@link AddReservationFormProps}
 * @returns A JSX element
 */
function AddReservationForm({ className, onClose }: AddReservationFormProps) {
  const { user } = useContext(AppContext);
  const [gettingReservation, setGettingReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation>();
  const [status, setStatus] = useState<string>();
  const inviteCodeField = 'invite-code';

  // get the reservation from invite code
  useEffect(() => {
    let subscribed = true;

    subscribed &&
      gettingReservation &&
      (async function () {
        const inviteCode = getInputValue(inviteCodeField);

        const result = await fetch(
          `${server}/api/reservations?index=invite&id=${inviteCode}`
        )
          .then(async (r) => await r.json())
          .then((r) => r.data[0])
          .catch(() => null);

        setReservation(result);
        setLoading(true);
      })();

    return () => {
      subscribed = false;
    };
  }, [gettingReservation]);

  // post new reservation entry to api
  useEffect(() => {
    let subscribed = true;

    setGettingReservation(false);

    subscribed &&
      user &&
      loading &&
      setTimeout(() => {
        (async function () {
          if (reservation) {
            const success = await postReservation(reservation, user.userId);

            if (success) {
              subscribed && setStatus('Reservation added.');
              setTimeout(() => onClose(), 3000);
            } else {
              console.log('error');
              subscribed && setStatus('Unable to add reservation.');
            }
          } else {
            subscribed && setStatus('Unable to add reservation.');
          }
          subscribed && setLoading(false);
        })();
      }, 2500);

    return () => {
      subscribed = false;
    };
  }, [reservation, user, loading]);

  // clear the status message
  useEffect(() => {
    let subscribed = true;

    status &&
      setTimeout(() => {
        subscribed && setStatus('');
      }, 3000);

    return () => {
      subscribed = false;
    };
  }, [status]);

  return (
    <Container className={className}>
      {!status ? (
        <>
          <div>Add a Reservation</div>
          <StyledInputField
            type="text"
            name={inviteCodeField}
            placeholder="Enter invite code"
          />
          <ButtonContainer>
            <CancelButton type="button" onClick={() => onClose()}>
              Cancel
            </CancelButton>
            <AddButton
              type="button"
              onClick={() => setGettingReservation(true)}
            >
              Add
            </AddButton>
          </ButtonContainer>
          {loading && <Loading />}
        </>
      ) : (
        <StatusMessage>{status}</StatusMessage>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border-radius: 8px;
  background-color: white;

  > div {
    ${theme.font.body}
    text-align: center;
  }
`;

const StyledInputField = styled(InputField)`
  input {
    width: 100%;
  }
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const FormButton = styled.button`
  border: none;
  padding: 8px;
  border-radius: 4px;
  min-width: 96px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  ${theme.font.button}

  :hover {
    cursor: pointer;
  }
`;

const AddButton = styled(FormButton)`
  background-color: ${theme.color.blue};
  color: white;
`;

const CancelButton = styled(FormButton)`
  background-color: ${theme.color.lightGray};
  color: black;
`;

const StatusMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;

export default AddReservationForm;
