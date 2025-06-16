# Outil de signalement et d'avis

Ce petit projet propose un formulaire permettant aux clients de signaler un problème technique ou de laisser un avis concernant leur séjour à l'hôtel. Le contenu du formulaire est envoyé via **Formspree** et un bouton permet ensuite de télécharger un PDF récapitulatif grâce à la librairie **jsPDF**.

Après un envoi réussi, le bouton **Télécharger la fiche** apparaît pour générer ce PDF à la demande.

## Présentation complète

Cet outil a été pensé pour simplifier la collecte de retours au sein de l'hôtel :

- **HTML/CSS/JavaScript** assurent l'interface et la logique du formulaire ;
- **Formspree** réceptionne les données et les transmet par courriel ;
- **jsPDF** génère localement une fiche au format PDF, téléchargeable après validation.

L'application fonctionne sans dépendance serveur : toute la logique est côté client et le stockage temporaire des préférences (thème) se fait dans `localStorage`.

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

## Tutoriel : configurer Formspree

Suivez ces étapes pour que le formulaire arrive sur votre propre adresse e‑mail :

1. Rendez‑vous sur [Formspree](https://formspree.io/) et créez un compte.
2. Validez l'adresse e‑mail utilisée lors de l'inscription (un lien de confirmation est envoyé par Formspree).
3. Dans votre tableau de bord, créez un nouveau formulaire. Formspree fournit une URL de type `https://formspree.io/f/abcde123`.
4. Ouvrez `index.html` et modifiez l'attribut `action` du formulaire avec cette URL :
   ```html
   <form id="mainForm" action="https://formspree.io/f/abcde123" method="POST">
   ```
5. Pour afficher une page personnalisée après l'envoi, décommentez ou ajoutez le champ `_next` :
   ```html
   <input type="hidden" name="_next" value="https://votresite.exemple/merci.html">
   ```

## Fonctionnement de l'envoi vers Formspree

Le fichier `script.js` gère l'appel réseau lors de la soumission du formulaire.
Les lignes 491&nbsp;à&nbsp;504 réalisent notamment :

1. **Récupération du formulaire et de ses données**
   ```javascript
   const form = document.getElementById('mainForm');
   const formData = new FormData(form);
   const formAction = form.getAttribute('action');
   ```
2. **Envoi en AJAX** via `fetch` sur l'URL Formspree :
   ```javascript
   fetch(formAction, {
     method: 'POST',
     body: formData,
     headers: { 'Accept': 'application/json' }
   }).then(response => {
   ```
3. **Traitement de la réponse** : si tout se passe bien (`response.ok`),
   l'application affiche le bouton de téléchargement et réinitialise le
   formulaire :
   ```javascript
   if (response.ok) {
     lastSubmissionData = { nom, chambre, multi: JSON.parse(JSON.stringify(multi)), codeInter };
     document.getElementById('download-btn').classList.remove('hidden');
     document.getElementById('mainForm').reset();
     // ... remise à zéro des variables internes ...
   }
   ```
   En cas d'erreur ou de problème réseau, un message d'alerte s'affiche afin de
   prévenir l'utilisateur.

## Licence

Ce projet est distribué sous licence [MIT](LICENSE). Des versions du présent fichier existent en anglais et en arabe dans [README.en.md](README.en.md) et `README.ar.md`.

