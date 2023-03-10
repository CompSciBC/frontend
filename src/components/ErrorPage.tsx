import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { theme } from '../utils/styles';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <h2>Oops!</h2>
      <h1>404</h1>
      <button type="button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: ${theme.color.white};
  text-shadow: 4px 4px 2px rgba(0, 0, 0, 0.25);
  color: ${theme.color.red};

  h1 {
    font-size: 160px;
  }

  h2 {
    font-size: 64px;
  }

  button {
    margin-top: 32px;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    box-shadow: 4px 4px 2px rgba(0, 0, 0, 0.25);
    background-color: ${theme.color.red};
    font-size: 32px;
    font-weight: bold;
    color: white;

    :hover {
      filter: brightness(0.9) contrast(1.2);
    }
  }
`;

export default ErrorPage;
