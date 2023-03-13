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
                <BodyTextBio>
                  {guidebookInfo.propertyBio.map((paragraph) => {
                    return <BodyText key={paragraph}>{paragraph}</BodyText>;
                  })}
                </BodyTextBio>

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
            content={
              <BodyText>
                {guidebookInfo.policies?.map((pol) => {
                  return <div key={pol}>{pol}</div>;
                })}
              </BodyText>
            }
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•HOST RECOMMENDED•"
            isOpen={true}
            content={
              <BodyText>
                {guidebookInfo.hostRecommended?.map((rec) => {
                  return <div key={rec}>{rec}</div>;
                })}
              </BodyText>
            }
            smallLineStyling={true}
          />
          <StyledAccordionDropdown
            label="•SERVICES AND SUPPORT•"
            isOpen={true}
            content={
              <BodyText>
                {guidebookInfo.hostServices?.map((serv) => {
                  return <div key={serv}>{serv}</div>;
                })}
              </BodyText>
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

const BodyText = styled.div`
  ${theme.font.guidebookBody};
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const BodyTextBio = styled.div`
  ${theme.font.guidebookBody};
  margin: 9px;
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
  ${theme.font.guidebookBody};
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
  ${theme.font.guidebookBody}
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
