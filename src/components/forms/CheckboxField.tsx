import styled from '@emotion/styled';
import { theme } from '../../utils/styles';

/**
 * Gets the values of all checked boxes with the given name
 *
 * @param name The name of the checkbox input element
 * @returns The values or an empty array ([]) if no such element exists
 */
export const getCheckboxValues = (name: string) => {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    `input[name="${name}"][type="checkbox"]:checked`
  );

  return Array.from(inputs).map((input) => input.value);
};

export interface CheckboxFieldProps {
  className?: string;
  name: string;
  label?: string;
  options: string[];
  defaultChecked?: string[];
  direction?: 'row' | 'column';
}

function CheckboxField({
  className,
  name,
  label,
  options,
  defaultChecked,
  direction = 'row'
}: CheckboxFieldProps) {
  return (
    <Container className={className} direction={direction}>
      {label && <label>{label}</label>}
      <div>
        {options.map((option) => {
          return (
            <label key={option}>
              <input
                name={name}
                value={option}
                type="checkbox"
                defaultChecked={
                  defaultChecked?.includes(option) ? true : undefined
                }
              />
              {option}
            </label>
          );
        })}
      </div>
    </Container>
  );
}

const Container = styled.div<{ direction: 'row' | 'column' }>`
  display: flex;
  align-items: ${(props) =>
    props.direction === 'column' ? 'start' : 'center'};
  column-gap: 8px;

  input {
    :focus {
      outline: 1px solid ${theme.color.blue};
    }
  }

  div {
    display: flex;
    flex-direction: ${(props) => props.direction};

    label:first-of-type input {
      margin-right: 2px;
    }

    label:not(:first-of-type) input {
      margin: ${(props) => `0 2px 0 ${props.direction === 'row' ? 8 : 0}px`};
    }
  }
`;

export default CheckboxField;
