import styled from '@emotion/styled';
import { GuidebookDto, KeyValue } from '../../../utils/dtos';
import { theme } from '../../../utils/styles';
import LightFadeCarousel from './PhotoCarousel';
import AccordionDropdown from '../../reservations/AccordionDropdown';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/AppContext';
import { server } from '../../..';

function Guidebook() {
  const [guidebookInfo, setGuidebookInfo] = useState<GuidebookDto | null>(null);
  const [guidebookImages, setGuidebookImages] = useState<string[] | null>(null);

  const { reservation } = useContext(AppContext);
  const propID = reservation?.propertyId;

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
            content={(function () {
              const { content, amenities, facts, checkInInstr, checkOutInstr } =
                guidebookInfo.propertyBio;
              return (
                <div>
                  <TextParentContainer>
                    <TextContainer>{content}</TextContainer>
                    <EndofComponentSpacing />
                  </TextParentContainer>

                  <EnableTableScroll>
                    <AboutSectionContainerTable>
                      <tbody>
                        {amenities && (
                          <AboutSectionContainerRow>
                            <AboutSectionItem>Amenities: </AboutSectionItem>
                            {amenities?.map((amen) => {
                              return (
                                <AboutSectionItem key={amen}>
                                  {amen}
                                </AboutSectionItem>
                              );
                            })}
                          </AboutSectionContainerRow>
                        )}

                        {facts.map(({ key, value }) => {
                          return (
                            <AboutSectionContainerRow key={key}>
                              <AboutSectionItem>{key}: </AboutSectionItem>
                              <AboutSectionItem>{value}</AboutSectionItem>
                            </AboutSectionContainerRow>
                          );
                        })}

                        {checkInInstr && (
                          <AboutSectionContainerRow>
                            <AboutSectionItem>
                              Check-In Instructions:
                            </AboutSectionItem>
                            <AboutSectionItem>{checkInInstr}</AboutSectionItem>
                          </AboutSectionContainerRow>
                        )}

                        {checkOutInstr && (
                          <AboutSectionContainerRow>
                            <AboutSectionItem>
                              Check-Out Instructions:
                            </AboutSectionItem>
                            <AboutSectionItem>{checkOutInstr}</AboutSectionItem>
                          </AboutSectionContainerRow>
                        )}
                      </tbody>
                    </AboutSectionContainerTable>
                  </EnableTableScroll>
                </div>
              );
            })()}
            smallLineStyling={true}
          />

          {guidebookInfo.sections
            .filter((sectionId) => sectionId.includes('custom_'))
            .map((sectionId) => {
              const { title, type, content } = guidebookInfo[sectionId];
              let formattedContent: JSX.Element | null = null;

              switch (type) {
                case 'text':
                  formattedContent = <>{content as string}</>;
                  break;

                case 'list':
                  formattedContent = (
                    <>
                      {(content as string[]).map((c) => {
                        return <TextContainer key={c}>⁃ {c}</TextContainer>;
                      })}
                    </>
                  );
                  break;

                case 'keyValue':
                  formattedContent = (
                    <KeyVal>
                      {(content as KeyValue[]).map(({ key, value }) => {
                        return (
                          <li key={key}>
                            <div>{key}</div>
                            <div>{value}</div>
                          </li>
                        );
                      })}
                    </KeyVal>
                  );
                  break;
              }
              return (
                <StyledAccordionDropdown
                  key={sectionId}
                  label={`•${title.toUpperCase()}•`}
                  isOpen={true}
                  content={
                    <TextParentContainer>
                      {formattedContent}
                    </TextParentContainer>
                  }
                  smallLineStyling={true}
                />
              );
            })}
        </ListContainer>
      </Container>
    )
  );
}

const KeyVal = styled.ol`
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
  white-space: pre-wrap; // preserves newline characters
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
