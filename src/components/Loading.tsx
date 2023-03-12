import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

export interface LoadingProps {
  className?: string;
  text?: string;
}

/**
 * Displays a "<text>..." loading animation (e.g, Loading...)
 *
 * @param props {@link LoadingProps}
 * @returns A JSX element
 */
function Loading({ className, text = 'Loading' }: LoadingProps) {
  const [ellipses, setEllipses] = useState<string>(text);

  // start animation
  useEffect(() => {
    let subscribed = true;
    let counter = 0;
    let dots = '';

    const interval = setInterval(() => {
      if (counter % 4 === 0) {
        dots = '';
        subscribed && setEllipses(text);
      } else {
        dots += ' . ';
        subscribed && setEllipses(`${text}${dots}`);
      }
      counter++;
    }, 350);

    return () => {
      subscribed = false;
      clearInterval(interval);
    };
  }, []);

  return <Container className={className}>{ellipses}</Container>;
}

const Container = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background-color: inherit;
`;

export default Loading;
