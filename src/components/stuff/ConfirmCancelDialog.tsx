import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

export interface ConfirmCancelDialogProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  title?: string;
  text: string;
  confirm: {
    text?: string;
    action: React.MouseEventHandler<HTMLButtonElement>;
  };
  cancel?: {
    text: string;
  };
}

/**
 * A popup dialog that allows the user to confirm/cancel an action
 *
 * @param props {@link ConfirmCancelDialogProps}
 * @returns A JSX element
 */
function ConfirmCancelDialog({
  className,
  open,
  onClose,
  title,
  text,
  confirm,
  cancel
}: ConfirmCancelDialogProps) {
  return (
    <Dialog className={className} open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {text && (
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>{cancel?.text ?? 'Cancel'}</Button>
        <Button onClick={confirm.action} autoFocus>
          {confirm.text ?? 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmCancelDialog;
