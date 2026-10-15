export function getMoonPhase(date: Date) {
  // Synodic month (new moon to new moon) is roughly 29.53058868 days
  const synodicMonth = 29.53058868;
  // Known new moon: Jan 6, 2000, 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const diff = date.getTime() - knownNewMoon;
  const days = diff / (1000 * 60 * 60 * 24);
  let fraction = (days % synodicMonth) / synodicMonth;
  if (fraction < 0) fraction += 1;

  let name = '';
  let icon = '';
  
  if (fraction < 0.03 || fraction > 0.97) { name = 'New Moon'; icon = '🌑'; }
  else if (fraction < 0.22) { name = 'Waxing Crescent'; icon = '🌒'; }
  else if (fraction < 0.28) { name = 'First Quarter'; icon = '🌓'; }
  else if (fraction < 0.47) { name = 'Waxing Gibbous'; icon = '🌔'; }
  else if (fraction < 0.53) { name = 'Full Moon'; icon = '🌕'; }
  else if (fraction < 0.72) { name = 'Waning Gibbous'; icon = '🌖'; }
  else if (fraction < 0.78) { name = 'Last Quarter'; icon = '🌗'; }
  else { name = 'Waning Crescent'; icon = '🌘'; }

  // Illumination is 0 at new moon, 1 at full moon
  const illumination = 1 - Math.abs(0.5 - fraction) * 2;

  return { fraction, illumination, name, icon };
}
