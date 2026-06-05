# Internationalisation avec next-intl

## Pourquoi next-intl ?

Dans un projet **Next.js**, la bibliothèque `react-intl` ne tire pas parti des fonctionnalités du framework comme le routage par langue dans l'URL ou les Server Components. `next-intl` est conçue spécifiquement pour Next.js et offre :

- Un routage automatique par langue dans l'URL (`/fr/...`, `/en/...`)
- La compatibilité avec les **Server Components** (pas de hook client obligatoire)
- Une API très proche de `react-intl`

!!! manuel
    [next-intl - Documentation](https://next-intl.dev/docs/getting-started/app-router)

## Installation

``` nodejsrepl title="console"
npm install next-intl
```

## Structure du projet

Voici la structure de fichiers à mettre en place :

```
├── message/
│   ├── fr.json          ← traductions françaises
│   └── en.json          ← traductions anglaises
├── i18n/
│   ├── routing.ts   ← configuration des langues et de la langue par défaut
│   └── request.ts   ← chargement des messages côté serveur
├── proxy.ts     ← redirections automatiques selon la langue
├── app/
│   └── [locale]/    ← segment dynamique pour la langue
│       ├── layout.tsx
│       └── page.tsx
```

## Étapes de configuration

### 1. Créer les fichiers de traductions

``` json title="messages/fr.json"
{
  "app": {
    "titre": "Mon application",
    "bienvenue": "Bonjour, {nom} !",
    "clics": "{nombreclics, plural, =0 {Aucun clic} one {Un clic} other {{nombreclics} clics}}"
  }
}
```

``` json title="messages/en.json"
{
  "app": {
    "titre": "My application",
    "bienvenue": "Hello, {nom}!",
    "clics": "{nombreclics, plural, =0 {No clicks} one {One click} other {{nombreclics} clicks}}"
  }
}
```

Idéalement, la création du fichier de traduction suivra la structure de votre projet. Par exemple, si vous avez une composante qui liste les billets vous pourrez avoir ceci dans votre fichier de traduction :  

``` json title="messages/fr.json"
{
  "listeBillets": {
    "numero": "Numéro du billet",
    "desc": "Description",
    "demandeur": "Demandeur"
  }
}
```

### 2. Configurer le routage i18n

``` ts title="i18n/routing.ts"
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
});
```

### 3. Configurer le chargement des messages

``` ts title="i18n/request.ts"
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'fr' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  };
});
```

### 4. Configurer le proxy

Le proxy détecte la langue préférée de l'utilisateur et redirige automatiquement vers la bonne URL :

``` ts title="src/proxy.ts"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 5. Configurer next.config.ts

``` ts title="next.config.ts"
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

### 6. Déplacer les pages sous \[locale\]

Toutes vos pages doivent être dans `app/[locale]/` :

``` ts title="src/app/[locale]/layout.tsx"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Utilisation dans les composants

### Dans un Server Component

``` ts title="src/app/[locale]/page.tsx"
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations();

  return <h1>{t('app.titre')}</h1>;
}
```

### Dans un Client Component

``` ts title="src/components/MonComposant.tsx"
'use client';

import { useTranslations } from 'next-intl';

export default function MonComposant() {
  const t = useTranslations();

  return <p>{t('app.titre')}</p>;
}
```

!!! note
    `useTranslations` fonctionne à la fois dans les Server Components et les Client Components.

## Message avec variable

``` json title="messages/fr.json"
{
  "app" : {
   "bienvenue": "Bonjour, {nom} !"
  }
}
```

``` ts
const t = useTranslations();

<p>{t('app.bienvenue', { nom: 'Alice' })}</p>
```

## Message avec pluriel

``` json title="messages/fr.json"
{
  "app":{
     "clics": "{nombreclics, plural, =0 {Aucun clic} one {Un clic} other {{nombreclics} clics}}"
  }
}
```

``` ts
const t = useTranslations();

<p>{t('app.clics', { nombreclics: count })}</p>
```

!!! manuel
    [Format des messages - ICU](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

## Formater une date

``` ts
import { useFormatter } from 'next-intl';

const format = useFormatter();
const maintenant = new Date();

<p>{format.dateTime(maintenant, { year: 'numeric', month: 'long', day: '2-digit' })}</p>
```

## Formater une devise (monétaire)

``` ts
import { useFormatter } from 'next-intl';

const format = useFormatter();
const prix = 12.35;

<p>{format.number(prix, { style: 'currency', currency: 'CAD' })}</p>
```

## Formater un pourcentage

``` ts
import { useFormatter } from 'next-intl';

const format = useFormatter();
const rabais = 0.15;

<p>{format.number(rabais, { style: 'percent' })}</p>
```

!!! manuel
    [useFormatter - Documentation next-intl](https://next-intl.dev/docs/usage/dates-times)

## Sélecteur de langue

Pour changer de langue, next-intl fournit des composants de navigation qui préservent le chemin courant tout en changeant le segment `[locale]` dans l'URL :

``` ts title="src/components/SelecteurLangue.tsx"
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function SelecteurLangue() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changerLangue(nouvelleLangue: string) {
    const segments = pathname.split('/');
    segments[1] = nouvelleLangue;
    router.push(segments.join('/'));
  }

  return (
    <select value={locale} onChange={(e) => changerLangue(e.target.value)}>
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}
```
