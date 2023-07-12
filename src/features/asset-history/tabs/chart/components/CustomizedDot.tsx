import { Key } from 'react';

export interface ICustomizedDot {
  cx?: string | number;
  cy?: number;
  payload: {
    color: string;
    endTime: number;
    startTime: number;
  };
  value?: Key | null;
  hovered: boolean;
  endDateInMillis: number;
  startDateInMillis: number;
  eventGraphWidth: number;
}

export const CustomizedDot = ({
  cx,
  cy,
  payload,
  value,
  hovered = false,
  endDateInMillis,
  startDateInMillis,
  eventGraphWidth,
}: ICustomizedDot) => {
  if (!cx || !cy) {
    return null;
  }

  const height = 7;
  const end = payload.endTime > endDateInMillis ? endDateInMillis : payload.endTime;
  const start = payload.startTime < startDateInMillis ? startDateInMillis : payload.startTime;
  const duration = end - start;
  const maxDuration = endDateInMillis - startDateInMillis;
  const width = maxDuration && Math.ceil((duration * eventGraphWidth) / maxDuration);

  if (width && width < 0) {
    return null;
  }

  if (hovered) {
    return (
      <rect
        style={{ filter: 'drop-shadow( 0px 2px 1px rgba(0, 0, 0, .7))' }}
        key={String(start) + String(end) + value}
        width={Number(width)}
        height={height}
        x={Number(cx) < 0 ? 0 : cx}
        y={cy - height}
        fill={payload.color}
      />
    );
  }

  return (
    <rect
      key={String(start) + String(end) + value}
      width={Number(width)}
      height={height}
      x={Number(cx) < 0 ? 0 : cx}
      y={cy - height}
      fill={payload.color}
    />
  );
};
