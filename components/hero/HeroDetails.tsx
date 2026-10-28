// Desktop-only details around the character (Mindly style, dark + gold theme):
// two floating glass cards with a gold edge, and gold dotted lines that "draw" themselves
// to the character during the entrance and then keep flowing.
// Keep: data-anim="card" (entrance), data-depth (mouse parallax), data-draw (line draw), animate-zx-float.
// Card tilt uses the CSS "rotate"/"scale" properties, so it never conflicts with GSAP transforms.

const CARD_OUTER =
    "group absolute z-[7] hidden w-[clamp(200px,14vw,260px)] rounded-[20px] p-px shadow-[0_24px_60px_rgba(0,0,0,0.65)] transition-[box-shadow,rotate,scale] duration-500 animate-zx-float hover:rotate-0 hover:scale-[1.03] hover:shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_40px_rgba(255,204,0,0.15)] min-[900px]:block";

// Gold-to-glass gradient used as a 1px border
const CARD_BORDER = {
    background:
        "linear-gradient(140deg, rgba(255, 204, 0, 0.55), rgba(255, 255, 255, 0.1) 35%, rgba(255, 255, 255, 0.04) 70%, rgba(255, 204, 0, 0.25))",
};

const CARD_INNER =
    "relative overflow-hidden rounded-[19px] p-[clamp(16px,1.3vw,22px)] backdrop-blur-xl";
const CARD_BG = {
    background: "linear-gradient(160deg, rgba(28, 28, 28, 0.92), rgba(12, 12, 12, 0.88))",
};

const ICON_BOX =
    "mb-3.5 grid size-[40px] place-items-center rounded-[11px] border border-accent/25 bg-accent/10 text-accent";
const BIG = "text-[clamp(30px,2.6vw,44px)] leading-none font-extrabold text-white";
const TITLE = "mt-2.5 text-[clamp(14px,1.05vw,17px)] leading-snug text-white/90";
const SMALL = "mt-1.5 text-[clamp(11px,0.8vw,13px)] leading-snug text-white/60";

// Each line starts at the bottom edge of a card and ends next to the character's face
const LINES = [
    { id: "zx-line-left", d: "M13 54 C 13 68, 28 63, 41 66", x1: 13, x2: 41 },
    { id: "zx-line-right", d: "M87 57 C 87 72, 74 69, 61 70", x1: 87, x2: 61 },
];

// Glowing end points (same coordinates as the line ends, in % of the hero)
const END_DOTS = [
    { left: "41%", top: "66%" },
    { left: "61%", top: "70%" },
];



function Avatars() {
    // Client avatars from the uploaded SVG (bigger, nothing cut off)
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/hero/clients-avatars.svg"
            alt="Happy clients"
            draggable={false}
            className="mb-3.5 h-[clamp(34px,2.6vw,44px)] w-auto max-w-full"
            style={{ clipPath: "inset(0 24% 0 0)" }}
        />
    );
}

function Glow() {
    // Soft gold light in the top corner of the card
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/15 blur-3xl"
        />
    );
}

function Shine() {
    // Thin light along the top edge of the glass
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)" }}
        />
    );
}

export default function HeroDetails() {
    return (
        <>
            {/* Gold dotted lines (behind the character). A mask "draws" each line during the entrance. */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full min-[900px]:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    {LINES.map((line) => (
                        <linearGradient
                            key={`${line.id}-grad`}
                            id={`${line.id}-grad`}
                            gradientUnits="userSpaceOnUse"
                            x1={line.x1}
                            x2={line.x2}
                            y1="0"
                            y2="0"
                        >
                            <stop offset="0" stopColor="#ffcc00" stopOpacity="0.75" />
                            <stop offset="1" stopColor="#ffcc00" stopOpacity="0.2" />
                        </linearGradient>
                    ))}
                    {LINES.map((line) => (
                        <mask key={line.id} id={line.id} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                            <path
                                d={line.d}
                                fill="none"
                                stroke="#fff"
                                strokeWidth={6}
                                pathLength={1}
                                strokeDasharray="1 1"
                                strokeDashoffset={1}
                                data-draw=""
                            />
                        </mask>
                    ))}
                </defs>

                {LINES.map((line) => (
                    <path
                        key={line.id}
                        d={line.d}
                        mask={`url(#${line.id})`}
                        fill="none"
                        stroke="rgba(255, 204, 0, 0.6)"
                        strokeWidth={1.6}
                        strokeDasharray="2 7"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    >
                        {/* Dots keep flowing from the card toward the character */}
                        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                    </path>
                ))}
            </svg>

            {/* Glowing points where the lines meet the character */}
            {END_DOTS.map((dot) => (
                <span
                    key={dot.left}
                    aria-hidden="true"
                    className="pointer-events-none absolute z-[4] hidden size-2 -translate-x-1/2 -translate-y-1/2 min-[900px]:block"
                    style={{ left: dot.left, top: dot.top }}
                >
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                    <span className="absolute inset-0 rounded-full bg-accent shadow-[0_0_12px_rgba(255,204,0,0.9)]" />
                </span>
            ))}

            {/* Left card: rating (tilted left) */}
            <div
                data-anim="card"
                data-depth="22"
                className={`${CARD_OUTER} top-[36%] left-[7%] -rotate-6`}
                style={CARD_BORDER}
            >
                <div className={CARD_INNER} style={CARD_BG}>
                    <Shine />
                    <Glow />
                    <div className={ICON_BOX}>
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[19px]" fill="currentColor">
                            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                        </svg>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className={BIG}>5.0</span>
                        <span
                            className="mb-[5px] text-[clamp(12px,0.9vw,15px)] tracking-[2px] text-accent"
                            aria-label="5 star rating"
                        >
                            ★★★★★
                        </span>
                    </div>
                    <p className={TITLE}>Rated by our clients</p>
                    <p className={SMALL}>Trusted results, every project.</p>
                </div>
            </div>

            {/* Right card: clients (tilted right) */}
            <div
                data-anim="card"
                data-depth="22"
                className={`${CARD_OUTER} top-[40%] right-[7%] rotate-6`}
                style={{ ...CARD_BORDER, animationDelay: "-3s" }}
            >
                <div className={CARD_INNER} style={CARD_BG}>
                    <Shine />
                    <Glow />
                    <Avatars />
                    <span className={BIG}>
                        50<span className="text-accent">+</span>
                    </span>
                    <p className={TITLE}>Happy clients</p>
                    <p className={SMALL}>Businesses scaling with us.</p>
                </div>
            </div>
        </>
    );
}