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
import About from './components/about/About';
import Guidebook from './components/dashboard/guidebook/Guidebook';
import Weather from './components/dashboard/Weather';
import Restaurants from './components/dashboard/Restaurants';
import EventsAndPlaces from './components/dashboard/EventsAndPlaces';
import Map from './components/dashboard/Map';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Reservations from './components/reservations/Reservations';
import ReservationLoader from './components/reservations/ReservationLoader';
import GuidebookLoader from './components/dashboard/guidebook/GuidebookLoader';
import Invite from './components/dashboard/invite/Invite';
import InviteLoader from './components/dashboard/invite/InviteLoader';
import App from './components/App';
import { AppContextProvider } from './context/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Logout from './components/auth/Logout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import DashboardLoader from './components/dashboard/DashboardLoader';

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
  login: '/login',
  logout: '/logout',
  signUp: '/signUp',
  dashboard: '/dashboard',
  about: '/about',
  invite: '/invite',
  chat: '/chat',
  profile: '/profile',
  guidebook: '/guidebook',
  reservations: '/reservations',
  weather: '/weather',
  restaurants: '/restaurants',
  eventsAndPlaces: '/eventsandplaces',
  map: '/map'
};

/**
 * Replaces the path variables in a route with the given parameters
 *
 * @param route A route containing at least one path variable (e.g., /login/:role, where :role is the variable)
 * @param params A variable number of parameters
 * @returns The given route with path variables replaced
 */
export const parameterizedRoute = (route: string, ...params: string[]) => {
  let path = route;
  const regex = /:\w+/g;
  const variables = Array.from(route.matchAll(regex), (match) => match[0]);
  params.forEach((param, i) => (path = path.replace(variables[i], param)));
  return path;
};

const unauthenticatedHeaderRoutes: RouteObject[] = [
  {
    path: routes.about,
    element: <About />,
    handle: {
      name: 'About'
    }
  },
  {
    path: routes.login,
    element: <Login />,
    handle: {
      name: 'Login'
    }
  }
];

const authenticatedHeaderRoutes: RouteObject[] = [
  {
    path: routes.reservations,
    element: <ProtectedRoute route={<Reservations />} />,
    handle: {
      name: 'Reservations'
    },
    loader: ReservationLoader
  },
  {
    path: routes.chat,
    element: <ProtectedRoute route={<Chat />} />,
    handle: {
      name: 'Chat'
    }
  },
  {
    path: routes.profile,
    element: <ProtectedRoute route={<Profile />} />,
    handle: {
      name: 'Profile'
    }
  },
  {
    path: routes.logout,
    element: <ProtectedRoute route={<Logout />} />,
    handle: {
      name: 'Logout'
    }
  }
];

const allRoutes: RouteObject[] = [
  ...unauthenticatedHeaderRoutes,
  ...authenticatedHeaderRoutes,
  {
    path: routes.signUp,
    element: <SignUp />,
    handle: {
      name: 'Sign Up'
    }
  },
  {
    path: routes.home,
    element: <Home logo="bmg-branding/BMG-Script-RdHrt.svg" />,
    handle: {
      name: 'Home'
    }
  },
  {
    path: routes.hostLanding,
    element: <ProtectedRoute route={<HostLanding />} />,
    handle: {
      name: 'Host Landing'
    }
  },
  {
    path: routes.guestLanding,
    element: <ProtectedRoute route={<GuestLanding />} />,
    handle: {
      name: 'Guest Landing'
    }
  },
  {
    path: routes.dashboard,
    element: <ProtectedRoute route={<Dashboard />} />,
    handle: {
      name: 'Dashboard'
    },
    loader: DashboardLoader
  },
  {
    path: routes.invite,
    element: <ProtectedRoute route={<Invite />} />,
    handle: {
      name: 'Invite'
    },
    loader: InviteLoader
  },
  {
    path: routes.weather,
    element: <ProtectedRoute route={<Weather />} />,
    handle: {
      name: 'Weather'
    }
  },
  {
    path: routes.restaurants,
    element: <ProtectedRoute route={<Restaurants />} />,
    handle: {
      name: 'Restaurants'
    }
  },
  {
    path: routes.eventsAndPlaces,
    element: <ProtectedRoute route={<EventsAndPlaces />} />,
    handle: {
      name: 'Events and Places'
    }
  },
  {
    path: routes.map,
    element: <ProtectedRoute route={<Map />} />,
    handle: {
      name: 'Map'
    }
  },
  {
    path: routes.guidebook,
    element: <ProtectedRoute route={<Guidebook />} />,
    handle: {
      name: 'Guidebook'
    },
    loader: GuidebookLoader
  }
];

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <AppContextProvider>
          <App
            authenticatedHeaderRoutes={authenticatedHeaderRoutes}
            unauthenticatedHeaderRoutes={unauthenticatedHeaderRoutes}
          />
        </AppContextProvider>
      }
    >
      {allRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          handle={route.handle?.name}
          loader={route.loader}
          element={route.element}
        />
      ))}
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
