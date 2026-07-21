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

Cela ajoute automatiquement `AUTH_SECRET` dans votre fichier `.env`.

## Configuration de base

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
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { courriel: credentials.courriel as string },
        })

        if (!utilisateur || !utilisateur.motDePasseHache) {
          return null
        }

        const motDePasseValide = await bcrypt.compare(
          credentials.motDePasse as string,
          utilisateur.motDePasseHache
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
model Utilisateur {
  id               Int      @id @default(autoincrement())
  nom              String
  courriel         String   @unique
  motDePasseHache  String?
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

  const existant = await prisma.utilisateur.findUnique({
    where: { courriel },
  })

  if (existant) {
    throw new Error("Un compte existe déjà avec ce courriel.")
  }

  const motDePasseHache = await bcrypt.hash(motDePasse, 10)

  await prisma.utilisateur.create({
    data: { nom, courriel, motDePasseHache },
  })

  redirect("/connexion")
}
```

``` tsx title="app/inscription/page.tsx"
import { inscrireUtilisateur } from "@/app/actions/auth.actions"

export default function PageInscription() {
  return (
    <form action={inscrireUtilisateur}>
      <div>
        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" name="nom" required />
      </div>
      <div>
        <label htmlFor="courriel">Courriel</label>
        <input type="email" id="courriel" name="courriel" required />
      </div>
      <div>
        <label htmlFor="motDePasse">Mot de passe</label>
        <input type="password" id="motDePasse" name="motDePasse" required />
      </div>
      <button type="submit">Créer un compte</button>
    </form>
  )
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
