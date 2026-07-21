# Exercice - Auth.js — Courriel et mot de passe

Créer une application de gestion de notes personnelles avec authentification par courriel et mot de passe :

## Mise en contexte

Le code de départ ci-dessous contient une application Next.js qui gère des notes pour un utilisateur. Le but de l'exercice est de rendre l'application multi-utilisateurs en ajoutant l'authentification.  

## Étape 1 — Code de départ

Clonez le code de départ, une application complète que vous allez modifier :  

``` nodejsrepl title="console"  
git clone https://github.com/cegepvictoetienne/exercice-web3-auth.git   
``` 

## Étape 2 -- Configurer Auth.js  

- Installer `next-auth@beta` et `bcryptjs`
- Générer `AUTH_SECRET` avec `npx auth secret`
- Créer `auth.ts` à la racine avec le fournisseur `Credentials`
- Créer le gestionnaire de route `app/api/auth/[...nextauth]/route.ts`
- Ajouter `SessionProvider` dans le layout racine

## Étape 3 - Créer les pages d'authentification  
- `app/inscription/page.tsx` : formulaire avec nom, courriel et mot de passe ; la Server Action hache le mot de passe avec `bcrypt.hash` avant de créer l'utilisateur, puis redirige vers `/connexion`
- `app/connexion/page.tsx` : formulaire qui appelle `signIn("credentials", ...)` ; afficher un message d'erreur si les identifiants sont invalides

## Étape 4 - Protéger les pages  
- Vérifier manuellement la session avec `auth()` et rediriger si absente :
    - `app/notes/page.tsx` : liste des notes de l'utilisateur connecté (filtrer par `utilisateurId`)
    - `app/notes/nouvelle/page.tsx` : formulaire de création de note avec une Server Action
    - `app/notes/[id]/page.tsx` : affichage d'une note, s'assurer que la note appartient à l'utilisateur connecté
- Ajouter un composant de navigation qui affiche le nom de l'utilisateur et un bouton « Se déconnecter » (Server Component utilisant `auth()`)  


