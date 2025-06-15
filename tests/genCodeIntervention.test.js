const genCodeIntervention = require('../genCodeIntervention');

test('le code généré a le bon format', () => {
  const code = genCodeIntervention();
  expect(code).toMatch(/^GRILL-\d{8}-\d{4}-[A-Z0-9]{4}$/);
});
