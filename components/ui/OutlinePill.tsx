// Gold outline pill: same border look and text style as the hero MENU button.
// The outline itself is the .zx-outline class in app/globals.css (CSS, so it fits any width).
//   size "md": section labels ("OUR TEAM", "WHAT WE DO")
//   size "sm": small pills (role on the Team cards, "Featured" in the menu)
//   solid: dark fill under the outline, for pills on top of photos

const SIZES = {
    md: "h-9 px-[18px] text-[12px]",
    sm: "h-[clamp(24px,1.75vw,27px)] px-[clamp(12px,0.95vw,15px)] text-[clamp(9px,0.62vw,10px)]",
};

export default function OutlinePill({
    children,
    size = "md",
    solid = false,
    className = "",
}: {
    children: React.ReactNode;
    size?: keyof typeof SIZES;
    solid?: boolean;
    className?: string;
}) {
    return (
        <span
            className={`zx-outline ${solid ? "zx-outline-solid" : ""} inline-flex w-fit items-center justify-center leading-none font-normal tracking-[0.14em] whitespace-nowrap text-[#f6f1f1] uppercase ${SIZES[size]} ${className}`}
        >
            {children}
        </span>
    );
}
