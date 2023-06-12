import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { GuidebookSection, GuidebookSectionType } from '../../../../utils/dtos';
import { theme } from '../../../../utils/styles';
import styled from '@emotion/styled';

const guidebookSectionTypes = [
  {
    label: 'Text',
    value: 'text'
  },
  {
    label: 'List',
    value: 'list'
  },
  {
    label: 'Key-Value',
    value: 'keyValue'
  }
];

export interface AddSectionDialogProps {
  className?: string;
  onSubmit: (section: GuidebookSection<any>) => void;
}

function AddSectionDialog({ className, onSubmit }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<GuidebookSection<any>>({
    type: 'text',
    title: '',
    content: null
  });

  const handleUpdateSection = (event: any) => {
    const updated = { ...section };
    const { name, value } = event.target;

    updated[name as keyof GuidebookSection<any>] = value;

    if ((name as keyof GuidebookSection<any>) === 'type') {
      // initialize the content to appropriate data type
      switch (value as GuidebookSectionType) {
        case 'text':
          updated.content = '';
          break;

        case 'list':
        case 'keyValue':
          updated.content = [];
          break;
      }
    }
    setSection(updated as GuidebookSection<any>);
  };

  return (
    <div className={className}>
      <AddSectionButton
        variant="contained"
        size="small"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        <Typography variant="button">Add Section</Typography>
      </AddSectionButton>
      <Dialog className={className} open={open}>
        <DialogTitle>New Section</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <TextField
              select
              id="add-section-type"
              label="Type"
              fullWidth
              size="small"
              name="type"
              defaultValue="text"
              onChange={handleUpdateSection}
            >
              {guidebookSectionTypes.map(({ label, value }) => {
                return (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              id="add-section-title"
              label="Title"
              fullWidth
              size="small"
              name="title"
              placeholder="Title"
              onChange={handleUpdateSection}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onSubmit(section);
              setOpen(false);
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const AddSectionButton = styled(Button)`
  background-color: ${theme.color.teal};
  color: white;

  :hover {
    background-color: white;
    color: ${theme.color.teal};
  }
`;

export default AddSectionDialog;
