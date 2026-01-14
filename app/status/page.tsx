import React from "react";

export default function StatusPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">System Status</h1>
      <p className="text-text-muted mb-8 text-lg">Check the current operational status of ZenPC services.</p>
      <section className="space-y-10">
          <div className="rounded-xl bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/20 p-8 shadow-xl flex flex-col items-center">
            <svg className="w-14 h-14 text-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <h2 className="text-3xl font-bold mb-2 text-text-primary">All Systems Operational</h2>
            <p className="text-text-muted mb-2">There are currently no reported issues. All ZenPC services are running smoothly.</p>
            <span className="text-xs text-accent">Updated just now</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-2 rounded-lg p-6 border border-border/10 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <div>
                <div className="font-medium text-text-primary">Website</div>
                <div className="text-xs text-text-muted">Operational</div>
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-6 border border-border/10 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <div>
                <div className="font-medium text-text-primary">API</div>
                <div className="text-xs text-text-muted">Operational</div>
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-6 border border-border/10 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <div>
                <div className="font-medium text-text-primary">Authentication</div>
                <div className="text-xs text-text-muted">Operational</div>
              </div>
            </div>
            <div className="bg-surface-2 rounded-lg p-6 border border-border/10 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <div>
                <div className="font-medium text-text-primary">Database</div>
                <div className="text-xs text-text-muted">Operational</div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
