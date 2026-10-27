import EmbedShell from "@/components/embed/EmbedShell";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmbedShell>{children}</EmbedShell>;
}