import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export interface NavbarLink {
  name: string;
  path: string;
}

interface NavBarProps {
  className?: string;
  navLinks: NavbarLink[];
}

function Navbar({ className, navLinks }: NavBarProps) {
  return (
    <Container className={className}>
      {navLinks.map((link) => (
        <NavLink key={link.name} to={link.path}>
          {link.name}
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
