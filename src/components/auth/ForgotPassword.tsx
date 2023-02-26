import { Auth } from 'aws-amplify';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../..';
import InputField, { getInputValue } from '../forms/InputField';
import AuthForm, { SubmitButton, TwoColumnFormContainer } from './AuthForm';

export interface ForgotPasswordProps {
  className?: string;
}

function ForgotPassword({ className }: ForgotPasswordProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [resetting, setResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');

  const usernameField = 'username';
  const verificationField = 'verification';
  const newPasswordField = 'newPassword';
  const confirmPasswordField = 'confirmPassword';

  const requestPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    const username = getInputValue(usernameField);

    if (username) {
      setErrorMessage('');
      setEnteredUsername(username);

      try {
        await Auth.forgotPassword(username);
        setResetting(true);
      } catch (error) {
        setErrorMessage(String(error));
      }
    } else {
      setErrorMessage('Please enter your username to reset the password.');
    }
  };

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    const verificationCode = getInputValue(verificationField);
    const newPassword = getInputValue(newPasswordField);
    const confirmPassword = getInputValue(confirmPasswordField);

    if (!(verificationCode && newPassword)) {
      setErrorMessage('Please complete all fields.');
    } else if (newPassword !== confirmPassword) {
      setErrorMessage('Password fields do not match.');
    } else {
      try {
        await Auth.forgotPasswordSubmit(
          enteredUsername,
          verificationCode,
          newPassword
        );
        setErrorMessage('');

        navigate(location.state ?? routes.login, { replace: true });
      } catch (error) {
        setErrorMessage(String(error));
      }
    }
  };

  return (
    <AuthForm
      className={className}
      logo="/bmg-branding/BMG-Script-RdHrt.svg"
      title="Reset Password"
      errorMessage={errorMessage}
      form={
        <>
          {!resetting ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <TwoColumnFormContainer onSubmit={requestPasswordReset}>
              <label>Username</label>
              <InputField
                type="text"
                name={usernameField}
                autoComplete="username"
              />
              <div />
              <SubmitButton type="submit">Reset Password</SubmitButton>
            </TwoColumnFormContainer>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <TwoColumnFormContainer onSubmit={resetPassword}>
              <label>Verification Code</label>
              <InputField type="text" name={verificationField} />
              <label>New Password</label>
              <InputField
                type="password"
                name={newPasswordField}
                autoComplete="new-password"
              />
              <label>Confirm Password</label>
              <InputField
                type="password"
                name={confirmPasswordField}
                autoComplete="new-password"
              />
              <div />
              <SubmitButton type="submit">Reset Password</SubmitButton>
            </TwoColumnFormContainer>
          )}
        </>
      }
    />
  );
}

export default ForgotPassword;
