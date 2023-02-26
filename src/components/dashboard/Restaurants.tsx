import { useEffect } from 'react';
import { server } from '../../index';

function Restaurants() {
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server!}/api/restaurants?postalCode=98119`
      );
      const responseJson = await response.json(); // json
      console.log(responseJson);
    })();
  }, []);
  return <>Restaurants</>;
}

export default Restaurants;
