export function CategorySkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border p-4 space-y-3">
      <div className="h-4 w-1/2 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-2/3 rounded bg-muted" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 rounded bg-muted" />
        <div className="h-6 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}
