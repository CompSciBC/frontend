import styled from '@emotion/styled';
import { Link, RouteObject } from 'react-router-dom';
import { routes } from '../../index';
import { theme } from '../../utils/styles';
// import HamburgerMenu from './HamburgerMenu';
import Navbar from './Navbar';

interface HeaderProps {
  className?: string;
  logo?: string;
  menu?: string;
  navLinks?: RouteObject[];
}

function Header({ className, logo, menu, navLinks }: HeaderProps) {
  return (<div className={className}>
    <NavParentFrame>
      <NavFrame ><IconHomeLinkFrame>
        <Logo to={routes.home}>
          <img src={logo} alt="logo" />
        </Logo>
      </IconHomeLinkFrame>
      <Menu2 ><img src={menu} alt="Hamb. Menu" /></Menu2>
      <NavLinksFrame>{navLinks && <Nav navLinks={navLinks} />}
      </NavLinksFrame>
      </NavFrame>
    </NavParentFrame>
  </div>
  );
}

const NavParentFrame = styled.div`
  /* NAVBAR */


/* Auto layout */

/* display: flex; */
/* flex-direction: row; */
/* align-items: flex-start; */
/* justify-content: center; */
/* padding: 10px 17px; */
/* gap: 10px; */
overflow: hidden;
background-color: white;

/* position: absolute; */
width: 100%;
height: 66px;
/* box-shadow: 2px 2px; */
box-shadow: 1px 1px 5px #aaaaaa;
/* left: 0px; */

/* top: 80px; */
`;

const IconHomeLinkFrame = styled.div`
  /* Frame 11 */
/* Auto layout */
/* display: flex;
flex-direction: row;
align-items: flex-start; */
/* padding: 0px;
gap: 10px;
overflow: hidden; */

/* width: 27.73px;
height: 39.1px; */


/* Inside auto layout */

/* flex:1 1 200px; */
flex: 1 66%;
padding: .4%;

order: 0;
flex-grow: 0;
${theme.screen.small} {
  display: none;
  }
`;

const NavLinksFrame = styled.div`
/* display: flex; */
justify-content: flex-end;
align-items: right;
display: inline-block;
text-align: center;
/* padding: 14px; */
color: rgb(0, 0, 0);
text-decoration: none;
`;

const NavFrame = styled.div`
  /* Frame 10 */
/* Auto layout */

display: flex;
flex-direction: row;
/* justify-content: flex-end; */
align-items: center;

position: relative;
overflow: hidden;
height: 70px;

background: linear-gradient(180deg, rgba(250, 206, 214, 0.69) 1.56%, rgba(249, 250, 206, 0.523639) 17.19%, rgba(206, 250, 231, 0.69) 45.31%, rgba(206, 242, 250, 0.327031) 71.35%);
/* border-radius: 17px; */

/* Inside auto layout */

flex: none;
order: 1;
align-self: stretch;
flex-grow: 1;
`;


// const Container = styled.div`
//   /* position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 64px;
//   column-gap: 20px;
//   padding: 0 20px;
//   background-color: #47a347; */


  
// `;

const Logo = styled(Link)`
  /* position: absolute;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 4px; */
  

  img {
    height: 55px;
    /* padding: 7px; */
  }

  /* :hover {
    cursor: pointer;
    background-color: #4fb94f;
  }  */

  /* ${theme.screen.small} {
  display: none;
  } */
`;

// const Menu = styled(HamburgerMenu)`
//   display: none;

//   ${theme.screen.small} {
//     display: block;
//     position: absolute;
//     left: 20px;
//   }
// `;

const Menu2 = styled.div`
  /* display: none; */

  /* img {
    height: 55px;
    padding: 4px;
  } */

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
  ${theme.font.bodyLink} {
    display: none;
    color: #000000;
  }
  text-align: center;
  text-decoration-line: underline;
  text-transform: uppercase;
`;

export default Header;
