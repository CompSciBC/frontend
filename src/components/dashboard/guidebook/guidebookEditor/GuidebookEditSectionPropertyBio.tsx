import { GuidebookDto } from '../../../../utils/dtos';
import GuidebookEditSectionText from './GuidebookEditSectionText';
import GuidebookEditSectionList from './GuidebookEditSectionList';
import styled from '@emotion/styled';
import { theme } from '../../../../utils/styles';

export type GuidebookPropertyBio = GuidebookDto['propertyBio'];

export interface GuidebookEditSectionPropertyBioProps {
  className?: string;
  idPrefix: string;
  propertyBio: GuidebookPropertyBio;
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
  propertyBio,
  onChange
}: GuidebookEditSectionPropertyBioProps) {
  const handleChange = (field: keyof GuidebookPropertyBio, update: any) => {
    const updatedBio = { ...propertyBio };
    updatedBio[field] = update;
    onChange(updatedBio);
  };

  return (
    <Container className={className}>
      <SectionBorder>
        <h6>Property Description</h6>
        <GuidebookEditSectionText
          id={`${idPrefix}-content-`}
          content={propertyBio.content}
          placeholder="Property bio"
          onChange={(changed: string) => handleChange('content', changed)}
        />
      </SectionBorder>
      <ColumnContainer>
        <SectionBorder>
          <h6>Check-in Instructions</h6>
          <GuidebookEditSectionText
            id={`${idPrefix}-checkInInstr-`}
            content={propertyBio.checkInInstr ?? ''}
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
            id={`${idPrefix}-checkOutInstr-`}
            content={propertyBio.checkOutInstr ?? ''}
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
          <h6>Amenities</h6>
          <GuidebookEditSectionList
            type="list"
            idPrefix={`${idPrefix}-amenities-`}
            content={propertyBio.amenities}
            placeholder="Amenity"
            onChange={(changed: any[]) => handleChange('amenities', changed)}
          />
        </SectionBorder>
        <SectionBorder>
          <h6>Facts</h6>
          <GuidebookEditSectionList
            type="keyValue"
            idPrefix={`${idPrefix}-facts-`}
            content={propertyBio.facts}
            onChange={(changed: any[]) => handleChange('facts', changed)}
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
  }
`;

const SectionBorder = styled.div`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
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

export default GuidebookEditSectionPropertyBio;
