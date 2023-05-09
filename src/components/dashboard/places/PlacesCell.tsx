import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { Place } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ImagePreview from '../ImagePreview';
import getPlaces from './getPlaces';

export interface PlacesCellProps extends DashboardCellProps {
  n: number;
}

function PlacesCell({ className, cell, n }: PlacesCellProps) {
  const { reservationDetail } = useContext(AppContext);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed &&
        reservationDetail &&
        setPlaces(await getPlaces(reservationDetail.property.address, n));
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
          title="Places"
          viewMoreLink={paramRoute(routes.places, reservationDetail?.id)}
          previewSlides={places.map((e) => {
            return {
              image: '/images/no-image-available.jpeg',
              link: 'https://google.com'
            };
          })}
        />
      }
    />
  );
}

export default memo(PlacesCell);
