import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useUser } from "~/lib/hooks/user";

export const meta: MetaFunction = () => {
  return [
    { title: "Simple Landing Page" },
    { name: "description", content: "A simple landing page" },
  ];
};

type LoaderData = {
  isLoggedIn: boolean;
};

export default function Index() {
  const navigate = useNavigate();
  const userQuery = useUser(navigate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto border-4 border-black p-8 mt-12 bg-white/80 backdrop-blur-sm">
        <header className="mb-16">
          <h1 className="text-6xl font-black uppercase mb-4 transform -rotate-2">
            share ur stuff
          </h1>
          <p className="text-2xl font-mono bg-purple-300 inline-block p-2 transform rotate-1">
            own less // share more // touch grass
          </p>
        </header>

        <main className="space-y-12">
          <div className="border-4 border-black p-6 transform rotate-1 bg-emerald-200">
            <h2 className="text-4xl font-black mb-4">SHARE ECONOMY FR FR</h2>
            <p className="font-mono">
              why buy when u can borrow? <br />
              post ur stuff, find what u need, build actual community
              <br />
              no cap, just vibes and mutual aid
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4 font-mono text-sm">
              <div>🔨 tools</div>
              <div>📚 books</div>
              <div>🌱 garden stuff</div>
            </div>
            <Link
              to="/goods"
              className="mt-6 px-8 py-3 bg-black text-white font-bold text-xl hover:bg-gray-800 transform hover:-translate-y-1 transition inline-block"
            >
              SEE THE GOODS →
            </Link>
          </div>

          <div className="border-4 border-black p-6 transform -rotate-1 bg-yellow-200">
            <h2 className="text-4xl font-black mb-4">HOW IT WORKS</h2>
            <ul className="font-mono space-y-2">
              <li>• post what u can share</li>
              <li>• borrow what u need</li>
              <li>• return stuff on time (don't be That Guy)</li>
              <li>• build trust score w the community</li>
              <li>• everything tracked on-chain fr fr</li>
            </ul>
            <Link
              to={userQuery.data?.id ? "/dashboard" : "/auth"}
              className="mt-6 px-8 py-3 bg-black text-white font-bold text-xl hover:bg-gray-800 transform hover:-translate-y-1 transition inline-block"
            >
              {userQuery.data?.id ? "GO TO DASHBOARD →" : "START SHARING →"}
            </Link>
          </div>
        </main>

        <footer className="mt-16 font-mono text-sm transform rotate-1">
          <p>
            powered by community since {new Date().getFullYear()} | verified
            grass-touchers only
          </p>
        </footer>
      </div>
    </div>
  );
}
