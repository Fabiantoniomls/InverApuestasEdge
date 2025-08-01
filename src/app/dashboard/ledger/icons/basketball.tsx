
import * as React from "react";

export function BasketballIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <circle cx="12" cy="12" r="10" />
        <path d="M4.2 16.8c3.2-2.4 7-3.6 11.6-3.6" />
        <path d="M19.8 7.2c-3.2 2.4-7 3.6-11.6 3.6" />
        <path d="M12 2a10 10 0 0 0 -10 10" />
        <path d="M12 22a10 10 0 0 1 -10 -10" />
    </svg>
  );
}
