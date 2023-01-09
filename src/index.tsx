import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from 'react-router-dom';
import Home from './components/home/Home';
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

const headerLinks: RouteObject[] = [
  {
    path: '/',
    element: <Home logo="images/bmg-logo-black.png" />,
    handle: {
      name: 'Home'
    }
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    handle: {
      name: 'Dashboard'
    }
  },
  {
    path: '/chat',
    element: <Chat />,
    handle: {
      name: 'Chat'
    }
  },
  {
    path: '/profile',
    element: <Profile />,
    handle: {
      name: 'Profile'
    }
  }
];

const routes: RouteObject[] = [
  ...headerLinks,
  {
    path: '/reservations',
    element: <Reservations />,
    handle: {
      name: 'Reservations'
    }
  },
  {
    path: '/weather',
    element: <Weather />,
    handle: {
      name: 'Weather'
    }
  },
  {
    path: '/restaurants',
    element: <Restaurants />,
    handle: {
      name: 'Restaurants'
    }
  },
  {
    path: '/eventsandplaces',
    element: <EventsAndPlaces />,
    handle: {
      name: 'Events and Places'
    }
  },
  {
    path: '/map',
    element: <Map />,
    handle: {
      name: 'Map'
    }
  }
];

const router = createBrowserRouter(
  routes.map((route) => {
    return {
      path: route.path,
      handle: route.handle?.name,
      element: (
        <Page
          header={
            <Header logo="images/bmg-logo-white.png" navLinks={headerLinks} />
          }
          content={route.element}
        />
      )
    };
  })
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
