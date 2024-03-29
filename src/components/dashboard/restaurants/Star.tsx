export interface StarProps {
  className?: string;
  height?: number;
  fill?: string;
}

function Star({ className, height = 16, fill = 'white' }: StarProps) {
  return (
    <svg
      className={className}
      height={height}
      width={height}
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
        fill={fill}
      />
    </svg>
  );
}

export default Star;
