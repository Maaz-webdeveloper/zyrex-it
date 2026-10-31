// Center visual of the Pillars section: isometric gold wireframe blocks.
// Block 0-3 = pillar 1-4 (Build, Automate, Scale, Insights), block 4 = the core in the middle.
// Each block has an outline layer (always visible) and a "lit" layer ([data-block-lit]) that Pillars.tsx fades in.
// Blocks 0-3 sit in a [data-orbit] group: Pillars.tsx moves it around the core while scrolling.
// Only the position changes, so the blocks stay upright.

const S = 52; // block size in the 400 x 400 drawing
const K = 0.866; // cos(30deg) for isometric angles
const CENTER = { x: 200, y: 192 }; // core position, also the middle of the orbit
const ORBIT_R = 120; // keep at 104 (2 x S) or more: then a block never overlaps the core
const START_DEG = [-135, -45, 45, 135]; // start: Build top-left, Automate top-right, Scale bottom-right, Insights bottom-left

// Where outer block i is (relative to the core) after the orbit has turned by deg
export function orbitOffset(i: number, deg: number) {
    const a = ((START_DEG[i] + deg) * Math.PI) / 180;
    return { x: Math.round(ORBIT_R * Math.cos(a) * 100) / 100, y: Math.round(ORBIT_R * Math.sin(a) * 100) / 100 };
}

function faces(x: number, y: number) {
    const p = (a: number, b: number) => `${a},${b}`;
    return {
        top: [p(x, y - S), p(x + K * S, y - S / 2), p(x, y), p(x - K * S, y - S / 2)].join(" "),
        left: [p(x - K * S, y - S / 2), p(x, y), p(x, y + S), p(x - K * S, y + S / 2)].join(" "),
        right: [p(x, y), p(x + K * S, y - S / 2), p(x + K * S, y + S / 2), p(x, y + S)].join(" "),
        // small grid on the top face (detail)
        grid: [
            `M${x - (K * S) / 2},${y - (S * 3) / 4} L${x + (K * S) / 2},${y - S / 4}`,
            `M${x + (K * S) / 2},${y - (S * 3) / 4} L${x - (K * S) / 2},${y - S / 4}`,
        ],
    };
}

function Gradient({ id, stops }: { id: string; stops: [string, string][] }) {
    return (
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {stops.map(([offset, color]) => (
                <stop key={offset} offset={offset} stopColor={color} />
            ))}
        </linearGradient>
    );
}

export default function PillarsVisual() {
    const f = faces(CENTER.x, CENTER.y);
    return (
        <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
                {/* Polished gold: solid fills (see-through gold over black is what looks muddy) */}
                <Gradient id="zx-gold-top" stops={[["0", "#fff4c2"], ["0.45", "#ffe27a"], ["1", "#ffcc00"]]} />
                <Gradient id="zx-gold-left" stops={[["0", "#ffdd65"], ["1", "#ffc107"]]} />
                <Gradient id="zx-gold-right" stops={[["0", "#ffcc00"], ["1", "#e0a500"]]} />
                {/* White-gold edge highlight */}
                <Gradient id="zx-gold-edge" stops={[["0", "#ffffff"], ["0.5", "#fff3c4"], ["1", "#ffe48a"]]} />
            </defs>

            {[0, 1, 2, 3, 4].map((i) => {
                const offset = i < 4 ? orbitOffset(i, 0) : { x: 0, y: 0 };
                return (
                    <g key={i} data-orbit={i < 4 ? i : undefined} transform={`translate(${offset.x} ${offset.y})`}>
                        {/* Outline (always visible, dark fill hides lines behind it) */}
                        <g stroke="rgba(255, 204, 0, 0.45)" strokeWidth={1} strokeLinejoin="round">
                            <polygon points={f.top} fill="#0d0c08" />
                            <polygon points={f.left} fill="#0b0a07" />
                            <polygon points={f.right} fill="#090806" />
                            {f.grid.map((d) => (
                                <path key={d} d={d} fill="none" />
                            ))}
                        </g>

                        {/* Lit (gold), faded in by Pillars.tsx */}
                        <g
                            data-block-lit={i}
                            stroke="url(#zx-gold-edge)"
                            strokeWidth={1.4}
                            strokeLinejoin="round"
                            style={{
                                filter: "drop-shadow(0 0 5px rgba(255, 221, 101, 0.7)) drop-shadow(0 0 18px rgba(255, 204, 0, 0.45))",
                                opacity: 0,
                            }}
                        >
                            <polygon points={f.top} fill="url(#zx-gold-top)" />
                            <polygon points={f.left} fill="url(#zx-gold-left)" />
                            <polygon points={f.right} fill="url(#zx-gold-right)" />
                            {f.grid.map((d) => (
                                <path key={d} d={d} fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth={1} />
                            ))}
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
