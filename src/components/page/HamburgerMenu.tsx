import styled from '@emotion/styled';

interface HamburgerMenuProps {
  className?: string;
  width?: number;
  color?: string;
}

function HamburgerMenu({
  className,
  width = 32,
  color = 'black'
}: HamburgerMenuProps) {
  return (
    <SVG
      className={className}
      width={width}
      height={width}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="24" width="30" height="6" fill={color} />
      <rect y="12" width="30" height="6" fill={color} />
      <rect width="30" height="6" fill={color} />
    </SVG>
  );
}

const SVG = styled.svg`
  :hover {
    cursor: pointer;
  }
`;

export default HamburgerMenu;
