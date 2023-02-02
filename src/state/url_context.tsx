import React from 'react';

export interface UrlContext {
  url: string;
  setCurrentUrl: (currentUrl: string) => void;
}

export const URL_DEFAULT_VALUE = {
  url: '/',
  setCurrentUrl: () => { },
};

export const urlContext = React.createContext<UrlContext>(URL_DEFAULT_VALUE);