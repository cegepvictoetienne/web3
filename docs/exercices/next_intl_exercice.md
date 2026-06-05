# Exercice - Internationalisation avec next-intl

Créer une application Next.js bilingue (français et anglais) de boutique en ligne :

- Configurer `next-intl` avec les langues `fr` et `en`, français par défaut
- Créer les fichiers de traductions `messages/fr.json` et `messages/en.json` avec :
    - Le titre de la boutique
    - Les libellés de navigation (Accueil, Produits, Contact)
    - Les libellés du catalogue (Nom, Prix, Ajouter au panier)
    - Un message de bienvenue avec variable `{nom}`
    - Un message de quantité avec pluriel (`{quantite, plural, =0 {...} one {...} other {...}}`)
- Créer les pages sous `app/[locale]/` :
    - `page.tsx` : page d'accueil avec message de bienvenue traduit
    - `produits/page.tsx` : liste de produits avec prix formatés en devise (CAD)
    - `contact/page.tsx` : formulaire de contact avec tous les libellés traduits
- Ajouter un sélecteur de langue dans le layout qui permet de basculer entre FR et EN en conservant la page courante
- Afficher sur la page des produits la date du jour formatée selon la langue active
