import { useContext } from 'react';
import { RouteObject } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Header from './page/Header';
import Page from './page/Page';

interface AppProps {
  authenticatedHeaderRoutes: RouteObject[];
  unauthenticatedHeaderRoutes: RouteObject[];
}

function App({
  authenticatedHeaderRoutes,
  unauthenticatedHeaderRoutes
}: AppProps) {
  const { authenticated } = useContext(AppContext);
  return (
    <Page
      header={
        <Header
          logo="bmg-branding/BMG-favicon-refined.svg"
          navLinks={
            authenticated
              ? authenticatedHeaderRoutes
              : unauthenticatedHeaderRoutes
          }
        />
      }
    />
  );
}

export default App;
