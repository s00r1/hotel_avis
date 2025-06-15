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

module.exports = genCodeIntervention;
