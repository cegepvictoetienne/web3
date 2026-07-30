# Authentification OAuth avec GitHub

## Qu'est-ce que OAuth

Avez-vous déjà connecté à un site Web en utilisant votre compte Facebook/Google/Apple? Ce genre de connectivité se fait à travers un protocole standard, OAuth.  

Voici un exemple de page d'authentification (Jira)  :

![Page de login Jira](./images/login-jira.png)  

L'idée est que le site Web fait confiance au fournisseur d'authenfication et ne reçoit que peu d'information. (Pas le mot de passe!).  


!!! manuel
    [Fournisseur GitHub - Auth.js](https://authjs.dev/getting-started/providers/github)  
    [OAuth Apps - GitHub Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

## Créer une application OAuth sur GitHub

1. Allez dans **GitHub → Settings → Developer settings → OAuth Apps**
   ![Page pour les OAuth de GitHub](./images/github_new_oauth.png)  
2. Cliquez sur **New OAuth App**
   ![Page pour nouvel OAuth de GitHub](./images/github_new_oauth_formulaire.png)  
3. Remplissez le formulaire :

| Champ | Valeur en développement |
|---|---|
| Application name | Mon App Next.js |
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |

4. Cliquez **Register application**
5. Notez le **Client ID** et générez un **Client Secret**

!!! warning "URL de rappel"
    L'URL de rappel doit correspondre exactement à ce qu'Auth.js attend : `/api/auth/callback/github`. En production, remplacez `localhost:3000` par votre domaine.

## Variables d'environnement

Ajoutez les identifiants GitHub dans votre fichier `.env` :

``` title=".env"
AUTH_SECRET="généré-par-npx-auth-secret"
AUTH_GITHUB_ID="votre-client-id-github"
AUTH_GITHUB_SECRET="votre-client-secret-github"
```

Auth.js reconnaît automatiquement les variables nommées `AUTH_<FOURNISSEUR>_ID` et `AUTH_<FOURNISSEUR>_SECRET`.

## Configuration du fournisseur GitHub

Ajoutez le fournisseur GitHub dans votre fichier `auth.ts` :

``` ts title="auth.ts"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
})
```

### Combiner GitHub et Credentials

Vous pouvez offrir plusieurs méthodes de connexion simultanément :

``` ts title="auth.ts"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      // configuration courriel + mot de passe...
    }),
  ],
})
```

## Bouton de connexion GitHub


``` tsx title="components/icone-github.tsx"
iexport function IconeGitHub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.17 0 1.56-.01 2.82-.01 3.2 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  )
}
```
``` tsx title="components/bouton-soumission-github.tsx"
"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { IconeGitHub } from "@/components/icone-github"

export function BoutonSoumissionGitHub() {
  const { pending: enCours } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={enCours}
    >
      <IconeGitHub className="size-4" />
      {enCours ? "Connexion en cours..." : "Continuer avec GitHub"}
    </Button>
  )
}
```

``` tsx title="components/bouton-github.tsx"
import { signIn } from "@/auth"

import { BoutonSoumissionGitHub } from "@/components/bouton-soumission-github"

export function BoutonConnexionGitHub() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github", { redirectTo: "/tableau-de-bord" })
      }}
    >
      <BoutonSoumissionGitHub />
    </form>
  )
}
```

``` tsx title="app/connexion/page.tsx"
import { BoutonConnexionGitHub } from "@/components/BoutonConnexionGitHub"

export default function PageConnexion() {
  return (
    <div>
      <h1>Connexion</h1>
      <BoutonConnexionGitHub />
    </div>
  )
}
```

## Données de session avec OAuth

Après la connexion via GitHub, Auth.js alimente automatiquement la session avec les informations du profil GitHub de l'utilisateur :

``` ts title="Contenu typique de session (OAuth GitHub)"
{
  user: {
    name: "Marie Tremblay",
    email: "marie@exemple.com",
    image: "https://avatars.githubusercontent.com/u/12345"
  },
  expires: "2025-07-30T..."
}
```

## Pour avoir le id des utilisateurs GitHub

### 1. Configurer les callbacks dans auth.ts

``` ts title="auth.ts"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const courriel = user.email ?? (profile?.email as string | undefined)

        if (!courriel) return false

        const utilisateur = await prisma.utilisateurs.upsert({
          where: { courriel },
          update: {},
          create: {
            courriel,
            nom: user.name ?? (profile?.login as string | undefined) ?? courriel,
          },
        })

        user.id = String(utilisateur.id)
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
```
