// Hero text: eyebrow, shining 2-line heading, paragraph (same sizes as the old design)

const SHINE_A =
    "linear-gradient(90deg, #ffcc00 0%, #ffdd65 12.5%, #ffffff 25%, #ffdd65 37.5%, #ffcc00 50%, #ffdd65 62.5%, #ffffff 75%, #ffdd65 87.5%, #ffcc00 100%)";
const SHINE_B =
    "linear-gradient(90deg, #ffffff 0%, #ffdd65 12.5%, #ffcc00 25%, #ffdd65 37.5%, #ffffff 50%, #ffdd65 62.5%, #ffcc00 75%, #ffdd65 87.5%, #ffffff 100%)";

const SHINE_CLASS =
    "mx-auto block w-fit bg-clip-text text-transparent animate-zx-shine max-[560px]:whitespace-nowrap";

const SHINE_STYLE = {
  backgroundSize: "200% 100%",
} as const;

export default function HeroCopy() {
    return (
        <div className="relative z-10 flex flex-col items-center px-5 pt-[clamp(80px,calc(var(--zx-vh,100svh)*0.1),110px)] text-center min-[900px]:[@media(max-height:760px)]:pt-[84px]">
            {/* Eyebrow */}
            <p className="mt-[50px] pl-[0.3em] text-[12px] tracking-[0.3em] text-white uppercase min-[561px]:pl-[0.5em] min-[561px]:tracking-[0.5em]" data-anim="eyebrow">
                Marketing Agency
            </p>

            {/* Heading: line 1 yellow-white-yellow, line 2 white-yellow-white */}
            <h1 className="mt-[18px] max-w-[1000px] text-[clamp(1.5rem,3.5vw,3.2rem)] leading-[1.04] font-extrabold tracking-[-0.01em] uppercase max-[560px]:text-[5.9vw] max-[560px]:tracking-normal min-[900px]:[@media(max-height:760px)]:mt-3 min-[1600px]:max-w-[1300px] min-[1600px]:text-[clamp(3rem,3.2vw,4.6rem)]">
                <span className={SHINE_CLASS} style={{ ...SHINE_STYLE, backgroundImage: SHINE_A }} data-anim="line">
                    Powering businesses with
                </span>
                <span className={`${SHINE_CLASS} text-[0.98em]`} style={{ ...SHINE_STYLE, backgroundImage: SHINE_B }} data-anim="line">
                    smarter digital solutions
                </span>
            </h1>

            {/* Paragraph: 2 lines on desktop, compact on mobile */}
            <p className="mx-auto mt-[14px] w-full px-0 text-[clamp(13.5px,3.8vw,15px)] leading-[1.5] text-balance text-white/70 min-[561px]:mt-5 min-[561px]:w-[min(100%,34rem)] min-[561px]:px-[clamp(12px,4.5vw,28px)] min-[561px]:text-[clamp(0.95rem,1.4vw,1.1rem)] min-[561px]:leading-[1.6] min-[900px]:w-[min(48rem,92vw)] min-[900px]:[@media(max-height:760px)]:mt-3 min-[900px]:[@media(max-height:760px)]:text-[0.9rem] min-[1600px]:w-[min(54rem,92vw)] min-[1600px]:text-[1.2rem]" data-anim="text">
                We build the digital systems, experiences, and strategies that help modern businesses look better, work
                smarter, and scale with confidence.
            </p>
        </div>
    );
}