/* ============================================================================
 *  Hand-drawn SVG ornaments for the Baroque Gold template.
 *
 *  The reference artwork is painted watercolour and 3D renders. These are
 *  vector stand-ins built to match its composition, weight and colour as
 *  closely as vector allows. Two techniques do most of that work:
 *
 *   - `ribbon()` builds a filled shape from a curve whose width tapers from
 *     one end to the other. Baroque scrollwork is never a uniform-width
 *     line; it swells and thins, and a plain stroke always reads as modern.
 *   - The florals are layered — back petals, front petals, a lit centre and
 *     a soft contact shadow — rather than flat shapes, so they sit on the
 *     page instead of floating above it.
 *
 *  See README "Swapping in real artwork" to replace any of these with an
 *  image. Each is a self-contained component, so nothing else has to change.
 * ========================================================================== */

type OrnamentProps = {
  className?: string;
  style?: React.CSSProperties;
};

type Pt = [number, number];

const f = (p: Pt) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;

/**
 * A filled ribbon along a cubic curve, `w0` wide at the start and `w1` at the
 * end. The outline is the curve offset either side by half the width, using
 * the tangent at each end to find the normal.
 */
function ribbon(p0: Pt, c1: Pt, c2: Pt, p3: Pt, w0: number, w1: number): string {
  const normal = (a: Pt, b: Pt): Pt => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len];
  };

  const n0 = normal(p0, c1);
  const n1 = normal(c2, p3);
  const off = (p: Pt, n: Pt, w: number, side: number): Pt => [
    p[0] + (n[0] * w * side) / 2,
    p[1] + (n[1] * w * side) / 2,
  ];

  return (
    `M${f(off(p0, n0, w0, 1))} ` +
    `C${f(off(c1, n0, w0, 1))} ${f(off(c2, n1, w1, 1))} ${f(off(p3, n1, w1, 1))} ` +
    `L${f(off(p3, n1, w1, -1))} ` +
    `C${f(off(c2, n1, w1, -1))} ${f(off(c1, n0, w0, -1))} ${f(off(p0, n0, w0, -1))} Z`
  );
}

/**
 * Math.sin and Math.cos are implementation-defined in JavaScript, so Node and
 * the browser can disagree in the last bit. Rendering a raw trig result into
 * an attribute therefore produces a React hydration mismatch on every load.
 * Rounding to three decimals is far finer than a pixel and always agrees.
 */
const round = (n: number) => Number(n.toFixed(3));

/** A small carved leaf, used to fill the hollows between scrolls. */
const LEAFLET = "M0,0 C7,-10 9,-22 6,-33 C-2,-24 -6,-11 0,0 Z";

/* -- The ornate cartouche frame around the couple's names ----------------- */

