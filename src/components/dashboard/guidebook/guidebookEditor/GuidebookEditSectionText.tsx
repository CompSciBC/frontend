import { TextField } from '@mui/material';

export interface GuidebookEditSectionTextProps {
  className?: string;
  id: string;
  content: string;
  placeholder?: string;
  onChange: (changed: string) => void;
  rows?: number;
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
  onChange,
  rows
}: GuidebookEditSectionTextProps) {
  return (
    <TextField
      id={id}
      className={className}
      fullWidth
      multiline
      size="small"
      /*
        Error: "MUI: Too many re-renders. The layout is unstable. TextareaAutosize limits the number of renders to prevent an infinite loop."

        Setting rows to a fixed size to avoid the above error. Ideally, would like to have dynamically adjusting height using minRows/maxRows,
        however, this is causing an infinite rerender loop.
      
        See SO question:
        https://stackoverflow.com/questions/64837884/material-ui-too-many-re-renders-the-layout-is-unstable-textareaautosize-limit
      */
      rows={rows ?? 12}
      defaultValue={content}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      sx={{ marginTop: '8px' }}
    />
  );
}

export default GuidebookEditSectionText;
