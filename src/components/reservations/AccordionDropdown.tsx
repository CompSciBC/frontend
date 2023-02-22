import styled from '@emotion/styled';
import { useState } from 'react';
import ChevronDown from './ChevronDown';

interface AccordionDropdownProps {
  className?: string;
  label: string;
  isOpen: boolean;
  content?: any;
  smallLineStyling?: boolean;
}

function isLineStyledAccordion(smallLineBool: boolean) {
  if (smallLineBool) {
    return <Line smallLine />;
  }
}

function AccordionDropdown({
  className,
  label,
  isOpen,
  content,
  smallLineStyling
}: AccordionDropdownProps) {
  const [open, setOpen] = useState<boolean>(isOpen);

  return (
    <div className={className}>
      <Header
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {isLineStyledAccordion(smallLineStyling!)}
        <div>{label}</div>
        <Line />
        <ChevronWrapper open={open}>
          <ChevronDown />
        </ChevronWrapper>
      </Header>
      <DropdownContent open={open}>{content}</DropdownContent>
    </div>
  );
}

const Header = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  padding: 4px;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  font: inherit;

  :hover {
    background-color: whitesmoke;
  }
`;

const Line = styled.hr<{ smallLine?: boolean }>`
  border-top: 1px solid black;
  flex-grow: 1;
  margin: auto 4px;
  max-width: ${(props) =>
    props.smallLine
      ? '1%'
      : '100%'}; // Conditional rendering if we want to add line styling.
`;

const ChevronWrapper = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  transform: ${(props) => `rotate(${props.open ? '180deg' : '0deg'})`};
  transition: all 0.4s ease-out;
`;

const DropdownContent = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  padding: 8px;
`;

export default AccordionDropdown;
