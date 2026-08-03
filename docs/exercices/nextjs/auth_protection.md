# Exercice - Better Auth — Protection des routes

Ajouter une protection centralisée des routes et un accès par rôle à l'application de gestion de notes :

- Créer le fichier `middleware.ts` à la racine du projet :
    - Utiliser `getSessionCookie` (`better-auth/cookies`) pour implémenter la logique suivante :
        - Les chemins `/`, `/connexion` et `/inscription` sont publics
        - Toute autre page redirige vers `/connexion` si le cookie de session est absent
        - Si le cookie de session est présent et que l'utilisateur tente d'accéder à `/connexion` ou `/inscription`, le rediriger vers `/notes`
    - Configurer `matcher` pour exclure `_next/static`, `_next/image`, `favicon.ico` et `api`
- Ajouter un champ additionnel `role` (valeurs possibles : `"utilisateur"` ou `"admin"`) au modèle `user` via `user.additionalFields` dans `lib/auth.ts`, avec `"utilisateur"` comme `defaultValue` et `input: false` ; régénérer le schéma avec `npx auth@latest generate` et appliquer la migration
- Ajouter `inferAdditionalFields<typeof auth>()` au client (`lib/auth-client.ts`) pour que TypeScript connaisse le champ `role`
- Créer la section d'administration :
    - `app/admin/page.tsx` : vérifier avec `auth.api.getSession` que l'utilisateur est connecté **et** que `session.user.role` vaut `"admin"`, sinon rediriger vers `/acces-refuse`; afficher la liste de **tous** les utilisateurs (requête Prisma sans filtre sur la table `user`)
    - `app/acces-refuse/page.tsx` : page simple affichant un message d'accès refusé avec un lien vers `/notes`
- Modifier manuellement le rôle d'un utilisateur dans Prisma Studio (`npx prisma studio`) pour le passer à `"admin"` et vérifier que la page `/admin` devient accessible
- Ajouter une Server Action `supprimerNote(id: number)` dans laquelle vous vérifiez avec `auth.api.getSession` que la note appartient bien à l'utilisateur connecté avant de la supprimer (protection contre la suppression d'une note appartenant à quelqu'un d'autre)
