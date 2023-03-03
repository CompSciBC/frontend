import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { routes } from '../../index';
import { theme } from '../../utils/styles';
import Navbar, { NavbarLink } from './Navbar';
import HamburgerMenu from './HamburgerMenu';

interface HeaderProps {
  className?: string;
  logo: string;
  navLinks?: NavbarLink[];
}

function Header({ className, logo, navLinks }: HeaderProps) {
  return (
    <NavParentFrame className={className}>
      <NavFrame>
        <IconHomeLinkFrame>
          <Logo to={routes.home}>
            <img src={logo} alt="logo" />
          </Logo>
          <StyledHamburgerMenu size={40} navLinks={navLinks} />
        </IconHomeLinkFrame>
        <NavLinksFrame>{navLinks && <Nav navLinks={navLinks} />}</NavLinksFrame>
      </NavFrame>
    </NavParentFrame>
  );
}

const NavParentFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;
  background-color: white;
  width: 100%;
  height: 60px;
  box-shadow: 1px 1px 5px #aaaaaa;
`;

const IconHomeLinkFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  overflow: hidden;
  flex: 1 61%;
  padding: 0 10px;
  order: 0;
  flex-grow: 0;
`;

const NavLinksFrame = styled.div`
  justify-content: flex-end;
  align-items: right;
  display: inline-block;
  text-align: center;
  color: rgb(0, 0, 0);
  text-decoration: none;
`;

const NavFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 60px;
  background: linear-gradient(
    180deg,
    rgba(250, 206, 214, 0.69) 1.56%,
    rgba(249, 250, 206, 0.523639) 17.19%,
    rgba(206, 250, 231, 0.69) 45.31%,
    rgba(206, 242, 250, 0.327031) 71.35%
  );
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 1;
`;

const Logo = styled(Link)`
  ${theme.screen.small} {
    display: none;
  }

  img {
    height: 40px;
  }
`;

const StyledHamburgerMenu = styled(HamburgerMenu)`
  display: none;

  ${theme.screen.small} {
    display: block;
  }
`;

const Nav = styled(Navbar)`
  ${theme.screen.small} {
    display: none;
  }
  ${theme.font.bodyLink}
  text-align: center;
  text-decoration-line: underline;
  text-transform: uppercase;
`;

export default Header;
