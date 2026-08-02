export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold">RentNest</h1>

        <div className="flex gap-6">
          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="/login">Login</a>
        </div>
      </div>
    </nav>
  );
}
