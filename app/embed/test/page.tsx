export default function TestPage() {
  return (
    <section className="bg-dark-2 py-20 px-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-accent mb-6">
        Embed Test
      </h1>
      <p className="text-white/70 max-w-md">
        This is a test embed section to verify the height reporting system works correctly.
        The section should communicate its height to the parent iframe via postMessage.
      </p>
    </section>
  );
}