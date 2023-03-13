import styled from '@emotion/styled';
import { GuidebookDto } from '../../../utils/dtos';
import { theme } from '../../../utils/styles';
import LightFadeCarousel from './PhotoCarousel';
import AccordionDropdown from '../../reservations/AccordionDropdown';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { server } from '../../..';

function Guidebook() {
  const [guidebookInfo, setGuidebookInfo] = useState<GuidebookDto | null>(null);
  const [guidebookImages, setGuidebookImages] = useState<string[] | null>(null);

  const { reservationDetail } = useContext(AppContext);
  const propID = reservationDetail?.propertyId;

  useEffect(() => {
    let subscribed = true;

    if (propID) {
      (async function () {
        const response = await fetch(
          `${server}/api/guidebook/${propID}/content`
        );
        subscribed && setGuidebookInfo(await response.json());
      })();
      (async function () {
        const response = await fetch(
          `${server}/api/guidebook/${propID}/images`
        );
        subscribed && setGuidebookImages(await response.json());
      })();
    }
    return () => {
      subscribed = false;
    };
  }, [propID]);

  return (
    guidebookInfo &&
    guidebookImages && (
      <Container>
        <DisplayText>{guidebookInfo.propertyName}</DisplayText>
        <ContainerCarousel>
          <LightFadeCarousel images={guidebookImages} />
        </ContainerCarousel>

        <ListContainer>
          <StyledAccordionDropdown
            label="•ABOUT•"
            isOpen={true}
            content={
              <div>
                <TextParentContainer>
                  {guidebookInfo.propertyBio.map((paragraph) => {
                    return <TextContainer key={paragraph}>{paragraph}</TextContainer>;
                  })}
                  <EndofComponentSpacing></EndofComponentSpacing>
                </TextParentContainer>

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
                            Check-In Instructions:
                          </AboutSectionItem>
                          <AboutSectionItem>
                            {guidebookInfo.checkininstr}
                          </AboutSectionItem>
                        </AboutSectionContainerRow>
                      )}

                      {guidebookInfo.checkoutinstr && (
                        <AboutSectionContainerRow>
                          <AboutSectionItem>
                            Check-Out Instructions:
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
            content={
              <TextParentContainer>
                {guidebookInfo.policies?.map((pol) => {
                  return <TextContainer key={pol}>⁃ {pol}</TextContainer>;
                })}
              </TextParentContainer>
            }
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•HOST RECOMMENDED•"
            isOpen={true}
            content={
              <TextParentContainer>
                {guidebookInfo.hostRecommended?.map((rec) => {
                  return <TextContainer key={rec}>⁃ {rec}</TextContainer>;
                })}
              </TextParentContainer>
            }
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•SERVICES AND SUPPORT•"
            isOpen={true}
            content={
              <TextParentContainer>
                {guidebookInfo.hostServices?.map((serv) => {
                  return <TextContainer key={serv}>⁃ {serv}</TextContainer>;
                })}
              </TextParentContainer>
            }
            smallLineStyling={true}
          />
        </ListContainer>
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

const TextParentContainer = styled.div`
  word-spacing: 3px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const DisplayText = styled.h1`
  ${theme.font.displayXL};
  margin: 20px 0 15px 20px;
`;

const EndofComponentSpacing = styled.div`
  margin: 0 0 30px 0;
`;

const EnableTableScroll = styled.div`
  overflow-x: auto;
  overflow-y: auto;
`;

const AboutSectionContainerTable = styled.table`
  margin-left: 20px;
  word-spacing: 3px;
  width: 98%;
  border: 1px solid;
  border-color: #d1d1d1;
`;

const AboutSectionContainerRow = styled.tr`
  border: 1px solid;
  word-spacing: 3px;
  border-color: #d1d1d1;
`;

const AboutSectionItem = styled.td`
  padding: 14px 20px;
  word-spacing: 3px;
  border: 1px solid;
  border-color: #d1d1d1;
`;

const Container = styled.div`
  width: 100%;
`;

const StyledAccordionDropdown = styled(AccordionDropdown)`
  /* ${theme.font.guidebookBody} */
`;

const ListContainer = styled.div`
${theme.font.guidebookBody}
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
  background-color: #393939;
  margin-left: auto;
  margin-right: auto;
  ${theme.screen.small} {
    width: 100%;
  }
`;

export default Guidebook;