import Link from "next/link";

const produits = [
  { id: 1, nom: "Clavier mécanique" },
  { id: 2, nom: "Souris ergonomique" },
  { id: 3, nom: "Écran 27 pouces" },
];

export default function Produits() {
  return (
    <main>
      <h1>Liste des produits</h1>
      <ul>
        {produits.map((produit) => (
          <li key={produit.id}>
            <Link href={`/produits/${produit.id}`}>{produit.nom}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