export function CartoucheFrame({ className, style }: OrnamentProps) {
  /**
   * One corner cluster, drawn for the top-left and mirrored into the other
   * three. Coordinates are local to the panel corner it grows out of.
   */
  const corner = (x: number, y: number, sx: number, sy: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      {/* Main scroll: a short sweep away from the corner, then a closing curl */}
      <path d={ribbon([2, -1], [-14, -6], [-30, -12], [-41, -19], 7.5, 4.4)} fill="url(#gilt)" />
      <path d={ribbon([-41, -19], [-53, -27], [-55, -40], [-45, -45], 4.4, 2.4)} fill="url(#gilt)" />
      <path d={ribbon([-45, -45], [-36, -48], [-28, -43], [-30, -35], 2.4, 1)} fill="url(#giltSoft)" />
      <path d={ribbon([-30, -35], [-33, -31], [-38, -32], [-39, -36], 1, 0.4)} fill="url(#giltPale)" />

      {/* Inner scroll rising along the top edge, also curling closed */}
      <path d={ribbon([4, -3], [8, -16], [1, -27], [-11, -30], 5, 2.6)} fill="url(#giltSoft)" />
      <path d={ribbon([-11, -30], [-22, -33], [-25, -25], [-18, -21], 2.6, 1)} fill="url(#giltPale)" />

      {/* Fine tendrils filling the hollows */}
      <g fill="none" stroke="url(#giltPale)" strokeLinecap="round">
        <path d="M-4,-10 C-18,-14 -30,-10 -36,0" strokeWidth="1.2" />
        <path d="M-36,0 C-44,-2 -50,3 -50,11" strokeWidth="0.9" />
        <path d="M-20,-22 C-30,-26 -40,-22 -44,-14" strokeWidth="0.8" />
      </g>

      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(-16,-13) rotate(212) scale(0.78)" />
      <path d={LEAFLET} fill="url(#giltPale)" transform="translate(-34,-26) rotate(240) scale(0.55)" />
      <circle cx="-50" cy="11" r="2.3" fill="url(#gilt)" />
    </g>
  );

  /** The crest above the panel; mirrored vertically to make the foot. */
  const crest = (y: number, sy: number, key: string) => (
    <g key={key} transform={`translate(200 ${y}) scale(1 ${sy})`}>
      <path d={ribbon([-2, -1], [-11, -10], [-19, -18], [-29, -22], 4.4, 2.2)} fill="url(#gilt)" />
      <path d={ribbon([2, -1], [11, -10], [19, -18], [29, -22], 4.4, 2.2)} fill="url(#gilt)" />
      <path d={ribbon([-29, -22], [-40, -26], [-43, -37], [-34, -41], 2.2, 1)} fill="url(#giltPale)" />
      <path d={ribbon([29, -22], [40, -26], [43, -37], [34, -41], 2.2, 1)} fill="url(#giltPale)" />
      <path d={ribbon([-34, -41], [-28, -43], [-24, -39], [-27, -35], 1, 0.4)} fill="url(#giltPale)" />
      <path d={ribbon([34, -41], [28, -43], [24, -39], [27, -35], 1, 0.4)} fill="url(#giltPale)" />

      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(-7,-11) rotate(-26) scale(0.68)" />
      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(7,-11) rotate(26) scale(0.68)" />
      <ellipse cx="0" cy="-30" rx="4.2" ry="7" fill="url(#gilt)" />
      <circle cx="0" cy="-19" r="2.2" fill="url(#gilt)" />
    </g>
  );

  return (
    <svg viewBox="0 0 400 440" className={className} style={style} aria-hidden focusable="false">
      {/* Inner panel — the clear area the names sit in */}
      <g fill="none" stroke="url(#gilt)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M88 118 C88 99 103 86 125 84 L275 84 C297 86 312 99 312 118
             L312 322 C312 341 297 354 275 356 L125 356 C103 354 88 341 88 322 Z"
          strokeWidth="2"
        />
        <path
          d="M98 124 C98 108 111 97 130 95 L270 95 C289 97 302 108 302 124
             L302 316 C302 332 289 343 270 345 L130 345 C111 343 98 332 98 316 Z"
          strokeWidth="0.85"
          opacity="0.55"
        />
      </g>

      {corner(125, 84, 1, 1, "tl")}
      {corner(275, 84, -1, 1, "tr")}
      {corner(125, 356, 1, -1, "bl")}
      {corner(275, 356, -1, -1, "br")}

      {crest(84, 1, "top")}
      {crest(356, -1, "foot")}

      {/* Side sprays */}
      <g fill="none" stroke="url(#giltPale)" strokeLinecap="round" strokeWidth="1.3">
        <path d="M88 198 C71 194 60 203 61 218" />
        <path d="M88 242 C71 246 60 237 61 222" />
        <path d="M312 198 C329 194 340 203 339 218" />
        <path d="M312 242 C329 246 340 237 339 222" />
      </g>
      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(72,220) rotate(-96) scale(0.75)" />
      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(328,220) rotate(96) scale(0.75)" />
      <circle cx="61" cy="220" r="2.5" fill="url(#gilt)" />
      <circle cx="339" cy="220" r="2.5" fill="url(#gilt)" />
    </svg>
  );
}

/* -- Large filigree swirl, used bleeding off the page edges --------------- */

export function FiligreeSwirl({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 160 300" className={className} style={style} aria-hidden focusable="false">
      <path d={ribbon([16, 6], [66, 44], [96, 92], [92, 148], 5.2, 3)} fill="url(#gilt)" />
      <path d={ribbon([92, 148], [88, 200], [62, 238], [24, 258], 3, 1.6)} fill="url(#gilt)" />
      <path d={ribbon([24, 258], [10, 266], [6, 282], [18, 292], 1.6, 0.7)} fill="url(#giltPale)" />

      <path d={ribbon([92, 148], [116, 140], [136, 152], [138, 174], 2.6, 1.2)} fill="url(#giltSoft)" />
      <path d={ribbon([138, 174], [140, 194], [126, 206], [110, 200], 1.2, 0.6)} fill="url(#giltPale)" />

      <g fill="none" stroke="url(#giltPale)" strokeLinecap="round">
        <path d="M90,132 C76,104 54,90 28,94" strokeWidth="1.3" />
        <path d="M28,94 C18,78 24,58 42,52" strokeWidth="1.1" />
        <path d="M42,52 C54,40 52,22 38,14" strokeWidth="0.9" />
        <path d="M92,188 C106,196 112,212 104,226" strokeWidth="1" />
      </g>

      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(96,116) rotate(30) scale(0.9)" />
      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(86,206) rotate(190) scale(0.8)" />
      <g fill="url(#gilt)">
        <circle cx="18" cy="292" r="2.8" />
        <circle cx="38" cy="14" r="2.6" />
        <circle cx="110" cy="200" r="2.2" />
      </g>
    </svg>
  );
}

