import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState, useContext, useCallback } from 'react';
import AppContext from '../../../context/AppContext';
import { Place, RestaurantFilters } from '../../../utils/dtos';
import getPlaces from './getPlaces';
// import SearchBar from '../../search/SearchBar';
import CloseX from '../../page/CloseX';
import PlaceCard from './PlaceCard';

function Places() {
  const { reservation } = useContext(AppContext);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [query, setQuery] = useState<RestaurantFilters>();

  // initialize default query and filter state
  useEffect(() => {
    let subscribed = true;

    if (reservation) {
      const { address } = reservation.property;
      subscribed && setQuery({ address });
    }

    return () => {
      subscribed = false;
    };
  }, [reservation]);

  // query the API
  useEffect(() => {
    let subscribed = true;

    if (reservation) {
      (async function () {
        const { address } = reservation.property;
        subscribed && setPlaces(await getPlaces(address));
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [reservation, query]);

  useEffect(() => {
    let subscribed = true;

    subscribed && places && setFilteredPlaces(places);

    return () => {
      subscribed = false;
    };
  }, [places]);

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

  return (
    <Container>
      <ContentContainer>
        <h2>Nearby Places</h2>
        {/* <StyledSearchBar
          handleSubmit={(text: string) => {
            const { address } = reservation!.property;

            if (!text.trim() && Object.keys(query ?? {}).length > 1) {
              // reset to default query if user submits blank search while there are keywords set
              setQuery({ address });
            } else if (text.trim()) {
              let keywords = text.split(',').map((i) => i.trim());
              keywords = [...new Set(keywords)];
              setQuery({ address, keywords });
            }
          }}
        /> */}
        <QueryContainer>
          <TagTrack>
            {query?.keywords?.map((k) => (
              <QueryTag key={k}>
                <span>{k}</span>
                <StyledCloseX
                  size={8}
                  onClick={() => setQuery(removeKeyword(k))}
                />
              </QueryTag>
            ))}
          </TagTrack>
          <ResultCount>{`${filteredPlaces.length} Results`}</ResultCount>
        </QueryContainer>
        <CardContainer>
          {filteredPlaces?.map((r) => {
            return <PlaceCard key={r.placeID} place={r} />;
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

// const StyledSearchBar = styled(SearchBar)``;

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

export default Places;
