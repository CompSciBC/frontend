import styled from '@emotion/styled';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../..';
import AppContext from '../../context/AppContext';
import { theme } from '../../utils/styles';
import InputField, { getInputValue } from '../forms/InputField';
import RadioField, { getRadioValue } from '../forms/RadioField';
import { assignUserToRole, getUserGroup } from './AuthUtils';
import { UserRole } from '../../utils/dtos';

export interface LoginProps {
  className?: string;
}

function Login({ className }: LoginProps) {
  const navigate = useNavigate();
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
      console.log('Error signing in: ', error);
      setErrorMessage('The username or password is incorrect.');
    }

    if (authUser) {
      setRole(getRadioValue(roleField).toLowerCase() as UserRole);

      let userGroup = getUserGroup(authUser);
      if (typeof userGroup === 'boolean') {
        userGroup = [role];
        assignUserToRole(authUser.getUsername(), role);
      }

      const userAttributes = await Auth.userAttributes(authUser);

      const getAttribute = (name: string) =>
        userAttributes.find((a) => a.getName() === name)?.getValue() ?? '';

      const userId = getAttribute('sub'); // sub = userId assigned by cognito
      const firstName = getAttribute('given_name');
      const lastName = getAttribute('family_name');
      const email = getAttribute('email');
      const phone = getAttribute('phone_number');
      const username = authUser.getUsername();

      if (userId) {
        setUser({
          userId,
          username,
          firstName,
          lastName,
          email,
          phone,
          role: userGroup[0]
        });
        setAuthenticated(true);
      }
    }
  };

  // redirect to landing page
  useEffect(() => {
    if (authenticated) {
      // the role selected by the radio button
      switch (role) {
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
      <h1>Login</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <FormContainer onSubmit={handleSubmit}>
        <div />
        <RadioField
          name={roleField}
          options={['Guest', 'Host']}
          defaultChecked="Guest"
        />
        <label>Username</label>
        <InputField type="text" name={usernameField} autoComplete="username" />
        <label>Password</label>
        <InputField
          type="password"
          name={passwordField}
          autoComplete="current-password"
        />
        <div />
        <SubmitButton type="submit">Login</SubmitButton>
        <StyledLink to={routes.signUp}>Sign Up</StyledLink>
        <StyledLink to="/forgot">Forgot Username / Password</StyledLink>
      </FormContainer>
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
  width: 256px;
  margin-top: 32px;
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: auto repeat(4, 1fr);
  gap: 8px 32px;
  align-items: center;
`;

const SubmitButton = styled.button`
  height: 100%;
  border: none;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  ${theme.font.button};

  background-color: ${theme.color.blue};
  color: white;

  :hover {
    cursor: pointer;
  }
`;

const StyledLink = styled(Link)`
  ${theme.font.bodyLink}
  font-size: smaller;
  color: ${theme.color.blue};
  text-decoration: none;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: smaller;
  margin-top: 16px;
`;

export default Login;