/* -- Symmetrical horizontal divider --------------------------------------- */

export function FiligreeDivider({ className, style }: OrnamentProps) {
  const half = (
    <g>
      <path d={ribbon([196, 44], [160, 44], [132, 28], [100, 26], 3.4, 2)} fill="url(#gilt)" />
      <path d={ribbon([100, 26], [74, 24], [58, 34], [58, 50], 2, 1)} fill="url(#giltSoft)" />
      <path d={ribbon([58, 50], [58, 62], [44, 66], [34, 60], 1, 0.5)} fill="url(#giltPale)" />

      <g fill="none" stroke="url(#giltPale)" strokeLinecap="round">
        <path d="M196,46 C172,56 148,60 126,56" strokeWidth="1.2" />
        <path d="M126,56 C114,66 118,78 132,82" strokeWidth="1" />
        <path d="M100,26 C96,14 82,8 68,12" strokeWidth="1" />
        <path d="M166,38 C156,28 142,28 134,36" strokeWidth="0.9" />
      </g>

      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(140,54) rotate(130) scale(0.5)" />
      <circle cx="132" cy="82" r="2.2" fill="url(#gilt)" />
      <circle cx="34" cy="60" r="2" fill="url(#gilt)" />
    </g>
  );

  return (
    <svg viewBox="0 0 400 90" className={className} style={style} aria-hidden focusable="false">
      {half}
      <g transform="translate(400 0) scale(-1 1)">{half}</g>
      <ellipse cx="200" cy="42" rx="5.6" ry="9" fill="url(#gilt)" />
      <circle cx="200" cy="58" r="2.8" fill="url(#gilt)" />
    </svg>
  );
}

/* -- Calendar corner flourish (drawn once, mirrored four ways) ------------ */

export function CalendarCorner({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 90 90" className={className} style={style} aria-hidden focusable="false">
      <path d={ribbon([84, 8], [52, 6], [18, 18], [8, 50], 3, 1.6)} fill="url(#gilt)" />
      <path d={ribbon([8, 50], [6, 66], [16, 78], [32, 82], 1.6, 0.8)} fill="url(#giltPale)" />
      <path d={ribbon([46, 20], [30, 22], [20, 32], [20, 48], 1.8, 0.8)} fill="url(#giltSoft)" />

      <g fill="none" stroke="url(#giltPale)" strokeLinecap="round" strokeWidth="1">
        <path d="M60,12 C56,24 46,32 34,34" />
        <path d="M14,60 C24,56 32,48 34,36" />
      </g>
      <path d={LEAFLET} fill="url(#giltSoft)" transform="translate(34,34) rotate(214) scale(0.5)" />
      <circle cx="32" cy="82" r="2.2" fill="url(#gilt)" />
      <circle cx="84" cy="8" r="2.2" fill="url(#gilt)" />
    </svg>
  );
}

/* -- Marble Corinthian pillar (mirrored for the right-hand side) --------- */

