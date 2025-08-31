"use client";

type Props = {
  size?: number;
  color?: string;
};

/**
 * Bull emoji logo for Torito.
 */
export const Logo: React.FC<Props> = ({ size = 32 }) => {
  return (
    <span
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        display: "inline-block",
        transform: "scaleX(-1)",
      }}
    >
      🐂
    </span>
  );
};
