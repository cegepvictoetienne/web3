# Se connecter à un API  

Il est préférable d’utiliser la librairie Axios pour aller chercher vos données de l’API :

``` ts title="fetch_bieres.ts"
axios.get('https://bieres.profinfo.ca/api/bieres').then((response) => {
  setListeBieres(response.data.bieres);
});
```

!!! manuel  
    [Axios - Documentation](https://axios-http.com/docs/intro)  



