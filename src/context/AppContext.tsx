import { createContext, ReactNode, useEffect, useState } from 'react';
import { ReservationDetail, User } from '../utils/dtos';

export interface AppContextType {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  reservationDetail: ReservationDetail | null;
  setReservationDetail: React.Dispatch<
    React.SetStateAction<ReservationDetail | null>
  >;
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
    email: 'test@email.com',
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
        clearAppContext,
        testing,
        setTesting
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
