import ServiceCard from "./ServiceCard";
import ServicesSlider from "./ServicesSlider";
import { SERVICES, SERVICES_COPY } from "./data";

// Heading of the Services section, plus the swipe slider on mobile.
// The desktop stacking cards are in ServicesStage.tsx; with reduced motion the desktop shows the plain card list here.

export default function Services() {
    return (
        <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 py-[clamp(72px,9vw,140px)] text-white max-md:pb-16 md:motion-safe:pb-[clamp(16px,2vw,40px)]">
            <div className="mx-auto max-w-[80rem]">
                {/* Heading (same pattern as Team) */}
                <div className="mx-auto flex max-w-[72rem] flex-col items-center text-center">
                    <span className="rounded-full border border-accent/70 px-5 py-2 text-[11px] font-normal tracking-[0.18em] text-white uppercase">
                        {SERVICES_COPY.label}
                    </span>
                    <h2 className="mt-6 text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em] max-[480px]:text-[length:calc((100vw-40px)*0.082)] min-[900px]:whitespace-nowrap">
                        {SERVICES_COPY.heading}{" "}
                        <br className="min-[900px]:hidden" />
                        <span
                            className="animate-zx-shine bg-clip-text font-normal text-transparent"
                            style={{
                                backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                                backgroundSize: "200% 100%",
                                WebkitTextStroke: "0.024em transparent", // Garet has no 500/600: this thickens the letters; bg-clip-text fills the stroke with the gold shine, so no outline
                            }}
                        >
                            {SERVICES_COPY.headingAccent}
                        </span>
                    </h2>
                    <p className="mt-5 max-w-[46rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">
                        {SERVICES_COPY.text}
                    </p>
                </div>

                <ServicesSlider />

                {/* Plain list: desktop with reduced motion */}
                <div className="mt-[clamp(48px,6vw,96px)] hidden flex-col gap-[clamp(24px,3vw,48px)] md:motion-reduce:flex">
                    {SERVICES.map((s, i) => (
                        <ServiceCard key={s.title} service={s} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}