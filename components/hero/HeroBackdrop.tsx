// Background layers: head glow, giant "ZYREX IT" (dim letters + bright golden Z),
// cinematic vignette and film grain (desktop + mobile, giant text desktop only).

const GIANT = {
    src: "/hero/golden-z.png",
    lettersOpacity: 0.22, // grey letters: subtle so the character and golden Z lead
    zClip: "inset(0 78% 0 0)", // bright copy shows only the golden Z (raise 78% if part of the Y shows)
    side: "-11%", // how far the image reaches past the screen edges (more negative = bigger letters)
    bottom: "calc(2% - 10.3vw)", // pushes the image down past its empty bottom space (less negative vw = text goes higher)
};

// Grey letters fade from top to bottom, so they feel lit from above
const LETTERS_FADE = "linear-gradient(to bottom, #000 25%, rgba(0, 0, 0, 0.25) 100%)";

// Very fine film grain (SVG noise)
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const BOX = "pointer-events-none absolute hidden select-none min-[900px]:block";
const POSITION = { left: GIANT.side, right: GIANT.side, bottom: GIANT.bottom };

export default function HeroBackdrop() {
    return (
        <>
            {/* Studio light: warm gold glow behind the head */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 [--zx-glow:radial-gradient(ellipse_75%_30%_at_50%_75%,rgba(255,204,0,0.16),transparent_70%)] min-[900px]:[--zx-glow:radial-gradient(ellipse_28%_34%_at_52%_66%,rgba(255,204,0,0.20),transparent_70%),radial-gradient(ellipse_60%_45%_at_50%_85%,rgba(255,204,0,0.08),transparent_70%)]"
                style={{ background: "var(--zx-glow)" }}
                data-anim="glow"
                data-depth="4"
            />

            {/* Dim copy: all letters, behind the character (desktop) */}
            <div aria-hidden="true" className={`${BOX} z-[2]`} style={POSITION} data-anim="giant" data-depth="-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GIANT.src}
                    alt=""
                    draggable={false}
                    className="block h-auto w-full"
                    style={{ opacity: GIANT.lettersOpacity, maskImage: LETTERS_FADE, WebkitMaskImage: LETTERS_FADE }}
                />
            </div>

            {/* Bright copy: golden Z only, fully visible (desktop) */}
            <div aria-hidden="true" className={`${BOX} z-[5]`} style={POSITION} data-anim="giant" data-depth="-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={GIANT.src} alt="" draggable={false} className="block h-auto w-full" style={{ clipPath: GIANT.zClip }} />
            </div>

            {/* Cinematic vignette: darker corners */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[6]"
                style={{ background: "radial-gradient(ellipse 80% 75% at 50% 45%, transparent 55%, rgba(0, 0, 0, 0.45) 100%)" }}
            />

            {/* Film grain */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[6] opacity-[0.06]"
                style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
            />
        </>
    );
}