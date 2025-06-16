const buildHiddenMessage = (nom, chambre, codeInter, multi) => {
  const now = new Date('2024-01-01T10:00:00');
  let hiddenMsg = '';
  let dateStr = now.toLocaleDateString('fr-FR');
  let timeStr = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
  hiddenMsg += 'Code intervention : ' + codeInter + '\n';
  hiddenMsg += 'Date : ' + dateStr + ' | Heure : ' + timeStr + '\n';
  hiddenMsg += 'Nom : ' + nom + '\n';
  hiddenMsg += 'Chambre : ' + chambre + '\n\n';
  multi.forEach((item, i) => {
    if(item.type === 'avis') {
      hiddenMsg += `Avis #${i+1}: ${item.texte}\n`;
    } else {
      let p = item.chemin.filter(x =>
        x !== 'Problème technique' && x !== 'Signaler' && x !== 'Chambre' &&
        x !== 'Parties communes' && x !== 'Nuisibles' && x !== 'Électricité' &&
        x !== 'Eau' && x !== 'Clés' && x !== 'Donner un avis'
      );
      let titre = p[p.length-1] || item.chemin[item.chemin.length-1];
      if (item.texte) titre += ` (${item.texte})`;
      hiddenMsg += `Signalement #${i+1}: ${titre}\n`;
    }
  });
  return hiddenMsg;
};

test('informations de conflit multiple dans hiddenMessage et PDF', () => {
  const multi = [{
    type: 'signalement',
    chemin: ['Signaler','Incident','Conflit','Conflit entre plusieurs chambres'],
    texte: 'Chambres: 10, 12'
  }];
  const msg = buildHiddenMessage('Nom', '1', 'CODE', multi);
  expect(msg).toMatch(/Chambres: 10, 12/);
  const pdfLine = multi.map(item => {
    let p = item.chemin.filter(x =>
      x !== 'Problème technique' && x !== 'Signaler' && x !== 'Chambre' &&
      x !== 'Parties communes' && x !== 'Nuisibles' && x !== 'Électricité' &&
      x !== 'Eau' && x !== 'Clés' && x !== 'Donner un avis'
    );
    let titre = p[p.length-1] || item.chemin[item.chemin.length-1];
    if(item.texte) titre += ` (${item.texte})`;
    return titre;
  }).join('\n');
  expect(pdfLine).toMatch(/Chambres: 10, 12/);
});

test('conflit avec personne extérieure ajoute le commentaire', () => {
  const multi = [{
    type: 'signalement',
    chemin: ['Signaler','Incident','Conflit','Conflit avec personne extérieure à l\'hôtel'],
    texte: 'Chambres: 5 - bruit important'
  }];
  const msg = buildHiddenMessage('Nom', '2', 'CODE', multi);
  expect(msg).toMatch(/bruit important/);
});
