/* eslint-env browser */
/* global fetch, FormData */
// --------- Générateur code unique ----------
function genCodeIntervention() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const rnd = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GRILL-${yyyy}${mm}${dd}-${h}${m}-${rnd()}`;
}

// --------- Arbre du wizard ---------
const arbre = {
  "": ["Signaler", "Donner un avis"],
  "Signaler": ["Problème technique", "Incident"],
  "Problème technique": ["Chambre", "Parties communes", "Autres"],
  "Chambre": ["Eau", "Électricité", "Nuisibles", "Clés", "Autres"],
  "Eau": ["WC", "Douche"],
  "WC": ["Chasse d'eau HS", "Fuite d'eau", "WC bouché"],
  "Douche": ["Fuite d'eau", "Mitigeur", "Flexible", "Pommeau de douche", "Douche bouchée"],
  "Électricité": ["Prises électriques", "Lumières", "Chauffage"],
  "Prises électriques": ["Prise chambre", "Prise salle de bain"],
  "Lumières": ["Lumière chambre", "Lumière salle de bain"],
  "Chauffage": ["Chauffage HS"],
  "Nuisibles": ["Cafards", "Punaises de lit"],
  "Clés": ["Clé perdue", "Clé cassée", "Clé retrouvée"],
  "Parties communes": ["Problème lave-linge", "Problème sèche-linge", "Problème cuisine", "Problème casiers", "Autres"],
  "Incident": ["Conflit", "Alarme incendie", "Vol"],
  "Conflit": [
    "Conflit entre plusieurs chambres",
    "Conflit dans la même famille",
    "Conflit avec personne extérieure à l'hôtel"
  ]
};
const CHOIX_STYLES = {
  "Eau":            { color:"bleu",    icon:'💧' },
  "WC":             { color:"bleu",    icon:'🚽' },
  "Douche":         { color:"bleu",    icon:'🚿' },
  "Chasse d'eau HS":{ color:"bleu",    icon:'💦' },
  "Fuite d'eau":    { color:"bleu",    icon:'💧' },
  "WC bouché":      { color:"bleu",    icon:'🚽' },
  "Mitigeur":       { color:"bleu",    icon:'🚰' },
  "Flexible":       { color:"bleu",    icon:'🔗' },
  "Pommeau de douche": { color:"bleu", icon:'🚿' },
  "Douche bouchée": { color:"bleu",    icon:'🚿' },

  "Électricité":    { color:"jaune",   icon:'⚡' },
  "Prises électriques": { color:"jaune", icon:'🔌' },
  "Prise chambre":  { color:"jaune",   icon:'🔌' },
  "Prise salle de bain": { color:"jaune", icon:'🔌' },
  "Lumières":       { color:"jaune",   icon:'💡' },
  "Lumière chambre":{ color:"jaune",   icon:'💡' },
  "Lumière salle de bain": { color:"jaune", icon:'💡' },
  "Chauffage":      { color:"orange",  icon:'🔥' },
  "Chauffage HS":   { color:"orange",  icon:'🔥' },

  "Incident":       { color:"rouge",   icon:'⚠️' },
  "Conflit":        { color:"rouge",   icon:'⚔️' },
  "Alarme incendie":{ color:"orange",  icon:'🚨' },
  "Vol":            { color:"rouge",   icon:'👜' },
  "Conflit entre plusieurs chambres":       { color:"rouge", icon:'🏘️' },
  "Conflit dans la même famille":            { color:"rouge", icon:'👪' },
  "Conflit avec personne extérieure à l'hôtel": { color:"rouge", icon:'🚶' },
  "Nuisibles":      { color:"vert",    icon:'🐞' },
  "Cafards":        { color:"vert",    icon:'🪳' },
  "Punaises de lit":{ color:"vert",    icon:'🛏️' },
  "Clés":           { color:"gris",    icon:'🔑' },
  "Clé perdue":     { color:"gris",    icon:'🔑' },
  "Clé cassée":     { color:"gris",    icon:'🔑' },
  "Clé retrouvée":  { color:"gris",    icon:'🔑' },

  "Parties communes":{color:"violet",  icon:'🏢' },
  "Problème lave-linge": {color:"violet", icon:'🧺' },
  "Problème sèche-linge":{color:"violet", icon:'🧺' },
  "Problème cuisine":    {color:"violet", icon:'🍽️' },
  "Problème casiers":    {color:"violet", icon:'🗄️' },

  "Problème technique":{color:"gris",   icon:'🛠️'},
  "Signaler":          {color:"gris",   icon:'📝'},
  "Donner un avis":    {color:"jaune",  icon:'⭐'},
  "Chambre":           {color:"gris",   icon:'🛏️'},
  "Autres":            {color:"gris",   icon:'❓'},
};

let chemin = [];
let autreSaisie = "";
let avisSaisie = "";
let multi = [];
let conflitChambres = [];
let conflitComment = "";
let volDescription = "";
let volObjets = "";
let volChambres = [];
let lastSubmissionData = null;

// Echappe les caract\xC3\xA8res HTML pour eviter l\x27interpretation des balises
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --------- Remplir chambres ---------
function fillChambres(){
  let sel = document.getElementById('chambre');
  sel.innerHTML = `<option value="">Sélectionner</option>`;
  for(let i=1; i<=54; i++){
    if(i === 13) continue;
    sel.innerHTML += `<option value="${i}">Chambre ${i}</option>`;
  }
}
fillChambres();

function createChambreSelect(val=""){
  let sel = document.createElement('select');
  sel.innerHTML = `<option value="">Sélectionner</option>`;
  for(let i=1; i<=54; i++){
    if(i === 13) continue;
    sel.innerHTML += `<option value="${i}">Chambre ${i}</option>`;
  }
  sel.value = val;
  return sel;
}

// --------- Liste multi ---------
function renderMultiList() {
  let list = document.getElementById('multiList');
  list.innerHTML = "";
  if (multi.length === 0) return;
  multi.forEach((item, idx) => {
    let div = document.createElement('div');
    div.className = "multi-item";
    let label = "";
    if (item.type === "avis") {
      label = `<span class="multi-type">Avis :</span> ${escapeHtml(item.texte)}`;
    } else {
      label = `<span class="multi-type">Signalement :</span> ${escapeHtml(item.chemin.join(" > "))}`;
      if(item.texte) label += ` (${escapeHtml(item.texte)})`;
    }
    div.innerHTML = label + `<span class="del" title="Supprimer" onclick="delMulti(${idx})">&times;</span>`;
    list.appendChild(div);
  });
}
window.delMulti = function(idx){
  multi.splice(idx,1);
  renderMultiList();
}

// --------- Wizard (arbo) ---------
function renderWizard() {
  const area = document.getElementById('wizard-area');
  area.innerHTML = "";
  let btnRow = document.getElementById('btnRow');
  btnRow.classList.add('hidden');

  if (chemin.length > 0) {
    const backBtn = document.createElement('button');
    backBtn.type = "button";
    backBtn.className = "back-btn";
    backBtn.innerHTML = `<span class="arrow">⬅️</span> Retour`;
    backBtn.onclick = (e) => {
      e.preventDefault();
      chemin.pop();
      autreSaisie = "";
      avisSaisie = "";
      conflitChambres = [];
      conflitComment = "";
      volDescription = "";
      volObjets = "";
      volChambres = [];
      renderWizard();
    }
    area.appendChild(backBtn);
  }
  if (chemin.length > 0) {
    const bc = document.createElement('div');
    bc.className = 'breadcrumb';
    chemin.forEach((step, idx) => {
      const sp = document.createElement('span');
      sp.textContent = step;
      sp.onclick = () => {
        chemin = chemin.slice(0, idx+1);
        autreSaisie = "";
        avisSaisie = "";
        conflitChambres = [];
        conflitComment = "";
        volDescription = "";
        volObjets = "";
        volChambres = [];
        renderWizard();
      }
      bc.appendChild(sp);
      if (idx < chemin.length-1) {
        const sep = document.createElement('span');
        sep.textContent = ">";
        sep.className = "sep";
        bc.appendChild(sep);
      }
    });
    area.appendChild(bc);
  }
  if (chemin[0] === "Donner un avis") {
    const label = document.createElement('label');
    label.textContent = "Ton avis :";
    area.appendChild(label);
    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.id = "avisText";
    textarea.placeholder = "Écris ton avis ici...";
    textarea.value = avisSaisie;
    textarea.oninput = e => avisSaisie = e.target.value;
    area.appendChild(textarea);
    btnRow.classList.remove('hidden');
    return;
  }
  let last = chemin[chemin.length-1];
  const conflits = [
    "Conflit entre plusieurs chambres",
    "Conflit dans la même famille",
    "Conflit avec personne extérieure à l'hôtel"
  ];
  if (conflits.includes(last)) {
    if(conflitChambres.length === 0) conflitChambres.push("");
    const label = document.createElement('label');
    label.textContent = last === "Conflit avec personne extérieure à l'hôtel" ?
      "Chambres concernées (optionnel) :" : "Chambres concernées :";
    area.appendChild(label);
    const list = document.createElement('div');
    list.className = 'chambres-list';
    conflitChambres.forEach((val, idx) => {
      const div = document.createElement('div');
      div.className = 'chambre-item';
      const sel = createChambreSelect(val);
      sel.onchange = e => conflitChambres[idx] = e.target.value;
      div.appendChild(sel);
      if(last !== "Conflit dans la même famille") {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'del-chambre-btn';
        del.textContent = '×';
        del.onclick = () => { conflitChambres.splice(idx,1); renderWizard(); };
        div.appendChild(del);
      }
      list.appendChild(div);
    });
    area.appendChild(list);
    if(last !== "Conflit dans la même famille") {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'add-chambre-btn';
      add.textContent = '+';
      add.onclick = () => { conflitChambres.push(""); renderWizard(); };
      area.appendChild(add);
    }
    if(last === "Conflit avec personne extérieure à l'hôtel") {
      const lab = document.createElement('label');
      lab.textContent = "Commentaire :";
      area.appendChild(lab);
      const ta = document.createElement('textarea');
      ta.rows = 3;
      ta.placeholder = "Décris le conflit...";
      ta.value = conflitComment;
      ta.oninput = e => conflitComment = e.target.value;
      area.appendChild(ta);
    }
    btnRow.classList.remove('hidden');
    return;
  }
  if (last === "Vol") {
    if(volChambres.length === 0) volChambres.push("");
    const labDesc = document.createElement('label');
    labDesc.textContent = "Descriptif du vol :";
    area.appendChild(labDesc);
    const taDesc = document.createElement('textarea');
    taDesc.rows = 3;
    taDesc.value = volDescription;
    taDesc.oninput = e => volDescription = e.target.value;
    area.appendChild(taDesc);
    const labObj = document.createElement('label');
    labObj.textContent = "Objet(s) volé(s) :";
    area.appendChild(labObj);
    const taObj = document.createElement('textarea');
    taObj.rows = 2;
    taObj.value = volObjets;
    taObj.oninput = e => volObjets = e.target.value;
    area.appendChild(taObj);
    const labelCh = document.createElement('label');
    labelCh.textContent = "Chambres suspectées (optionnel) :";
    area.appendChild(labelCh);
    const listV = document.createElement('div');
    listV.className = 'chambres-list';
    volChambres.forEach((val, idx) => {
      const div = document.createElement('div');
      div.className = 'chambre-item';
      const sel = createChambreSelect(val);
      sel.onchange = e => volChambres[idx] = e.target.value;
      div.appendChild(sel);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'del-chambre-btn';
      del.textContent = '×';
      del.onclick = () => { volChambres.splice(idx,1); renderWizard(); };
      div.appendChild(del);
      listV.appendChild(div);
    });
    area.appendChild(listV);
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'add-chambre-btn';
    add.textContent = '+';
    add.onclick = () => { volChambres.push(""); renderWizard(); };
    area.appendChild(add);
    btnRow.classList.remove('hidden');
    return;
  }
  if (chemin.length > 0 && arbre[chemin[chemin.length-1]] === undefined) {
    if (chemin[chemin.length-1] === "Autres") {
      const label = document.createElement('label');
      label.textContent = "Décris ton problème :";
      area.appendChild(label);
      const textarea = document.createElement('textarea');
      textarea.rows = 4;
      textarea.id = "autreText";
      textarea.placeholder = "Explique ici...";
      textarea.value = autreSaisie;
      textarea.oninput = e => autreSaisie = e.target.value;
      area.appendChild(textarea);
    } else {
      const div = document.createElement('div');
      div.className = "path-end";
      div.innerHTML = `👉 Problème sélectionné : <br><b>${chemin.join(" > ")}</b>`;
      area.appendChild(div);
    }
    btnRow.classList.remove('hidden');
    return;
  }
  let cle = chemin.length === 0 ? "" : chemin[chemin.length-1];
  let choix = arbre[cle];
  if (!choix) return;
  const chDiv = document.createElement('div');
  chDiv.className = "choices";
  choix.forEach(c => {
    let style = CHOIX_STYLES[c] || { color:"gris", icon:'❓'};
    const btn = document.createElement('button');
    btn.type = "button";
    btn.className = "choice-btn";
    btn.setAttribute('data-color', style.color);
    btn.innerHTML = `<span class="choice-ico">${style.icon}</span> ${c}`;
    btn.onclick = () => {
      chemin.push(c);
      renderWizard();
    }
    chDiv.appendChild(btn);
  });
  area.appendChild(chDiv);
}
renderWizard();
renderMultiList();

// --------- Ajouter un autre ---------
document.getElementById('add-btn').onclick = function() {
  if(chemin[0] === "Donner un avis") {
    if(!avisSaisie.trim()) { alert("Écris ton avis !"); return;}
    multi.push({type: "avis", texte: avisSaisie.trim()});
  } else {
    let label = chemin.join(" > ");
    if (!label) { alert("Sélectionne au moins un choix."); return; }
    let texte = "";
    let last = chemin[chemin.length-1];
    if (last === "Autres") {
      if(!autreSaisie.trim()) { alert("Décris ton problème !"); return;}
      texte = autreSaisie.trim();
    } else if(["Conflit entre plusieurs chambres","Conflit dans la même famille","Conflit avec personne extérieure à l'hôtel"].includes(last)) {
      let chs = conflitChambres.filter(x=>x).join(', ');
      if(chs) texte = 'Chambres: ' + chs;
      if(last === "Conflit avec personne extérieure à l'hôtel" && conflitComment.trim()) {
        texte += (texte ? ' - ' : '') + conflitComment.trim();
      }
    } else if(last === "Vol") {
      if(!volDescription.trim() && !volObjets.trim() && volChambres.filter(x=>x).length===0) {
        alert("Renseigne au moins un détail sur le vol !"); return;
      }
      if(volDescription.trim()) texte = volDescription.trim();
      if(volObjets.trim()) texte += (texte ? ' - ' : '') + 'Objets: ' + volObjets.trim();
      let chs = volChambres.filter(x=>x).join(', ');
      if(chs) texte += (texte ? ' - ' : '') + 'Chambres suspectes: ' + chs;
    }
    multi.push({type: "signalement", chemin: [...chemin], texte});
  }
  renderMultiList();
  chemin = [];
  autreSaisie = "";
  avisSaisie = "";
  conflitChambres = [];
  conflitComment = "";
  volDescription = "";
  volObjets = "";
  volChambres = [];
  renderWizard();
}

// --------- PATCH FORM SUBMIT (PDF + Envoi mail Formspree) ---------
document.getElementById('mainForm').onsubmit = function(e){
  e.preventDefault();
  let nom = document.getElementById('nom').value.trim();
  let chambre = document.getElementById('chambre').value.trim();
  if (!nom || !chambre) {
    alert("Veuillez renseigner votre nom et numéro de chambre");
    return;
  }
  if(multi.length === 0 && chemin.length === 0) {
    alert("Veuillez ajouter au moins un signalement ou un avis");
    return;
  }
  if(chemin.length > 0) {
    if(chemin[0] === "Donner un avis") {
      if(!avisSaisie.trim()) { alert("Écris ton avis !"); return;}
      multi.push({type: "avis", texte: avisSaisie.trim()});
    } else {
      let label = chemin.join(" > ");
      if (!label) { alert("Sélectionne au moins un choix."); return; }
      let texte = "";
      let last = chemin[chemin.length-1];
      if (last === "Autres") {
        if(!autreSaisie.trim()) { alert("Décris ton problème !"); return;}
        texte = autreSaisie.trim();
      } else if(["Conflit entre plusieurs chambres","Conflit dans la même famille","Conflit avec personne extérieure à l'hôtel"].includes(last)) {
        let chs = conflitChambres.filter(x=>x).join(', ');
        if(chs) texte = 'Chambres: ' + chs;
        if(last === "Conflit avec personne extérieure à l'hôtel" && conflitComment.trim()) {
          texte += (texte ? ' - ' : '') + conflitComment.trim();
        }
      } else if(last === "Vol") {
        if(!volDescription.trim() && !volObjets.trim() && volChambres.filter(x=>x).length===0) {
          alert("Renseigne au moins un détail sur le vol !"); return;
        }
        if(volDescription.trim()) texte = volDescription.trim();
        if(volObjets.trim()) texte += (texte ? ' - ' : '') + 'Objets: ' + volObjets.trim();
        let chs = volChambres.filter(x=>x).join(', ');
        if(chs) texte += (texte ? ' - ' : '') + 'Chambres suspectes: ' + chs;
      }
      multi.push({type: "signalement", chemin: [...chemin], texte});
    }
    renderMultiList();
    chemin = [];
    autreSaisie = "";
    avisSaisie = "";
    conflitChambres = [];
    conflitComment = "";
    volDescription = "";
    volObjets = "";
    volChambres = [];
    renderWizard();
  }

  // Génère code intervention
  const codeInter = genCodeIntervention();

  // Prépare tout le contenu pour le champ caché message (pour Formspree)
  let hiddenMsg = '';
  const now = new Date(); // Date for Formspree message
  let dateStr = now.toLocaleDateString('fr-FR');
  let timeStr = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
  hiddenMsg += 'Code intervention : ' + codeInter + '\n';
  hiddenMsg += 'Date : ' + dateStr + ' | Heure : ' + timeStr + '\n';
  hiddenMsg += 'Nom : ' + nom + '\n';
  hiddenMsg += 'Chambre : ' + chambre + '\n\n';
  multi.forEach((item, i) => {
    if(item.type === "avis") {
      hiddenMsg += `Avis #${i+1}: ${item.texte}\n`;
    } else {
      let p = item.chemin.filter(x =>
        x !== "Problème technique" && x !== "Signaler" && x !== "Chambre"
        && x !== "Parties communes" && x !== "Nuisibles" && x !== "Électricité"
        && x !== "Eau" && x !== "Clés" && x !== "Donner un avis"
      );
      let titre = p[p.length-1] || item.chemin[item.chemin.length-1];
      if (item.texte) titre += ` (${item.texte})`;
      hiddenMsg += `Signalement #${i+1}: ${titre}\n`;
    }
  });
  document.getElementById('hiddenMessage').value = hiddenMsg;

  const form = document.getElementById('mainForm');
  const formData = new FormData(form);
  const formAction = form.getAttribute('action');

  fetch(formAction, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      lastSubmissionData = { nom, chambre, multi: JSON.parse(JSON.stringify(multi)), codeInter };
      document.getElementById('download-btn').classList.remove('hidden');
      document.getElementById('mainForm').reset();
      chemin = [];
      autreSaisie = "";
      avisSaisie = "";
      conflitChambres = [];
      conflitComment = "";
      volDescription = "";
      volObjets = "";
      volChambres = [];
      multi = [];
      renderWizard();
      renderMultiList();
      alert("Signalement envoyé avec succès !");
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          alert("Erreur d'envoi: " + data["errors"].map(error => error["message"]).join(", "));
        } else {
          alert("Erreur d'envoi du formulaire.");
        }
      }).catch(() => {
        alert("Erreur d'envoi et erreur lors de l'analyse de la réponse d'erreur. Statut: " + response.status);
      });
    }
  }).catch(error => {
    alert("Erreur réseau ou autre problème lors de l'envoi : " + error.toString());
  });

  return false;
};

