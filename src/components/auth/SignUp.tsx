/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { Auth } from '@aws-amplify/auth';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import InputField, {
  getInputValue,
  getTelephoneValue
} from '../forms/InputField';
import RadioField, { getRadioValue } from '../forms/RadioField';
import { assignUserToRole, redirectAfterLogin } from './AuthUtils';
import { UserRole } from '../../utils/dtos';
import AuthForm, {
  OneColumnFormContainer,
  SubmitButton,
  TwoColumnFormContainer
} from './AuthForm';
import { server } from '../../index';

export interface SignUpProps {
  className?: string;
}

function SignUp({ className }: SignUpProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, setAuthenticated, user, setUser } =
    useContext(AppContext);

  // displays the confirmation code form when set to true
  const [confirming, setConfirming] = useState(false);
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
      // Check that email does not exist
      const response = await fetch(
        `${server}/api/users?index=email&id=${enteredEmail}`
      );
      const body = await response.json();
      if (body.data.length !== 0) {
        setErrorMessage('This email is already taken.');
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
        } catch (error) {
          setErrorMessage(String(error));
        }

        if (signUpResult) {
          setUser({
            userId: signUpResult.userSub,
            firstName: enteredFirstName,
            lastName: enteredLastName,
            username: enteredUsername,
            email: enteredEmail,
            phone: enteredPhone,
            role: enteredRole as UserRole
          });
          setConfirming(true);
        }
      }
    }
  };

  // handles confirmation code form submission
  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    if (user) {
      try {
        await Auth.confirmSignUp(
          user.username,
          getInputValue(confirmationCodeField)
        );
        setAuthenticated(true);
      } catch (error) {
        setErrorMessage(String(error));
      }
    }
  };

  useEffect(() => {
    if (user && authenticated) {
      // assign role to newly confirmed user
      assignUserToRole(user.username, user.role);
      redirectAfterLogin(location, navigate, user.role);
    }
  }, [authenticated, location]);

  return (
    <AuthForm
      className={className}
      logo="/bmg-branding/BMG-Script-RdHrt.svg"
      title="Sign Up"
      errorMessage={errorMessage}
      form={
        <>
          {!confirming ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <StyledTwoColumnFormContainer onSubmit={handleSubmit}>
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
            </StyledTwoColumnFormContainer>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <OneColumnFormContainer onSubmit={handleConfirm}>
              <div>
                A confirmation code was sent to {user?.email ?? '[EMAIL]'}.
                <br />
                Enter the code here.
              </div>
              <InputField type="text" name={confirmationCodeField} />
              <SubmitButton type="submit">Confirm</SubmitButton>
            </OneColumnFormContainer>
          )}
        </>
      }
    />
  );
}

const StyledTwoColumnFormContainer = styled(TwoColumnFormContainer)`
  grid-template-rows: auto repeat(8, 1fr);
`;

export default SignUp;
