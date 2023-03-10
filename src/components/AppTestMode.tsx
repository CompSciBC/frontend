import styled from '@emotion/styled';
import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import SelectField from './forms/SelectField';

/**
 * Provides a selector for activating test mode. Test mode changes the
 * current user to test-guest-1. This change is defined in AppContext
 *
 * @returns A JSX element
 */
export default function AppTestMode() {
  const { authenticated, testing, setTesting } = useContext(AppContext);

  useEffect(() => {
    const select = document.querySelector<HTMLSelectElement>(
      'select[name="test-selection"]'
    );

    const handleChange = (event: any) => {
      const value = select?.value;
      setTesting(value === 'Test Mode');
    };

    select?.addEventListener('change', handleChange);

    return () => {
      select?.removeEventListener('change', handleChange);
    };
  }, [authenticated]);

  return (
    <>
      {authenticated && (
        <TestSetting
          name="test-selection"
          options={['Normal Mode', 'Test Mode']}
          defaultOption={testing ? 'Test Mode' : 'Normal Mode'}
        />
      )}
    </>
  );
}

const TestSetting = styled(SelectField)`
  position: fixed;
  left: 56px;
  top: 14px;
  z-index: 100;
  select {
    background-color: transparent;
    outline: none;
    padding: 4px;
  }
`;
