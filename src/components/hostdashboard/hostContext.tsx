import React from 'react';

export interface HostContextType {
  reservations: any;
  reviews: any;
}
const HostContext = React.createContext<HostContextType | null>(null);

export const HostProvider = HostContext.Provider;
export default HostContext;
