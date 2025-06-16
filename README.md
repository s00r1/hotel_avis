# Outil de signalement et d'avis

Ce petit projet propose un formulaire permettant aux clients de signaler un problème technique ou de laisser un avis concernant leur séjour à l'hôtel. Le contenu du formulaire est envoyé via **Formspree** et un bouton permet ensuite de télécharger un PDF récapitulatif grâce à la librairie **jsPDF**.

Après un envoi réussi, le bouton **Télécharger la fiche** apparaît pour générer ce PDF à la demande.

## Cloner le dépôt

```bash
git clone <URL-du-dépôt>
cd hotel_avis
npm install
```

Cette commande télécharge notamment `jest` et `eslint`, indispensables pour exécuter `npm test` et `npm run lint`. Veillez à disposer d'un accès réseau lors de cette étape.
Vous pouvez ensuite lancer les tests et le linter :

```bash
npm test
npm run lint
```

## Ouvrir l'application

Il suffit ensuite d'ouvrir le fichier `index.html` dans votre navigateur :

```bash
xdg-open index.html  # ou double-cliquez sur le fichier depuis votre explorateur
```

Un petit bouton en haut à droite de la page permet de basculer entre un thème clair et un thème sombre. Le choix effectué est enregistré dans `localStorage` afin d'être conservé lors des prochaines visites.

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

