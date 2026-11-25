import "./mascot.css";

export type MascotMood = "idle" | "happy" | "driving" | "thinking" | "working" | "asking" | "celebrating";

/*
 * The concierge mascot: a chubby sage hatchback with a face, drawn front-on.
 * It is an illustration, not an icon, so it is hand-built SVG (see the deviations
 * list in the style guide). Mood and talking are plain attributes; all animation
 * lives in mascot.css.
 */
export function Mascot({
  mood = "idle",
  talking = false,
  size = 160,
  className = "",
}: {
  mood?: MascotMood;
  talking?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 200"
      width={size}
      height={(size * 200) / 220}
      className={`mascot ${className}`}
      data-mood={mood}
      data-talking={talking ? "" : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="m-shadow" cx="110" cy="186" rx="74" ry="8" />

      {/* Ground and speed lines (driving) */}
      <line className="m-road" x1="6" y1="186" x2="214" y2="186" />
      <g className="m-speed-g">
        <line className="m-speed" x1="14" y1="120" x2="2" y2="120" />
        <line className="m-speed" x1="14" y1="140" x2="-2" y2="140" />
        <line className="m-speed" x1="14" y1="160" x2="4" y2="160" />
      </g>

      <g className="m-float">
        <g className="m-jump">
          <g className="m-body">
            {/* Tyres */}
            <rect className="m-tyre" x="30" y="138" width="30" height="42" rx="12" />
            <rect className="m-tyre" x="160" y="138" width="30" height="42" rx="12" />

            {/* Body, cabin, glass */}
            <rect className="m-body-low" x="18" y="92" width="184" height="76" rx="32" />
            <rect className="m-cabin" x="42" y="28" width="136" height="86" rx="38" />
            <ellipse className="m-shine" cx="86" cy="40" rx="24" ry="5" />
            <rect className="m-mirror" x="32" y="74" width="14" height="14" rx="6" />
            <rect className="m-mirror" x="174" y="74" width="14" height="14" rx="6" />
            <rect className="m-glass" x="54" y="40" width="112" height="60" rx="26" />

            {/* Eyes */}
            <g className="m-eyes">
              {[88, 132].map((cx) => (
                <g key={cx} className="m-eye">
                  <circle className="m-eye-white" cx={cx} cy="70" r="15" />
                  <g className="m-pupil-g">
                    <circle className="m-pupil" cx={cx} cy="71" r="8" />
                    <circle className="m-eye-glint" cx={cx + 3} cy="67" r="2.6" />
                  </g>
                </g>
              ))}
            </g>
            <g className="m-happy-eyes">
              <path className="m-happy-eye" d="M74 74 Q88 56 102 74" />
              <path className="m-happy-eye" d="M118 74 Q132 56 146 74" />
            </g>

            {/* Cheeks, mouth, grille */}
            <ellipse className="m-cheek" cx="64" cy="106" rx="9" ry="5.5" />
            <ellipse className="m-cheek" cx="156" cy="106" rx="9" ry="5.5" />
            <path className="m-mouth" d="M98 124 Q110 134 122 124" />
            <path className="m-mouth-open" d="M97 122 Q110 142 123 122 Q110 127 97 122 Z" />
            <rect className="m-grille" x="88" y="146" width="44" height="12" rx="6" />

            {/* Headlights */}
            <circle className="m-light" cx="46" cy="118" r="11" />
            <circle className="m-light" cx="174" cy="118" r="11" />
          </g>

          {/* Props */}
          <g className="m-wrench-g">
            <g className="m-wrench-spin">
              <rect className="m-wrench" x="186" y="26" width="10" height="56" rx="5" />
              <circle className="m-wrench" cx="191" cy="24" r="13" />
              <circle className="m-bolt" cx="191" cy="24" r="5" />
            </g>
          </g>
          <g className="m-dots">
            <circle className="m-dot" cx="170" cy="14" r="5" />
            <circle className="m-dot" cx="186" cy="8" r="5" />
            <circle className="m-dot" cx="202" cy="4" r="5" />
          </g>
          <g className="m-sparkles">
            {[
              [28, 34],
              [196, 28],
              [10, 100],
              [210, 96],
            ].map(([x, y]) => (
              <path key={`${x}-${y}`} className="m-spark" d={`M${x} ${y - 11} L${x + 3.5} ${y - 3.5} L${x + 11} ${y} L${x + 3.5} ${y + 3.5} L${x} ${y + 11} L${x - 3.5} ${y + 3.5} L${x - 11} ${y} L${x - 3.5} ${y - 3.5} Z`} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
