/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

export interface AuthFormProps {
  className?: string;
  logo?: string;
  title?: string;
  form: JSX.Element;
  errorMessage?: string;
}

function AuthForm({
  className,
  logo,
  title,
  form,
  errorMessage
}: AuthFormProps) {
  return (
    <Container className={className}>
      {logo && <Logo src={logo} />}
      {title && <h1>{title}</h1>}
      {form}
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

export const TwoColumnFormContainer = styled.form`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-auto-rows: 1fr;
  gap: 8px 32px;
  align-items: center;
`;

export const OneColumnFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  row-gap: 32px;

  div {
    justify-content: center;

    input {
      text-align: center;
    }
  }
`;

export const SubmitButton = styled.button`
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

export const LinkButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
  width: fit-content;
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

export default AuthForm;
