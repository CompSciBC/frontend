import styled from "@emotion/styled";
import { useLoaderData } from "react-router-dom";
import { GuidebookDto } from "../../../utils/dtos";
import { theme } from "../../../utils/styles";
import LightFadeCarousel from "./PhotoCarousel";
import AccordionDropdown from "../../reservations/AccordionDropdown";

function Guidebook() {
  const guidebookDetails = useLoaderData() as GuidebookDto;

  return <Container>
    <DisplayText>{guidebookDetails.propertyName}</DisplayText>
    <ContainerCarousel>
      <LightFadeCarousel />
    </ContainerCarousel>
    
    <ListContainer>
      <StyledAccordionDropdown
        label="•ABOUT•"
        isOpen={true}
        content={<div>
          
          <BodyText>{guidebookDetails.propertyBio}</BodyText>

          <AboutSectionContainer>Amenities: {guidebookDetails.amenities?.map((amen) => {
            return (
              <AboutSectionItem key={amen}>{amen}</AboutSectionItem>
            );
          })
          }</AboutSectionContainer>

          <AboutSectionContainer>Pets: <AboutSectionItem>{guidebookDetails.pets}</AboutSectionItem></AboutSectionContainer>
          <AboutSectionContainer>Capacity: <AboutSectionItem>{guidebookDetails.capacity}</AboutSectionItem></AboutSectionContainer>

          {guidebookDetails.checkininstr && <AboutSectionContainer>Check-In Instructions: <AboutSectionItem>{guidebookDetails.checkininstr}</AboutSectionItem></AboutSectionContainer>}

          {guidebookDetails.checkoutinstr && <AboutSectionContainer>Check-Out Instructions: <AboutSectionItem>{guidebookDetails.checkoutinstr}</AboutSectionItem></AboutSectionContainer>}
        </div>
        }
        smallLineStyling={true}
      />

      <StyledAccordionDropdown
        label="•GUEST FAQ•"
        isOpen={true}
        content={<Faq>
          {guidebookDetails.faq?.map((faq) => {
            return (
              <li key={faq.Question}>
                <div>{faq.Question}</div>
                <div>{faq.Answer}</div>
              </li>
            );
          })
          }
        </Faq>}
        smallLineStyling={true}
      />
      <StyledAccordionDropdown
        label="•POLICIES•"
        isOpen={true}
        content={<BodyText>{guidebookDetails.policies}</BodyText>}
        smallLineStyling={true}
      />
      <StyledAccordionDropdown
        label="•YOUR HOST•"
        isOpen={true}
        content={<BodyText>{guidebookDetails.policies}</BodyText>}
        smallLineStyling={true}
      />
      <StyledAccordionDropdown
        label="•SERVICES AND SUPPORT•"
        isOpen={true}
        content={<BodyText>{guidebookDetails.policies}</BodyText>}
        smallLineStyling={true}
      />
    </ListContainer>

    {/* <Faq>                                         // Code below commented out -> For reference !
      {guidebookDetails.faq?.map((faq) => {
        return (
          <li key={faq.Question}>
            <div>{faq.Question}</div>
            <div>{faq.Answer}</div>
          </li>
        );
      })
      }
    </Faq> */}

    {/* <h2>{guidebookDetails.faq?.[0].Question}</h2>
    <h2>{guidebookDetails.faq?.[0].Answer}</h2> */}

    {/* Object.keys(guidebookDetails).map((guidebookKey, i) => {
      
      return (
        <div key={guidebookKey}>
          <div>{guidebookKey}</div>
          {<div>{guidebookDetails[guidebookKey as keyof GuidebookDto]}</div> }
        </div>
      );
    })
  */}

  </Container>;
}

const Faq = styled.ol` 
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  margin-top: 20px;
`;

const BodyText = styled.div` 
  ${theme.font.body};
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const DisplayText = styled.h1` 
  ${theme.font.displayXL};
  margin: 20px 0 15px 20px;
`;

const AboutSectionContainer = styled.div` 
  ${theme.font.body};
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  margin-left: 20px;
`;

const AboutSectionItem = styled.ul` 
  font-weight: bold;
`;

const Container = styled.div` 
  width: 100%;
`;

const StyledAccordionDropdown = styled(AccordionDropdown)` 
  ${theme.font.body}
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ContainerCarousel = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 76%;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

  
export default Guidebook;