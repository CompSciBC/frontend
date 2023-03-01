import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../..';
import { Restaurant } from '../../../utils/dtos';
import Star from './Star';

export interface RestaurantCardProps {
  className?: string;
  restaurant: Restaurant;
}

function RestaurantCard({ className, restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const {
    name,
    imageUrl,
    isOpen,
    url,
    categories,
    rating,
    numReviews,
    transactions,
    price,
    distance
  } = restaurant;

  const distanceInMiles = `${(0.000621371 * distance).toFixed(2)} mi`;
  const stars = Array.from({ length: rating }, (_, i) => <Star key={i} />);
  const dollars = Array.from({ length: price }, (_, i) => (
    <Fragment key={i}>$</Fragment>
  ));

  return (
    <Container className={className} href={url} target="/">
      <CardHeader>
        <ImageWrapper>
          <img src={imageUrl} />
          <IsOpen>{isOpen ? 'Open Now' : 'Closed'}</IsOpen>
          <Distance>{distanceInMiles}</Distance>
        </ImageWrapper>
        <Stars>
          <div>{stars}</div>
          {`${numReviews} Reviews`}
        </Stars>
      </CardHeader>
      <CardBody>
        <h3>{name}</h3>
        <TagContainer>
          {categories.map((c) => (
            <CategoryTag key={c}>{c}</CategoryTag>
          ))}
          {transactions.map((t) => (
            <CategoryTag key={t}>{t}</CategoryTag>
          ))}
        </TagContainer>
      </CardBody>
      <CardFooter>
        <div>
          {dollars}
          <div>
            {/* links cannot be children of links, so these are buttons as a workaround */}
            <FooterButton
              type="button"
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              Order
            </FooterButton>
            <FooterButton
              type="button"
              onClick={(event) => {
                event.preventDefault();
                navigate(routes.map);
              }}
            >
              Get Directions
            </FooterButton>
          </div>
        </div>
      </CardFooter>
    </Container>
  );
}

const Container = styled.a`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  row-gap: 16px;
  padding: 16px;
  border: 1px solid ${theme.color.lightGray};
  border-radius: 8px;
  text-decoration: none;
  color: inherit;

  :hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    color: inherit;
    cursor: pointer;
  }
`;

const CardHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 256px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }
`;

const ImageTag = styled.div`
  position: absolute;
  top: 0;
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;
  ${theme.font.caption}
  background-color: rgba(0, 0, 0, .45);
  color: white;
`;

const IsOpen = styled(ImageTag)`
  left: 0;
  border-radius: 8px 0 0 0;
`;

const Distance = styled(ImageTag)`
  right: 0;
  border-radius: 0 8px 0 0;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background-color: ${theme.color.green};
  ${theme.font.caption}
  color: white;

  div {
    display: flex;
    gap: 4px;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    ${theme.font.body}
    font-size: 24px;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const CategoryTag = styled.div`
  padding: 4px 8px;
  background-color: ${theme.color.lightGray};
  color: black;
  width: fit-content;
  ${theme.font.caption}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardFooter = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: end;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    ${theme.font.caption}

    div {
      display: flex;
      gap: 4px;
    }
  }
`;

const FooterButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${theme.color.lightGray};
  border-radius: 4px;
  background-color: transparent;
  ${theme.font.captionLink}

  :hover {
    color: ${theme.color.white};
    border: 1px solid ${theme.color.blue};
    background-color: ${theme.color.blue};
  }
`;

export default RestaurantCard;
