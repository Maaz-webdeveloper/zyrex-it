// Background layers: gold glow + giant "ZYREX IT" image across the full width (desktop).
// Same image drawn twice: dim copy (all letters, behind the character)
// and bright copy clipped to the golden Z only (in front of the bottom fade).

const GIANT = {
    src: "/hero/golden-z.png",
    lettersOpacity: 0.35, // grey letters stay subtle
    zClip: "inset(0 78% 0 0)", // bright copy shows only the golden Z (raise 78% if part of the Y shows)
    side: "-11%", // how far the image reaches past the screen edges (more negative = bigger letters)
    bottom: "calc(2% - 10.3vw)", // pushes the image down past its empty bottom space (less negative vw = text goes higher)
};

// Soft fade only on the grey letters, so they stay fully readable
const LETTERS_FADE = "linear-gradient(to bottom, #000 60%, rgba(0, 0, 0, 0.45) 100%)";

const BOX = "pointer-events-none absolute hidden select-none min-[900px]:block";
const POSITION = { left: GIANT.side, right: GIANT.side, bottom: GIANT.bottom };

export default function HeroBackdrop() {
    return (
        <>
            {/* Warm gold glow behind the character */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse 55% 45% at 50% 78%, rgba(255, 204, 0, 0.16), transparent 70%)",
                }}
            />

            {/* Dim copy: all letters, behind the character (hidden on mobile) */}
            <div aria-hidden="true" className={`${BOX} z-[2]`} style={POSITION}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GIANT.src}
                    alt=""
                    draggable={false}
                    className="block h-auto w-full"
                    style={{ opacity: GIANT.lettersOpacity, maskImage: LETTERS_FADE, WebkitMaskImage: LETTERS_FADE }}
                />
            </div>

            {/* Bright copy: golden Z only, fully visible (hidden on mobile) */}
            <div aria-hidden="true" className={`${BOX} z-[5]`} style={POSITION}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GIANT.src}
                    alt=""
                    draggable={false}
                    className="block h-auto w-full"
                    style={{ clipPath: GIANT.zClip }}
                />
            </div>
        </>
    );
}