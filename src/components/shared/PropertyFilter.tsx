export default function PropertyFilter() {
  return (
    <div className="mt-8 grid gap-4 rounded-lg border p-6 md:grid-cols-3">
      <input placeholder="Location" className="rounded-md border px-4 py-2" />

      <input
        placeholder="Min Price"
        type="number"
        className="rounded-md border px-4 py-2"
      />

      <input
        placeholder="Max Price"
        type="number"
        className="rounded-md border px-4 py-2"
      />
    </div>
  );
}
