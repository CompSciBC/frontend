import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { Restaurant, RestaurantFilters } from '../../../utils/dtos';
import getRestaurants from './getRestaurants';
import RestaurantCard from './RestaurantCard';
import SearchBar from '../../search/SearchBar';

function Restaurants() {
  const { reservationDetail } = useContext(AppContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<RestaurantFilters | null>(null);

  // initialize filters to property address
  useEffect(() => {
    let subscribed = true;

    if (reservationDetail) {
      subscribed &&
        setFilters({
          address: reservationDetail.property.address
        });
    }
    return () => {
      subscribed = false;
    };
  }, [reservationDetail]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed &&
        reservationDetail &&
        setRestaurants(
          await getRestaurants(
            filters ?? {
              address: reservationDetail.property.address
            }
          )
        );
    })();

    return () => {
      subscribed = false;
    };
  }, [reservationDetail, filters]);

  const keywordSearchFilters = (keywords?: string): RestaurantFilters => {
    return {
      address: reservationDetail!.property.address,
      keywords: keywords?.split(',')
    };
  };

  return (
    <Container>
      <SidebarWrapper>
        <Sidebar>Hello</Sidebar>
      </SidebarWrapper>
      <ContentContainer>
        <h2>Nearby Restaurants</h2>
        <StyledSearchBar
          handleSubmit={(text: string) =>
            setFilters(keywordSearchFilters(text))
          }
        />
        <CardContainer>
          {restaurants?.map((r) => {
            return <RestaurantCard key={r.id} restaurant={r} />;
          })}
        </CardContainer>
      </ContentContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const SidebarWrapper = styled.div`
  position: relative;
  width: 256px;
  height: 100%;
  background-color: ${theme.color.lightGray};

  ${theme.screen.small} {
    display: none;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 32px;

  ${theme.screen.small} {
    padding: 16px;
  }

  h2 {
    ${theme.font.displayLarge}
    margin-bottom: 16px;
  }
`;

const StyledSearchBar = styled(SearchBar)`
  margin-bottom: 32px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  width: 100%;
  gap: 16px;
  place-content: center;
`;

export default Restaurants;
