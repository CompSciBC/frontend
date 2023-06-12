import { TextField } from '@mui/material';
import { KeyValue } from '../../../../utils/dtos';
import styled from '@emotion/styled';

export interface GuidebookEditSectionKeyValueProps {
  className?: string;
  idPrefix: string;
  content: KeyValue;
  onChange: (changed: KeyValue) => void;
}

/**
 * A pair of text input fields for a key/value data pair
 *
 * @param props {@link GuidebookEditSectionKeyValueProps}
 * @returns A JSX element
 */
function GuidebookEditSectionKeyValue({
  className,
  idPrefix,
  content,
  onChange
}: GuidebookEditSectionKeyValueProps) {
  const handleChange = () => {
    const [key, value] = Array.from(
      document.querySelectorAll<HTMLInputElement>(`textarea[id^=${idPrefix}]`),
      (x) => x?.value
    );

    onChange({ key, value });
  };

  return (
    <Container className={className}>
      <TextField
        id={`${idPrefix}key`}
        fullWidth
        multiline
        size="small"
        minRows={1}
        maxRows={12}
        defaultValue={content.key}
        placeholder="Key"
        onChange={handleChange}
      />
      <TextField
        id={`${idPrefix}value`}
        fullWidth
        multiline
        size="small"
        minRows={1}
        maxRows={12}
        defaultValue={content.value}
        placeholder="Value"
        onChange={handleChange}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
`;

export default GuidebookEditSectionKeyValue;
