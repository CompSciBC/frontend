import { TextField } from '@mui/material';

export interface GuidebookEditSectionTextProps {
  className?: string;
  id: string;
  content: string;
  placeholder?: string;
  onChange: (changed: string) => void;
}

/**
 * A text input field for editing a guidebook section text content
 *
 * @param props {@link GuidebookEditSectionTextProps}
 * @returns A JSX element
 */
function GuidebookEditSectionText({
  className,
  id,
  content,
  placeholder,
  onChange
}: GuidebookEditSectionTextProps) {
  return (
    <TextField
      id={id}
      className={className}
      fullWidth
      multiline
      size="small"
      /*
        setting rows to fixed size to avoid too many rerenders error. Ideally, would like to have
        minRows/maxRows that dynamically adjusts the content in the textarea, however, this is causing
        an infinite rerender loop. See SO question:
        https://stackoverflow.com/questions/64837884/material-ui-too-many-re-renders-the-layout-is-unstable-textareaautosize-limit
      */
      rows={12}
      defaultValue={content}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      sx={{ marginTop: '8px' }}
    />
  );
}

export default GuidebookEditSectionText;
