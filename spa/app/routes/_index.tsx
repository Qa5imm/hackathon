import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useUser } from "~/lib/hooks/user";

export const meta: MetaFunction = () => {
  return [
    { title: "Simple Landing Page" },
    { name: "description", content: "A simple landing page" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const userQuery = useUser(navigate);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-emerald-100 to-cyan-100">
      <div className="max-w-7xl mx-auto border-4 border-black p-12 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex gap-12">
          {/* Left column - Hero */}
          <div className="w-1/3 sticky top-12 self-start">
            <h1 className="text-8xl font-black uppercase transform -rotate-2 hover:rotate-0 transition-transform leading-[0.9]">
              SHARE STUFF NOW
            </h1>
            <p className="text-xl font-mono bg-purple-300 inline-block p-3 transform rotate-1 mt-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              own less // share more // touch grass
            </p>

            <div className="mt-12 space-y-3 font-mono">
              <p className="text-lg">already in the community?</p>
              <Link
                to={userQuery.data?.id ? "/dashboard" : "/auth"}
                className="px-8 py-3 bg-black text-white font-bold inline-block border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
              >
                {userQuery.data?.id ? "ENTER STASH →" : "START SHARING →"}
              </Link>
            </div>
          </div>

          {/* Right side content */}
          <div className="w-2/3 space-y-12">
            {/* Share Economy Section */}
            <div className="border-4 border-black p-8 bg-emerald-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-black mb-6">SHARE ECONOMY FR FR</h2>
              <p className="font-mono text-lg leading-relaxed">
                why buy when u can borrow? <br />
                post ur stuff, find what u need, build actual community <br />
                no cap, just vibes and mutual aid
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 font-mono">
                <div className="border-2 border-black p-4 bg-white hover:translate-y-[-2px] transition-transform">
                  <div className="text-2xl mb-2">🔨</div>
                  <div>tools n stuff</div>
                </div>
                <div className="border-2 border-black p-4 bg-white hover:translate-y-[-2px] transition-transform">
                  <div className="text-2xl mb-2">📚</div>
                  <div>books n media</div>
                </div>
                <div className="border-2 border-black p-4 bg-white hover:translate-y-[-2px] transition-transform">
                  <div className="text-2xl mb-2">🌱</div>
                  <div>garden gear</div>
                </div>
              </div>
              <Link
                to="/goods"
                className="mt-8 px-8 py-3 bg-black text-white font-bold inline-block border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
              >
                PEEP THE GOODS →
              </Link>
            </div>

            {/* How it Works Section */}
            <div className="border-4 border-black p-8 bg-cyan-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-black mb-6">HOW IT WORKS</h2>
              <ul className="font-mono text-lg space-y-4">
                <li className="flex items-center gap-3">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </span>
                  post what u can share
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </span>
                  borrow what u need
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </span>
                  return on time (don't be That Guy)
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                    4
                  </span>
                  build trust score w the community
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold">
                    5
                  </span>
                  everything tracked on-chain fr fr
                </li>
              </ul>

              <div className="mt-8 p-4 border-2 border-black bg-yellow-200">
                <p className="font-mono">
                  <span className="font-bold">protip:</span> higher trust score
                  = more borrowing power + special perks
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 font-mono text-sm border-t-4 border-black pt-6 flex justify-between items-center">
          <div>
            powered by community since {new Date().getFullYear()} | verified
            grass-touchers only
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">discord</span>
            <span className="hover:underline cursor-pointer">twitter</span>
            <span className="hover:underline cursor-pointer">github</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
