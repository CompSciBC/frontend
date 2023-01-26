import styled from "@emotion/styled";

function Guidebook() {
  return <Container>
    <h1>Guidebook Page Beginning</h1>
    <ImageCarousel >Image carousel</ImageCarousel>
  </Container>;
}



const ImageCarousel = styled.div` 
  height: 256px;
  width: 100%;
  background-color: #00ff6e;
`;


const Container = styled.div` 
  width: 100%;
`;
  
export default Guidebook;