import styled from '@emotion/styled';
import { theme } from '../../../utils/styles';
import { useEffect, useState } from 'react';
import CheckboxField, { getCheckboxValues } from '../../forms/CheckboxField';
import RadioField, { getRadioValue } from '../../forms/RadioField';

/**
 * The current state of all filter groups
 */
export interface FilterState {
  [group: string]: string[];
}

/**
 * A group of options to be filtered on
 */
export interface FilterGroup {
  type: 'check' | 'radio';
  name: string;
  label: string;
  options: string[];
  defaultChecked?: string[] | string;
}

export interface FilterPanelProps {
  className?: string;
  title?: string;
  groups?: FilterGroup[];
  handleChange?: React.Dispatch<React.SetStateAction<FilterState>>;
}

function FilterPanel({
  className,
  title = 'Filters',
  groups,
  handleChange
}: FilterPanelProps) {
  const [filterState, setFilterState] = useState<FilterState>();
  const [filterGroups, setFilterGroups] = useState<JSX.Element>();

  // create filter group sections and initialize default filter state on initial page load
  useEffect(() => {
    let subscribed = true;

    const getFilterGroup = (filterGroup: FilterGroup) => {
      let input: JSX.Element;
      const { type, name, options, defaultChecked } = filterGroup;

      switch (type) {
        case 'check':
          input = (
            <CheckboxField
              direction="column"
              name={name}
              options={options}
              defaultChecked={
                typeof defaultChecked === 'string'
                  ? [defaultChecked]
                  : defaultChecked
              }
            />
          );
          break;

        case 'radio':
          input = (
            <RadioField
              direction="column"
              name={name}
              options={options}
              defaultChecked={
                typeof defaultChecked === 'string'
                  ? defaultChecked
                  : defaultChecked?.[0]
              }
            />
          );
          break;
      }
      return input;
    };

    const defaultFilterState: FilterState = {};

    // create filter group sections
    subscribed &&
      setFilterGroups(
        <>
          {groups?.map((group) => {
            const { name, label, defaultChecked } = group;

            // initialize default filter state values
            switch (typeof defaultChecked) {
              case 'string':
                defaultFilterState[name] = [defaultChecked];
                break;

              case 'object':
                defaultFilterState[name] = defaultChecked;
                break;

              case 'undefined':
                defaultFilterState[name] = [];
                break;
            }

            return (
              <FilterSection key={name}>
                <label>{label}</label>
                {getFilterGroup(group)}
              </FilterSection>
            );
          })}
        </>
      );

    subscribed && setFilterState(defaultFilterState);

    return () => {
      subscribed = false;
    };
  }, []);

  // update filterState when filter inputs change
  const handleInputChange = (event: any) => {
    const updatedFilterState = { ...filterState };
    const input = event.target as HTMLInputElement;
    const { type, name } = input;

    switch (type) {
      case 'checkbox':
        updatedFilterState[name] = getCheckboxValues(name);
        break;

      case 'radio':
        updatedFilterState[name] = [getRadioValue(name)];
        break;
    }

    setFilterState({ ...updatedFilterState });
  };

  // add event listeners to filter inputs to watch for changes
  useEffect(() => {
    // add change event listeners
    filterGroups &&
      groups?.forEach((group) => {
        document
          .getElementsByName(group.name)
          .forEach((i) => i.addEventListener('change', handleInputChange));
      });

    return () => {
      // remove change event listeners
      filterGroups &&
        groups?.forEach((group) => {
          document
            .getElementsByName(group.name)
            .forEach((i) => i.removeEventListener('change', handleInputChange));
        });
    };
  }, [filterGroups, handleInputChange]);

  useEffect(() => {
    let subscribed = true;

    subscribed && handleChange && filterState && handleChange(filterState);

    return () => {
      subscribed = false;
    };
  }, [filterState]);

  return (
    <Container className={className}>
      <h4>{title}</h4>
      {filterGroups}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  padding: 16px;

  h4 {
    ${theme.font.displayMedium}
  }
`;

const FilterSection = styled.div`
  width: 100%;
  padding-top: 8px;
  border-top: 1px solid ${theme.color.gray};

  > label {
    ${theme.font.body}
    margin-bottom: 8px;
  }

  > div {
    ${theme.font.displaySmall}
    font-size: small;
  }

  div {
    width: 100%;

    label:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

export default FilterPanel;
