# Authentification avec Better Auth — Courriel et mot de passe

## Qu'est-ce que Better Auth

Toute application se doit d'être bien protégée. Pour une appli Web faite avec Next.js, utilisez le module Better Auth. (Pourquoi réinventer la roue quand um module gratuit fait l'affaire!)   

!!! manuel
    [Documentation officielle Better Auth](https://www.better-auth.com/docs)  
    [Guide Next.js - Better Auth](https://www.better-auth.com/docs/integrations/next)

## Installation

``` nodejsrepl title="console"
npm install better-auth
npm install @better-auth/prisma-adapter
```

Générez ensuite une clé secrète pour chiffrer les sessions :

``` nodejsrepl title="console"
npx auth@latest secret
```

Ajoutez `BETTER_AUTH_SECRET` dans votre fichier `.env` avec la clé générée, ainsi que `BETTER_AUTH_URL`, l'adresse de votre application :

``` title=".env"
BETTER_AUTH_SECRET="généré-par-npx-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL="mysql://..."
```

## Configuration de base

### Fichier principal de Better Auth

Créez le fichier `lib/auth.ts` :

``` ts title="lib/auth.ts"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"

import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
})
```

Le plugiciel `nextCookies` doit toujours être le dernier de la liste des plugiciels : il permet aux appels `auth.api.signInEmail` et `auth.api.signUpEmail` faits depuis une action serveur de bien déposer le cookie de session dans le navigateur.

### Gestionnaire de route

Better Auth a besoin d'une route API pour gérer les requêtes d'authentification (connexion, déconnexion, session) :

``` ts title="app/api/auth/[...all]/route.ts"
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

### Client d'authentification

Les composants clients passent par un client dédié pour accéder à la session ou déclencher certaines actions :

``` ts title="lib/auth-client.ts"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()
```

## Génération du schéma de base de données

Better Auth gère lui-même ses tables (`user`, `session`, `account`, `verification`). Sa CLI ajoute les modèles nécessaires à votre schéma Prisma :

``` nodejsrepl title="console"
npx auth@latest generate
```

Appliquez ensuite la migration comme d'habitude :

``` nodejsrepl title="console"
npx prisma migrate dev --name better_auth
```

``` prisma title="prisma/schema.prisma (extrait généré par Better Auth)"
model user {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      session[]
  accounts      account[]
}
```

Le mot de passe n'est jamais stocké dans la table `user` : il est haché (avec l'algorithme `scrypt`) et conservé dans la table `account`, associée à un fournisseur `credential`. Souvenez-vous des recommandations de votre professeur de piratage éthique — ici, c'est Better Auth qui s'en charge à votre place.

## Inscription d'un utilisateur

La création de compte reste une action serveur, mais c'est `auth.api.signUpEmail` qui hache le mot de passe et crée l'utilisateur :

``` ts title="app/actions/auth.actions.ts"
"use server"

import { APIError } from "better-auth/api"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export async function inscrireUtilisateur(formData: FormData) {
  const nom = formData.get("nom") as string
  const courriel = formData.get("courriel") as string
  const motDePasse = formData.get("motDePasse") as string

  try {
    await auth.api.signUpEmail({
      body: { name: nom, email: courriel, password: motDePasse },
    })
  } catch (error) {
    if (error instanceof APIError) {
      redirect("/inscription?erreur=1")
    }
    throw error
  }

  redirect("/connexion")
}
```

`signUpEmail` refuse la création si le courriel existe déjà et lève une `APIError` : plus besoin de vérifier soi-même l'existence de l'utilisateur avant de l'insérer.

``` tsx title="app/inscription/page.tsx"
import Link from "next/link"

import { inscrireUtilisateur } from "@/app/actions/auth.actions"
import { BoutonSoumission } from "@/components/bouton-soumission"
import { Input } from "@/components/ui/input"

export default async function PageInscription({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Créer un compte
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Inscrivez-vous pour commencer à prendre des notes.
          </p>
        </div>

        {erreur && (
          <p className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Un compte existe déjà avec ce courriel.
          </p>
        )}

        <form
          action={inscrireUtilisateur}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nom" className="text-sm font-medium">
              Nom
            </label>
            <Input
              type="text"
              id="nom"
              name="nom"
              placeholder="Votre nom"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="courriel" className="text-sm font-medium">
              Courriel
            </label>
            <Input
              type="email"
              id="courriel"
              name="courriel"
              placeholder="vous@exemple.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="motDePasse" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              type="password"
              id="motDePasse"
              name="motDePasse"
              placeholder="••••••••"
              required
            />
          </div>
          <BoutonSoumission
            libelle="Créer un compte"
            libelleEnCours="Création en cours..."
          />
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
```

``` tsx title="components/bouton-soumission.tsx"
'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type BoutonSoumissionProps = {
  libelle: string;
  libelleEnCours: string;
};

export function BoutonSoumission({
  libelle,
  libelleEnCours,
}: BoutonSoumissionProps) {
  const { pending: enCours } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={enCours}>
      {enCours ? libelleEnCours : libelle}
    </Button>
  );
}

```


## Connexion

``` tsx title="app/connexion/page.tsx"
import { APIError } from "better-auth/api"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default function PageConnexion({
  searchParams,
}: {
  searchParams: { erreur?: string }
}) {
  return (
    <div>
      {searchParams.erreur && (
        <p style={{ color: "red" }}>Courriel ou mot de passe invalide.</p>
      )}
      <form
        action={async (formData: FormData) => {
          "use server"
          try {
            await auth.api.signInEmail({
              body: {
                email: formData.get("courriel") as string,
                password: formData.get("motDePasse") as string,
              },
            })
          } catch (error) {
            if (error instanceof APIError) {
              redirect("/connexion?erreur=1")
            }
            throw error
          }
          redirect("/tableau-de-bord")
        }}
      >
        <div>
          <label htmlFor="courriel">Courriel</label>
          <input type="email" id="courriel" name="courriel" required />
        </div>
        <div>
          <label htmlFor="motDePasse">Mot de passe</label>
          <input type="password" id="motDePasse" name="motDePasse" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}
```

## Déconnexion

`signOut` doit être appelé depuis un composant client — les méthodes de `authClient` reposent sur `fetch` et ne peuvent pas s'exécuter dans une action serveur :

``` tsx title="components/BoutonDeconnexion.tsx"
"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function BoutonDeconnexion() {
  const router = useRouter()

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/"),
          },
        })
      }
    >
      Se déconnecter
    </Button>
  )
}
```

## Accès à la session

### Dans un composant serveur

``` tsx title="app/tableau-de-bord/page.tsx"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export default async function TableauDeBord() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Connecté en tant que : {session?.user?.name}</p>
      <p>Courriel : {session?.user?.email}</p>
    </div>
  )
}
```

### Dans un composant client

``` tsx title="components/InfoUtilisateur.tsx"
"use client"

import { authClient } from "@/lib/auth-client"

export function InfoUtilisateur() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <p>Chargement...</p>
  if (!session) return <p>Non connecté</p>

  return <p>Bonjour, {session.user.name}</p>
}
```

| Propriété | Valeurs possibles | Description |
|---|---|---|
| `isPending` | `true` / `false` | La session est en cours de chargement |
| `data` | objet `{ user, session }` ou `null` | Les données de la session, `null` si non connecté |
| `error` | objet d'erreur ou `null` | Erreur survenue lors de la récupération de la session |

## Variables d'environnement

``` title=".env"
BETTER_AUTH_SECRET="généré-par-npx-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL="mysql://..."
```
