// Background layers: soft gold glow + giant "ZYREX IT" text with the golden Z (desktop only)

const GIANT_TEXT_SHIFT = "translate-y-[27%]"; // how much of the giant text hides below the bottom edge

export default function HeroBackdrop() {
    return (
        <>
            {/* Soft gold glow behind the character */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse 60% 40% at 50% 72%, rgba(255, 204, 0, 0.12), transparent 70%)",
                }}
            />

            {/* Giant ZYREX IT + golden Z (hidden on mobile) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[6%] bottom-0 z-[2] hidden select-none min-[900px]:block"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/giant-text.svg" alt="" draggable={false} className={`block h-auto w-full ${GIANT_TEXT_SHIFT}`} />
            </div>
        </>
    );
}