// src/component/Gallery.js
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
class Gallery extends React.Component {
  render() {

    const styles = {
      container: {
        // width: "70%",
        height: 'auto',
        margin: '50px ',
        // backgroundColor: "orange",
        // display: "flex",
        // flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        // fontWeight: "bold",
      },
    } as const;
    
    return (
      <div style={styles.container}>
        <Carousel autoPlay infiniteLoop>
          <div>
            <img src="https://images.unsplash.com/photo-1662180255446-d0d78f565bf3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" alt="" />
            {/* <p className="legend">My Photo 1</p> */}
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1664648383125-8e5a588b5a5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="" />
            {/* <p className="legend">My Photo 2</p> */}
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1629359322339-ec1551b9edcc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80" alt="" />
            {/* <p className="legend">My Photo 3</p> */}
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1629359080404-2dafcfd9f159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="" />
            {/* <p className="legend">My Photo 4</p> */}
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1586810163991-513cd3dec586?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80" alt="" />
            {/* <p className="legend">My Photo 5</p> */}
          </div>
        </Carousel>
      </div>
    );
  };
}
export default Gallery;