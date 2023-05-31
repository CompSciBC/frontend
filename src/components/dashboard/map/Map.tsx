import { useState, useEffect, useContext } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import styled from '@emotion/styled';
import AppContext from '../../../context/AppContext';
import { server } from '../../../index';

export interface Location {
  latitude: number;
  longitude: number;
}

function Map() {
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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <MapContainer>
      <GoogleMap
        mapContainerClassName="map-container"
        zoom={18}
        center={center}
      >
        <MarkerF key="marker1" position={center} />
      </GoogleMap>
    </MapContainer>
  );
}

export default Map;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;

  .map-container {
    width: 100%;
    height: 100%;
  }
`;
