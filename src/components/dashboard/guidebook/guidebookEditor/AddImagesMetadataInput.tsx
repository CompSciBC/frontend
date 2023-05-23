import { Autocomplete, Box, TextField } from '@mui/material';
import { GuidebookImageMetadata } from '../../../../utils/dtos';
import { useState } from 'react';

const tagOptions = [
  'Featured',
  'Kitchen',
  'Living Room',
  'Bathroom',
  'Bedroom',
  'Master Bedroom',
  'Ariel',
  'Garage'
];

export interface AddImageMetadataInputProps {
  className?: string;
  fileName: string;
  onChange: (update: GuidebookImageMetadata) => void;
}

/**
 * An input field for guidebook image metadata
 *
 * @param props {@link AddImageMetadataInputProps}
 * @returns A JSX element
 */
function AddImageMetadataInput({
  className,
  fileName,
  onChange
}: AddImageMetadataInputProps) {
  const [data, setData] = useState<GuidebookImageMetadata>({
    name: fileName,
    tags: []
  });

  const handleNameChange = (event: any) => {
    const updatedData: GuidebookImageMetadata = {
      ...data,
      name: event.target.value
    };

    setData(updatedData);
    onChange(updatedData);
  };

  const handleTagsChange = (event: any, tags: string[]) => {
    const updatedData: GuidebookImageMetadata = { ...data, tags };

    setData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box
      className={className}
      sx={{
        padding: '4px',
        width: '320px'
      }}
    >
      <TextField
        name="name"
        fullWidth
        defaultValue={fileName}
        placeholder="File name"
        size="small"
        sx={{ marginBottom: '4px' }}
        onChange={handleNameChange}
      />
      <Autocomplete
        multiple
        freeSolo
        size="small"
        defaultValue={[]}
        options={tagOptions}
        onChange={handleTagsChange}
        renderInput={(params) => (
          <TextField {...params} variant="standard" placeholder="Tags" />
        )}
      />
    </Box>
  );
}

export default AddImageMetadataInput;
