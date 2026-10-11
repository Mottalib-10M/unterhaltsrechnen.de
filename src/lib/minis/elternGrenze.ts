import { elternunterhalt } from '../engine/unterhalt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Liegen Sie über der 100.000-Euro-Grenze?', 'Are you above the 100,000 euro limit?'),
  cta: T(l, 'Elternunterhalt-Rechner', 'Parental maintenance calculator'),
  inputs: [{ id: 'j', label: T(l, 'Jahresbruttoeinkommen', 'Annual gross income'), def: 98000, unit: '€', max: 5000000 }, { id: 'n', label: T(l, 'Bereinigtes Netto im Monat', 'Adjusted net per month'), def: 4600, unit: '€', max: 100000 }],
  run: ({ j, n }: Record<string, number>) => { const r = elternunterhalt({ nettoBereinigt: n, jahresbrutto: j, luecke: 99999 });
    return { head: [T(l, 'Rückgriff des Sozialamts', 'Welfare office can claim'), r.rueckgriffMoeglich ? T(l, 'möglich', 'possible') : T(l, 'nein', 'no')], rows: [[T(l, 'Abstand zur Grenze', 'Distance to the limit'), eur(j - r.grenze, l)], [T(l, 'Leistungsfähig (falls über der Grenze)', 'Ability to pay (if above)'), eur(r.leistungsfaehig, l)]] as Rows }; },
});
