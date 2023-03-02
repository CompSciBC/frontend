import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { Restaurant, RestaurantFilters } from '../../../utils/dtos';
import getRestaurants from './getRestaurants';
import RestaurantCard from './RestaurantCard';
import SearchBar from '../../search/SearchBar';
import FilterPanel, { FilterState } from './FilterPanel';

function Restaurants() {
  const { reservationDetail } = useContext(AppContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // filters used in the query to the API
  const [query, setQuery] = useState<RestaurantFilters>();

  // filters used to filter the results from the API
  const [, setFilterState] = useState<FilterState>({});

  // initialize query with property address
  useEffect(() => {
    let subscribed = true;

    if (reservationDetail) {
      const { address } = reservationDetail.property;
      subscribed && setQuery({ address });
    }

    return () => {
      subscribed = false;
    };
  }, [reservationDetail]);

  // query the API
  useEffect(() => {
    let subscribed = true;

    if (reservationDetail) {
      (async function () {
        const { address } = reservationDetail.property;
        subscribed &&
          setRestaurants(await getRestaurants({ ...query, address }));
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [reservationDetail, query]);

  const sidebarWidth = 192;

  return (
    <Container>
      <SidebarWrapper width={sidebarWidth}>
        <Sidebar width={sidebarWidth}>
          <FilterPanel
            handleChange={setFilterState}
            groups={[
              {
                type: 'check',
                name: 'openNow',
                label: 'Open Now',
                options: ['Open Now'],
                defaultChecked: 'Open Now'
              },
              {
                type: 'radio',
                name: 'distance',
                label: 'Distance',
                options: [
                  'Walking (1 mile)',
                  'Biking (2 miles)',
                  'Driving (10 miles)',
                  'Any'
                ],
                defaultChecked: 'Any'
              },
              {
                type: 'check',
                name: 'price',
                label: 'Price',
                options: ['$', '$$', '$$$', '$$$$']
              },
              {
                type: 'check',
                name: 'rating',
                label: 'Rating',
                options: ['☆☆☆☆', '☆☆☆', '☆☆', '☆']
              },
              {
                type: 'check',
                name: 'services',
                label: 'Services',
                options: ['Dine-in', 'Delivery', 'Take-out', 'Drive-thru']
              }
            ]}
          />
        </Sidebar>
      </SidebarWrapper>
      <ContentContainer>
        <h2>Nearby Restaurants</h2>
        <StyledSearchBar
          handleSubmit={(text: string) =>
            setQuery({
              address: reservationDetail!.property.address,
              keywords: text?.split(',')
            })
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

const SidebarWrapper = styled.div<{ width: number }>`
  position: relative;
  width: ${(props) => `${props.width}px`};
  height: 100%;
  background-color: ${theme.color.lightGray};

  ${theme.screen.small} {
    display: none;
  }
`;

const Sidebar = styled.div<{ width: number }>`
  position: fixed;
  top: 60px; // TODO: make dynamic based on height of header
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: 100%;
  overflow-y: scroll;

  // hide scrollbar on chrome/safari
  ::-webkit-scrollbar {
    display: none;
  }

  // hide scrollbar on firefox
  ::-moz-scrollbar {
    display: none;
  }

  // hide scrollbar on edge/ie
  ::-ms-scrollbar {
    display: none;
  }
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
