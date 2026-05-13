# UseEffect

Le hook UseEffect est utilisé pour synchroniser un componsant avec un système externe.  

## Anatomie d'un useEffect  

``` typescript  
    import { useEffect } from 'react';

    export default function Test() {

        useEffect(() => {
            // Code qui sera exécuté lorsque les dépendances changent
            console.log("message");

            // La fontion fléchée peut retourner une fonction qui fait du ménage
        }, 
        []); // Le tableau des dépendances
    }
```

Le useEffect reçoit 2 paramètres :  
- Une fonction fléchée qui est exécutée lors de changements d'état des dépendances  
- Un tableau des dépendances, où se retrouveront toutes les variables d'état (useState) qui seront monitorées.  


## Exécution  

Le useEffect est garanti d'être exécuté au moins une fois par chargement (mount).  C'est pour cela qu'un tableau de dépendance vide s'exécute une seule fois.  

## Ménage  

``` typescript  
    import { useEffect } from 'react';

    export default function Test() {

        useEffect(() => {
            // Code qui sera exécuté lorsque les dépendances changent
            systemeexterne.connect();

            // La fontion fléchée peut retourner une fonction qui fait du ménage
            return () => {
                systemeexterne.disconnect();
            }
        }, 
        []); // Le tableau des dépendances
    }
```

Pour faire du ménage, il suffit de retourner une fonction fléchée qui exécute les actions nécessaires. Ce peut être pour se déconnecter d'un système externe ou arrêter des minuteries, etc.  

## Quand ne pas utiliser useEffect  

- Si vous ne synchronisez pas avec un système externe, vous n'avez probablement pas à utiliser useEffect  
- En mode Strict, React va exécuter un cycle complet supplémentaire de setup et de ménage. Si ça cause des problèmes dans votre composant, c'est que le ménage n'est pas bien fait  


## Références  

[React.dev useEffect](https://react.dev/reference/react/useEffect)   

