import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { Address, Restaurant } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ImagePreview from '../ImagePreview';
import getRestaurants from './getRestaurants';

export interface RestaurantsCellProps extends DashboardCellProps {
  address: Address;
  n: number;
}

function RestaurantsCell({
  className,
  cell,
  address,
  n
}: RestaurantsCellProps) {
  const { resId } = useParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed && setRestaurants(await getRestaurants(address, n));
    })();

    return () => {
      subscribed = false;
    };
  }, [resId]);

  return (
    <DashboardCellWrapper
      className={className}
      cell={cell}
      child={
        <ImagePreview
          title="Nearby Restaurants"
          viewMoreLink={paramRoute(routes.restaurants, resId)}
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
