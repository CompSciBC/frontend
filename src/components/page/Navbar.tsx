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
  padding: 30px;
  font-weight: bold;
  color: #000000;
  :hover {
    color: #54c2ee;
  }
`;
//  #a1d7ec;

export default Navbar;