export function Pillar({ className, style }: OrnamentProps) {
  /** A single acanthus lobe on the capital's bell, carved not gilded. */
  const lobe = (x: number, y: number, s: number, rot: number, key: string) => (
    <path
      key={key}
      d="M0,0 C5,-7 7,-16 5,-25 C11,-19 13,-9 10,-1 C14,-6 17,-13 16,-20
         C20,-12 18,-4 11,2 C7,5 2,4 0,0 Z"
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
      fill="#EDE3D4"
      stroke="#CFC0A8"
      strokeWidth="0.7"
    />
  );

  return (
    <svg viewBox="0 0 120 600" className={className} style={style} aria-hidden focusable="false">
      {/* Shaft */}
      <rect x="34" y="150" width="52" height="380" fill="url(#marble)" />
      <g stroke="#D3C5AE" strokeWidth="0.9" opacity="0.7">
        <line x1="43" y1="152" x2="43" y2="528" />
        <line x1="52" y1="152" x2="52" y2="528" />
        <line x1="60" y1="152" x2="60" y2="528" />
        <line x1="68" y1="152" x2="68" y2="528" />
        <line x1="77" y1="152" x2="77" y2="528" />
      </g>

      {/* Capital: bell, two tiers of acanthus, corner volutes, abacus */}
      <path d="M30 150 L24 92 L96 92 L90 150 Z" fill="url(#marble)" />
      {[
        [42, 148, 1.15, -8],
        [60, 150, 1.25, 0],
        [78, 148, 1.15, 8],
      ].map(([x, y, s, r], i) => lobe(x, y, s, r, `lo${i}`))}
      {[
        [36, 122, 0.9, -14],
        [60, 124, 1.0, 0],
        [84, 122, 0.9, 14],
      ].map(([x, y, s, r], i) => lobe(x, y, s, r, `hi${i}`))}

      <g fill="none" stroke="#CFC0A8" strokeWidth="1.6" strokeLinecap="round">
        <path d="M27 104 C18 100 14 92 18 86 C22 80 31 82 32 90" />
        <path d="M93 104 C102 100 106 92 102 86 C98 80 89 82 88 90" />
        <path d="M60 104 C56 96 58 90 64 88" />
      </g>

      <rect x="16" y="80" width="88" height="12" rx="2" fill="url(#marble)" />
      <rect x="10" y="66" width="100" height="15" rx="3" fill="url(#marble)" />
      <line x1="16" y1="80" x2="104" y2="80" stroke="#D3C5AE" strokeWidth="0.9" />

      {/* Base */}
      <rect x="30" y="530" width="60" height="14" rx="2" fill="url(#marble)" />
      <rect x="22" y="544" width="76" height="18" rx="3" fill="url(#marble)" />
      <rect x="12" y="562" width="96" height="20" rx="3" fill="url(#marble)" />
      <g stroke="#D3C5AE" strokeWidth="1" fill="none" opacity="0.85">
        <line x1="30" y1="537" x2="90" y2="537" />
        <line x1="22" y1="553" x2="98" y2="553" />
      </g>
    </svg>
  );
}

/* -- Floral cluster -------------------------------------------------------
 *  White magnolias with sage foliage and gold berry sprigs, matching the
 *  reference's arrangement. Each bloom is built from a back ring of petals,
 *  a smaller front ring offset between them, and a lit centre — which is
 *  what reads as depth rather than a flat badge.
 * ------------------------------------------------------------------------ */

/** A teardrop petal of length `r`, pointing up from the origin. */
function petalPath(r: number): string {
  return (
    `M0,0 C${(-0.27 * r).toFixed(1)},${(-0.2 * r).toFixed(1)} ` +
    `${(-0.36 * r).toFixed(1)},${(-0.62 * r).toFixed(1)} ` +
    `${(-0.17 * r).toFixed(1)},${(-0.9 * r).toFixed(1)} ` +
    `C${(-0.06 * r).toFixed(1)},${(-1.06 * r).toFixed(1)} ` +
    `${(0.06 * r).toFixed(1)},${(-1.06 * r).toFixed(1)} ` +
    `${(0.17 * r).toFixed(1)},${(-0.9 * r).toFixed(1)} ` +
    `C${(0.36 * r).toFixed(1)},${(-0.62 * r).toFixed(1)} ` +
    `${(0.27 * r).toFixed(1)},${(-0.2 * r).toFixed(1)} 0,0 Z`
  );
}

