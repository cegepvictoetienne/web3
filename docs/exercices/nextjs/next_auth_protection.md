# Exercice - Auth.js — Protection des routes

Ajouter une protection centralisée des routes et un accès par rôle à l'application de gestion de notes :

- Créer le fichier `middleware.ts` à la racine du projet :
    - Utiliser la forme étendue (`auth((req) => { ... })`) pour implémenter la logique suivante :
        - Les chemins `/`, `/connexion` et `/inscription` sont publics
        - Toute autre page redirige vers `/connexion` si l'utilisateur n'est pas connecté
        - Si l'utilisateur est connecté et tente d'accéder à `/connexion` ou `/inscription`, le rediriger vers `/notes`
    - Configurer `matcher` pour exclure `_next/static`, `_next/image`, `favicon.ico` et `api`
- Ajouter un champ `role` (valeurs possibles : `"utilisateur"` ou `"admin"`) au modèle Prisma `Utilisateur` avec `"utilisateur"` comme valeur par défaut ; appliquer la migration
- Propager le rôle dans la session :
    - Ajouter `role: string` dans `types/next-auth.d.ts`
    - Retourner le `role` dans la fonction `authorize` de `auth.ts`
    - Ajouter les callbacks `jwt` et `session` pour propager `token.role` vers `session.user.role`
- Créer la section d'administration :
    - `app/admin/page.tsx` : vérifier avec `auth()` que l'utilisateur est connecté **et** que son rôle est `"admin"`, sinon rediriger vers `/acces-refuse`; afficher la liste de **tous** les utilisateurs (requête Prisma sans filtre)
    - `app/acces-refuse/page.tsx` : page simple affichant un message d'accès refusé avec un lien vers `/notes`
- Modifier manuellement le rôle d'un utilisateur dans Prisma Studio (`npx prisma studio`) pour le passer à `"admin"` et vérifier que la page `/admin` devient accessible
- Ajouter une Server Action `supprimerNote(id: number)` dans laquelle vous vérifiez avec `auth()` que la note appartient bien à l'utilisateur connecté avant de la supprimer (protection contre la suppression d'une note appartenant à quelqu'un d'autre)
