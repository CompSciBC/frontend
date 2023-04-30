import { Alert, AlertColor, Slide, SlideProps, Snackbar } from '@mui/material';

export interface AlertPopupProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  severity: AlertColor;
  message: string;
}

// slides the component in/out from/to the right/left.
// function must be same function (i.e., cannot change on rerender)
// https://stackoverflow.com/questions/59440683/material-uis-snackbar-is-not-sliding-down#:~:text=Please%20note%20that%20the%20function%20of%20Slide%20must%20be%20the%20same%20function%2C%20i.e%20you%20cannot%20just%20put%20it%20inside%20a%20component%20directly%2C%20because%20it%20will%20change%20after%20re%2Drendering.%20The%20useState%20is%20not%20essential%20here%2C%20because%20you%20can%20just%20put%20the%20function%20outside%20the%20component%20to%20keep%20it%20unchanged.
const slideTransition = (slideProps: SlideProps) => (
  <Slide {...slideProps} direction="right" />
);

/**
 * An alert that pops up on screen
 *
 * @param props {@link AlertPopupProps}
 * @returns A popup alert on the bottom left of the screen
 */
function AlertPopup({
  className,
  open,
  onClose,
  severity,
  message
}: AlertPopupProps) {
  return (
    <Snackbar
      className={className}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      TransitionComponent={slideTransition}
    >
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertPopup;
