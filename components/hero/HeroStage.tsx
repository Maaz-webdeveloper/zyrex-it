// Character area. Desktop: stage at the bottom with room above the head for the 3D ring.
// Mobile: character below the buttons.
import CharacterOrbits from "./CharacterOrbits";
export default function HeroStage() {
  return (
    <div className="relative mt-2 max-[560px]:mt-8 flex w-full flex-1 flex-col justify-end min-[900px]:mt-auto min-[900px]:h-[clamp(360px,calc(var(--zx-vh,100svh)*0.52),700px)] min-[900px]:flex-none">
      {/* Character */}
      <div className="relative z-[3] mx-auto min-h-[300px] flex-1 w-full min-[900px]:absolute min-[900px]:inset-0 min-[900px]:h-auto" data-anim="character" data-depth="10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/character.svg"
          alt=""
          draggable={false}
          fetchPriority="high"
          className="absolute z-[2] bottom-0 left-1/2 h-full w-full -translate-x-[55%] object-contain object-bottom select-none max-[899px]:w-[130%] max-[899px]:max-w-none max-[899px]:[mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)] min-[900px]:-translate-x-1/2"
        />
        <CharacterOrbits />
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