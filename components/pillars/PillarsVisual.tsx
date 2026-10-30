// Center visual of the Pillars section: isometric gold wireframe blocks.
// Block 0-3 = pillar 1-4 (Build, Automate, Scale, Insights), block 4 = the core in the middle.
// Each block has an outline layer (always visible) and a "lit" layer ([data-block-lit]) that Pillars.tsx fades in.

const S = 52; // block size in the 400 x 400 drawing
const K = 0.866; // cos(30deg) for isometric angles

// Block centers: Build top-left, Automate top-right, Scale bottom-right, Insights bottom-left, core middle
const BLOCKS = [
    { x: 118, y: 120 },
    { x: 282, y: 120 },
    { x: 282, y: 262 },
    { x: 118, y: 262 },
    { x: 200, y: 192 },
];

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

export default function PillarsVisual() {
    return (
        <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden="true">
            {BLOCKS.map((b, i) => {
                const f = faces(b.x, b.y);
                return (
                    <g key={i}>
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
                            stroke="#ffdd65"
                            strokeWidth={1.2}
                            strokeLinejoin="round"
                            style={{ filter: "drop-shadow(0 0 10px rgba(255, 204, 0, 0.55))", opacity: 0 }}
                        >
                            <polygon points={f.top} fill="rgba(255, 221, 101, 0.55)" />
                            <polygon points={f.left} fill="rgba(255, 204, 0, 0.32)" />
                            <polygon points={f.right} fill="rgba(255, 204, 0, 0.18)" />
                            {f.grid.map((d) => (
                                <path key={d} d={d} fill="none" stroke="rgba(0, 0, 0, 0.35)" />
                            ))}
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}