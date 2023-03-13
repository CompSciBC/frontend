import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

interface RectangularTileLinkProps {
  className?: string;
  to: string;
  content: JSX.Element;
  background?: string;
}

function RectangularCardLink({
  className = '',
  to,
  content,
  background = ''
}: RectangularTileLinkProps) {
  return (
    <Wrapper className={className} to={to}>
      {background && (
        <>
          <Background background={background} />
          <Screen />
        </>
      )}
      <ContentContainer>{content}</ContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled(Link)`
  position: relative;
  border: 1px solid lightgrey;
  border-radius: 8px;
  box-shadow: 0 4px 4px lightgrey;
  text-decoration: none;
  color: black;
  overflow: hidden;

  :hover {
    transform: scale(102%);
    box-shadow: 0 6px 6px grey;
  }
`;

const Background = styled.div<{ background: string }>`
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background-image: ${(props) => `url(${props.background})`};
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center;
`;

const Screen = styled.div`
  position: absolute;
  inset: 0;
  background-color: white;
  opacity: 25%;
`;

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  width: 700px;
  min-height: 128px;
  padding: 8px;
  background-color: white;

  @media only screen and (max-width: 700px) {
    width: 85vw;
  }
`;

export default RectangularCardLink;
