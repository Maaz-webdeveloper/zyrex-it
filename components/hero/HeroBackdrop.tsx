// Background layers: head glow, giant "ZYREX IT" (giant-text.svg, desktop only),
// cinematic vignette and film grain.

const GIANT = {
    src: "/hero/giant-text.svg",
    opacity: 1, // lower (e.g. 0.6) to make the letters softer
    shift: "translate-y-[27%]", // how much of the giant text hides below the bottom edge
};

// Very fine film grain (SVG noise)
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function HeroBackdrop() {
    return (
        <>
            {/* Studio light behind the head (mobile: wide and low, desktop: focused + soft floor glow) */}
            <div
                data-anim="glow"
                data-depth="4"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 [--zx-glow:radial-gradient(ellipse_75%_30%_at_50%_75%,rgba(255,204,0,0.16),transparent_70%)] min-[900px]:[--zx-glow:radial-gradient(ellipse_28%_34%_at_52%_66%,rgba(255,204,0,0.20),transparent_70%),radial-gradient(ellipse_60%_45%_at_50%_85%,rgba(255,204,0,0.08),transparent_70%)]"
                style={{ background: "var(--zx-glow)" }}
            />

            {/* Giant ZYREX IT behind the character (hidden on mobile) */}
            <div
                data-anim="giant"
                data-depth="-8"
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[6%] bottom-0 z-[2] hidden select-none min-[900px]:block"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GIANT.src}
                    alt=""
                    draggable={false}
                    className={`block h-auto w-full ${GIANT.shift}`}
                    style={{ opacity: GIANT.opacity }}
                />
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