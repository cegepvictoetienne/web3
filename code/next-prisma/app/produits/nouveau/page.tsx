import { creerProduit } from '@/app/actions/produit.actions';
import { useActionState } from 'react';

export default function NouveauProduit() {
  const [state, formAction, pending] = useActionState(creerProduit, undefined);
  return (
    <main>
      <h1>Ajouter un produit</h1>

      <form action={formAction}>
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

        {state?.erreur && (
          <p
            aria-live="polite"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400"
          >
            {state.erreur}
          </p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? 'Ajout en cours…' : 'Ajouter'}
        </button>
      </form>
    </main>
  );
}
