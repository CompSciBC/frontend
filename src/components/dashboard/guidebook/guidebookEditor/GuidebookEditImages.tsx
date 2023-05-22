import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography
} from '@mui/material';
import AddImageDialog from './AddImagesDialog';
import { useEffect, useState } from 'react';
import { getGuidebookImages, uploadGuidebookImages } from '../guidebookData';
import { AddPhotoAlternateOutlined, Delete } from '@mui/icons-material';
import { GuidebookImageFiles } from '../../../../utils/dtos';

export interface GuidebookEditImagesProps {
  className?: string;
  propId: string;
}

function GuidebookEditImages({ className, propId }: GuidebookEditImagesProps) {
  const [guidebookImages, setGuidebookImages] = useState<string[]>([]);
  const [addImagesOpen, setAddImagesOpen] = useState(false);

  // retrieve guidebook images from api
  useEffect(() => {
    let subscribed = true;

    if (propId) {
      (async function () {
        subscribed && setGuidebookImages(await getGuidebookImages(propId));
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [propId]);

  const handleUploadImages = (files: GuidebookImageFiles) => {
    (async function () {
      uploadGuidebookImages(propId, files).then((res) => {
        if (res) {
          // TODO: replace with alert component
          window.alert('success');
        }
      });
    })();
  };

  return (
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
      {guidebookImages?.map((item, i) => {
        return (
          <ImageListItem key={item}>
            <img src={item} loading="lazy" />
            <ImageListItemBar
              // TODO: get filename and tags from API
              title={i}
              subtitle={i}
              actionIcon={
                <IconButton
                  onClick={() => {
                    /* TODO: implement */
                    window.alert('Delete image');
                  }}
                >
                  <Delete sx={{ color: 'white' }} />
                </IconButton>
              }
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}

export default GuidebookEditImages;
