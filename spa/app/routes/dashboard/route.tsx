import { AddItemDialog, EditItemDialog } from "./add-item-form";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4 flex items-center justify-center">
      <div className="container mx-auto flex flex-col gap-10">
        <div className="mt-12 font-mono">
          <h2 className="text-2xl font-black mb-4">quick stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-4 border-black p-4 bg-purple-200">
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm">items shared</div>
            </div>
            <div className="border-4 border-black p-4 bg-green-200">
              <div className="text-3xl font-bold">47</div>
              <div className="text-sm">total borrows</div>
            </div>
            <div className="border-4 border-black p-4 bg-blue-200">
              <div className="text-3xl font-bold">96%</div>
              <div className="text-sm">return rate</div>
            </div>
            <div className="border-4 border-black p-4 bg-yellow-200">
              <div className="text-3xl font-bold">$1.2k</div>
              <div className="text-sm">saved by community</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">ur shared stuff</h1>
          <AddItemDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* item card */}
          <div className="border-4 border-black bg-white p-4 transform hover:-rotate-1 transition">
            <div className="aspect-square bg-gray-100 mb-4">
              <img
                // src="drill.jpg"
                alt="power drill"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl">power drill</h3>
              <span className="bg-green-200 px-2 py-1 text-sm font-mono">
                available rn
              </span>
            </div>

            <p className="font-mono text-sm mb-4">
              dewalt 20v. good for basic stuff. comes with bits and case
            </p>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span>times borrowed:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>avg borrow time:</span>
                <span>2.3 days</span>
              </div>
              <div className="flex justify-between">
                <span>trust score:</span>
                <span className="text-green-600">98%</span>
              </div>
            </div>

            <div className="border-t-2 border-black mt-4 pt-4 flex gap-2">
              <EditItemDialog />
              <button className="flex-1 px-3 py-2 border-2 border-black text-sm font-bold hover:bg-gray-100">
                DELIST
              </button>
            </div>
          </div>

          {/* repeat similar cards but with different statuses */}
          <div className="border-4 border-black bg-white p-4 transform hover:rotate-1 transition">
            <div className="aspect-square bg-gray-100 mb-4">
              <img
                // src="tent.jpg"
                alt="camping tent"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl">4-person tent</h3>
              <span className="bg-yellow-200 px-2 py-1 text-sm font-mono">
                borrowed until 6/12
              </span>
            </div>

            {/* similar stats... */}
          </div>
        </div>
      </div>
    </div>
  );
}
