import styled from '@emotion/styled';
import { GuidebookDto } from '../../../utils/dtos';
import { theme } from '../../../utils/styles';
import LightFadeCarousel from './PhotoCarousel';
import AccordionDropdown from '../../reservations/AccordionDropdown';
import { useState, useEffect } from 'react';

function Guidebook() {
  const [guidebookInfo, setGuidebookInfo] = useState<GuidebookDto | null>(null);
  const propID = 'PID00178';
  // const {reservationDetail} = useContext(AppContext); // & import AppContext at top 
  useEffect(() => {
    let subscribed = true;

    (async function () {
      const response = await fetch('/api/guidebook/' + propID);
      subscribed && setGuidebookInfo(await response.json());
    })();
    return () => {
      subscribed = false;
    };
  }, [propID]);

  return (
    guidebookInfo && (
      <Container>
        <DisplayText>{guidebookInfo.propertyName}</DisplayText>
        <ContainerCarousel>
          <LightFadeCarousel />
        </ContainerCarousel>

        <ListContainer>
          <StyledAccordionDropdown
            label="•ABOUT•"
            isOpen={true}
            content={
              <div>
                <BodyText>{guidebookInfo.propertyBio}</BodyText>
                <EnableTableScroll>
                  <AboutSectionContainerTable>
                    <tbody>
                      {guidebookInfo.amenities && (
                        <AboutSectionContainerRow>
                          <AboutSectionItem>Amenities: </AboutSectionItem>
                          {guidebookInfo.amenities?.map((amen) => {
                            return (
                              <AboutSectionItem key={amen}>
                                {amen}
                              </AboutSectionItem>
                            );
                          })}
                        </AboutSectionContainerRow>
                      )}

                      <AboutSectionContainerRow>
                        <AboutSectionItem>Pets: </AboutSectionItem>
                        <AboutSectionItem>
                          {guidebookInfo.pets}
                        </AboutSectionItem>
                      </AboutSectionContainerRow>

                      <AboutSectionContainerRow>
                        <AboutSectionItem>Capacity: </AboutSectionItem>
                        <AboutSectionItem>
                          {guidebookInfo.capacity}
                        </AboutSectionItem>
                      </AboutSectionContainerRow>

                      {guidebookInfo.checkininstr && (
                        <AboutSectionContainerRow>
                          <AboutSectionItem>
                            Check-In Instructions:{' '}
                          </AboutSectionItem>
                          <AboutSectionItem>
                            {guidebookInfo.checkininstr}
                          </AboutSectionItem>
                        </AboutSectionContainerRow>
                      )}

                      {guidebookInfo.checkoutinstr && (
                        <AboutSectionContainerRow>
                          <AboutSectionItem>
                            Check-Out Instructions:{' '}
                          </AboutSectionItem>
                          <AboutSectionItem>
                            {guidebookInfo.checkoutinstr}
                          </AboutSectionItem>
                        </AboutSectionContainerRow>
                      )}

                      {guidebookInfo.propertyType && (
                        <AboutSectionContainerRow>
                          <AboutSectionItem>Property Type: </AboutSectionItem>
                          <AboutSectionItem>
                            {guidebookInfo.propertyType}
                          </AboutSectionItem>
                        </AboutSectionContainerRow>
                      )}
                    </tbody>
                  </AboutSectionContainerTable>
                </EnableTableScroll>
              </div>
            }
            smallLineStyling={true}
          />

          {guidebookInfo.faq && (
            <StyledAccordionDropdown
              label="•GUEST FAQ•"
              isOpen={true}
              content={
                <Faq>
                  {guidebookInfo.faq?.map((faq) => {
                    return (
                      <li key={faq.question}>
                        <div>{faq.question}</div>
                        <div>{faq.answer}</div>
                      </li>
                    );
                  })}
                </Faq>
              }
              smallLineStyling={true}
            />
          )}
          <StyledAccordionDropdown
            label="•POLICIES•"
            isOpen={true}
            content={<BodyText>{guidebookInfo.policies}</BodyText>}
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•YOUR HOST•"
            isOpen={true}
            content={<BodyText>{guidebookInfo.policies}</BodyText>}
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•SERVICES AND SUPPORT•"
            isOpen={true}
            content={<BodyText>{guidebookInfo.policies}</BodyText>}
            smallLineStyling={true}
          />
        </ListContainer>

        {/* <Faq>                                         // Code below commented out -> For reference !
      {guidebookInfo.faq?.map((faq) => {
        return (
          <li key={faq.Question}>
            <div>{faq.Question}</div>
            <div>{faq.Answer}</div>
          </li>
        );
      })
      }
    </Faq> */}

        {/* <h2>{guidebookInfo.faq?.[0].Question}</h2>
    <h2>{guidebookInfo.faq?.[0].Answer}</h2> */}

        {/* Object.keys(guidebookInfo).map((guidebookKey, i) => {
      
      return (
        <div key={guidebookKey}>
          <div>{guidebookKey}</div>
          {<div>{guidebookInfo[guidebookKey as keyof GuidebookDto]}</div> }
        </div>
      );
    })
  */}
      </Container>
    )
  );
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

const EnableTableScroll = styled.div`
  overflow-x: auto;
  overflow-y: auto;
`;

const AboutSectionContainerTable = styled.table`
  ${theme.font.body};
  margin-left: 20px;
  width: 98%;
  border: 1px solid;
  border-color: #d1d1d1;
`;

const AboutSectionContainerRow = styled.tr`
  border: 1px solid;
  border-color: #d1d1d1;
`;

const AboutSectionItem = styled.td`
  padding: 14px 20px;
  border: 1px solid;
  border-color: #d1d1d1;
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
  width: 66%; // was 76%
  margin-left: auto;
  margin-right: auto;
  ${theme.screen.small} {
    width: 100%;
  }
`;

export default Guidebook;
