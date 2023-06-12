import { GuidebookPropertyBio, KeyValue } from '../../../../utils/dtos';
import GuidebookEditSectionText from './GuidebookEditSectionText';
import GuidebookEditSectionList from './GuidebookEditSectionList';
import styled from '@emotion/styled';
import { theme } from '../../../../utils/styles';
import { useState } from 'react';
import { getArray, getKeyValues, getText } from '../../../../utils/functions';
import ScanImagesDialog from './ScanImagesDialog';

/**
 * Generates an id for the property bio input element
 *
 * @param idPrefix A string to prefix to the id
 * @param field The property bio input field
 * @returns A string id for the input element
 */
const getInputId = (idPrefix: string, field: keyof GuidebookPropertyBio) =>
  `${idPrefix}${field as string}`;

/**
 * Gets the updated property bio state
 *
 * @param idPrefix The id prefix assigned to the {@link GuidebookEditSectionPropertyBio}
 * @param currentBio The current state of the property bio
 * @returns The updated state of the property bio
 */
export const getUpdatedPropertyBio = (
  idPrefix: string,
  currentBio: GuidebookPropertyBio
): GuidebookPropertyBio => {
  const selector = (field: keyof GuidebookPropertyBio) =>
    `textarea[id^=${getInputId(idPrefix, field)}]`;

  const updated = {
    ...currentBio,
    about: getText(selector('about')),
    amenities: getArray(selector('amenities')),
    facts: getKeyValues(selector('facts')),
    checkInInstr: getText(selector('checkInInstr')),
    checkOutInstr: getText(selector('checkOutInstr'))
  };
  return updated;
};

export interface GuidebookEditSectionPropertyBioProps {
  className?: string;
  idPrefix: string;
  content: GuidebookPropertyBio;
  onChange: (changed: GuidebookPropertyBio) => void;
}

/**
 * Provides an interface for editing the property bio section of a guidebook
 *
 * @param props {@link GuidebookEditSectionPropertyBioProps}
 * @returns A JSX element
 */
function GuidebookEditSectionPropertyBio({
  className,
  idPrefix,
  content,
  onChange
}: GuidebookEditSectionPropertyBioProps) {
  const [bio, setBio] = useState(content);
  const { about, facts, checkInInstr, checkOutInstr } = content;

  const handleChange = (field: keyof GuidebookPropertyBio, update: any) => {
    const updatedBio: GuidebookPropertyBio = { ...bio, [field]: update };
    setBio(updatedBio);
    onChange(updatedBio);
  };

  return (
    <Container className={className}>
      <SectionBorder>
        <h6>Property Description</h6>
        <GuidebookEditSectionText
          id={getInputId(idPrefix, 'about')}
          content={about}
          placeholder="Property bio"
          onChange={(changed: string) => handleChange('about', changed)}
        />
      </SectionBorder>
      <ColumnContainer>
        <SectionBorder>
          <h6>Check-in Instructions</h6>
          <GuidebookEditSectionText
            id={getInputId(idPrefix, 'checkInInstr')}
            content={checkInInstr ?? ''}
            placeholder="Instructions for checking-in"
            onChange={(changed: string) =>
              handleChange('checkInInstr', changed)
            }
            rows={6}
          />
        </SectionBorder>
        <SectionBorder>
          <h6>Check-out Instructions</h6>
          <GuidebookEditSectionText
            id={getInputId(idPrefix, 'checkOutInstr')}
            content={checkOutInstr ?? ''}
            placeholder="Instructions for checking-out"
            onChange={(changed: string) =>
              handleChange('checkOutInstr', changed)
            }
            rows={6}
          />
        </SectionBorder>
      </ColumnContainer>
      <ColumnContainer>
        <SectionBorder>
          <AmenityHeader>
            Amenities
            <ScanImagesDialog
              existingAmenities={bio.amenities}
              onSubmit={(additions: string[]) => {
                const updatedAmenities = [...bio.amenities, ...additions];
                handleChange('amenities', updatedAmenities);
              }}
            />
          </AmenityHeader>
          <GuidebookEditSectionList
            type="list"
            idPrefix={getInputId(idPrefix, 'amenities')}
            content={bio.amenities}
            placeholder="Amenity"
            onChange={(changed: string[]) => handleChange('amenities', changed)}
          />
        </SectionBorder>
        <SectionBorder>
          <h6>Facts</h6>
          <GuidebookEditSectionList
            type="keyValue"
            idPrefix={getInputId(idPrefix, 'facts')}
            content={facts}
            onChange={(changed: KeyValue[]) => handleChange('facts', changed)}
          />
        </SectionBorder>
      </ColumnContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h6 {
    margin: 0;
    ${theme.font.body}
  }
`;

const SectionBorder = styled.div`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  color: ${theme.color.BMGdarkblue};
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 16px;

  > div {
    width: 50%;
  }

  ${theme.screen.small} {
    flex-direction: column;

    > div {
      width: 100%;
    }
  }
`;

const AmenityHeader = styled.h6`
  display: flex;
  justify-content: space-between;
`;

export default GuidebookEditSectionPropertyBio;
