import type { SVGProps } from 'react';

export function SolarViewLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label="SolarView Logo"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Simple Sun icon part */}
      <circle cx="25" cy="25" r="12" fill="hsl(var(--accent))" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="25"
          y1="25"
          x2={25 + 18 * Math.cos(angle * Math.PI / 180)}
          y2={25 + 18 * Math.sin(angle * Math.PI / 180)}
          stroke="hsl(var(--accent))"
          strokeWidth="2.5"
        />
      ))}
      {/* Text part */}
      <text
        x="55"
        y="35"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="url(#grad1)"
      >
        SolarView
      </text>
    </svg>
  );
}
