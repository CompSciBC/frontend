import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { paramRoute, routes } from '../../..';
import { Address, EventOrPlace } from '../../../utils/dtos';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellWrapper from '../DashboardCellWrapper';
import ImagePreview from '../ImagePreview';
import getEventsAndPlaces from './getEventsAndPlaces';

export interface EventsAndPlacesCellProps extends DashboardCellProps {
  address: Address;
  n: number;
}

function EventsAndPlacesCell({
  className,
  cell,
  address,
  n
}: EventsAndPlacesCellProps) {
  const { resId } = useParams();
  const [eventsAndPlaces, setEventsAndPlaces] = useState<EventOrPlace[]>([]);

  useEffect(() => {
    let subscribed = true;

    (async function () {
      subscribed && setEventsAndPlaces(await getEventsAndPlaces(address, n));
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
          title="Events and Places"
          viewMoreLink={paramRoute(routes.eventsAndPlaces, resId)}
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
