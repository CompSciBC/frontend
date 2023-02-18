import styled from '@emotion/styled';

/**
 * Gets the value of the named select element
 *
 * @param name The name of the select element
 * @returns The value or an empty string ('') if no such element exists
 */
export const getSelectValue = (name: string) => {
  return (
    document.querySelector<HTMLSelectElement>(
      `select[name="${name}"] option:checked`
    )?.value ?? ''
  );
};

export interface SelectFieldProps {
  className?: string;
  name: string;
  label?: string;
  options: string[];
  defaultOption?: string;
}

function SelectField({
  className,
  name,
  label,
  options,
  defaultOption
}: SelectFieldProps) {
  return (
    <Container className={className}>
      {label && <label>{label}</label>}
      <select name={name} defaultValue={defaultOption}>
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </Container>
  );
}

const Container = styled.div`
  display: flex;

  input {
    padding: 4px;
  }
`;

export default SelectField;
