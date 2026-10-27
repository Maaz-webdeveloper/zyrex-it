// Background layers: gold glow, subtle giant "ZYREX IT", bright golden 3D Z (desktop)

const GIANT = {
  opacity: 0.35, // giant letters stay subtle so the character is the focus
  shift: "translate-y-[27%]", // how much of the giant text hides below the bottom edge
};

const GOLDEN_Z = {
  src: "/hero/golden-z.png",
  left: "0.5%", // move the golden Z left/right to sit on the grey Z
  width: "14%", // size of the golden Z
  bottom: "-4%", // move it up/down
};

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

      {/* Giant ZYREX IT + golden Z (hidden on mobile) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[6%] bottom-0 z-[2] hidden select-none min-[900px]:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/giant-text.svg"
          alt=""
          draggable={false}
          className={`block h-auto w-full ${GIANT.shift}`}
          style={{
            opacity: GIANT.opacity,
            maskImage: "linear-gradient(to bottom, #000 30%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 30%, transparent 95%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GOLDEN_Z.src}
          alt=""
          draggable={false}
          className="absolute h-auto"
          style={{
            left: GOLDEN_Z.left,
            width: GOLDEN_Z.width,
            bottom: GOLDEN_Z.bottom,
            filter: "drop-shadow(0 0 30px rgba(255, 204, 0, 0.35))",
          }}
        />
      </div>
    </>
  );
}