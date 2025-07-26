
import * as React from "react";

export function SoccerBallIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 22l-4-4-4-4-4-4" />
      <path d="M12 2l4 4 4 4 4 4" />
      <path d="M2 12l4 4 4 4 4 4" />
      <path d="M22 12l-4-4-4-4-4-4" />
      <path d="M12 12l-4 4-4 4-4-4-4-4" />
      <path d="M12 12l4-4 4-4 4 4 4 4" />
    </svg>
  );
}
