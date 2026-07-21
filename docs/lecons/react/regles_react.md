# Règles de React

## Introduction

Les développeurs de React ont défini un ensemble de règles pour un bon fonctionnement de la plateforme. Ça ne garantie pas une application parfaite, mais un manquement dans ces règles peut causer des fonctionnements imprévisibles.

## Liste des règles  


1. En BD1, vous avez vu ce qu'était une fonction déterministe. En JavaScript, on appelle ça idempotent. Ça veut dire que le résultat d'une fonction sera la même si les données en entrée sont les mêmes. Les composants React doivent être idempotents.


2. Ne jamais mettre à jour les variables d'un composant à partir d'un composant. (On appelle ça un effet de bord et ça peut causer des problèmes de rendu multiples)  

3. Ne jamais modifier les props et les états directement. (Ils sont immuables)  

4. Même chose pour les valeurs envoyées à un hook, ne pas les modifier directement.  

5. Toute variable utilisée dans le JSX doivent être modifiées avant la génération du JSX.  

6. Ne jamais appeler directement une fonction d'un composant, toujours passer par le JSX.  

7. Ne jamais passer un hook comme valeur normale, toujours les appeler dans un composant.

8. Les hooks ne doivent être appelés qu'au niveau supérieur d'un composant, jamais dans une boucle, une condition ou une fonction imbriquée.  

9. Les hooks ne doivent être appelés qu'à partir d'une fonction React, jamais à partir d'une fonction régulière javascript.  

!!! manuel  
    [Rules of React](https://react.dev/reference/rules)

