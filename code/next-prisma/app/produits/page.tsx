import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { supprimerProduit } from "@/app/actions/produit.actions";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany({
    include: { categorie: true },
  });

  return (
    <main>
      <h1>Liste des produits</h1>
      <Link href="/produits/nouveau">Ajouter un produit</Link>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((produit) => (
            <tr key={produit.id}>
              <td>{produit.nom}</td>
              <td>{produit.prix} $</td>
              <td>{produit.categorie.nom}</td>
              <td>
                <form action={supprimerProduit.bind(null, produit.id)}>
                  <button type="submit">Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
