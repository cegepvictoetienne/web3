# Exercice - Better Auth — Courriel et mot de passe

Créer une application de gestion de notes personnelles avec authentification par courriel et mot de passe :

## Mise en contexte

Le code de départ ci-dessous contient une application Next.js qui gère des notes pour un utilisateur. Le but de l'exercice est de rendre l'application multi-utilisateurs en ajoutant l'authentification.  

## Étape 1 — Code de départ

Clonez le code de départ, une application complète que vous allez modifier :  

``` nodejsrepl title="console"  
git clone https://github.com/cegepvictoetienne/exercice-web3-auth.git   
``` 

## Étape 2 -- Configurer Better Auth  

- Installer `better-auth` et `@better-auth/prisma-adapter`
- Générer `BETTER_AUTH_SECRET` avec `npx auth@latest secret` et ajouter `BETTER_AUTH_URL` dans `.env`
- Créer `lib/auth.ts` avec `emailAndPassword.enabled: true` et le plugiciel `nextCookies`
- Créer le gestionnaire de route `app/api/auth/[...all]/route.ts`
- Créer le client `lib/auth-client.ts`
- Générer les tables avec `npx auth@latest generate`, puis appliquer la migration Prisma

## Étape 3 - Créer les pages d'authentification  
- `app/inscription/page.tsx` : formulaire avec nom, courriel et mot de passe ; la Server Action appelle `auth.api.signUpEmail`, puis redirige vers `/connexion`
- `app/connexion/page.tsx` : formulaire dont la Server Action appelle `auth.api.signInEmail` ; afficher un message d'erreur si les identifiants sont invalides (capturer l'`APIError`)

## Étape 4 - Protéger les pages  
- Vérifier manuellement la session avec `auth.api.getSession({ headers: await headers() })` et rediriger si absente :
    - `app/notes/page.tsx` : liste des notes de l'utilisateur connecté (filtrer par `utilisateurId`)
    - `app/notes/nouvelle/page.tsx` : formulaire de création de note avec une Server Action
    - `app/notes/[id]/page.tsx` : affichage d'une note, s'assurer que la note appartient à l'utilisateur connecté
- Ajouter un composant de navigation qui affiche le nom de l'utilisateur et un bouton « Se déconnecter » (le bouton est un composant client qui appelle `authClient.signOut()`)

!!! note "Identifiants des utilisateurs"
    Better Auth génère des `id` de type texte (chaîne) plutôt que des entiers auto-incrémentés. Adaptez le type de `utilisateurId` dans votre modèle Prisma `Note` en conséquence.
