import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { theme } from '../../utils/styles';
import ChevronDown from '../reservations/ChevronDown';

export interface PreviewSlide {
  image?: string;
  link?: string;
}

export interface ImagePreviewProps {
  className?: string;
  title?: string;
  viewMoreLink: string;
  previewSlides?: PreviewSlide[];
}

/**
 * Previews the top n results of a query for more images
 *
 * @param props {@link ImagePreviewProps}
 * @returns A JSX element
 */
function ImagePreview({
  className,
  title,
  viewMoreLink,
  previewSlides
}: ImagePreviewProps) {
  return (
    <Container className={className}>
      {title && <Header>{title}</Header>}
      <Body>
        {previewSlides?.map((preview, i) => (
          <Slide
            key={i} // no other guaranteed unique key other than index
            img={preview.image ?? '/images/no-image-available.jpeg'}
            href={preview.link}
          />
        ))}
        <ViewMoreButton to={viewMoreLink}>
          <div>
            <ChevronRight fill={theme.color.white} width={32} />
          </div>
        </ViewMoreButton>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  position: relative;
  padding: 4px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  background-color: ${theme.color.lightGray};
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 4px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${theme.color.white};
  column-gap: 4px;

  a {
    flex-grow: 1;
    :nth-of-type(1) {
      border-bottom-left-radius: 8px;
    }
  }
`;

const Slide = styled.a<{ img: string }>`
  width: 33%;
  border: none;
  padding: 0;
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center;
  cursor: pointer;
`;

const ViewMoreButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;
  border: none;
  padding: 0;
  border-bottom-right-radius: 8px;
  background-color: transparent;
  cursor: pointer;

  :hover {
    div {
      background-color: lightgray;
    }
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border-radius: 100vh;
    background-color: ${theme.color.lightGray};
  }
`;

const ChevronRight = styled(ChevronDown)`
  transform: rotate(-90deg);
`;

export default ImagePreview;
