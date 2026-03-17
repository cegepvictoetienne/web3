interface ProduitPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProduitDetail({ params }: ProduitPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Détail du produit #{id}</h1>
      <p>Vous consultez le produit avec l&apos;identifiant : {id}</p>
    </main>
  );
}
