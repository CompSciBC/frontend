import { BoundingBox } from '../../../../utils/dtos';
import styled from '@emotion/styled';

export interface BoxColor {
  fill: string;
  font: string;
}

export interface AmenityBoundingBoxProps {
  className?: string;
  name: string;
  box: BoundingBox;
  height: number;
  width: number;
  color: BoxColor;
}

function AmenityBoundingBox({
  className,
  name,
  box,
  height,
  width,
  color
}: AmenityBoundingBoxProps) {
  const boundingBox: BoundingBox = {
    height: box.height * height,
    width: box.width * width,
    top: box.top * height,
    left: box.left * width
  };

  return (
    <AmenityBox className={className} color={color} {...boundingBox}>
      <div>{name}</div>
    </AmenityBox>
  );
}

const AmenityBox = styled.div<{ color: BoxColor } & BoundingBox>`
  position: absolute;
  height: ${(props) => `${props.height}px`};
  width: ${(props) => `${props.width}px`};
  top: ${(props) => `${props.top}px`};
  left: ${(props) => `${props.left}px`};
  border: ${(props) => `2px solid ${props.color.fill}`};
  background-color: transparent;

  div {
    position: absolute;
    // if label is too close to top of image, push label down inside box
    bottom: ${(props) => (props.top < 15 ? undefined : '100%')};
    top: ${(props) => (props.top >= 15 ? undefined : 0)};
    left: -2px; // account for border width
    font-size: 10px;
    padding: 0 4px;
    background-color: ${(props) => props.color.fill};
    color: ${(props) => props.color.font};
  }
`;

export default AmenityBoundingBox;
