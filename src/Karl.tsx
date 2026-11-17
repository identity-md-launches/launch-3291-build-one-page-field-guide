// Karl, MVA's goldfish. Drawn once, in the corner, in ink and the one accent colour.
export function Karl() {
  return (
    <svg className="karl" viewBox="0 0 120 80" role="img" aria-label="Doodle of Karl, a small goldfish">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 40c10-18 40-22 58-6 4 4 4 8 0 12-18 16-48 12-58-6z" className="karl-body" />
        <path d="M76 36l18-14c-2 10-2 26 0 36L76 46" className="karl-fin" />
        <path d="M44 26c4-8 12-10 18-8" />
        <path d="M46 54c2 6 8 8 12 6" />
        <path d="M30 34c3 4 3 9 0 12" />
        <circle cx="26" cy="38" r="1.6" fill="currentColor" />
        <circle cx="10" cy="26" r="2.5" />
        <circle cx="6" cy="14" r="1.6" />
      </g>
      <text x="58" y="76" fontSize="10" fill="currentColor" fontStyle="italic">
        Karl
      </text>
    </svg>
  )
}
