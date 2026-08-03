# Suivi - Vérification style IA dans les leçons

Suivi des fichiers de `docs/lecons/` et `docs/exercices/` évalués pour des patterns
stylistiques typiques de texte généré par IA (analyse du 2026-07-20, sans modification
des fichiers). But : reformuler progressivement les leçons pour qu'elles passent les
détecteurs d'IA, comme fait pour `docs/lecons/next.js/orm.md`.

Statuts possibles : `a corriger` / `corrige` / `verifie humain`.

Pour redemander une vérification plus tard : "vérifie si [fichier] est encore détecté
comme IA" ou "relance l'analyse sur les fichiers `a corriger`".

## Fortement suspect (patterns IA marqués)

- [x] `docs/lecons/next.js/hydratation.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/modes_rendu.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/routage.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/composantes.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/server_actions.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/introduction.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/next_intl.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/next.js/auth_courriel.md` — verifie humain (revalide le 2026-07-30, intro reecrite par l'utilisateur ton oral + coquille naturelle, phrases "Contrairement a Auth.js" retirees)
- [x] `docs/lecons/next.js/auth_oauth.md` — verifie humain (revalide le 2026-07-30, titre change pour "OAUTH dans la vraie vie" et intro reecrite par l'utilisateur avec exemple concret plutot que question rhetorique)
- [x] `docs/lecons/next.js/auth_protection.md` — verifie humain (revalide le 2026-07-30 : la reecriture Better Auth a supprime les paragraphes d'intro generiques, fichier maintenant surtout du code + explications techniques courtes, aucun moule repetitif)
- [x] `docs/lecons/react/mecanique_react.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/react/introduction_react.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur ; residu mineur : sections rendu conditionnel/listes restent tres neutres, pas bloquant)
- [x] `docs/lecons/react/react_shadcn.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/react/react_usereducer.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/react/regles_react.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/react/react4.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/outils/immer.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur)
- [x] `docs/lecons/typescript/typescript_2.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur ; petit doublon de titre "### find" ligne 183 a nettoyer, cosmetique seulement)
- [x] `docs/lecons/next.js/orm.md` — corrige (reformule le 2026-07-20)

## Suspect modéré

- [x] `docs/lecons/react/react3.md` — verifie humain (revalide le 2026-07-20, reecrit par l'utilisateur ; section "BrowserRouter vs HashRouter" retravaillee)
- [ ] `docs/lecons/deploiement/azure_nextjs.md` — a refaire au complet (nouvelle leçon prévue dans les prochaines semaines, ~2026-08, ne pas juste retoucher le texte actuel)

## Semble humain (aucune action requise pour l'instant)

- `docs/lecons/typescript/introduction_typescript.md`
- `docs/lecons/typescript/javascript_async.md`
- `docs/lecons/typescript/npm.md`
- `docs/lecons/typescript/prettier.md`
- `docs/lecons/typescript/eslint.md`
- `docs/lecons/react/react_usestate.md`
- `docs/lecons/react/react_useeffect.md`
- `docs/lecons/react/react_usecontext.md`
- `docs/lecons/react/react_tw.md`
- `docs/lecons/react/react_demarrage_rapide.md`
- `docs/lecons/react/structure_projet_react.md`
- `docs/lecons/react/penser_en_react.md`
- `docs/lecons/react/internationalisation.md`
- `docs/lecons/deploiement/azure_inscription.md`
- `docs/lecons/deploiement/azure_react.md`
- tous les fichiers `docs/exercices/*`

Next.js :
- hydratation.md — 5 "erreurs courantes" numérotées avec paires Problématique/Correct identiques
- modes_rendu.md — chaque mode a tip + warning + tableau, encadré par un diagramme mermaid
- routage.md, composantes.md, server_actions.md, introduction.md, next_intl.md — moule répété "définition en gras → tableau → code → note"
- auth_courriel.md, auth_oauth.md, auth_protection.md — signature quasi identique à orm.md (diagrammes de séquence mermaid, tableau "Résumé des différences", "Qu'est-ce que OAuth")

React :
- mecanique_react.md, introduction_react.md, react_shadcn.md, react_usereducer.md, regles_react.md, react4.md — "Le problème que X résout", tableaux "Éléments clés" répétitifs

Autres :
- outils/immer.md — paire systématique "Sans Immer / Avec Immer"
- typescript/typescript_2.md — sous-sections miroir répétitives
