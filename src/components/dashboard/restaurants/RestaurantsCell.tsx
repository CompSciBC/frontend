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
  const { reservationDetail } = useContext(AppContext);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed &&
        reservationDetail &&
        setRestaurants(
          await getRestaurants(reservationDetail.property.address, n)
        );
    })();

    return () => {
      subscribed = false;
    };
  }, [reservationDetail]);

  return (
    <DashboardCellWrapper
      className={className}
      cell={cell}
      child={
        <ImagePreview
          title="Nearby Restaurants"
          viewMoreLink={paramRoute(routes.restaurants, reservationDetail?.id)}
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
