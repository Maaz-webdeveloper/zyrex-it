// Desktop-only details around the character (Mindly style, dark theme):
// two floating side cards with dotted lines to the character, and a small tagline bottom-right.

const CARD =
    "absolute z-[7] hidden w-[clamp(170px,13vw,230px)] rounded-[22px] border border-white/10 p-[clamp(14px,1.2vw,20px)] text-left shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-zx-float min-[900px]:block";
const CARD_BG = { background: "linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))" };

const TITLE = "text-[clamp(15px,1.15vw,19px)] leading-snug font-extrabold text-white";
const SMALL = "mt-2 text-[12px] leading-snug text-white/55";

export default function HeroDetails() {
    return (
        <>
            {/* Dotted curved lines: side cards -> character (behind the character) */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full min-[900px]:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {[
                    "M13.5 58 C 13.5 70, 30 62, 44 69", // left card -> left side of the face
                    "M86.5 61 C 86.5 73, 70 64, 57 69", // right card -> right side of the face
                ].map((d) => (
                    <path
                        key={d}
                        d={d}
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
            <div className={`${CARD} top-[36%] left-[7%] -rotate-[4deg]`} style={CARD_BG}>
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