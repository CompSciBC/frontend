import styled from '@emotion/styled';

/**
 * Gets the value of the named radio input element
 *
 * @param name The name of the radio input element
 * @returns The value or an empty string ('') if no such element exists
 */
export const getRadioValue = (name: string) => {
  return (
    document.querySelector<HTMLInputElement>(
      `input[name="${name}"][type="radio"]:checked`
    )?.value ?? ''
  );
};

export interface RadioFieldProps {
  className?: string;
  name: string;
  label?: string;
  options: string[];
  defaultChecked?: string;
  direction?: 'row' | 'column';
}

function RadioField({
  className,
  name,
  label,
  options,
  defaultChecked,
  direction = 'row'
}: RadioFieldProps) {
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
                type="radio"
                defaultChecked={option === defaultChecked ? true : undefined}
              />
              {option}
            </label>
          );
        })}
      </div>
    </Container>
  );
}

const Container = styled.div<{ direction: string }>`
  display: flex;

  div {
    display: flex;
    flex-direction: ${(props) => props.direction};

    label:first-of-type input {
      margin-right: 2px;
    }

    label:not(:first-of-type) input {
      margin: 0 2px 0 8px;
    }
  }
`;

export default RadioField;
