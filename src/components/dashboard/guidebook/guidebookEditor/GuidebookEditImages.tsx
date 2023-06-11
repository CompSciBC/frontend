import {
  AlertColor,
  Button,
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography
} from '@mui/material';
import AddImageDialog from './AddImagesDialog';
import { useEffect, useState } from 'react';
import {
  getGuidebookImages,
  uploadGuidebookImages,
  deleteGuidebookImage
} from '../guidebookData';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { GuidebookImage, GuidebookImageFiles } from '../../../../utils/dtos';
import ConfirmCancelDialog from '../../../stuff/ConfirmCancelDialog';
import AlertPopup from '../../../stuff/AlertPopup';
import GuidebookEditImage from './GuidebookEditImage';

export interface GuidebookEditImagesProps {
  className?: string;
  propId: string;
}

function GuidebookEditImages({ className, propId }: GuidebookEditImagesProps) {
  const [guidebookImages, setGuidebookImages] = useState<GuidebookImage[]>([]);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [deleteImage, setDeleteImage] = useState<GuidebookImage | null>(null);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: AlertColor;
    message: string;
  }>({
    open: false,
    severity: 'error',
    message: ''
  });

  // retrieve guidebook images from api
  useEffect(() => {
    let subscribed = true;

    if (propId) {
      (async function () {
        subscribed &&
          setGuidebookImages(
            await getGuidebookImages(propId, {
              width: 300,
              height: 300
            })
          );
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [propId]);

  const handleUploadImages = (files: GuidebookImageFiles) => {
    uploadGuidebookImages(propId, files).then((res) => {
      if (res.length) {
        setGuidebookImages([...guidebookImages, ...res]);
        setAlert({
          open: true,
          severity: 'success',
          message: 'Photo uploaded.'
        });
      } else {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Unable to upload photo at this time. Please try again.'
        });
      }
    });
  };

  const handleDeleteImage = () => {
    if (deleteImage) {
      deleteGuidebookImage(deleteImage.url).then((res) => {
        if (res) {
          // remove deleted image from list
          setGuidebookImages(
            [...guidebookImages].filter((i) => i !== deleteImage)
          );
          setAlert({
            open: true,
            severity: 'success',
            message: 'Photo deleted.'
          });
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Unable to delete photo at this time. Please try again.'
          });
        }
        setDeleteImage(null);
      });
    }
  };

  return (
    <>
      <ImageList className={className} cols={3}>
        <ImageListItem cols={3}>
          <ListSubheader
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            Images
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddPhotoAlternateOutlined />}
              onClick={() => setAddImagesOpen(true)}
              sx={{ height: 'max-content' }}
            >
              <Typography variant="button">Add Photos</Typography>
            </Button>
            {addImagesOpen && (
              <AddImageDialog
                onClose={() => setAddImagesOpen(false)}
                onSubmit={handleUploadImages}
              />
            )}
          </ListSubheader>
        </ImageListItem>
        {guidebookImages?.map((image) => (
          <GuidebookEditImage
            key={image.url}
            image={image}
            onDelete={() => setDeleteImage(image)}
          />
        ))}
      </ImageList>
      <ConfirmCancelDialog
        open={!!deleteImage}
        onClose={() => setDeleteImage(null)}
        text="Are you sure you want to delete this photo? This action cannot be undone."
        confirm={{
          text: 'Yes',
          action: handleDeleteImage
        }}
        cancel={{ text: 'No' }}
      />
      <AlertPopup
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </>
  );
}

export default GuidebookEditImages;
