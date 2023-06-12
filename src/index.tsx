import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { NavbarLink } from './components/page/Navbar';
import App from './components/App';
import ErrorPage from './components/ErrorPage';
import Home from './components/home/Home';
import About from './components/about/About';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Logout from './components/auth/Logout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HostLanding from './components/hostdashboard/HostLanding';
import Profile from './components/profile/Profile';
import Reservations from './components/reservations/Reservations';
import AddReservation from './components/reservations/AddReservation';
import Dashboard from './components/dashboard/Dashboard';
import Guidebook from './components/dashboard/guidebook/Guidebook';
import GuidebookEditor from './components/dashboard/guidebook/guidebookEditor/GuidebookEditor';
import Invite from './components/dashboard/invite/Invite';
import Chat from './components/chat/Chat';
import Weather from './components/dashboard/weather/Weather';
import Restaurants from './components/dashboard/restaurants/Restaurants';
import Places from './components/dashboard/places/Places';
import Map from './components/dashboard/map/Map';
import SurveyView from './components/dashboard/review/SurveyComponent';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Inbox from './components/chat/Inbox';
import HostReviewsDashboard from './components/hostdashboard/HostReviewsDashboard';
import { ManageListings } from './components/hostdashboard/ManageListings';
// import AppTestMode from './components/AppTestMode';

// Configure React project with Amplify resources
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

/**
 * Configure Backend API endpoint
 */
let endpoint;
if (process.env.REACT_APP_ENV === 'prod') {
  endpoint = 'https://bemyguestapp.link:8080';
} else {
  endpoint = 'http://localhost:8080';
}
export const server = endpoint;

/**
 * Contains the base route urls of the various pages in the app
 */
export const routes = {
  home: '/',
  error: '/error',
  about: '/about',
  login: '/login',
  signUp: '/signUp',
  forgotPassword: '/forgotPassword',
  logout: '/logout',
  hostLanding: '/hostLanding',
  profile: '/profile',
  reservations: '/reservations',
  addReservation: '/reservations/add/:resId',
  dashboard: '/reservations/:resId/dashboard',
  guidebook: '/reservations/:resId/guidebook',
  guidebookEdit: '/manageListings/:propId/guidebook/edit',
  invite: '/reservations/:resId/invite',
  chat: '/reservations/:resId/chat',
  inbox: '/inbox',
  weather: '/reservations/:resId/weather',
  restaurants: '/reservations/:resId/restaurants',
  places: '/reservations/:resId/places',
  map: '/reservations/:resId/map',
  review: '/reservations/:resId/:guestId/review',
  hostReviews: '/hostReviewsDashboard',
  manageListings: '/manageListings'
};

/**
 * Replaces the path variables in a route with the given parameters
 *
 * @param route A route containing at least one path variable (e.g., /login/:role, where :role is the variable)
 * @param params A variable number of parameters
 * @returns The given route with path variables replaced
 */
export const paramRoute = (
  route: string,
  ...params: Array<string | undefined>
) => {
  let path = route;
  const regex = /:\w+/g;
  const variables = Array.from(route.matchAll(regex), (match) => match[0]);
  params.forEach(
    (param, i) => (path = path.replace(variables[i], param ?? ''))
  );
  return path;
};

const noAuthNavLinks: NavbarLink[] = [
  {
    name: 'About',
    path: routes.about
  },
  {
    name: 'Login',
    path: routes.login
  }
];

const guestNavLinks: NavbarLink[] = [
  {
    name: 'Reservations',
    path: routes.reservations
  },
  {
    name: 'Inbox',
    path: routes.inbox
  },
  {
    name: 'About',
    path: routes.about
  }
];

const hostNavLinks: NavbarLink[] = [
  {
    name: 'Dashboard',
    path: routes.hostLanding
  },
  {
    name: 'Manage Listings',
    path: routes.manageListings
  },
  {
    name: 'Inbox',
    path: routes.inbox
  },
  {
    name: 'Reviews',
    path: routes.hostReviews
  },
  {
    name: 'About',
    path: routes.about
  }
];

const avatarLinks: NavbarLink[] = [
  {
    name: 'Profile',
    path: routes.profile
  },
  {
    name: 'Logout',
    path: routes.logout
  }
];

const router = createBrowserRouter([
  {
    element: (
      <AppContextProvider>
        <App
          noAuthNavLinks={noAuthNavLinks}
          guestNavLinks={guestNavLinks}
          hostNavLinks={hostNavLinks}
          avatarLinks={avatarLinks}
        />
        {/* <AppTestMode /> */}
      </AppContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: routes.error,
        element: <ErrorPage />
      },
      {
        path: routes.home,
        element: <Home logo="/bmg-branding/BMG-Script-RdHrt.svg" />,
        index: true
      },
      {
        path: routes.about,
        element: <About />
      },
      {
        path: routes.login,
        element: <Login />
      },
      {
        path: routes.signUp,
        element: <SignUp />
      },
      {
        path: routes.forgotPassword,
        element: <ForgotPassword />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routes.logout,
            element: <Logout />
          },
          {
            path: routes.hostLanding,
            element: <HostLanding />
          },
          {
            path: routes.profile,
            element: <Profile />
          },
          {
            path: routes.reservations,
            element: <Reservations />
          },
          {
            path: routes.addReservation,
            element: <AddReservation />
          },
          {
            path: routes.dashboard,
            element: <Dashboard />
          },
          {
            path: routes.guidebook,
            element: <Guidebook />
          },
          {
            path: routes.guidebookEdit,
            element: <GuidebookEditor />
          },
          {
            path: routes.invite,
            element: <Invite />
          },
          {
            path: routes.chat,
            element: <Chat />
          },
          {
            path: routes.inbox,
            element: <Inbox />
          },
          {
            path: routes.weather,
            element: <Weather />
          },
          {
            path: routes.restaurants,
            element: <Restaurants />
          },
          {
            path: routes.places,
            element: <Places />
          },
          {
            path: routes.map,
            element: <Map />
          },
          {
            path: routes.review,
            element: <SurveyView />
          },
          {
            path: routes.hostReviews,
            element: <HostReviewsDashboard />
          },
          {
            path: routes.manageListings,
            element: <ManageListings />
          }
        ]
      }
    ]
  }
]);

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
