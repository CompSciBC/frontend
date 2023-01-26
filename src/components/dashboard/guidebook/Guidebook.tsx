import styled from "@emotion/styled";
import { useLoaderData } from "react-router-dom";
import { GuidebookDto } from "../../../utils/dtos";

function Guidebook() {
  const guidebookDetails = useLoaderData() as GuidebookDto;


  return <Container>
    <h1>Guidebook Page Beginning</h1>
    <ImageCarousel >Image carousel</ImageCarousel>

    
    <h2>{guidebookDetails.propertyName}</h2>
    <h2>{guidebookDetails.faq?.[0].Answer}</h2>

    {Object.keys(guidebookDetails).map((guidebookKey, i) => {
      
      return (
        <div key={guidebookKey}>
          <div>{guidebookKey}</div>
          {/* <div>{guidebookDetails[guidebookKey as keyof GuidebookDto]}</div> */}
        </div>
      );
    })
    }

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