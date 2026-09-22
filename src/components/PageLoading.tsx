// Shared route-level loading fallback — used by loading.tsx in each (site)
// segment that fetches data server-side, so a cache miss shows this instead
// of a blank page while the request resolves.
export default function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-2 border-gold-200 border-t-gold-500"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
