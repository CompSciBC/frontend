import styled from '@emotion/styled';
import { Box, FormControlLabel, Stack, Switch } from '@mui/material';
import { GuidebookDto2 } from '../../../../utils/dtos';
import { useEffect, useState } from 'react';
import { theme } from '../../../../utils/styles';
import GuidebookEditSection from './GuidebookEditSection';
import gb from './gb1.json';
import { useParams } from 'react-router-dom';

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
  const [guidebook, setGuidebook] = useState<GuidebookDto2 | null>(null);
  const [order, setOrder] = useState<string[]>([]);

  // retrieve guidebook content from api
  useEffect(() => {
    let subscribed = true;

    if (propId) {
      (async function () {
        // TODO:
        // const gb: GuidebookDto2 = await fetch(
        //   `${server}/api/guidebook/${reservation.propertyId}/content`
        // ).then(async (res) => await res.json());

        // subscribed && setGuidebook(gb);
        subscribed && setGuidebook(gb as unknown as GuidebookDto2);
        subscribed && setOrder(gb.sections);
      })();
    }

    return () => {
      subscribed = false;
    };
  }, [propId]);

  const handleSave = async (
    sectionId: string,
    update: any
  ): Promise<boolean> => {
    if (guidebook) {
      const updatedGuidebook: GuidebookDto2 = {
        ...guidebook,
        [sectionId]: {
          ...guidebook[sectionId],
          content: update
        }
      };
      setGuidebook(updatedGuidebook);

      return true;
    } else {
      return false;
    }
  };

  const handleDelete = async (sectionId: string): Promise<boolean> => {
    if (guidebook) {
      const newSections = [...guidebook.sections];
      const index = newSections.indexOf(sectionId);
      if (index && index >= 0) newSections.splice(index, 1);

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const updatedGuidebook = {
        ...guidebook,
        sections: newSections
      } as GuidebookDto2;

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete updatedGuidebook[sectionId];

      setGuidebook(updatedGuidebook);

      return true;
    } else {
      return false;
    }
  };

  // post updated guidebook to api
  useEffect(() => {
    let subscribed = true;

    // TODO: post to api
    subscribed && console.log(guidebook);

    return () => {
      subscribed = false;
    };
  }, [guidebook]);

  // swap index i and i+1
  const handleMoveDown = (id: string) => {
    const i = order.indexOf(id);
    const newOrder = [...order];
    const current = newOrder[i];
    newOrder[i] = newOrder[i + 1];
    newOrder[i + 1] = current;
    setOrder(newOrder);
    // TODO: immediately save this order change to the API
  };

  return (
    <Container>
      <Header>
        <FormControlLabel
          control={<Switch disableRipple />}
          label="View as Guest"
          labelPlacement="start"
          onChange={() => setGuestView(!guestView)}
        />
      </Header>
      <EditorContainer className={className}>
        <Box sx={{ width: '100%' }}>
          {guidebook && (
            <Stack>
              {order.map((sectionId, i) => {
                return guidebook[sectionId] ? (
                  <GuidebookEditSection
                    key={sectionId}
                    sectionId={sectionId}
                    section={guidebook[sectionId]}
                    onMoveDown={
                      // last section will not have move down logic as it cannot move down further
                      i < order.length - 1
                        ? () => handleMoveDown(sectionId)
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
        </Box>
      </EditorContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: end;
  width: 100%;
  padding: 8px 16px;
  background-color: ${theme.color.lightGray};

  /* the toggle switch's knob has a large shadow on hover, which is causing it to
  overflow the header container on the right; overflow hidden to prevent that */
  overflow: hidden;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 32px 32px 32px;
`;

export default GuidebookEditor;
