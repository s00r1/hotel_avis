# Manual Test Cases for Form Submission Enhancement

This document outlines manual test cases to verify the enhanced form submission process, including PDF generation, AJAX submission to Formspree, and comprehensive error handling.

## 1. Successful Submission (Desktop)

*   **Scenario**: User fills the form and submits successfully on a desktop browser.
*   **Steps**:
    1.  Open `index.html` in a desktop browser (e.g., Chrome, Firefox, Edge).
    2.  Enter a valid name in the "Nom et Prénom" field.
    3.  Select a valid room number from the "Chambre" dropdown.
    4.  Navigate the wizard to add at least one "Signalement" (e.g., Signaler > Problème technique > Chambre > Eau > WC > WC bouché).
    5.  Provide details if prompted (e.g., for "Autres").
    6.  Click the "Ajouter au formulaire" button.
    7.  Verify the item appears in the "Récapitulatif" list.
    8.  Click the "Envoyer le formulaire" button.
*   **Expected Outcome**:
    1.  A PDF file (e.g., `signalement_GRILL-YYYYMMDD-HHMM-XXXX.pdf`) is downloaded by the browser.
    2.  An alert box appears with the message: "Signalement envoyé avec succès ! Le PDF a été téléchargé."
    3.  The "Nom et Prénom" and "Chambre" fields are cleared/reset.
    4.  The wizard area resets to its initial state.
    5.  The "Récapitulatif" list is cleared.
    6.  **(Requires Formspree setup)** Check the email inbox configured for the Formspree endpoint. An email should be received containing the submitted details (Name, Room, Code Intervention, and the list of signalements/avis). The content of the `hiddenMessage` field should be present in the email body.

## 2. Successful Submission (Mobile)

*   **Scenario**: User fills the form and submits successfully on a mobile browser.
*   **Steps**:
    1.  Open `index.html` in a mobile browser (e.g., Chrome on Android, Safari on iOS). Alternatively, use browser developer tools to emulate a mobile device.
    2.  Enter a valid name in the "Nom et Prénom" field.
    3.  Select a valid room number from the "Chambre" dropdown.
    4.  Add at least one "Signalement" as described in the desktop test.
    5.  Click "Ajouter au formulaire".
    6.  Click "Envoyer le formulaire".
*   **Expected Outcome**:
    1.  PDF download/viewing behavior:
        *   On some mobile browsers, the PDF might open directly in a viewer.
        *   On others, it might prompt to download or save the file.
        *   Verify the PDF content is correct.
    2.  An alert box appears with the message: "Signalement envoyé avec succès ! Le PDF a été téléchargé."
    3.  The form fields are reset.
    4.  The wizard and récapitulatif are reset.
    5.  **(Requires Formspree setup)** An email is received at the Formspree configured email address with correct report details.

## 3. Validation Error: Missing Name/Room

*   **Scenario**: User attempts to submit without filling required fields (Name, Room).
*   **Steps**:
    1.  Open `index.html`.
    2.  **Case A**: Leave "Nom et Prénom" empty, select a "Chambre", add a signalement.
    3.  Click "Envoyer le formulaire".
    4.  **Case B**: Enter "Nom et Prénom", leave "Chambre" unselected, add a signalement.
    5.  Click "Envoyer le formulaire".
*   **Expected Outcome (for both cases)**:
    1.  An alert box appears with the message: "Veuillez renseigner votre nom et numéro de chambre".
    2.  The form remains as is (no reset).
    3.  No PDF is generated or downloaded.
    4.  No AJAX request is made to Formspree (verify via browser developer tools network tab if necessary).
    5.  No email is received.

## 4. Validation Error: No Report/Feedback Added

*   **Scenario**: User attempts to submit without adding any report ("Signalement") or feedback ("Avis").
*   **Steps**:
    1.  Open `index.html`.
    2.  Enter a valid name in "Nom et Prénom".
    3.  Select a valid room number from "Chambre".
    4.  Do *not* add any "Signalement" or "Avis" using the wizard.
    5.  Click "Envoyer le formulaire".
*   **Expected Outcome**:
    1.  An alert box appears with the message: "Veuillez ajouter au moins un signalement ou un avis".
    2.  The form remains as is.
    3.  No PDF is generated.
    4.  No AJAX request to Formspree.
    5.  No email is received.

## 5. PDF Generation Error (Simulated)