function Bloom({
  cx,
  cy,
  r,
  rot = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  rot?: number;
}) {
  const back = [0, 51, 103, 154, 206, 257, 309];
  const front = [26, 86, 146, 206, 266, 326];

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`} filter="url(#petalShadow)">
      {back.map((a) => (
        <path
          key={`b${a}`}
          d={petalPath(r)}
          transform={`rotate(${a})`}
          fill="url(#petalBack)"
          stroke="#DFD2BA"
          strokeWidth={r * 0.022}
        />
      ))}
      {front.map((a) => (
        <path
          key={`f${a}`}
          d={petalPath(r * 0.72)}
          transform={`rotate(${a})`}
          fill="url(#petalFront)"
          stroke="#E7DCC7"
          strokeWidth={r * 0.02}
        />
      ))}
      <circle cx="0" cy="0" r={r * 0.2} fill="url(#flowerHeart)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={`s${a}`}
          cx={round(Math.cos((a * Math.PI) / 180) * r * 0.13)}
          cy={round(Math.sin((a * Math.PI) / 180) * r * 0.13)}
          r={round(r * 0.035)}
          fill="#B98A2E"
          opacity="0.75"
        />
      ))}
    </g>
  );
}

function Leaf({
  x,
  y,
  len,
  rot,
  light = false,
}: {
  x: number;
  y: number;
  len: number;
  rot: number;
  light?: boolean;
}) {
  const w = len * 0.34;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        d={`M0,0 C${w},${-len * 0.26} ${w * 0.92},${-len * 0.68} 0,${-len}
            C${-w * 0.92},${-len * 0.68} ${-w},${-len * 0.26} 0,0 Z`}
        fill={light ? "url(#leafGradLight)" : "url(#leafGrad)"}
        stroke="#7C8A64"
        strokeWidth="0.6"
      />
      <path
        d={`M0,${-len * 0.06} L0,${-len * 0.9}`}
        stroke="#6E7C58"
        strokeWidth="0.7"
        opacity="0.5"
        fill="none"
      />
    </g>
  );
}

export function FloralCluster({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden focusable="false">
      <g filter="url(#softShadow)">
        {/* Foliage, laid down first so the blooms sit on top of it */}
        <Leaf x={54} y={126} len={62} rot={-42} />
        <Leaf x={96} y={136} len={74} rot={6} light />
        <Leaf x={140} y={122} len={64} rot={48} />
        <Leaf x={40} y={100} len={50} rot={-78} light />
        <Leaf x={156} y={96} len={48} rot={78} />
        <Leaf x={112} y={158} len={44} rot={22} />
        <Leaf x={74} y={154} len={40} rot={-18} light />

        {/* Gold berry sprigs */}
        <g stroke="#C0923C" strokeWidth="1.1" fill="none">
          <path d="M150 104 C163 96 173 81 175 63" />
          <path d="M46 108 C33 100 25 85 23 67" />
          <path d="M120 150 C131 156 143 157 153 152" />
        </g>
        <g fill="url(#berry)">
          <circle cx="175" cy="60" r="4.2" />
          <circle cx="168" cy="75" r="3.3" />
          <circle cx="159" cy="88" r="2.7" />
          <circle cx="23" cy="64" r="4.2" />
          <circle cx="30" cy="79" r="3.3" />
          <circle cx="39" cy="92" r="2.7" />
          <circle cx="153" cy="151" r="3" />
          <circle cx="144" cy="156" r="2.3" />
        </g>

        {/* Blooms, largest first */}
        <Bloom cx={76} cy={88} r={36} rot={14} />
        <Bloom cx={126} cy={78} r={29} rot={-22} />
        <Bloom cx={103} cy={120} r={25} rot={8} />
        <Bloom cx={50} cy={58} r={17} rot={42} />
        <Bloom cx={150} cy={116} r={15} rot={-34} />

        {/* Buds */}
        <g>
          <ellipse cx="166" cy="140" rx="7" ry="9" fill="url(#petalFront)" stroke="#DFD2BA" strokeWidth="0.7" transform="rotate(24 166 140)" />
          <ellipse cx="32" cy="128" rx="6" ry="8" fill="url(#petalBack)" stroke="#DFD2BA" strokeWidth="0.7" transform="rotate(-18 32 128)" />
        </g>
      </g>
    </svg>
  );
}

/* -- Small divider glyph used on the envelope card ------------------------ */

export function EnvelopeRule({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 220 20" className={className} style={style} aria-hidden focusable="false">
      <line x1="4" y1="10" x2="88" y2="10" stroke="url(#gilt)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="132" y1="10" x2="216" y2="10" stroke="url(#gilt)" strokeWidth="1.8" strokeLinecap="round" />
      <g fill="url(#gilt)">
        <ellipse cx="110" cy="10" rx="4.5" ry="7" />
        <circle cx="98" cy="10" r="2.2" />
        <circle cx="122" cy="10" r="2.2" />
      </g>
    </svg>
  );
}

/* -- The heart marking the wedding day in the calendar -------------------- */

export function HeartShape({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 32 30" className={className} style={style} aria-hidden focusable="false">
      <path
        d="M16 28 C16 28 2 19.5 2 10.5 C2 5.5 5.8 2 10.2 2 C12.9 2 15.1 3.5 16 5.6
           C16.9 3.5 19.1 2 21.8 2 C26.2 2 30 5.5 30 10.5 C30 19.5 16 28 16 28 Z"
        fill="var(--gold)"
      />
    </svg>
  );
}
