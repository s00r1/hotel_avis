# Issue Reporting and Review Tool

This small project provides a form allowing guests to report a technical problem or leave feedback about their stay at the hotel. The form contents are sent through **Formspree** and a button then allows you to download a summary PDF thanks to the **jsPDF** library.

After a successful submission, the **Download the sheet** button appears to generate this PDF on demand.

## Full overview

This tool was designed to simplify collecting feedback within the hotel:

- **HTML/CSS/JavaScript** provide the form's interface and logic;
- **Formspree** receives the data and forwards it by email;
- **jsPDF** locally generates a PDF sheet, downloadable after validation.

The application runs with no server dependency: all logic is client-side and temporary storage of preferences (theme) takes place in `localStorage`.

## Clone the repository

```bash
git clone <URL-du-dépôt>
cd hotel_avis
npm install
```

This command notably downloads `jest` and `eslint`, required to run `npm test` and `npm run lint`. Make sure you have network access during this step. You can then run the tests and the linter:

```bash
npm test
npm run lint
```

## Open the application

Then simply open the `index.html` file in your browser:

```bash
xdg-open index.html  # or double-click the file from your explorer
```

A small button at the top right of the page lets you switch between a light theme and a dark theme. The chosen setting is stored in `localStorage` so it is kept for future visits.

## jsPDF version

The page loads **jsPDF** version **2.5.1**:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

## Tutorial: configure Formspree

Follow these steps so that the form arrives at your own e-mail address:

1. Go to [Formspree](https://formspree.io/) and create an account.
2. Validate the e-mail address used during sign-up (Formspree sends a confirmation link).
3. In your dashboard, create a new form. Formspree provides a URL like `https://formspree.io/f/abcde123`.
4. Open `index.html` and change the form's `action` attribute with this URL:
   ```html
   <form id="mainForm" action="https://formspree.io/f/abcde123" method="POST">
   ```
5. To display a custom page after sending, uncomment or add the `_next` field:
   ```html
   <input type="hidden" name="_next" value="https://votresite.exemple/merci.html">
   ```

## How the send to Formspree works

The `script.js` file handles the network call when the form is submitted. Lines 491&nbsp;to&nbsp;504 notably perform:

1. **Retrieving the form and its data**
   ```javascript
   const form = document.getElementById('mainForm');
   const formData = new FormData(form);
   const formAction = form.getAttribute('action');
   ```
2. **AJAX sending** via `fetch` to the Formspree URL:
   ```javascript
   fetch(formAction, {
     method: 'POST',
     body: formData,
     headers: { 'Accept': 'application/json' }
   }).then(response => {
   ```
3. **Processing the response**: if everything goes well (`response.ok`),
   the application shows the download button and resets the form:
   ```javascript
   if (response.ok) {
     lastSubmissionData = { nom, chambre, multi: JSON.parse(JSON.stringify(multi)), codeInter };
     document.getElementById('download-btn').classList.remove('hidden');
     document.getElementById('mainForm').reset();
     // ... reset internal variables ...
   }
   ```
   If an error or a network issue occurs, an alert message is shown to warn the user.

## License

This project is distributed under the [MIT](LICENSE) license. French and Arabic versions of this file are available in [README.md](README.md) and [README.ar.md](README.ar.md).
