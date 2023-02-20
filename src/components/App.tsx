import { useContext } from 'react';
import { NavbarLink } from './page/Navbar';
import AppContext from '../context/AppContext';
import Header from './page/Header';
import Page from './page/Page';

interface AppProps {
  authNavLinks: NavbarLink[];
  noAuthNavLinks: NavbarLink[];
}

function App({ authNavLinks, noAuthNavLinks }: AppProps) {
  const { authenticated } = useContext(AppContext);
  return (
    <Page
      header={
        <Header
          logo="/bmg-branding/BMG-favicon-refined.svg"
          navLinks={authenticated ? authNavLinks : noAuthNavLinks}
        />
      }
    />
  );
}

export default App;
