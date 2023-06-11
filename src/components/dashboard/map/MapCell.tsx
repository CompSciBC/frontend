/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@emotion/styled';
import { memo, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { paramRoute, routes, server } from '../../..';
import { DashboardCellProps } from '../Dashboard';
import DashboardCellClickable from '../DashboardCellClickable';
import { useLoadScript } from '@react-google-maps/api';

export interface Location {
  latitude: number;
  longitude: number;
}

function MapCell({ className, cell }: DashboardCellProps) {
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
  // const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=20&size=400x300&markers=${center.lat},${center.lng}`;
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=20&size=400x300&markers=${center.lat},${center.lng}&key=myKey`;
  console.log(url);
  return (
    <Container
      className={className}
      cell={cell}
      to={paramRoute(routes.map, reservation?.id)}
      img={url}
    />
  );
}

const Container = styled(DashboardCellClickable)<{ img: string }>`
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
  background-position: center;
`;

export default memo(MapCell);
