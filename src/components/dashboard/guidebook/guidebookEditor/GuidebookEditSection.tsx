import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AlertColor,
  Button,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import { useEffect, useCallback, useState } from 'react';
import {
  ExpandMore,
  MoveDown,
  SaveOutlined,
  DeleteOutlined
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { theme } from '../../../../utils/styles';
import ConfirmCancelDialog from '../../../stuff/ConfirmCancelDialog';
import { GuidebookSection, KeyValue } from '../../../../utils/dtos';
import GuidebookEditSectionText from './GuidebookEditSectionText';
import GuidebookEditSectionList from './GuidebookEditSectionList';
import AlertPopup from '../../../stuff/AlertPopup';
import GuidebookEditSectionPropertyBio, {
  GuidebookPropertyBio
} from './GuidebookEditSectionPropertyBio';

/**
 * Checks the given objects for deep equality (Thanks ChatGPT!)
 *
 * @param a An object
 * @param b An object
 * @returns True if a and b are equivalent
 */
const objectEquals = (a: any, b: any): boolean => {
  if (typeof a !== typeof b) {
    return false;
  }

  if (a === null || a === undefined || typeof a !== 'object') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!objectEquals(a[i], b[i])) {
        return false;
      }
    }
  } else {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const key of aKeys) {
      if (!objectEquals(a[key], b[key])) return false;
    }
  }

  return true;
};

export interface GuidebookEditSectionProps {
  className?: string;
  sectionId: string;
  section: GuidebookSection<any>;
  onMoveDown?: Function;
  onSave: (sectionId: string, update: any) => Promise<boolean>;
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
            propertyBio={section as GuidebookPropertyBio}
            onChange={(changed: any) =>
              setChanged(!objectEquals(changed, section))
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

              let update: any = null;
              const selector = `textarea[id^=${idPrefix}]`;

              switch (type) {
                case 'text':
                  update =
                    document.querySelector<HTMLInputElement>(selector)?.value;
                  break;

                case 'list':
                  update = Array.from(
                    document.querySelectorAll<HTMLInputElement>(selector),
                    (x) => x?.value
                  );
                  break;

                case 'keyValue': {
                  const inputs = Array.from(
                    document.querySelectorAll<HTMLInputElement>(selector),
                    (x) => x?.value
                  );
                  const kv: KeyValue[] = [];

                  for (let i = 0; i < inputs.length; i += 2) {
                    kv.push({
                      key: inputs[i],
                      value: inputs[i + 1]
                    });
                  }
                  update = kv;
                  break;
                }
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
            <SaveOutlined />
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
          <DeleteOutlined />
        </HeaderButton>
      </Tooltip>
    );
  }, []);

  return (
    <div className={className}>
      <Accordion expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          onClick={() => setExpanded(!expanded)}
        >
          <AccordionSummaryContent>
            <TitleContainer>
              <Tooltip title="Move down" arrow disableInteractive>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    onMoveDown?.(sectionId);
                  }}
                  sx={{
                    padding: '4px',
                    minWidth: 'fit-content',
                    visibility: onMoveDown ? 'visible' : 'hidden'
                  }}
                >
                  <MoveDown />
                </Button>
              </Tooltip>
              <h5>{section.title}</h5>
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
      </Accordion>
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
