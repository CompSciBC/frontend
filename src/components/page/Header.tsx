import styled from '@emotion/styled';
import { Link, RouteObject } from 'react-router-dom';
import { theme } from '../../utils/styles';
import HamburgerMenu from './HamburgerMenu';
import Navbar from './Navbar';

interface HeaderProps {
  className?: string;
  logo?: string;
  navLinks?: RouteObject[];
}

function Header({ className, logo, navLinks }: HeaderProps) {
  return (
    <Container className={className}>
      {logo && (
        <Logo to="/">
          <img src={logo} alt="logo" />
        </Logo>
      )}
      <Menu />
      {navLinks && <Nav navLinks={navLinks} />}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  column-gap: 20px;
  padding: 0 20px;
  background-color: #47a347;
`;

const Logo = styled(Link)`
  position: absolute;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 4px;

  img {
    height: 75%;
    padding: 4px;
  }

  :hover {
    cursor: pointer;
    background-color: #4fb94f;
  }

  ${theme.screen.small} {
    position: static;
  }
`;

const Menu = styled(HamburgerMenu)`
  display: none;

  ${theme.screen.small} {
    display: block;
    position: absolute;
    left: 20px;
  }
`;

const Nav = styled(Navbar)`
  ${theme.screen.small} {
    display: none;
  }
`;

export default Header;
