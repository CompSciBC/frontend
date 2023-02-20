import styled from '@emotion/styled';

/**
 * Gets the value of the named input element
 *
 * @param name The name of the input element
 * @returns The value or an empty string ('') if no such element exists
 */
export const getInputValue = (name: string) => {
  return (
    document.querySelector<HTMLInputElement>(
      `input[name="${name}"]:not([type="radio"], [type="checkbox"], [type="tel"])`
    )?.value ?? ''
  );
};

/**
 * Gets the value of the named telephone input element. Currently only
 * US telephone numbers are accepted (+1 xxx xxx xxxx).
 *
 * @param name The name of the telephone input element
 * @returns The value or an empty string ('') if no such element exists
 */
export const getTelephoneValue = (name: string) => {
  const inputs = document.querySelectorAll(`input[name="${name}"]`);

  // tel field has 3 inputs; need to concatenate them
  const area = (inputs[0] as HTMLInputElement).value;
  const prefix = (inputs[1] as HTMLInputElement).value;
  const suffix = (inputs[2] as HTMLInputElement).value;

  // TODO: allow other country codes
  return `+1${area}${prefix}${suffix}`;
};

export type InputFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'tel'
  | 'password'
  | 'date';

export interface InputFieldProps {
  className?: string;
  name: string;
  label?: string;
  type?: InputFieldType;
  placeholder?: string;
  autoComplete?: string;
}

function InputField({
  className,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete
}: InputFieldProps) {
  // when user enters the max length digits, auto focus to next field
  const handleTelInput = (e: any) => {
    const input = e.target as HTMLInputElement;
    const maxLength = Number(input.getAttribute('maxlength'));

    if (input.value.length >= maxLength) {
      const nextInput = input.nextElementSibling as HTMLInputElement;

      if (nextInput?.getAttribute('name') === name) {
        nextInput.focus();
      }
    }
  };

  return (
    <Container className={className}>
      {label && <label htmlFor={name}>{label}</label>}
      {type === 'tel' ? (
        <div key={name}>
          <input
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="tel-area-code"
            pattern="\d{3}"
            maxLength={3}
            onInput={handleTelInput}
          />
          <input
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="tel-local-prefix"
            pattern="\d{3}"
            maxLength={3}
            onInput={handleTelInput}
          />
          <input
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="tel-local-suffix"
            pattern="\d{4}"
            maxLength={4}
          />
        </div>
      ) : (
        <input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  column-gap: 8px;

  input {
    padding: 8px;
    border: 1px solid lightgray;
    border-radius: 4px;

    ::placeholder {
      color: lightgray;
    }
  }

  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    width: 100%;

    input {
      padding: 4px;
      width: 1px;
      flex-grow: 1;
      text-align: center;
    }
  }
`;

export default InputField;
