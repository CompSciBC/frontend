import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

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
  align-items: center;
  column-gap: 8px;

  select {
    padding: 8px;
    border: 1px solid lightgray;
    border-radius: 4px;

    :focus {
      outline: 1px solid ${theme.color.blue};
    }
  }
`;

export default SelectField;
