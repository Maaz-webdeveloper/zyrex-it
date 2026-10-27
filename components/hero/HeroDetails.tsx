// Desktop-only details around the character (Mindly style, dark theme):
// two floating side cards with dotted lines that "draw" themselves to the character.

const CARD =
    "absolute z-[7] hidden w-[clamp(170px,13vw,230px)] rounded-[22px] border border-white/10 p-[clamp(14px,1.2vw,20px)] text-left shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-zx-float min-[900px]:block";
const CARD_BG = { background: "linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))" };

const TITLE = "text-[clamp(15px,1.15vw,19px)] leading-snug font-extrabold text-white";
const SMALL = "mt-2 text-[12px] leading-snug text-white/55";

// Each line starts at a card and ends at the character
const LINES = [
    { id: "zx-line-left", d: "M13.5 58 C 13.5 70, 30 62, 44 69" },
    { id: "zx-line-right", d: "M86.5 61 C 86.5 73, 70 64, 57 69" },
];

export default function HeroDetails() {
    return (
        <>
            {/* Dotted curved lines (behind the character). A mask "draws" each line during the entrance. */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full min-[900px]:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
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
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1.5}
                        strokeDasharray="2 7"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>

            {/* Left card: rating */}
            <div data-anim="card" className={`${CARD} top-[36%] left-[7%] -rotate-[4deg]`} style={CARD_BG}>
                <div className="mb-3 text-[13px] tracking-[3px] text-accent" aria-label="5 star rating">
                    ★★★★★
                </div>
                <p className={TITLE}>
                    Rated 5.0
                    <br />
                    by our clients
                </p>
                <p className={SMALL}>
                    Trusted results,
                    <br />
                    every project.
                </p>
            </div>

            {/* Right card: clients */}
            <div
                data-anim="card"
                className={`${CARD} top-[40%] right-[7%] rotate-[5deg]`}
                style={{ ...CARD_BG, animationDelay: "-3s" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/clients-avatars.svg" alt="Happy clients" className="mb-3 h-8 w-auto" draggable={false} />
                <p className={TITLE}>
                    50+ happy
                    <br />
                    clients
                </p>
                <p className={SMALL}>
                    Businesses scaling
                    <br />
                    with us.
                </p>
            </div>
        </>
    );
}