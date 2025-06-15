# Outil de signalement et d'avis

Ce petit projet propose un formulaire permettant aux clients de signaler un problème technique ou de laisser un avis concernant leur séjour à l'hôtel. Lors de la soumission, un PDF récapitulatif est généré grâce à la librairie **jsPDF** puis le contenu du formulaire est envoyé via **Formspree**.

## Cloner le dépôt

```bash
git clone <URL-du-dépôt>
cd hotel_avis
```

## Ouvrir l'application

Il suffit ensuite d'ouvrir le fichier `index.html` dans votre navigateur :

```bash
xdg-open index.html  # ou double-cliquez sur le fichier depuis votre explorateur
```

## Version de jsPDF

La page charge **jsPDF** en version **2.5.1** :

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

## Modifier l'adresse Formspree

1. Créez votre propre formulaire sur [Formspree](https://formspree.io/).
2. Copiez l'URL fournie par Formspree.
3. Dans `index.html`, remplacez l'attribut `action` du formulaire par cette nouvelle URL :
   ```html
   <form id="mainForm" action="https://formspree.io/f/monidentifiant" method="POST">
   ```
4. Facultatif : décommentez la ligne contenant le champ `_next` pour rediriger l'utilisateur vers votre page de remerciement personnalisée :
   ```html
   <input type="hidden" name="_next" value="https://votresite.exemple/merci.html">
   ```

