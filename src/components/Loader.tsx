"use client";

export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-8 py-12 animate-fade-in">
      {/* Triple ring spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin [animation-duration:2.2s]" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-white font-semibold tracking-wide">Fetching weather…</p>
        <p className="text-slate-500 text-sm mt-1">Please wait</p>
      </div>

      {/* Skeleton */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="h-52 rounded-3xl bg-white/[0.05] animate-pulse" />
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 h-48 rounded-2xl bg-white/[0.05] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
