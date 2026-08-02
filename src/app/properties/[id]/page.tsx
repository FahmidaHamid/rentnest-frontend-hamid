type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl p-10">
      <h1 className="text-3xl font-bold">Property Details</h1>

      <p className="mt-4">Property ID: {id}</p>
    </main>
  );
}
