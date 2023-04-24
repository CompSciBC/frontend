import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Property, Reservation, ReservationDetail, User } from '../utils/dtos';
import { routes, server } from '../index';

export interface AppContextType {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  reservationDetail: ReservationDetail | null;
  setReservationDetail: React.Dispatch<
    React.SetStateAction<ReservationDetail | null>
  >;
  refreshReservationDetail: Function;
  clearAppContext: Function;
  testing: boolean;
  setTesting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Context for app-wide global state
 */
const AppContext = createContext<AppContextType>({
  authenticated: false,
  setAuthenticated: () => {},
  user: null,
  setUser: () => {},
  reservationDetail: null,
  setReservationDetail: () => {},
  refreshReservationDetail: () => {},
  clearAppContext: () => {},
  testing: false,
  setTesting: () => {}
});

export default AppContext;

/**
 * Context provider for all global state
 *
 * @param props Children
 * @returns A context provider
 */
export function AppContextProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // local storage key names
  const authenticatedKey = 'authenticated';
  const userKey = 'user';
  const reservationDetailKey = 'reservationDetail';

  // initialize state variables
  const [authenticated, setAuthenticated] = useState<boolean>(
    localStorage.getItem(authenticatedKey) === 'true'
  );

  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(userKey) ?? 'null') as User
  );

  const [reservationDetail, setReservationDetail] =
    useState<ReservationDetail | null>(
      JSON.parse(
        localStorage.getItem(reservationDetailKey) ?? 'null'
      ) as ReservationDetail
    );

  // persist state in local storage whenever updated
  useEffect(() => {
    localStorage.setItem(authenticatedKey, String(authenticated));
  }, [authenticated]);

  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      reservationDetailKey,
      JSON.stringify(reservationDetail)
    );
  }, [reservationDetail]);

  const [manualRefreshReservation, setManualRefreshReservation] =
    useState(false);
  const { resId } = useParams();
  useEffect(() => {
    let subscribed = true;

    if (!authenticated || !resId || resId === ':resId') {
      subscribed && setReservationDetail(null);
    } else {
      (async function () {
        if (
          !reservationDetail ||
          reservationDetail.id !== resId ||
          manualRefreshReservation
        ) {
          setManualRefreshReservation(false);

          let reservation: Reservation | null = null;
          let property: Property | null = null;

          reservation = await fetch(
            `${server}/api/reservations/${resId}?primary=true`
          )
            .then(async (r) => await r.json())
            .then((r) => r.data[0])
            .catch(() => null);

          if (reservation) {
            property = await fetch(
              `${server}/api/properties/${reservation.propertyId}`
            )
              .then(async (p) => await p.json())
              .then((p) => p.data[0])
              .catch(() => null);
          }

          if (reservation && property) {
            subscribed &&
              setReservationDetail({
                ...reservation,
                property
              });
          } else {
            subscribed && setReservationDetail(null);
            navigate(routes.error);
          }
        }
      })();
    }

    return () => {
      subscribed = true;
    };
  }, [resId, authenticated, manualRefreshReservation]);

  // purge all saved state (triggers useEffects to update local storage as well)
  const clearAppContext = () => {
    setAuthenticated(false);
    setUser(null);
    setReservationDetail(null);
    setTesting(false);
    setSavedUser(null);
  };

  // for testing ==================================================
  const testUser: User = {
    userId: 'test-guest-1',
    username: 'Test Guest',
    firstName: 'Ricky',
    lastName: 'Bobby',
    email: 'test@email.com',
    phone: '123-456-7890',
    role: 'guest'
  };
  const savedUserKey = 'savedUser';
  const testingKey = 'testing';
  const [testing, setTesting] = useState(
    localStorage.getItem(testingKey) === 'true'
  );
  const [savedUser, setSavedUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(savedUserKey) ?? 'null') as User
  );

  useEffect(() => {
    localStorage.setItem(savedUserKey, JSON.stringify(savedUser));
  }, [savedUser]);

  useEffect(() => {
    let subscribed = true;

    localStorage.setItem(testingKey, String(testing));

    if (testing) {
      subscribed && user?.userId !== testUser.userId && setSavedUser(user);
      subscribed && setUser(testUser);
    } else {
      subscribed &&
        savedUser &&
        savedUser.userId !== testUser.userId &&
        setUser(savedUser);
    }

    return () => {
      subscribed = false;
    };
  }, [testing]);
  // for testing ==================================================

  return (
    <AppContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        user,
        setUser,
        reservationDetail,
        setReservationDetail,
        refreshReservationDetail: () => setManualRefreshReservation(true),
        clearAppContext,
        testing,
        setTesting
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
