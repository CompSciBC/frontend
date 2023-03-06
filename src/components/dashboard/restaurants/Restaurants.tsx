import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState, useContext, useCallback } from 'react';
import AppContext from '../../../context/AppContext';
import { Restaurant, RestaurantFilters } from '../../../utils/dtos';
import getRestaurants from './getRestaurants';
import RestaurantCard from './RestaurantCard';
import SearchBar from '../../search/SearchBar';
import FilterPanel, { FilterState, FilterGroup } from './FilterPanel';
import CloseX from '../../page/CloseX';

function Restaurants() {
  const { reservationDetail } = useContext(AppContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] =
    useState<Restaurant[]>(restaurants);

  // filters used in the query to the API
  const [query, setQuery] = useState<RestaurantFilters>();

  // filters used to filter the results from the API
  const [filterState, setFilterState] = useState<FilterState>({});

  const distances: { [key: string]: number } = {
    'Walking (1 mile)': 1,
    'Biking (2 miles)': 2,
    'Driving (10 miles)': 10,
    Any: 50
  };

  const ratings: { [key: string]: number } = {
    '☆☆☆☆ & up': 4,
    '☆☆☆ & up': 3,
    '☆☆ & up': 2,
    '☆ & up': 1
  };

  const groups: FilterGroup[] = [
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
      options: Object.keys(distances),
      defaultChecked: 'Any'
    },
    {
      type: 'check',
      name: 'price',
      label: 'Price',
      options: ['$', '$$', '$$$', '$$$$']
    },
    {
      type: 'radio',
      name: 'rating',
      label: 'Rating',
      options: Object.keys(ratings),
      defaultChecked: '☆☆☆☆ & up'
    }
  ];

  // initialize default query and filter state
  useEffect(() => {
    let subscribed = true;

    if (reservationDetail) {
      const { address } = reservationDetail.property;
      subscribed && setQuery({ address });

      const defaultFilters: FilterState = {};

      groups
        .filter((g) => g.defaultChecked)
        .forEach((g) => {
          switch (typeof g.defaultChecked) {
            case 'string':
              defaultFilters[g.name] = [g.defaultChecked];
              break;
            case 'object':
              defaultFilters[g.name] = g.defaultChecked;
              break;
          }
        });

      subscribed && setFilterState(defaultFilters);
    }

    return () => {
      subscribed = false;
    };
  }, [reservationDetail]);

  const filterResults = useCallback(
    (results: Restaurant[]) => {
      const { openNow, distance, price, rating } = filterState;
      const metersToMiles = (meters: number) => 0.000621371 * meters;

      return results.filter((result) => {
        if (openNow && openNow[0] === 'Open Now' && !result.isOpen)
          return false;

        if (distance && metersToMiles(result.distance) > distances[distance[0]])
          return false;

        if (price?.length && !price.map((p) => p.length).includes(result.price))
          return false;

        if (rating?.length && result.rating < ratings[rating[0]]) return false;

        return true;
      });
    },
    [filterState]
  );

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

  // filter the restaurant query results
  useEffect(() => {
    let subscribed = true;

    subscribed &&
      restaurants &&
      setFilteredRestaurants(filterResults(restaurants));

    return () => {
      subscribed = false;
    };
  }, [restaurants, filterState]);

  const removeKeyword = useCallback(
    (keyword: string): RestaurantFilters => {
      const keywords = query?.keywords;
      const remove = keywords?.indexOf(keyword) ?? -1;
      remove >= 0 && keywords?.splice(remove, 1);

      const newQuery = { ...query, keywords };
      return newQuery as RestaurantFilters;
    },
    [query]
  );

  const sidebarWidth = 192;

  return (
    <Container>
      <SidebarWrapper width={sidebarWidth}>
        <Sidebar width={sidebarWidth}>
          <FilterPanel
            handleChange={setFilterState}
            groups={groups}
            title={null}
          />
        </Sidebar>
      </SidebarWrapper>
      <ContentContainer>
        <h2>Nearby Restaurants</h2>
        <StyledSearchBar
          handleSubmit={(text: string) => {
            const { address } = reservationDetail!.property;

            if (!text.trim() && Object.keys(query ?? {}).length > 1) {
              // reset to default query if user submits blank search while there are keywords set
              setQuery({ address });
            } else if (text.trim()) {
              let keywords = text.split(',').map((i) => i.trim());
              keywords = [...new Set(keywords)];
              setQuery({ address, keywords });
            }
          }}
        />
        <QueryContainer>
          <TagTrack>
            {query?.keywords?.map((k) => (
              <QueryTag key={k}>
                <span>{k}</span>
                <StyledCloseX
                  size={24}
                  onClick={() => setQuery(removeKeyword(k))}
                />
              </QueryTag>
            ))}
          </TagTrack>
          <ResultCount>{`${filteredRestaurants.length} Results`}</ResultCount>
        </QueryContainer>
        <CardContainer>
          {filteredRestaurants?.map((r) => {
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
  height: 100%;
`;

const SidebarWrapper = styled.div<{ width: number }>`
  position: relative;
  width: ${(props) => `${props.width}px`};

  ${theme.screen.small} {
    display: none;
  }
`;

const Sidebar = styled.div<{ width: number }>`
  position: fixed;
  --header-height: 60px; // TODO: make dynamic based on height of header
  top: var(--header-height);
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: calc(100% - var(--header-height));
  background-color: ${theme.color.lightGray};
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
  height: fit-content;
  padding: 32px;

  ${theme.screen.small} {
    padding: 16px;
  }

  h2 {
    ${theme.font.displayLarge}
    margin-bottom: 16px;
  }
`;

const StyledSearchBar = styled(SearchBar)``;

const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  margin: 8px 0;
`;

const TagTrack = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const QueryTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
  background-color: ${theme.color.lightGray};
  ${theme.font.caption}
  color: ${theme.color.gray};
`;

const StyledCloseX = styled(CloseX)`
  padding: 8px;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ResultCount = styled.div`
  display: flex;
  justify-content: center;

  ${theme.font.caption}
  color: ${theme.color.gray};
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  width: 100%;
  gap: 16px;
  place-content: center;
`;

export default Restaurants;
