import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignUserToRole, getUserGroup } from '../home/AuthUtils';
import { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { routes } from '../..';
import styled from '@emotion/styled';

function Login() {
  const { user: authUser } = useAuthenticator();
  const navigate = useNavigate();
  const { role } = useParams();

  const { authenticated, setAuthenticated, setUser } = useContext(AppContext);

  useEffect(() => {
    let subscribed = true;

    subscribed && setAuthenticated(true);

    let userGroup = getUserGroup(authUser);
    if (typeof userGroup === 'boolean') {
      userGroup = [role];
      assignUserToRole(authUser.username, 'unassigned', role!);
    }

    subscribed &&
      authUser.username &&
      authUser.attributes &&
      setUser({
        userId: authUser.attributes.sub, // sub = userId assigned by cognito
        username: authUser.username,
        email: authUser.attributes.email,
        role: userGroup[0]
      });

    return () => {
      subscribed = false;
    };
  }, []);

  useEffect(() => {
    if (authenticated) {
      switch (role) {
        case 'guest':
          navigate(routes.guestLanding);
          break;

        case 'host':
          navigate(routes.hostLanding);
          break;

        case 'unassigned':
          break;
      }
    }
  }, [authenticated]);

  return (
    <Container>
      <Menu id="hello">
        <ul>
          <li>Guest</li>
          <li>Host</li>
        </ul>
      </Menu>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;
const Menu = styled.div`
  display: none;
  position: relative;
  left: 0;
  top: 12px;

  :hover {
    display: block;
  }
`;

export default withAuthenticator(Login);
