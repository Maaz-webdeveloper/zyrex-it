export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark gap-6">
      <h1 className="text-accent">ZyrexIT Setup ✓</h1>
      <div className="flex space-x-4">
        <div className="w-24 h-24 rounded-xl bg-accent"></div>
        <div className="w-24 h-24 rounded-xl bg-accent-light"></div>
        <div className="w-24 h-24 rounded-xl bg-dark-2 border border-white/20"></div>
        <div className="w-24 h-24 rounded-xl bg-black border border-white/20"></div>
        <div className="w-24 h-24 rounded-xl bg-white"></div>
      </div>
    </div>
  );
}