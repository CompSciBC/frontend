import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes } from '../../..';
import { EventOrPlace } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ImagePreview from '../ImagePreview';
import getEventsAndPlaces from './getEventsAndPlaces';

export interface EventsAndPlacesCellProps extends DashboardCellProps {
  n: number;
}

function EventsAndPlacesCell({ className, cell, n }: EventsAndPlacesCellProps) {
  const { reservation } = useContext(AppContext);
  const [eventsAndPlaces, setEventsAndPlaces] = useState<EventOrPlace[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed &&
        reservation &&
        setEventsAndPlaces(
          await getEventsAndPlaces(reservation.property.address, n)
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
          title="Events and Places"
          viewMoreLink={paramRoute(routes.eventsAndPlaces, reservation?.id)}
          previewSlides={eventsAndPlaces.map((e) => {
            return {
              image: e.imageUrl,
              link: e.url
            };
          })}
        />
      }
    />
  );
}

export default memo(EventsAndPlacesCell);
