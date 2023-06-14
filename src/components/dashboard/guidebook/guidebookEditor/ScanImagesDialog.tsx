/* @typescript-eslint/restrict-template-expressions */
import { DocumentScannerOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AmenitySuggestion, GuidebookImage } from '../../../../utils/dtos';
import { getGuidebookImages } from '../guidebookData';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { server } from '../../../..';
import AmenityBoundingBox, { BoxColor } from './AmenityBoundingBox';
import { theme } from '../../../../utils/styles';

interface SelectedSuggestions {
  [key: string]: boolean;
}

const BOX_COLORS: BoxColor[] = [
  { fill: '#00FF00', font: 'black' }, // lime
  { fill: '#00FFFF', font: 'black' }, // cyan
  { fill: '#FFD700', font: 'black' }, // gold
  { fill: '#FF00FF', font: 'white' } // magenta
];
let colorIndex = -1;

/*
  these are the fixed heights on the dialog component
  32px dialog padding-top
  64px dialog title
  16px img wrapper margin bottom
  24px suggestions title
  192px suggestion wrapper
  20px dialog content padding bottom
  52.5px dialog actions
  32px dialog padding-bottom
*/
const DIALOG_HEIGHT = 32 + 64 + 16 + 24 + 192 + 20 + 52.5 + 32;

export interface ScanImagesDialogProps {
  className?: string;
  existingAmenities: string[];
  onSubmit: (selections: string[]) => void;
}

function ScanImagesDialog({
  className,
  existingAmenities,
  onSubmit
}: ScanImagesDialogProps) {
  const { propId } = useParams();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<GuidebookImage[]>([]);
  const [imageIndex, setImageIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AmenitySuggestion[][]>([]);
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<SelectedSuggestions>({});

  // fetch property images and initialize suggestions to empty array
  useEffect(() => {
    let subscribed = true;

    (async function () {
      if (open && propId) {
        const height = window.innerHeight - DIALOG_HEIGHT;
        const dimensions = { width: height, height };
        const response = await getGuidebookImages(propId, dimensions);
        subscribed && setImages(response);
        subscribed && setSuggestions(response.map(() => []));
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [open]);

  const handlePrevious = () => {
    setImageIndex(imageIndex - 1);
  };

  const handleNext = () => {
    setImageIndex(imageIndex + 1);
    setLoading(true);
  };

  const getSuggestions = (index: number) => {
    (async function () {
      if (!suggestions?.[index]?.length) {
        const response = await fetch(
          `${server}/api/amenities?url=${images[index].url}`
        );
        const data = (await response.json()).data;
        const updatedSuggestions = [...suggestions];
        updatedSuggestions[index] = data;
        setSuggestions(updatedSuggestions);
      }
      setLoading(false);
    })();
  };

  const handleInputChange = (event: any) => {
    const name = event.target.value;
    const updatedSelected = { ...selections };

    if (updatedSelected[name]) updatedSelected[name] = !updatedSelected[name];
    else updatedSelected[name] = true;

    setSelections(updatedSelected);
  };

  const handleClose = () => {
    setOpen(false);
    setImageIndex(-1);
    setSuggestions([]);
    setSelections({});
  };

  const handleSubmit = () => {
    const amenities = Object.entries(selections)
      .filter(([, selected]) => selected)
      .map(([name]) => name);

    onSubmit(amenities);
    handleClose();
  };

  return (
    <div className={className}>
      <ScanButton
        variant="contained"
        size="small"
        startIcon={<DocumentScannerOutlined />}
        onClick={() => setOpen(true)}
      >
        Scan Photos
      </ScanButton>
      {open && (
        <Dialog open={true}>
          <DialogTitle>Scan Photos for Amenities</DialogTitle>
          {imageIndex >= 0 ? (
            <>
              <DialogContent>
                <ImageWrapper>
                  <div>
                    {!suggestions.length ? (
                      /*
                        need to display loading if suggestions not initialized
                        because sometimes the image loads before the useEffect triggered
                        by 'open' runs, which means getSuggestions() will run before
                        suggestions is initialized, and then will get overwritten when
                        the useEffect runs afterward. This is a problem caused when the
                        dialog is opened again after being closed
                      */
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <img
                        src={images?.[imageIndex]?.url}
                        // don't fetch suggestions until image has loaded;
                        // image is slow and UI looks weird if suggestions appear before image
                        onLoad={() => getSuggestions(imageIndex)}
                      />
                    )}
                    {suggestions?.[imageIndex]?.map(({ name, boxes }) => {
                      return boxes.map((box, i) => {
                        colorIndex = (colorIndex + 1) % BOX_COLORS.length;

                        return (
                          <AmenityBoundingBox
                            key={`${name}-${i}`}
                            name={name}
                            box={box}
                            color={BOX_COLORS[colorIndex]}
                          />
                        );
                      });
                    })}
                  </div>
                </ImageWrapper>
                <SuggestionsTitle>Suggested Amenities</SuggestionsTitle>
                <SuggestionsWrapper>
                  {loading ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container>
                      {suggestions?.[imageIndex]?.map(
                        (suggestion: AmenitySuggestion) => {
                          const { name, confidence } = suggestion;

                          const alreadyExistsInAmenityList =
                            existingAmenities.includes(name);

                          const checked =
                            alreadyExistsInAmenityList ||
                            selections[name] ||
                            false;

                          return (
                            <Grid item key={name} sm={6}>
                              <FormControlLabel
                                // default checkbox has too much padding
                                control={<Checkbox sx={{ padding: '4px' }} />}
                                // label has default negative padding for some reason, which causes the
                                // component to overflow the grid item when the checkbox padding is modified
                                sx={{ marginLeft: '0' }}
                                disabled={alreadyExistsInAmenityList}
                                checked={checked}
                                onChange={handleInputChange}
                                value={name}
                                label={
                                  <>
                                    {name}
                                    <Confidence>
                                      {' '}
                                      ({confidence.toFixed(2)}%)
                                    </Confidence>
                                  </>
                                }
                              />
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  )}
                </SuggestionsWrapper>
              </DialogContent>
              <DialogActions>
                <ImageCounter>{`${imageIndex + 1}/${
                  images.length
                }`}</ImageCounter>
                <Button onClick={handlePrevious} disabled={imageIndex === 0}>
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={imageIndex === images.length - 1}
                >
                  Next
                </Button>
                <Button onClick={handleSubmit}>Finish</Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogContent>
                This tool uses artificial intelligence to scan photos for common
                amenities. Click next to proceed with scanning your photos, or
                cancel to exit.
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleNext}>Start</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}

const ScanButton = styled(Button)`
  background-color: ${theme.color.BMGnavyblue};
  color: white;
  ${theme.font.caption}

  :hover {
    background-color: white;
    color: ${theme.color.BMGnavyblue};
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  --dialog-height: ${`${DIALOG_HEIGHT}px`};
  --remaining-space: calc(100vh - var(--dialog-height));
  max-height: var(--remaining-space);
  width: 100%;
  aspect-ratio: 1/1;

  > div {
    position: relative;

    img {
      max-height: var(--remaining-space);
      max-width: 100%;
      aspect-ratio: 1/1;
    }
  }
`;

const SuggestionsTitle = styled.div`
  margin-top: 16px;
`;

const SuggestionsWrapper = styled.div`
  width: 552px;
  max-width: 100%;
  height: 192px;
  overflow-y: scroll;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.25);
`;

const Confidence = styled.span`
  font-size: small;
  color: rgba(1, 1, 1, 0.33);
`;

const ImageCounter = styled.div`
  margin: 0 auto 0 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
`;

export default ScanImagesDialog;
