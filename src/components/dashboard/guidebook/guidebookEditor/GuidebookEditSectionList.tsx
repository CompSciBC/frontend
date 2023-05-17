import { Add, Delete, MoveDown } from '@mui/icons-material';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip
} from '@mui/material';
import { useState } from 'react';
import ConfirmCancelDialog from '../../../stuff/ConfirmCancelDialog';
import GuidebookEditSectionKeyValue from './GuidebookEditSectionKeyValue';
import { KeyValue } from '../../../../utils/dtos';

export interface GuidebookEditSectionListProps {
  className?: string;
  type: 'list' | 'keyValue';
  idPrefix: string;
  content: any[];
  placeholder?: string;
  onChange: (changed: any[]) => void;
}

/**
 * A list of text input fields for editing a guidebook section list content
 *
 * @param props {@link GuidebookEditSectionListProps}
 * @returns A JSX element
 */
function GuidebookEditSectionList({
  className,
  type,
  idPrefix,
  content,
  placeholder,
  onChange
}: GuidebookEditSectionListProps) {
  const [order, setOrder] = useState(content);
  const [deleteItemIndex, setDeleteItemIndex] = useState(-1);

  // gets all the inputs' state to use in each action (moveDown, add, and delete).
  // This is necessary because I don't want to save the inputs' values as a state variable
  // because that would make it a controlled component, which was causing issues
  const getCurrentOrder = (): any[] => {
    const inputValues = Array.from(
      document.querySelectorAll<HTMLInputElement>(`textarea[id^=${idPrefix}]`),
      (x) => x?.value
    );

    switch (type) {
      case 'list':
        return inputValues;

      case 'keyValue': {
        const kv: KeyValue[] = [];

        for (let i = 0; i < inputValues.length; i += 2) {
          kv.push({
            key: inputValues[i],
            value: inputValues[i + 1]
          });
        }
        return kv;
      }
    }
  };

  // swap index i and i+1
  const handleMoveDown = (i: number) => {
    const newOrder = getCurrentOrder();
    const current = newOrder[i];
    newOrder[i] = newOrder[i + 1];
    newOrder[i + 1] = current;
    setOrder(newOrder);
    onChange(newOrder);
  };

  const addItem = () => {
    const newOrder = getCurrentOrder();
    newOrder.push('');
    setOrder(newOrder);
    onChange(newOrder);
  };

  const deleteItem = () => {
    const newOrder = getCurrentOrder();
    newOrder.splice(deleteItemIndex, 1);
    setOrder(newOrder);
    onChange(newOrder);
  };

  const handleChange = () => {
    const newOrder = getCurrentOrder();
    onChange(newOrder);
  };

  const getInput = (x: any, i: number) => {
    const id = `${idPrefix}${i}`;

    switch (type) {
      case 'list':
        return (
          <TextField
            id={id}
            fullWidth
            multiline
            size="small"
            minRows={1}
            maxRows={12}
            defaultValue={x}
            placeholder={placeholder}
            onChange={handleChange}
          />
        );

      case 'keyValue':
        return (
          <GuidebookEditSectionKeyValue
            idPrefix={id}
            content={x}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <div className={className}>
      <List dense>
        {order?.map((x, i) => {
          let uniqueKey: string = '';
          switch (type) {
            case 'list':
              uniqueKey = `${(x as string) ?? 'item'}-${i}`;
              break;

            case 'keyValue': {
              const { key, value } = x as KeyValue;
              uniqueKey = `${key ?? 'key'}-${value ?? 'val'}-${i}`;
              break;
            }
          }
          return (
            <ListItem key={uniqueKey} sx={{ padding: '4px 0' }}>
              <ListItemIcon sx={{ minWidth: 'fit-content' }}>
                <Tooltip title="Move down" arrow disableInteractive>
                  <IconButton
                    sx={{
                      visibility: i < order.length - 1 ? 'visible' : 'hidden'
                    }}
                    onClick={() => handleMoveDown(i)}
                  >
                    <MoveDown />
                  </IconButton>
                </Tooltip>
              </ListItemIcon>
              <ListItemText>{getInput(x, i)}</ListItemText>
              <ListItemIcon>
                <Tooltip title="Delete" arrow disableInteractive>
                  <IconButton onClick={() => setDeleteItemIndex(i)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItemIcon>
            </ListItem>
          );
        })}
        <ListItem sx={{ justifyContent: 'center' }}>
          <Button
            sx={{ justifyContent: 'center', gap: '8px' }}
            variant="outlined"
            onClick={addItem}
          >
            <Add />
            Add new item
          </Button>
        </ListItem>
      </List>
      <ConfirmCancelDialog
        open={deleteItemIndex >= 0}
        onClose={() => setDeleteItemIndex(-1)}
        text="Are you sure you want to delete this item?"
        confirm={{
          text: 'Yes',
          action: () => {
            deleteItem();
            setDeleteItemIndex(-1);
          }
        }}
        cancel={{ text: 'No' }}
      />
    </div>
  );
}

export default GuidebookEditSectionList;