*   **Scenario**: An error occurs during PDF generation (e.g., `jsPDF` library not loaded or fails).
*   **Steps to Simulate**:
    1.  Open `index.html` in a browser.
    2.  Open browser developer tools.
    3.  In the console, execute: `window.jspdf = undefined;` or `window.jsPDF = undefined;` (depending on how it's referenced, check `script.js` if unsure which one is `window.jspdf?.jsPDF || window.jsPDF`). This simulates the library not being loaded.
    4.  Fill in Name and Room.
    5.  Add at least one "Signalement".
    6.  Click "Envoyer le formulaire".
*   **Expected Outcome**:
    1.  An alert box appears with a message similar to: "Erreur lors de la génération du PDF : Librairie PDF (jsPDF) non chargée.\nLe signalement ne sera pas envoyé." (The exact error message might vary slightly if the simulation method causes a different error, e.g. "jsPDF is not a constructor" if only part of the object is undefined).
    2.  No PDF is downloaded.
    3.  No AJAX request to Formspree.
    4.  No email is received.
    5.  The form should remain as is, or in a state allowing the user to retry if the issue was temporary (though in this simulation, it won't be).

## 6. Formspree Submission Error (Simulated - Invalid Endpoint)

*   **Scenario**: Formspree returns an error because the endpoint is misconfigured or invalid.
*   **Steps to Simulate**:
    1.  Open `index.html`.
    2.  Open browser developer tools.
    3.  Inspect the `<form id="mainForm" ...>` element and temporarily change its `action` attribute to an invalid or non-existent Formspree URL (e.g., `https://formspree.io/f/xxxxxxxxxxxxxx_invalid`).
    4.  Fill in Name and Room.
    5.  Add at least one "Signalement".
    6.  Click "Envoyer le formulaire".
*   **Expected Outcome**:
    1.  A PDF file is downloaded successfully.
    2.  An alert box appears indicating a submission error. For an invalid endpoint, this would likely be a 404 error. The message might be like: "Erreur d'envoi du formulaire (404): \n - Page not found" or whatever Formspree/browser returns for a 404 on its API. If Formspree returns a JSON error, it should be parsed, e.g., "Erreur d'envoi du formulaire (400): \n - Cannot POST to this endpoint".
    3.  The form fields should *not* be reset (as the submission failed).
    4.  No email is received.

## 7. Network Error during Submission (Simulated)

*   **Scenario**: A network error prevents the AJAX request to Formspree from completing.
*   **Steps to Simulate**:
    1.  Open `index.html`.
    2.  Fill in Name and Room.
    3.  Add at least one "Signalement".
    4.  Open browser developer tools and go to the "Network" tab.
    5.  Enable network throttling and set it to "Offline".
    6.  Click "Envoyer le formulaire".
    7.  *(Timing is key here: the PDF generation is local. The "Offline" mode needs to be active when the `fetch` call is made.)*
*   **Expected Outcome**:
    1.  A PDF file is downloaded successfully (as this is client-side).
    2.  An alert box appears with a message similar to: "Erreur réseau ou problème technique lors de l'envoi du formulaire : Failed to fetch" or "TypeError: Failed to fetch".
    3.  The form fields should *not* be reset.
    4.  No email is received.

## 8. Formspree Submission Error (Simulated - Server-Side Validation Error from Formspree)

*   **Scenario**: Formspree is reachable but returns a validation error (e.g., a required field by Formspree itself is missing, or data is malformed according to Formspree).
*   **Steps to Simulate (Conceptual / Requires Formspree Setup)**:
    1.  This is harder to simulate without specific Formspree setup. Conceptually, if Formspree had a server-side validation rule (e.g., "email field is required and must be an email format" but your form doesn't enforce it or sends something wrong), it would return a JSON error.
    2.  To simulate the *handling* of such an error:
        *   Temporarily modify `script.js`. Inside the `fetch().then(response => { ... })` block, before `if (response.ok)`, insert:
          ```javascript
          // ---- START SIMULATION ----
          if (true) { // Simulate a Formspree error condition
              response.ok = false;
              response.status = 422; // Unprocessable Entity
              response.json = () => Promise.resolve({
                  errors: [{ field: "generic", message: "Simulated Formspree server-side validation error." }]
              });
          }
          // ---- END SIMULATION ----
          ```
    3.  Fill in Name and Room, add a signalement.
    4.  Click "Envoyer le formulaire".
*   **Expected Outcome**:
    1.  A PDF file is downloaded successfully.
    2.  An alert box appears with a message like: "Erreur d'envoi du formulaire (422): \n - Simulated Formspree server-side validation error."
    3.  Form fields are not reset.
    4.  No email is received.
    5.  **Remember to remove the simulation code from `script.js` after this test.**

These test cases cover the main success paths, validation errors, PDF generation issues, and various Formspree/network submission problems.
