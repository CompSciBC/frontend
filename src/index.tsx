import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouteObject,
  RouterProvider
} from 'react-router-dom';
import Home from './components/home/Home';
import HostLanding from './components/home/HostLanding';
import GuestLanding from './components/home/GuestLanding';
import Dashboard from './components/dashboard/Dashboard';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import Weather from './components/dashboard/Weather';
import Restaurants from './components/dashboard/Restaurants';
import EventsAndPlaces from './components/dashboard/EventsAndPlaces';
import Map from './components/dashboard/Map';
import Header from './components/page/Header';
import Page from './components/page/Page';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Reservations from './components/reservations/Reservations';
import ReservationLoader from './components/reservations/ReservationLoader';
import Invite from './components/dashboard/invite/Invite';
import InviteLoader from './components/dashboard/invite/InviteLoader';

// Configure React project with Amplify resources
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

/**
 * Contains the base route urls of the various pages in the app
 */
export const routes = {
  home: '/',
  hostLanding: '/hostLanding',
  guestLanding: '/guestLanding',
  dashboard: '/dashboard',
  invite: '/invite',
  chat: '/chat',
  profile: '/profile',
  reservations: '/reservations',
  weather: '/weather',
  restaurants: '/restaurants',
  eventsAndPlaces: '/eventsandplaces',
  map: '/map'
};

const headerRoutes: RouteObject[] = [
  {
    path: routes.home,
    element: <Home logo="images/bmg-logo-black.png" />,
    handle: {
      name: 'Home'
    }
  },
  {
    path: routes.chat,
    element: <Chat />,
    handle: {
      name: 'Chat'
    }
  },
  {
    path: routes.profile,
    element: <Profile />,
    handle: {
      name: 'Profile'
    }
  }
];

const allRoutes: RouteObject[] = [
  ...headerRoutes,
  {
    path: routes.hostLanding,
    element: <HostLanding />,
    handle: {
      name: 'Host Landing'
    }
  },
  {
    path: routes.guestLanding,
    element: <GuestLanding />,
    handle: {
      name: 'Guest Landing'
    }
  },
  {
    path: routes.reservations,
    element: <Reservations />,
    handle: {
      name: 'Reservations'
    },
    loader: ReservationLoader
  },
  {
    path: routes.dashboard,
    element: <Dashboard />,
    handle: {
      name: 'Dashboard'
    }
  },
  {
    path: routes.invite,
    element: <Invite />,
    handle: {
      name: 'Invite'
    },
    loader: InviteLoader
  },
  {
    path: routes.weather,
    element: <Weather />,
    handle: {
      name: 'Weather'
    }
  },
  {
    path: routes.restaurants,
    element: <Restaurants />,
    handle: {
      name: 'Restaurants'
    }
  },
  {
    path: routes.eventsAndPlaces,
    element: <EventsAndPlaces />,
    handle: {
      name: 'Events and Places'
    }
  },
  {
    path: routes.map,
    element: <Map />,
    handle: {
      name: 'Map'
    }
  }
];

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <Page
          header={
            <Header logo="images/bmg-logo-white.png" navLinks={headerRoutes} />
          }
        />
      }
    >
      {allRoutes.map((route) =>
        <Route
          key={route.path}
          path={route.path}
          handle={route.handle?.name}
          loader={route.loader}
          element={route.element}
        />
      )}
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
