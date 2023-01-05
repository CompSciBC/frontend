import styled from '@emotion/styled';
import { Link, RouteObject } from 'react-router-dom';

interface NavBarProps {
  className?: string;
  navLinks: RouteObject[];
}

function Navbar({ className, navLinks }: NavBarProps) {
  return (
    <Container className={className}>
      {navLinks.map((link) => (
        // TODO: Replace the ! with better solution that handles undefined path
        <NavLink key={link.handle?.name} to={link.path!}>
          {link.handle?.name}
        </NavLink>
      ))}
    </Container>
  );
}

const Container = styled.nav`
  display: flex;
`;

const NavLink = styled(Link)`
  padding: 8px;
  text-decoration: none;
  font-weight: bold;
  color: white;
  border-radius: 4px;

  :hover {
    background-color: #4fb94f;
  }
`;

export default Navbar;
