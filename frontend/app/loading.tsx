export default function Loading() {
  return (
    <div className="page-container py-12">
      <div className="space-y-4">
        <div className="h-8 w-64 skeleton rounded-lg" />
        <div className="h-4 w-96 skeleton rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
