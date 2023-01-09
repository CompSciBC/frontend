import styled from '@emotion/styled';
import { useState } from 'react';
import ChevronDown from './ChevronDown';

interface AccordionDropdownProps {
  className?: string;
  label: string;
  isOpen: boolean;
  content?: any;
}

function AccordionDropdown({
  className,
  label,
  isOpen,
  content
}: AccordionDropdownProps) {
  const [open, setOpen] = useState<boolean>(isOpen);

  return (
    <Container className={className}>
      <Header
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Label>{label}</Label>
        <Line />
        <ChevronWrapper open={open}>
          <ChevronDown />
        </ChevronWrapper>
      </Header>
      <DropdownContent open={open}>{content}</DropdownContent>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  padding: 4px;
  width: 100%;
  background-color: transparent;
  cursor: pointer;

  :hover {
    background-color: whitesmoke;
  }
`;

const Label = styled.div`
  font-weight: bold;
  font-size: medium;
`;

const Line = styled.hr`
  border-top: 2px solid black;
  flex-grow: 1;
  margin: auto 4px;
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
