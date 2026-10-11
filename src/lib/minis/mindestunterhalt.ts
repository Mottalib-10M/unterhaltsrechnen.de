import { P } from '../engine/params';
import { T, eur, pct, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Mindestunterhalt nach Alter', 'Minimum support by age'),
  cta: T(l, 'Kindesunterhaltsrechner', 'Child support calculator'),
  inputs: [{ id: 'a', label: T(l, 'Alter des Kindes', 'Child’s age'), def: 9, max: 17 }],
  run: ({ a }: Record<string, number>) => { const s = a < 6 ? 0 : a < 12 ? 1 : 2; const m = P.mindestunterhalt.stufen[s]; const kg = P.kindergeld.monat;
    return { head: [T(l, 'Mindestunterhalt 2026', 'Minimum support 2026'), eur(m, l)], rows: [[T(l, 'Anteil am Existenzminimum', 'Share of the subsistence minimum'), pct(P.mindestunterhalt.prozent_existenzminimum[s], l, 0)], [T(l, 'Zahlbetrag nach halbem Kindergeld', 'Payable after half child benefit'), eur(m - kg / 2, l)], [T(l, 'Unterhaltsvorschuss', 'Maintenance advance'), eur(m - kg, l)]] as Rows }; },
});
