export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-[2] flex max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Backend API Services
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            API Endpoints Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-6 border rounded-lg bg-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">Health Check</h3>
              <p className="text-sm text-gray-300">GET /api/health</p>
            </div>
            <div className="p-6 border rounded-lg bg-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">API Status</h3>
              <p className="text-sm text-gray-300">GET /api/status</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Services{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Backend services and API endpoints
          </p>
        </div>
      </div>
    </main>
  );
} 