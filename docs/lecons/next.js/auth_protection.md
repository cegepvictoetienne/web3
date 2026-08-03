# Protection des routes avec Better Auth

## Intergiciel (Middleware)

Le fichier `proxy.ts` s'exécute sur le serveur avant chaque requête, une bonne place pour valider globalement les routes accessibles ou non d'un utilisateur.

### Configuration minimale

``` ts title="proxy.ts"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/connexion", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

L'expression régulière dans `matcher` exclut les ressources statiques et les routes API internes, mais intercepte toutes les autres requêtes.

### Logique personnalisée

Si vous voulez des règles plus précises (rediriger les utilisateurs déjà connectés, protéger seulement certains chemins), étendez la fonction :

``` ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const cheminsPublics = ["/", "/connexion", "/inscription"]

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const chemin = request.nextUrl.pathname
  const estCheminPublic = cheminsPublics.includes(chemin)

  if (!sessionCookie && !estCheminPublic) {
    return NextResponse.redirect(new URL("/connexion", request.url))
  }

  if (sessionCookie && chemin === "/connexion") {
    return NextResponse.redirect(new URL("/tableau-de-bord", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### Dans un composant serveur

``` tsx title="app/tableau-de-bord/page.tsx"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function TableauDeBord() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/connexion")
  }

  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {session.user.name}</p>
    </div>
  )
}
```

### Dans une action serveur

``` ts title="app/actions/commandes.actions.ts"
"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function creerCommande(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer cette action.")
  }

  await prisma.commande.create({
    data: {
      utilisateurId: session.user.id,
      produitId: Number(formData.get("produitId")),
    },
  })
}
```

## Protection par rôle


### 1. Déclarer le champ additionnel

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
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "utilisateur",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})
```

`input: false` empêche un utilisateur de choisir son propre rôle lors de l'inscription : le champ ne peut être modifié que directement en base de données (ou par du code serveur qui a accès à Prisma).

Régénérez ensuite le schéma et migrez :

``` nodejsrepl title="console"
npx auth@latest generate
npx prisma migrate dev --name role
```

### 2. Inférer le type côté client

``` ts title="lib/auth-client.ts"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
```

### 3. Vérifier le rôle dans une page

``` tsx title="app/admin/page.tsx"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function PageAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/connexion")
  }

  if (session.user.role !== "admin") {
    redirect("/acces-refuse")
  }

  return (
    <div>
      <h1>Panneau d'administration</h1>
      <p>Connecté en tant qu'administrateur : {session.user.name}</p>
    </div>
  )
}
```
