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
        const response = await getGuidebookImages(propId);
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
          `${server}/api/amenities?url=${images[imageIndex].url}`
        );
        const data = (await response.json()).data;
        const updatedSuggestions = [...suggestions];
        updatedSuggestions[imageIndex] = data;
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
      <Button
        variant="outlined"
        size="small"
        startIcon={<DocumentScannerOutlined />}
        onClick={() => setOpen(true)}
      >
        Scan Photos
      </Button>
      {open && (
        <Dialog open={true}>
          <DialogTitle>Scan Photos for Amenities</DialogTitle>
          {imageIndex >= 0 ? (
            <>
              <DialogContent>
                <ImageWrapper>
                  <img
                    src={images?.[imageIndex]?.url}
                    // don't fetch suggestions until image has loaded;
                    // image is slow and UI looks weird if suggestions appear before image
                    onLoad={() => getSuggestions(imageIndex)}
                  />
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
                </ImageWrapper>
                Suggested Amenities
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

const ImageWrapper = styled.div`
  position: relative;
  width: 552px;
  max-width: 100%;
  aspect-ratio: 1/1;
  margin-bottom: 16px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const SuggestionsWrapper = styled.div`
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
