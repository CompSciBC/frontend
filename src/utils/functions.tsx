import { KeyValue } from './dtos';

/**
 * Checks the given objects for deep equality (Thanks ChatGPT!)
 *
 * @param a An object
 * @param b An object
 * @returns True if a and b are equivalent
 */
export const objectEquals = (a: any, b: any): boolean => {
  if (typeof a !== typeof b) {
    return false;
  }

  if (a === null || a === undefined || typeof a !== 'object') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!objectEquals(a[i], b[i])) {
        return false;
      }
    }
  } else {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const key of aKeys) {
      if (!objectEquals(a[key], b[key])) return false;
    }
  }

  return true;
};

/**
 * Gets the value of the identified input element
 *
 * @param selector A CSS selector
 * @returns The string value of the input element
 */
export const getText = (selector: string): string =>
  document.querySelector<HTMLInputElement>(selector)?.value ?? '';

/**
 * Gets an array of values for the identified inputs
 *
 * @param selector A CSS selector
 * @returns An array of string values from the identified input elements
 */
export const getArray = (selector: string): string[] => {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(selector),
    (x) => x?.value
  );
};

/**
 * Gets an array of key-value pairs from the identified inputs
 *
 * @param selector A CSS selector
 * @returns An array of {@link KeyValue}s from the identified inputs
 */
export const getKeyValues = (selector: string): KeyValue[] => {
  const inputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(selector),
    (x) => x?.value
  );
  const kv: KeyValue[] = [];

  for (let i = 0; i < inputs.length; i += 2) {
    kv.push({
      key: inputs[i],
      value: inputs[i + 1]
    });
  }
  return kv;
};
