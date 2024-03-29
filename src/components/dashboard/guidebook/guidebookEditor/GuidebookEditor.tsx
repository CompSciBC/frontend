import styled from '@emotion/styled';
import {
  AlertColor,
  Box,
  FormControlLabel,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { GuidebookDto, GuidebookSection } from '../../../../utils/dtos';
import { useCallback, useEffect, useState } from 'react';
import { theme } from '../../../../utils/styles';
import GuidebookEditSection from './GuidebookEditSection';
import { useParams } from 'react-router-dom';
import AlertPopup from '../../../stuff/AlertPopup';
import Guidebook from '../Guidebook';
import AddSectionDialog from './AddSectionDialog';
import { getGuidebookContent, uploadGuidebookContent } from '../guidebookData';
import GuidebookEditImages from './GuidebookEditImages';

/**
 * Generates a object key name for a new custom guidebook section
 *
 * @param title The title of the new section
 * @returns A property name to be used as the key for the new section
 */
const createCustomSectionId = (title: string) => {
  return `custom_${title}`;
};

/**
 * Checks to see if the given sectionId is a host custom defined guidebook section
 *
 * @param sectionId A section id
 * @returns True if the sectionId is not a defined property in the GuidebookDto type
 */
const isCustomGuidebookSection = (sectionId: string) => {
  return sectionId.includes(createCustomSectionId(''));
};

export interface GuidebookEditorProps {
  className?: string;
}

/**
 * Provides an interface for editing a property guidebook
 *
 * @param props {@link GuidebookEditorProps}
 * @returns A JSX element
 */
function GuidebookEditor({ className }: GuidebookEditorProps) {
  const { propId } = useParams();
  const [guestView, setGuestView] = useState(false);
  const [guidebook, setGuidebook] = useState<GuidebookDto | null>(null);

  // true if guidebook has diverged from s3
  // this is a hack to prevent calling the api on initial load of the guidebook
  const [guidebookUpdated, setGuidebookUpdated] = useState(false);

  const [alert, setAlert] = useState<{
    open: boolean;
    severity: AlertColor;
    message: string;
  }>({
    open: false,
    severity: 'error',
    message: ''
  });

  // retrieve guidebook content from api
  useEffect(() => {
    let subscribed = true;

    if (propId) {
      (async function () {
        subscribed && setGuidebook(await getGuidebookContent(propId));
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [propId]);

  const handleSave = useCallback(
    async (
      sectionId: string,
      update: GuidebookSection<any>
    ): Promise<boolean> => {
      if (guidebook) {
        const updatedGuidebook: GuidebookDto = {
          ...guidebook,
          [sectionId]: update
        };
        setGuidebook(updatedGuidebook);
        setGuidebookUpdated(true);

        return true;
      } else {
        return false;
      }
    },
    [guidebook]
  );

  const handleDelete = useCallback(
    async (sectionId: string): Promise<boolean> => {
      if (guidebook) {
        const newSections = [...guidebook.sections];
        const index = newSections.indexOf(sectionId);
        if (index && index >= 0) newSections.splice(index, 1);

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const updatedGuidebook = {
          ...guidebook,
          sections: newSections
        } as GuidebookDto;

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete updatedGuidebook[sectionId];

        setGuidebook(updatedGuidebook);
        setGuidebookUpdated(true);

        return true;
      } else {
        return false;
      }
    },
    [guidebook]
  );

  // swap index i and i+1
  const handleMoveDown = useCallback(
    (id: string) => {
      if (guidebook) {
        const i = guidebook.sections.indexOf(id);
        const newOrder = [...guidebook.sections];
        const current = newOrder[i];
        newOrder[i] = newOrder[i + 1];
        newOrder[i + 1] = current;

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const updatedGuidebook = {
          ...guidebook,
          sections: newOrder
        } as GuidebookDto;

        setGuidebook(updatedGuidebook);
        setGuidebookUpdated(true);
      }
    },
    [guidebook]
  );

  const handleAddSection = useCallback(
    (section: GuidebookSection<any>) => {
      const newSectionId = `custom_${section.title.replace(' ', '')}`;

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const newGuidebook = {
        ...guidebook,
        [newSectionId]: section,
        sections: [...guidebook!.sections, newSectionId]
      } as GuidebookDto;

      setGuidebook(newGuidebook);
      setGuidebookUpdated(true);
    },
    [guidebook]
  );

  // post updated guidebook to api
  useEffect(() => {
    let subscribed = true;

    if (propId && guidebookUpdated && guidebook) {
      (async function () {
        uploadGuidebookContent(propId, guidebook)
          .then(() => {
            subscribed && setGuidebookUpdated(false);
            subscribed &&
              setAlert({
                open: true,
                severity: 'success',
                message: 'Saved successfully.'
              });
          })
          .catch((err) => {
            subscribed &&
              setAlert({
                open: true,
                severity: 'error',
                message: err
              });
          });
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [guidebookUpdated]);

  return (
    <>
      {propId && (
        <Container>
          <Header guestView={guestView}>
            {!guestView && (
              <>
                <AddSectionDialog onSubmit={handleAddSection} />
                <Typography
                  variant="h6"
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  Guidebook Editor
                </Typography>
              </>
            )}
            <FormControlLabel
              control={<Switch disableRipple />}
              label="View as Guest"
              labelPlacement="start"
              onChange={() => setGuestView(!guestView)}
            />
          </Header>
          {guestView ? (
            <Guidebook propertyId={propId} />
          ) : (
            <EditorContainer className={className}>
              <Box sx={{ width: '100%' }}>
                {guidebook && (
                  <Stack spacing={1.5} sx={{ marginBottom: '16px' }}>
                    {guidebook.sections?.map((sectionId, i) => {
                      return guidebook[sectionId] ? (
                        <GuidebookEditSection
                          key={sectionId}
                          sectionId={sectionId}
                          section={guidebook[sectionId]}
                          onMoveDown={
                            // last section will not have move down logic as it cannot move down further
                            i < guidebook.sections.length - 1
                              ? handleMoveDown
                              : undefined
                          }
                          onSave={handleSave}
                          onDelete={
                            // only host's custom defined sections can be deleted
                            isCustomGuidebookSection(sectionId)
                              ? handleDelete
                              : undefined
                          }
                        />
                      ) : null;
                    })}
                  </Stack>
                )}
                <GuidebookEditImages propId={propId} />
              </Box>
            </EditorContainer>
          )}
        </Container>
      )}
      <AlertPopup
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </>
  );
}

const Container = styled.div`
  width: 100%;
  position: relative;

  .MuiInputBase-root {
    background-color: white;
  }
`;

const Header = styled.div<{ guestView: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: ${(props) => (props.guestView ? 'end' : 'space-between')};
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  background-color: ${theme.color.lightGray};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  /* the toggle switch's knob has a large shadow on hover, which is causing it to
  overflow the header container on the right; overflow hidden to prevent that */
  overflow: hidden;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 32px 32px 32px;
`;

export default GuidebookEditor;