// Ajoute ou met à jour un champ hidden dans le formulaire (pour Formspree)
// --------- THEME SWITCHER ---------
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;
function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if(themeIcon){
    themeIcon.querySelector('.sun').style.display = theme === 'dark' ? 'none':'block';
    themeIcon.querySelector('.moon').style.display = theme === 'dark' ? 'block':'none';
  }
  localStorage.setItem('hotel_theme', theme);
}
if(themeBtn){
  themeBtn.onclick = function(){
    let isDark = htmlEl.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light':'dark');
  };
}
(function(){
  let theme = localStorage.getItem('hotel_theme') || 'light';
  setTheme(theme);
})();

function generatePdf(data) {
  const { nom, chambre, multi, codeInter } = data;
  const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
  if (!jsPDF) { alert('Librairie PDF (jsPDF) non chargée.'); return; }
  const doc = new jsPDF();
  const nowGen = new Date();
  let dateStrGen = nowGen.toLocaleDateString('fr-FR');
  let timeStrGen = nowGen.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
  let y = 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Fiche de Signalement / Avis', 105, y, {align:'center'});
  y += 9;
  doc.setFontSize(12);
  doc.setTextColor(80,80,250);
  doc.text(codeInter, 105, y, {align:'center'});
  doc.setTextColor(0,0,0);
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Date :', 14, y);
  doc.text(dateStrGen, 40, y);
  doc.text('Heure :', 100, y);
  doc.text(timeStrGen, 120, y);
  y += 8;
  doc.text('Nom :', 14, y);
  doc.text(nom, 40, y);
  doc.text('Chambre :', 100, y);
  doc.text(chambre, 120, y);
  y += 12;
  let sep = '________________________________________';
  doc.setFontSize(12);
  multi.forEach((item,i) => {
    if (y > 260) { doc.addPage(); y = 15; }
    doc.setFont('helvetica','bold');
    if(item.type === 'avis') {
      doc.text(`Avis #${i+1} :`, 14, y);
      y += 7;
      doc.setFont('helvetica','normal');
      doc.text(item.texte, 18, y);
      y += 10;
    } else {
      let p = item.chemin.filter(x =>
        x !== 'Problème technique' && x !== 'Signaler' && x !== 'Chambre'
        && x !== 'Parties communes' && x !== 'Nuisibles' && x !== 'Électricité'
        && x !== 'Eau' && x !== 'Clés' && x !== 'Donner un avis'
      );
      let titre = p[p.length-1] || item.chemin[item.chemin.length-1];
      if (item.texte) titre += ` (${item.texte})`;
      doc.text(`Signalement #${i+1} :`, 14, y);
      y += 7;
      doc.setFont('helvetica','normal');
      doc.text(titre, 18, y);
      y += 10;
    }
    doc.setFontSize(9);
    doc.text(sep, 14, y);
    y += 8;
    doc.setFontSize(12);
  });
  doc.save(`signalement_${codeInter}.pdf`);
}

const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
  downloadBtn.onclick = () => {
    if (!lastSubmissionData) {
      alert('Aucun signalement à exporter.');
      return;
    }
    generatePdf(lastSubmissionData);
  };
}
