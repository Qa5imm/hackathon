import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Simple Landing Page" },
    { name: "description", content: "A simple landing page" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-24">
          <h1 className="text-7xl font-black mb-6 tracking-tight">
            SIMPLE STUFF
          </h1>
          <p className="text-2xl font-mono border-b-4 border-black pb-2 inline-block">
            doing it right.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="border-4 border-black p-8 [box-shadow:8px_8px_0_0_#000]">
            <h2 className="text-3xl font-bold mb-6">about this</h2>
            <p className="text-lg font-mono">
              straight to the point. no fluff. just pure function with style.
            </p>
            <button className="mt-8 px-8 py-3 bg-black text-white font-bold hover:translate-y-[-2px] transition-transform">
              more →
            </button>
          </section>

          <section className="border-4 border-black p-8 [box-shadow:8px_8px_0_0_#000]">
            <h2 className="text-3xl font-bold mb-6">get going</h2>
            <p className="text-lg font-mono">
              skip the nonsense. start right now.
            </p>
            <button className="mt-8 px-8 py-3 bg-black text-white font-bold hover:translate-y-[-2px] transition-transform">
              begin →
            </button>
          </section>
        </main>

        <footer className="mt-24 font-mono text-sm border-t-4 border-black pt-6">
          <p>© {new Date().getFullYear()} | built different</p>
        </footer>
      </div>
    </div>
  );
}
