import styled from '@emotion/styled';
import Carousel from 'react-bootstrap/Carousel';

export interface Props {
  images: string[];
}

function LightFadeCarousel({ images }: Props) {
  return (
    <Container>
      <Carousel fade variant="light" touch={true}>
        {images.map((img) => {
          return (
            <Carousel.Item key={img}>
              <img className="d-block w-100" src={img} alt="First slide" />
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Container>
  );
}

const Container = styled.div`
  align-items: center;
  justify-content: center;
  margin: 20px;
  width: 65%;
  margin-left: auto;
  margin-right: auto;
`;

export default LightFadeCarousel;
