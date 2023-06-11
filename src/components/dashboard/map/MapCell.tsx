/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes, server } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import DashboardCellWrapper from '../DashboardCellWrapper';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapCellProps extends DashboardCellProps {
  interactive: boolean;
  zoom: number;
}

function MapCell({ className, cell, interactive, zoom }: MapCellProps) {
  const coordinates: Location = {
    latitude: 0.0,
    longitude: 0.0
  };

  const { reservation } = useContext(AppContext);
  const [location, setLocation] = useState<Location>(coordinates); // location is a variable but Location is an interface (object)

  useEffect(() => {
    const address = reservation!.property.address;

    const addressLocation = [
      address?.line1,
      address?.line2,
      address?.stateProvince,
      address?.city,
      address?.country,
      address?.postalCode
    ]
      .filter(Boolean)
      .join(' ');

    const addressURL = encodeURIComponent(addressLocation);
    fetch(`${server}/api/coordinates/${addressURL}`)
      .then(async (res) => {
        return await res.json();
      })
      .then((data) => {
        setLocation(data);
      });
  }, [reservation]);

  console.log('Setting center');
  const center = {
    lat: location?.latitude,
    lng: location?.longitude
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY as string
  });

  const myKey = process.env.REACT_APP_GOOGLE_MAPS_KEY as string;

  if (!isLoaded) return <div>Loading...</div>;
  else if (interactive) {
    return (
      <InteractiveContainer
        cell={cell}
        child={
          <GoogleMap
            mapContainerClassName="map-container"
            zoom={zoom}
            center={center}
          >
            <MarkerF key="marker1" position={center} />
          </GoogleMap>
        }
      ></InteractiveContainer>
    );
  } else {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=400x300&markers=${center.lat},${center.lng}&key=${myKey}`;

    return (
      <StaticContainer
        className={className}
        cell={cell}
        to={paramRoute(routes.map, reservation?.id)}
        img={url}
      />
    );
  }
}

const InteractiveContainer = styled(DashboardCellWrapper)`
  width: 100%;
  height: 100%;

  .map-container {
    width: 100%;
    height: 100%;
  }
`;

const StaticContainer = styled(DashboardCellClickable)<{ img: string }>`
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center;
`;

export default memo(MapCell);
