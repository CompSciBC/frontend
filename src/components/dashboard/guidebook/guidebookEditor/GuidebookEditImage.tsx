import { IconButton, ImageListItem, ImageListItemBar } from '@mui/material';
import { GuidebookImage } from '../../../../utils/dtos';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';

export interface GuidebookEditImageProps {
  className?: string;
  image: GuidebookImage;
  onDelete: () => void;
}

/**
 * An image in the guidebook edit images list
 *
 * @param props {@link GuidebookEditImageProps}
 * @returns A JSX element
 */
function GuidebookEditImage({
  className,
  image,
  onDelete
}: GuidebookEditImageProps) {
  const { url, metadata } = image;
  const [visible, setVisible] = useState(false);

  return (
    <ImageListItem
      className={className}
      sx={{ display: visible ? 'flex' : 'none' }}
    >
      <img src={url} onLoad={() => setVisible(true)} />
      <ImageListItemBar
        title={metadata.name}
        subtitle={metadata.tags.reduce(
          (prev: string, curr: string) => (prev ? `${prev}, ${curr}` : curr),
          ''
        )}
        actionIcon={
          <IconButton onClick={onDelete}>
            <Delete sx={{ color: 'white' }} />
          </IconButton>
        }
      />
    </ImageListItem>
  );
}

export default GuidebookEditImage;
