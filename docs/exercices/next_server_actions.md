# Exercice - Server Actions et formulaires

Créer une application de gestion de contacts avec Server Actions :

- Configurer Prisma avec un modèle `Contact` (id, nom, courriel, telephone optionnel, dateCreation)
- Créer les Server Actions dans `app/actions/contact.actions.ts` :
    - `creerContact(formData: FormData)` : valider et créer un contact, revalider `/contacts`
    - `supprimerContact(id: number)` : supprimer un contact, revalider `/contacts`
    - `modifierContact(id: number, formData: FormData)` : mettre à jour un contact
- Créer les pages suivantes :
    - `app/contacts/page.tsx` : liste des contacts avec bouton « Supprimer » utilisant `.bind()` pour passer l'`id`
    - `app/contacts/nouveau/page.tsx` : formulaire de création avec Server Action dans l'attribut `action`
    - `app/contacts/[id]/modifier/page.tsx` : formulaire de modification prérempli avec les données existantes
- Ajouter la validation côté serveur dans chaque action :
    - Le nom est obligatoire
    - Le courriel est obligatoire et doit contenir un `@`
- Utiliser `useActionState` pour afficher les erreurs de validation dans le formulaire de création
