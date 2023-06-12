/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../index';
import { theme } from '../../utils/styles';
import Navbar, { NavbarLink } from './Navbar';
import HamburgerMenu from './HamburgerMenu';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

interface HeaderProps {
  className?: string;
  logo: string;
  navLinks?: NavbarLink[];
  authenticated: boolean;
  avatarLinks?: NavbarLink[];
  user?: string;
}

function Header({
  className,
  logo,
  navLinks,
  authenticated,
  avatarLinks,
  user
}: HeaderProps) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    // <NavParentFrame className={className}>
    //   <NavFrame>
    //     <IconHomeLinkFrame>
    //       <Logo to={routes.home}>
    //         <img src={logo} alt="logo" />
    //       </Logo>
    //       <StyledHamburgerMenu size={40} navLinks={navLinks} />
    //     </IconHomeLinkFrame>
    //     <NavLinksFrame>{navLinks && <Nav navLinks={navLinks} />}</NavLinksFrame>
    //   </NavFrame>
    // </NavParentFrame>
    <AppBar
      position="static"
      style={{ background: 'linear-gradient(to right, #F4F269, #5CB270)' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={'/'}>
          <Logo to={routes.home}>
            <img src={logo} alt="logo" />
          </Logo>
          </Link>
          {/* <Typography
            // variant="h5"
            noWrap
            component="a"
            textAlign="center"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: "Roboto",
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'black',
              textDecoration: 'none'
            }}
          >
            BeMyGuest
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {navLinks!.map((link) => (
                <MenuItem
                  key={link.name}
                  onClick={() => navigateToPage(link.path)}
                >
                  <Typography textAlign="center" sx={{ color: 'black' }}>
                    {link.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <Typography
            // variant="h5"
            noWrap
            component="a"
            textAlign="center"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Arial',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'black',
              textDecoration: 'none'
            }}
          >
            BeMyGuest
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navLinks!.map((link) => (
              <Button
                key={link.name}
                onClick={() => navigateToPage(link.path)}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {link.name}
              </Button>
            ))}
          </Box>
          {authenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {avatarLinks!.map((link) => (
                  <MenuItem
                    key={link.name}
                    onClick={() => navigateToPage(link.path)}
                  >
                    <Typography textAlign="center">{link.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
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
  /* ${theme.screen.small} {
    display: none;
  } */

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
