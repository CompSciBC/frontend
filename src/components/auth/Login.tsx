import styled from '@emotion/styled';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';
import InputField, { getInputValue } from '../forms/InputField';
import RadioField, { getRadioValue } from '../forms/RadioField';
import {
  assignUserToRole,
  getUserGroup,
  redirectAfterLogin
} from './AuthUtils';
import { UserRole } from '../../utils/dtos';
import AuthForm, {
  LinkButton,
  SubmitButton,
  TwoColumnFormContainer
} from './AuthForm';

export interface LoginProps {
  className?: string;
}

function Login({ className }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, setAuthenticated, setUser } = useContext(AppContext);

  // the role selected via the radio button
  const [role, setRole] = useState<UserRole>();
  const [errorMessage, setErrorMessage] = useState('');

  const roleField = 'role';
  const usernameField = 'username';
  const passwordField = 'password';

  // handles login form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form submission default behavior

    // user object returned by amplify
    let authUser: CognitoUser | undefined;

    try {
      authUser = await Auth.signIn(
        getInputValue(usernameField),
        getInputValue(passwordField)
      );
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('The username or password is incorrect.');
    }

    if (authUser) {
      const selectedRole = getRadioValue(roleField).toLowerCase() as UserRole;
      setRole(selectedRole);

      let userGroup = getUserGroup(authUser);
      if (typeof userGroup === 'boolean') {
        userGroup = selectedRole;
        assignUserToRole(authUser.getUsername(), userGroup);
      }

      const userAttributes = await Auth.userAttributes(authUser);

      const getAttribute = (name: string) =>
        userAttributes.find((a) => a.getName() === name)?.getValue() ?? '';

      setUser({
        userId: getAttribute('sub'), // sub = userId assigned by cognito
        username: authUser.getUsername(),
        firstName: getAttribute('given_name'),
        lastName: getAttribute('family_name'),
        email: getAttribute('email'),
        phone: getAttribute('phone_number'),
        role: userGroup
      });
      setAuthenticated(true);
    }
  };

  // redirect after successful login
  useEffect(() => {
    if (authenticated) redirectAfterLogin(location, navigate, role);
  }, [authenticated, location]);

  // navigates to the given path and stores the current path for future redirect
  // if the current path is not the literal login path
  const navigateTo = (path: string) => {
    const redirect =
      location.pathname !== routes.login ? location.pathname : undefined;
    navigate(path, { state: redirect });
  };

  return (
    <AuthForm
      className={className}
      logo="/bmg-branding/BMG-Script-RdHrt.svg"
      title="Login"
      errorMessage={errorMessage}
      form={
        <>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <StyledTwoColumnFormContainer onSubmit={handleSubmit}>
            <div />
            <RadioField
              name={roleField}
              options={['Guest', 'Host']}
              defaultChecked="Guest"
            />
            <label>Username</label>
            <InputField
              type="text"
              name={usernameField}
              autoComplete="username"
            />
            <label>Password</label>
            <InputField
              type="password"
              name={passwordField}
              autoComplete="current-password"
            />
            <div />
            <SubmitButton type="submit">Login</SubmitButton>
            <LinkButton type="button" onClick={() => navigateTo(routes.signUp)}>
              Sign Up
            </LinkButton>
            <LinkButton
              type="button"
              onClick={() => navigateTo(routes.forgotPassword)}
            >
              Forgot Username / Password
            </LinkButton>
          </StyledTwoColumnFormContainer>
        </>
      }
    />
  );
}

const StyledTwoColumnFormContainer = styled(TwoColumnFormContainer)`
  grid-template-rows: auto repeat(4, 1fr);
`;

export default Login;
