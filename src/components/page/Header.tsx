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
    <AppBar
      position="static"
      style={{
        background: 'linear-gradient(to right, #023059, #50A4AB, #FBC70D)',
        fontFamily: 'Helvetica'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Logo to={routes.home}>
              <img src={logo} alt="logo" />
            </Logo>
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
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'roboto',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'white',
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
                sx={{ my: 2, color: 'white', display: 'block' }}
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

const Logo = styled(Link)`
  /* ${theme.screen.small} {
    display: none;
  } */

  img {
    height: 40px;
  }
`;

export default Header;
