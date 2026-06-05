## Démarrage rapide d'une application React  

Pour partir un projet qui utilise :  
- React avec Vite  
- TailwindCSS et shadcn  
- React Router  
- React-Intl  


### Créer le projet React  

```nodejsrepl title="console"
   npm create vite@latest
```   

## Installation de Tailwind CSS

1. Installez Tailwind CSS en utilisant la commande suivante :  
    ``` nodejsrepl title="console"
    npm install tailwindcss @tailwindcss/vite
    ```
1. Configurer le plugin dans la configuration Vite
    ``` js title="vite.config.ts"
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import tailwindcss from "@tailwindcss/vite";

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [react(), tailwindcss()],
    });
    ```
1. Ajouter les imports de Tailwind CSS dans le fichier `index.css` :  
    ``` css title="index.css"
    @import 'tailwindcss';
    ```  


## Installation de shadcn  

### 1. Modifier tsconfig.json

shadcn/ui utilise l'alias `@/` pour importer ses composantes. Il faut configurer TypeScript pour reconnaître cet alias.

Modifiez `tsconfig.json` à la racine du projet :

``` json title="tsconfig.json"
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Modifiez aussi `tsconfig.app.json` pour ajouter les mêmes chemins dans les options du compilateur :

``` json title="tsconfig.app.json"
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. Modifier vite.config.ts

Ajoutez la résolution de l'alias `@/` dans la configuration Vite :

``` ts title="vite.config.ts"
import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Installez ensuite le module Node pour la résolution de chemins :

``` nodejsrepl title="console"
npm install -D @types/node
```

### 3. Initialiser shadcn/ui

``` nodejsrepl title="console"
npx shadcn@latest init
```

## 4. Ajouter des composantes

Chaque composante s'installe séparément avec la commande `add`. Le code source de la composante est copié dans `src/components/ui/` :

``` nodejsrepl title="console"
npx shadcn@latest add button
npx shadcn@latest add navigation-menu
npx shadcn@latest add field
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add badge
```

## Installation de React Router  

``` nodejsrepl title="console"
npm i react-router-dom
npm i @types/react-router-dom --save-dev
```  

