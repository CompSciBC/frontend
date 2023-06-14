import { useContext, useState, useEffect } from 'react';
import { NavbarLink } from './page/Navbar';
import AppContext from '../context/AppContext';
import Header from './page/Header';
import Page from './page/Page';

interface AppProps {
  guestNavLinks: NavbarLink[];
  hostNavLinks: NavbarLink[];
  avatarLinks: NavbarLink[];
  noAuthNavLinks: NavbarLink[];
}

function App({
  guestNavLinks,
  hostNavLinks,
  avatarLinks,
  noAuthNavLinks
}: AppProps) {
  const { authenticated, user } = useContext(AppContext);
  const [navLinks, setNavLinks] = useState<NavbarLink[]>(noAuthNavLinks);
  useEffect(() => {
    if (authenticated) {
      if (user?.role === 'host') {
        setNavLinks(hostNavLinks);
      } else {
        setNavLinks(guestNavLinks);
      }
    } else {
      setNavLinks(noAuthNavLinks);
    }
  }, [authenticated]);

  return (
    <Page
      header={
        <Header
          logo="/bmg-branding/BMG-favicon-refined-white.svg"
          navLinks={navLinks}
          authenticated={authenticated}
          avatarLinks={avatarLinks}
          user={user?.firstName}
        />
      }
    />
  );
}

export default App;
