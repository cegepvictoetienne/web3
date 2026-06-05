# React Router  

Permettre de passer d’une page à l’autre dans votre application React.  

!!! manuel 
    [React Router](https://reactrouter.com/en/main)  


Pour l'installer dans votre projet :  

``` nodejsrepl title="console"
npm i react-router-dom
npm i @types/react-router-dom --save-dev
```
 
# Exemple de SPA avec Router  

``` ts title="App.tsx"
--8<-- "monrouteur/src/App.tsx"
```
# Différents éléments du projet monrouteur  

## BrowserRouter  

Un __<BrowserRouter\>__ stocke l'emplacement actuel dans la barre d'adresse du navigateur en utilisant des URL propres et navigue en utilisant la pile d'historique intégrée du navigateur.

``` ts title="App.tsx"
function App() {
  return (
    <BrowserRouter>
      // Le reste de l'application React
    </BrowserRouter>
  );
}
```

!!! manuel 
    [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router)

## Routes  

L'élément __<Routes\>__ (au pluriel) indique l'ensemble des routes qui seront disponibles dans l'application.  Doit contenir au moins un élément __<Route\>__ (au singulier).  

``` ts title="app.tsx"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Modele />}/>
      </Routes>
    </BrowserRouter>
  );
}
```

## Route  

L'élément __<Route\>__ (au singulier) définit une page de l'application à afficher selon son URL.  

Par exemple :  

``` ts title="app.tsx"
     <Route path="/dadams" element={<DouglasAdams />} />
```

Cette route indique que http://serveur/dadams pointe sur la composante __DouglasAdams__.  

!!! manuel  
    [Route - Documentation](https://reactrouter.com/en/6.14.2/route/route)  


## Routes imbriquées  

L'élément __<Route\>__ (au singulier) peut contenir des routes enfants.  Comme ceci :  

``` ts title="app.tsx"
     <Route path="/" element={<Modele />}>
          <Route index element={<PagePrincipale />} />
          <Route path="dadams" element={<DouglasAdams />} />
          <Route path="oscard" element={<OrsonScottCard />} />
          <Route path="livre/:id" element={<Livre />} />
        </Route>
```  

Plusieurs choses importantes ici :  

- La route "/" est la route parent des autres.  Lorsqu'un élément est mentionné dans la route parent, l'élément est généré avant celui de la route enfant.  Il faut par contre indiquer dans l'élément parent à quel endroit faut-il générer l'élément enfant (avec l'élément __<Outlet\>__) :   

    ``` ts title="app.tsx"
        function Modele() {
        return (
            <div>
            <a href="/">Page principale</a>&nbsp;
            <a href="/dadams">Douglas Adams</a>&nbsp;
            <a href="/oscard">Orson Scott Card</a>
            <br />
            <Outlet />
            </div>
        );
        }
    ```  

- Le mot clé __index__ indique l'élément qui sera généré lorsque l'utilisateur navigue à l'URL du parent.  

## Routes dynamiques  

On peut placer un paramètre dans une route qui peut être lu par l'élément généré.  

Dans la route, on peut avoir le paramètre __:id__ :  

``` ts title="app.tsx"
<Route path="livre/:id" element={<Livre />} />
```  

Dans l'élément, on accède au paramètre avec la fonction __useParams()__ :  

``` ts title="app.tsx"
    function Livre() {
        const { id } = useParams();
        return <h1>Livre #{id}</h1>;
    }
```  

## HashRouter  

Un __<HashRouter\>__ est une alternative à `BrowserRouter` qui stocke l'emplacement actuel dans la partie __fragment (#)__ de l'URL plutôt que dans le chemin.

``` ts title="App.tsx"
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Modele />}>
          <Route index element={<PagePrincipale />} />
          <Route path="dadams" element={<DouglasAdams />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
```

Les URLs générées ressemblent à ceci :

| Page | BrowserRouter | HashRouter |
|------|---------------|------------|
| Accueil | `monsite.com/` | `monsite.com/#/` |
| Douglas Adams | `monsite.com/dadams` | `monsite.com/#/dadams` |
| Livre #3 | `monsite.com/livre/3` | `monsite.com/#/livre/3` |

!!! manuel 
    [HashRouter](https://reactrouter.com/en/main/router-components/hash-router)

## BrowserRouter vs HashRouter

La différence fondamentale est ce que le serveur web reçoit lors d'une requête :

- Avec **BrowserRouter**, le serveur reçoit le chemin complet (ex. : `/dadams`). Si le serveur ne connaît pas cette route, il retourne une erreur **404**.
- Avec **HashRouter**, le serveur ne reçoit jamais la partie après le `#`. Il reçoit toujours `/` et le navigateur gère le reste localement. Aucune configuration serveur n'est nécessaire.

### Impact sur le déploiement d'une SPA

C'est là que la différence devient concrète.

**Problème avec BrowserRouter :** Quand un utilisateur visite directement `monsite.com/dadams` ou rafraîchit la page, le serveur cherche un fichier à l'emplacement `/dadams`. Comme ce fichier n't'existe pas (c'est React qui gère la navigation), le serveur retourne une erreur 404.

**Solution avec BrowserRouter :** Il faut configurer le serveur pour rediriger toutes les requêtes vers `index.html` afin que React Router prenne le relais. Sur Azure Static Web Apps, cela se fait avec le fichier `staticwebapp.config.json` :

``` json title="staticwebapp.config.json"
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/dist/*.{svg,png,jpg,gif}", "/dist/assets/*"]
  }
}
```

**Avantage de HashRouter :** Aucune configuration serveur requise. Ça fonctionne sur n'importe quel hébergement de fichiers statiques (GitHub Pages, un simple serveur Apache, etc.) sans modification.

### Quand utiliser lequel ?

| Critère | BrowserRouter | HashRouter |
|---------|---------------|------------|
| URLs propres (sans `#`) | Oui | Non |
| Configuration serveur requise | Oui | Non |
| Référencement (SEO) | Meilleur | Plus faible |
| Hébergement simple (GitHub Pages, S3) | Nécessite config | Fonctionne d'emblée |
| Applications internes / prototypage | Oui | Oui |

En production avec un hébergement que vous contrôlez (Azure, Vercel, Netlify), privilégiez **BrowserRouter** pour les URLs propres. Pour un hébergement statique sans configuration possible, **HashRouter** est la solution simple.

