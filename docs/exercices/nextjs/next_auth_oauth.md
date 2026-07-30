# Exercice - Auth.js — OAuth avec GitHub

Ajouter la connexion via GitHub à l'application de gestion de notes de l'exercice précédent :

- Créer une application OAuth sur GitHub :
    - Aller dans **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
    - Remplir le formulaire avec `http://localhost:3000` comme URL et `http://localhost:3000/api/auth/callback/github` comme URL de rappel
    - Copier le **Client ID** et générer un **Client Secret**
- Configurer les variables d'environnement dans `.env` :
    - `AUTH_GITHUB_ID` avec le Client ID GitHub
    - `AUTH_GITHUB_SECRET` avec le Client Secret GitHub
- Modifier `auth.ts` pour ajouter le fournisseur GitHub aux côtés du fournisseur `Credentials`
- Ajouter un bouton « Se connecter avec GitHub » sur la page `/connexion` (formulaire avec Server Action appelant `signIn("github", { redirectTo: "/notes" })`)
- Tester les deux méthodes de connexion (courriel + mot de passe et GitHub) et vérifier que les pages protégées restent accessibles dans les deux cas


<figure markdown>
  ![exercice](images/nextjs-auth-github.png){ width="600" }
  <figcaption>Aspect visuel de l'exercice de auth GitHub dans Next.js</figcaption>
</figure>


[Version démo](https://next-auth.profinfo.ca)  