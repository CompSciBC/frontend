import { BoundingBox } from '../../../../utils/dtos';
import styled from '@emotion/styled';

export interface BoxColor {
  fill: string;
  font: string;
}

interface AmenityBoxStyle extends BoundingBox {
  color: BoxColor;
}

export interface AmenityBoundingBoxProps {
  className?: string;
  name: string;
  box: BoundingBox;
  color: BoxColor;
}

function AmenityBoundingBox({
  className,
  name,
  box,
  color
}: AmenityBoundingBoxProps) {
  return (
    <AmenityBox className={className} color={color} {...box}>
      <div>{name}</div>
    </AmenityBox>
  );
}

const AmenityBox = styled.div<AmenityBoxStyle>`
  position: absolute;
  height: ${(props) => `${props.height * 100}%`};
  width: ${(props) => `${props.width * 100}%`};
  top: ${(props) => `${props.top * 100}%`};
  left: ${(props) => `${props.left * 100}%`};
  border: ${(props) => `2px solid ${props.color.fill}`};
  background-color: transparent;

  div {
    position: absolute;
    // if label is too close to top of image, push label down inside box
    bottom: ${(props) => (props.top * 100 < 15 ? undefined : '100%')};
    top: ${(props) => (props.top * 100 >= 15 ? undefined : 0)};
    left: -2px; // account for border width
    font-size: 10px;
    padding: 0 4px;
    background-color: ${(props) => props.color.fill};
    color: ${(props) => props.color.font};
  }
`;

export default AmenityBoundingBox;
