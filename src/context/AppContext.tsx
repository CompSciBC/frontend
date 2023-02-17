import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../utils/dtos';

export interface AppContextType {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  reservationId: string | null;
  setReservationId: React.Dispatch<React.SetStateAction<string | null>>;
  clearAppContext: Function;
}

/**
 * Context for app-wide global state
 */
const AppContext = createContext<AppContextType>({
  authenticated: false,
  setAuthenticated: () => {},
  user: null,
  setUser: () => {},
  reservationId: null,
  setReservationId: () => {},
  clearAppContext: () => {}
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
  const reservationIdKey = 'reservationId';

  // initialize state variables
  const [authenticated, setAuthenticated] = useState<boolean>(
    localStorage.getItem(authenticatedKey) === 'true'
  );

  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(userKey) ?? 'null') as User
  );

  const [reservationId, setReservationId] = useState<string | null>(
    localStorage.getItem(reservationIdKey)
  );

  // persist state in local storage whenever updated
  useEffect(() => {
    localStorage.setItem(authenticatedKey, String(authenticated));
  }, [authenticated]);

  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(reservationIdKey, String(reservationId));
  }, [reservationId]);

  // purge all saved state (triggers useEffects to update local storage as well)
  const clearAppContext = () => {
    setAuthenticated(false);
    setUser(null);
    setReservationId(null);
  };

  return (
    <AppContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        user,
        setUser,
        reservationId,
        setReservationId,
        clearAppContext
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
