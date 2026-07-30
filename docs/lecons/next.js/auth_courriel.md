# Authentification avec Auth.js — Courriel et mot de passe

## Qu'est-ce qu'Auth.js

L'authentification dans une application Web est essentielle. Les défis sont de taille pour créer un système bien protégé avec une sécurité adéquate. Il ne faut pas réinventer la roue, alors utilisons plutôt un module très utilisé par les programmeurs Next.Js, `Auth.js`.  

!!! manuel
    [Documentation officielle Auth.js](https://authjs.dev)  
    [Guide Next.js - Auth.js](https://authjs.dev/getting-started/installation?framework=next.js)

## Installation

``` nodejsrepl title="console"
npm install next-auth@beta
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

Générez ensuite une clé secrète pour chiffrer les sessions :

``` nodejsrepl title="console"
npx auth secret
```

Ajoutez  `AUTH_SECRET` dans votre fichier `.env`. (Prenez la clé générée par la commande, mais pas le *BETTER*!)

## Configuration de base

### Fichier de type pour avoir l'id de l'utilisateur  

``` ts title="/types/next-auth.d.ts"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}
``` 

### Fichier principal d'Auth.js

Créez le fichier `auth.ts` à la **racine du projet** (au même niveau que `app/`) :

``` ts title="auth.ts"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        courriel: { label: "Courriel", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const utilisateur = await prisma.utilisateurs.findFirst({
          where: { courriel: credentials.courriel as string },
        })

        if (!utilisateur || !utilisateur.motdepasse) {
          return null
        }

        const motDePasseValide = await bcrypt.compare(
          credentials.motDePasse as string,
          utilisateur.motdepasse
        )

        if (!motDePasseValide) return null

        return {
          id: String(utilisateur.id),
          name: utilisateur.nom,
          email: utilisateur.courriel,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

La fonction `authorize` reçoit les données du formulaire et doit retourner l'objet utilisateur si les identifiants sont valides, ou `null` sinon.

### Gestionnaire de route

Auth.js a besoin d'une route API pour gérer les requêtes d'authentification (connexion, déconnexion, session) :

``` ts title="app/api/auth/[...nextauth]/route.ts"
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### SessionProvider dans le layout

Pour que les composants clients puissent accéder à la session, ajoutez `SessionProvider` dans votre layout racine :

``` tsx title="app/layout.tsx"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

## Modèle de base de données

Ajoutez un modèle `Utilisateur` dans votre schéma Prisma avec un champ pour stocker le mot de passe haché :

``` prisma title="prisma/schema.prisma"
model Utilisateurs {
  id               Int      @id @default(autoincrement())
  nom              String
  courriel         String   @unique
  motdepasse       String?
  creeLe           DateTime @default(now())
}
```
Le mot de passe doit être haché avant d'être enregistré en base de données. La bibliothèque `bcryptjs` s'en charge avec la fonction `hash`. Souvenez-vous des recommandations de votre professeur de piratage éthique?  

## Inscription d'un utilisateur

La création de compte est une action serveur qui hache le mot de passe avant de l'enregistrer :

``` ts title="app/actions/auth.actions.ts"
"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function inscrireUtilisateur(formData: FormData) {
  const nom = formData.get("nom") as string
  const courriel = formData.get("courriel") as string
  const motDePasse = formData.get("motDePasse") as string

  const existant = await prisma.utilisateurs.findFirst({
    where: { courriel },
  })

  if (existant) {
    redirect("/inscription?erreur=1")
  }

  const motDePasseHache = await bcrypt.hash(motDePasse, 10)

  await prisma.utilisateurs.create({
    data: { nom, courriel, motdepasse: motDePasseHache },
  })

  redirect("/connexion")
}
```

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

Le formulaire de connexion appelle `signIn` importé de `@/auth` dans une action serveur :

``` tsx title="app/connexion/page.tsx"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

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
            await signIn("credentials", {
              courriel: formData.get("courriel"),
              motDePasse: formData.get("motDePasse"),
              redirectTo: "/tableau-de-bord",
            })
          } catch (error) {
            if (error instanceof AuthError) {
              redirect("/connexion?erreur=1")
            }
            throw error
          }
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

``` tsx title="components/BoutonDeconnexion.tsx"
import { signOut } from "@/auth"

export function BoutonDeconnexion() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/" })
      }}
    >
      <button type="submit">Se déconnecter</button>
    </form>
  )
}
```

## Accès à la session

### Dans un composant serveur

``` tsx title="app/tableau-de-bord/page.tsx"
import { auth } from "@/auth"

export default async function TableauDeBord() {
  const session = await auth()

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

import { useSession } from "next-auth/react"

export function InfoUtilisateur() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Chargement...</p>
  if (status === "unauthenticated") return <p>Non connecté</p>

  return <p>Bonjour, {session?.user?.name}</p>
}
```

| Propriété | Valeurs possibles | Description |
|---|---|---|
| `status` | `"loading"` | La session est en cours de chargement |
| `status` | `"authenticated"` | L'utilisateur est connecté |
| `status` | `"unauthenticated"` | Aucun utilisateur connecté |
| `data` | objet `Session` ou `null` | Les données de la session |

## Variables d'environnement

``` title=".env"
AUTH_SECRET="généré-par-npx-auth-secret"
DATABASE_URL="mysql://..."
```
