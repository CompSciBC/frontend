import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AlertColor,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import { useEffect, useCallback, useState } from 'react';
import {
  ExpandMore,
  MoveDown,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { theme } from '../../../../utils/styles';
import ConfirmCancelDialog from '../../../stuff/ConfirmCancelDialog';
import { GuidebookSection } from '../../../../utils/dtos';
import GuidebookEditSectionText from './GuidebookEditSectionText';
import GuidebookEditSectionList from './GuidebookEditSectionList';
import AlertPopup from '../../../stuff/AlertPopup';
import GuidebookEditSectionPropertyBio, {
  getUpdatedPropertyBio
} from './GuidebookEditSectionPropertyBio';
import {
  getArray,
  getKeyValues,
  getText,
  objectEquals
} from '../../../../utils/functions';

export interface GuidebookEditSectionProps {
  className?: string;
  sectionId: string;
  section: GuidebookSection<any>;
  onMoveDown?: Function;
  onSave: (
    sectionId: string,
    update: GuidebookSection<any>
  ) => Promise<boolean>;
  onDelete?: (sectionId: string) => Promise<boolean>;
}

/**
 * Manages the editing of a single section of a property guidebook
 *
 * @param props {@link GuidebookEditSectionProps}
 * @returns A JSX element
 */
function GuidebookEditSection({
  className,
  sectionId,
  section,
  onMoveDown,
  onSave,
  onDelete
}: GuidebookEditSectionProps) {
  const { title, type, content } = section;
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState<JSX.Element | null>(null);
  const [changed, setChanged] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: AlertColor;
    message: string;
  }>({
    open: false,
    severity: 'error',
    message: ''
  });
  const idPrefix = `${sectionId}-input-${type as string}-`;

  // initialize the content input field
  useEffect(() => {
    let subscribed = true;
    let component: JSX.Element | null = null;

    switch (type) {
      case 'text':
        component = (
          <GuidebookEditSectionText
            id={idPrefix}
            content={content}
            placeholder={title}
            onChange={(changed: string) => setChanged(changed !== content)}
          />
        );
        break;

      case 'list':
      case 'keyValue':
        component = (
          <GuidebookEditSectionList
            type={section.type as 'list' | 'keyValue'}
            idPrefix={idPrefix}
            content={content}
            placeholder={title}
            onChange={(changed: any[]) =>
              setChanged(!objectEquals(changed, content))
            }
          />
        );
        break;

      case 'bio':
        component = (
          <GuidebookEditSectionPropertyBio
            idPrefix={idPrefix}
            content={content}
            onChange={(changed: any) =>
              setChanged(!objectEquals(changed, content))
            }
          />
        );
        break;
    }

    subscribed && setInput(component);

    return () => {
      subscribed = false;
    };
  }, [section]);

  const saveButton = useCallback(
    (screen: 'lg' | 'sm') => {
      return (
        <Tooltip title="Save" arrow disableInteractive>
          <HeaderButton
            screen={screen}
            variant="text"
            onClick={(event) => {
              event.stopPropagation();

              const update: GuidebookSection<any> = {
                ...section
              };
              const selector = `textarea[id^=${idPrefix}]`;

              switch (type) {
                case 'text':
                  update.content = getText(selector);
                  break;

                case 'list':
                  update.content = getArray(selector);
                  break;

                case 'keyValue':
                  update.content = getKeyValues(selector);
                  break;

                case 'bio':
                  update.content = getUpdatedPropertyBio(idPrefix, content);
                  break;
              }

              onSave(sectionId, update).then((res) => {
                if (res) setChanged(false);
                else {
                  setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Unable to save at this time. Please try again.'
                  });
                }
              });
            }}
            sx={{ visibility: changed ? 'visible' : 'hidden' }}
          >
            <SaveOutlined sx={{ color: theme.color.BMGteal }} />
          </HeaderButton>
        </Tooltip>
      );
    },
    [sectionId, changed, onSave]
  );

  const deleteButton = useCallback((screen: 'lg' | 'sm') => {
    return (
      <Tooltip title="Delete" arrow disableInteractive>
        <HeaderButton
          screen={screen}
          variant="text"
          onClick={(event) => {
            event.stopPropagation();
            setDeleteConfirmOpen(true);
          }}
          sx={{ visibility: onDelete ? 'visible' : 'hidden' }}
        >
          <DeleteOutlined sx={{ color: theme.color.BMGteal }} />
        </HeaderButton>
      </Tooltip>
    );
  }, []);

  const handleChangeTitle = useCallback(() => {
    const update: GuidebookSection<any> = {
      ...section,
      title: getText(`input[id^=${idPrefix}title]`)
    };
    onSave(sectionId, update).then((res) => {
      if (res) setEditTitle(false);
      else {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Unable to save at this time. Please try again.'
        });
      }
    });
  }, [onSave]);

  return (
    <div className={className}>
      <StyledAccordion expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          onClick={() => setExpanded(!expanded)}
        >
          <AccordionSummaryContent>
            <TitleContainer>
              <Tooltip title="Move down" arrow disableInteractive>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveDown?.(sectionId);
                  }}
                  sx={{
                    padding: '4px',
                    visibility: onMoveDown ? 'visible' : 'hidden'
                  }}
                >
                  <MoveDown sx={{ color: theme.color.BMGteal }} />
                </IconButton>
              </Tooltip>
              {editTitle ? (
                <>
                  <TextField
                    id={`${idPrefix}title`}
                    size="small"
                    defaultValue={title}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <Tooltip title="Save" arrow disableInteractive>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleChangeTitle();
                      }}
                    >
                      <SaveOutlined sx={{ color: theme.color.BMGteal }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <h5>{section.title}</h5>
                  <Tooltip title="Edit title" arrow disableInteractive>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditTitle(true);
                      }}
                    >
                      <EditOutlined
                        fontSize="small"
                        sx={{ color: theme.color.BMGteal }}
                      />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {!expanded && changed && (
                <UnsavedChangesWrapper>(unsaved changes)</UnsavedChangesWrapper>
              )}
            </TitleContainer>
            <ButtonGroup size="small">
              {saveButton('lg')}
              {deleteButton('lg')}
            </ButtonGroup>
          </AccordionSummaryContent>
        </AccordionSummary>
        <AccordionDetails>
          <HeaderButtonContainer>
            <ButtonGroup size="small">
              {saveButton('sm')}
              {deleteButton('sm')}
            </ButtonGroup>
          </HeaderButtonContainer>
          {input}
        </AccordionDetails>
      </StyledAccordion>
      <ConfirmCancelDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        text="Are you sure you want to delete this section? This action cannot be undone."
        confirm={{
          text: 'Yes',
          action: () => {
            onDelete?.(sectionId).then((res) => {
              if (!res) {
                // TODO: FIX BUG: alert is not being set here, possibly due to the way
                // the action function is being called in confirm cancel dialog? Not sure...
                setAlert({
                  open: true,
                  severity: 'error',
                  message: 'Unable to delete at this time. Please try again.'
                });
              }
            });
          }
        }}
        cancel={{ text: 'No' }}
      />
      <AlertPopup
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </div>
  );
}

const StyledAccordion = styled(Accordion)`
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${theme.color.lightGray};
`;

const AccordionSummaryContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-right: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  h5 {
    margin: 0;
    ${theme.font.body}
    font-size: 18px;
  }
`;

const UnsavedChangesWrapper = styled.span`
  display: none;

  ${theme.screen.small} {
    display: inline;
    color: rgba(0, 0, 0, 0.25);
    font-size: smaller;
  }
`;

/*
  workaround for passing custom props to mui components. The explanation below is actually
  for Styled-Components and not Emotion, but I believe the issue is similar
  Explanation: https://github.com/styled-components/styled-components/issues/1198#issuecomment-336628848
  Fix: https://stackoverflow.com/questions/71128841/mui-system-how-to-pass-transient-props-to-styled
*/
const HeaderButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'screen'
})<{ screen?: 'lg' | 'sm' }>`
  display: ${(props) => (props?.screen === 'lg' ? 'flex' : 'none')};
  min-width: fit-content;
  padding: 4px;

  ${theme.screen.small} {
    display: ${(props) => (props?.screen === 'sm' ? 'flex' : 'none')};
  }
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  justify-content: right;
`;

export default GuidebookEditSection;
