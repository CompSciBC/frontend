import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { Restaurant } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ImagePreview from '../ImagePreview';
import getRestaurants from './getRestaurants';

export interface RestaurantsCellProps extends DashboardCellProps {
  n: number;
}

function RestaurantsCell({ className, cell, n }: RestaurantsCellProps) {
  const { reservation } = useContext(AppContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed &&
        reservation &&
        setRestaurants(
          await getRestaurants({
            address: reservation.property.address,
            numResults: n
          })
        );
    })();

    return () => {
      subscribed = false;
    };
  }, [reservation]);

  return (
    <DashboardCellWrapper
      className={className}
      cell={cell}
      child={
        <ImagePreview
          title="Nearby Restaurants"
          viewMoreLink={paramRoute(routes.restaurants, reservation?.id)}
          previewSlides={restaurants.map((r) => {
            return {
              image: r.imageUrl,
              link: r.url
            };
          })}
        />
      }
    />
  );
}

export default memo(RestaurantsCell);
