import { creerProduit } from "@/app/actions/produit.actions";

export default function NouveauProduit() {
  return (
    <main>
      <h1>Ajouter un produit</h1>

      <form action={creerProduit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input type="text" id="nom" name="nom" required />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea id="description" name="description" />
        </div>

        <div>
          <label htmlFor="prix">Prix :</label>
          <input type="number" id="prix" name="prix" step="0.01" required />
        </div>

        <div>
          <label htmlFor="categorieId">Catégorie (ID) :</label>
          <input type="number" id="categorieId" name="categorieId" required />
        </div>

        <button type="submit">Ajouter</button>
      </form>
    </main>
  );
}
