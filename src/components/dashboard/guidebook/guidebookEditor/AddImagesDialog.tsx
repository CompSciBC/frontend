import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddImagesMetadataInput from './AddImagesMetadataInput';
import {
  GuidebookImageFiles,
  GuidebookImageMetadata
} from '../../../../utils/dtos';

export interface AddImageDialogProps {
  className?: string;
  onClose: () => void;
  onSubmit: (files: GuidebookImageFiles) => void;
}

/**
 * Provides an interface for uploading image files from the user's machine
 *
 * @param props {@link AddImageDialogProps}
 * @returns A JSX element
 */
function AddImageDialog({ className, onClose, onSubmit }: AddImageDialogProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [metadata, setMetadata] = useState<GuidebookImageMetadata[]>([]);

  const handleFilesChange = (event: any) => {
    setFiles(event.target.files);
  };

  // render file metadata inputs
  useEffect(() => {
    let subscribed = true;

    subscribed &&
      files &&
      setMetadata(
        Array.from(files).map((file) => {
          return { name: file.name, tags: [] };
        })
      );

    return () => {
      subscribed = false;
    };
  }, [files]);

  const handleChange = (meta: GuidebookImageMetadata, i: number) => {
    const updated = [...metadata];
    updated[i] = meta;
    setMetadata(updated);
  };

  const handleSubmit = () => {
    files && onSubmit({ files, metadata });
  };

  // purge data on unmount
  useEffect(() => {
    return () => {
      setFiles(null);
      setMetadata([]);
    };
  }, []);

  return (
    <Dialog className={className} open={true}>
      <DialogTitle>Select file(s)</DialogTitle>
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
          <Input
            type="file"
            size="small"
            onChange={handleFilesChange}
            inputProps={{ multiple: true }}
          />
          {Array.from(files ?? []).map((file, i) => {
            return (
              <AddImagesMetadataInput
                key={file.name}
                fileName={file.name}
                onChange={(meta: GuidebookImageMetadata) =>
                  handleChange(meta, i)
                }
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleSubmit();
            onClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddImageDialog;
