import React from 'react';
import { UrlContext } from '../state/url_context';

export const useUrl = (): UrlContext => {
  const [url, setUrl] = React.useState('/welcome');

  const setCurrentUrl = React.useCallback((currentUrl: string): void => {
    setUrl(currentUrl);
  }, []);

  return {
    url,
    setCurrentUrl,
  };
};