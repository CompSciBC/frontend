import styled from '@emotion/styled';
import { Auth } from '@aws-amplify/auth';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';
import { theme } from '../../utils/styles';
import InputField, {
  getInputValue,
  getTelephoneValue
} from '../forms/InputField';
import RadioField, { getRadioValue } from '../forms/RadioField';
import { assignUserToRole } from './AuthUtils';
import { UserRole } from '../../utils/dtos';

export interface SignUpProps {
  className?: string;
}

function SignUp({ className }: SignUpProps) {
  const navigate = useNavigate();
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AppContext);

  // displays the confirmation code form when set to true
  const [confirming, setConfirming] = useState(false);
  // set to true after confirmation code accepted
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roleField = 'role';
  const firstNameField = 'firstName';
  const lastNameField = 'lastName';
  const usernameField = 'username';
  const emailField = 'email';
  const passwordField = 'password';
  const confirmPasswordField = 'confirmPassword';
  const phoneField = 'phoneField';
  const confirmationCodeField = 'confirmCodeField';

  // handles sign up form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    let signUpResult: any; // this is supposed to be type CognitoSignUpResult, but the type does not work

    const enteredRole = getRadioValue(roleField).toLowerCase();
    const enteredUsername = getInputValue(usernameField);
    const enteredPassword = getInputValue(passwordField);
    const enteredConfirmPassword = getInputValue(confirmPasswordField);
    const enteredFirstName = getInputValue(firstNameField);
    const enteredLastName = getInputValue(lastNameField);
    const enteredEmail = getInputValue(emailField);
    const enteredPhone = getTelephoneValue(phoneField);

    if (
      !(
        enteredUsername &&
        enteredPassword &&
        enteredConfirmPassword &&
        enteredFirstName &&
        enteredLastName &&
        enteredEmail &&
        enteredPhone
      )
    ) {
      setErrorMessage('Please complete all fields.');
    } else if (enteredPassword !== enteredConfirmPassword) {
      setErrorMessage('Password fields do not match.');
    } else {
      try {
        signUpResult = await Auth.signUp({
          username: enteredUsername,
          password: enteredPassword,
          attributes: {
            given_name: enteredFirstName,
            family_name: enteredLastName,
            email: enteredEmail,
            phone_number: enteredPhone
          },
          autoSignIn: {
            enabled: true
          }
        });

        setErrorMessage('');

        setUser({
          userId: signUpResult.userSub,
          username: enteredUsername,
          email: enteredEmail,
          role: enteredRole as UserRole
        });
      } catch (error) {
        console.log('Error signing up: ', error);
        setErrorMessage(String(error));
      }
    }
  };

  // displays sign up confirmation code form
  useEffect(() => {
    let subscribed = true;

    subscribed && user && setConfirming(true);

    return () => {
      subscribed = false;
    };
  }, [user]);

  // handles confirmation code form submission
  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    if (user) {
      try {
        await Auth.confirmSignUp(
          user.username,
          getInputValue(confirmationCodeField)
        );
        setConfirmed(true);
      } catch (error) {
        console.log('Error when confirming: ', error);
        setErrorMessage(String(error));
      }
    }
  };

  // assigns role to newly confirmed user
  useEffect(() => {
    let subscribed = true;

    if (user && confirmed) {
      assignUserToRole(user.username, user.role);
      subscribed && setUser(user);
      subscribed && setAuthenticated(true);
    }

    return () => {
      subscribed = false;
    };
  }, [confirmed]);

  // redirect to landing page
  useEffect(() => {
    if (authenticated) {
      switch (user?.role) {
        case 'guest':
          navigate(routes.guestLanding);
          break;

        case 'host':
          navigate(routes.hostLanding);
          break;
      }
    }
  }, [authenticated]);

  return (
    <Container className={className}>
      <Logo src="/bmg-branding/BMG-Script-RdHrt.svg" />
      <h1>Sign Up</h1>
      {!confirming ? (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <FormContainer onSubmit={handleSubmit}>
          <label>I am a...</label>
          <RadioField
            name={roleField}
            options={['Guest', 'Host']}
            defaultChecked="Guest"
          />
          <label>First Name</label>
          <InputField
            type="text"
            name={firstNameField}
            autoComplete="given-name"
          />
          <label>Last Name</label>
          <InputField
            type="text"
            name={lastNameField}
            autoComplete="family-name"
          />
          <label>Username</label>
          <InputField
            type="text"
            name={usernameField}
            autoComplete="username"
          />
          <label>Email</label>
          <InputField type="email" name={emailField} autoComplete="email" />
          <label>Password</label>
          <InputField
            type="password"
            name={passwordField}
            autoComplete="new-password"
          />
          <label>Confirm Password</label>
          <InputField
            type="password"
            name={confirmPasswordField}
            autoComplete="new-password"
          />
          <label>Phone</label>
          <InputField type="tel" name={phoneField} />
          <div />
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </FormContainer>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <ConfirmContainer onSubmit={handleConfirm}>
          <div>
            A confirmation code was sent to {user?.email ?? '[EMAIL]'}.
            <br />
            Enter the code here.
          </div>
          <InputField type="text" name={confirmationCodeField} />
          <SubmitButton type="submit">Confirm</SubmitButton>
        </ConfirmContainer>
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  height: 100%;
  ${theme.font.body}

  h1 {
    ${theme.font.displayXL}
    margin-bottom: 32px;
  }

  ${theme.screen.small} {
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 384px;
  margin-top: 32px;

  ${theme.screen.small} {
    width: 256px;
  }
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 32px;
  align-items: center;
`;

const ConfirmContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  row-gap: 32px;
`;

const SubmitButton = styled.button`
  border: none;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  ${theme.font.button};

  background-color: ${theme.color.blue};
  color: white;

  :hover {
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: smaller;
  margin-top: 16px;
`;

export default SignUp;
