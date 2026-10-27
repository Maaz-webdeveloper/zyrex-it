// Character area. Desktop: fixed-height stage at the bottom. Mobile: character between text and buttons.

export default function HeroStage() {
    return (
        <div className="relative mt-2.5 flex w-full flex-1 flex-col justify-end pb-6 min-[900px]:mt-auto min-[900px]:h-[max(360px,min(calc(clamp(470px,min(44vw,calc(var(--zx-vh,100svh)*0.62)),700px)+60px),calc(var(--zx-vh,100svh)-300px)))] min-[900px]:flex-none min-[900px]:pb-0">
            {/* Character */}
            <div className="relative z-[3] mx-auto h-[clamp(200px,calc(var(--zx-vh,100svh)*0.4),360px)] w-full [mask-image:linear-gradient(to_bottom,#000_82%,transparent_100%)] min-[900px]:absolute min-[900px]:inset-0 min-[900px]:h-auto min-[900px]:origin-bottom min-[900px]:[mask-image:none] min-[1050px]:scale-[1.06] min-[1200px]:scale-110 min-[1650px]:scale-125">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/hero/character.svg"
                    alt=""
                    draggable={false}
                    fetchPriority="high"
                    className="absolute bottom-0 left-1/2 h-full w-full -translate-x-[55%] object-contain object-bottom select-none min-[900px]:-translate-x-1/2"
                />
            </div>

            {/* Bottom fade so the character melts into the page (desktop) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-10 bottom-0 z-[4] hidden h-[26%] min-[900px]:block"
                style={{ background: "linear-gradient(to bottom, transparent, #000 92%)" }}
            />
        </div>
    );
}