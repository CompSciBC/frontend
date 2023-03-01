import styled from '@emotion/styled';
import { theme } from '../../utils/styles';
import InputField, { getInputValue } from '../forms/InputField';
import MagnifyingGlass from './MagnifyingGlass';

export interface SearchBarProps {
  className?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  handleSubmit: (text: string) => void;
}

function SearchBar({
  className,
  buttonText = 'Search',
  buttonColor = theme.color.red,
  buttonTextColor = 'white',
  handleSubmit
}: SearchBarProps) {
  const searchBar = 'keyword-search-bar';

  const onSubmit = () => {
    const text = getInputValue(searchBar);
    const textField = document.getElementsByName(
      searchBar
    )[0] as HTMLInputElement;
    textField.value = '';
    handleSubmit(text);
    console.log('Searching for: ', text);
  };

  return (
    <Container className={className}>
      <SearchIcon>
        <MagnifyingGlass fill={theme.color.gray} height={16} />
      </SearchIcon>
      <StyledInputField
        name={searchBar}
        type="text"
        placeholder="Search by keywords"
      />
      <SearchButton
        type="button"
        onClick={onSubmit}
        bgColor={buttonColor}
        textColor={buttonTextColor}
      >
        {buttonText}
      </SearchButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;

  :focus {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const SearchIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-left: 8px;
  border-left: 1px solid ${theme.color.lightGray};
  border-top: 1px solid ${theme.color.lightGray};
  border-bottom: 1px solid ${theme.color.lightGray};
  border-radius: 8px 0 0 8px;
`;

const StyledInputField = styled(InputField)`
  input {
    border: 1px solid ${theme.color.lightGray};
    border-left: none;
    border-radius: 0;
    flex-grow: 1;
    height: 100%;

    :focus {
      outline: none;
    }
  }
`;

const SearchButton = styled.button<{ bgColor: string; textColor: string }>`
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 8px 16px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
`;

export default SearchBar;
