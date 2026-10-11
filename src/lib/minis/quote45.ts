import { ehegattenunterhalt } from '../engine/unterhalt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ehegattenunterhalt nach der 45-Prozent-Quote', 'Spousal maintenance with the 45 percent quota'),
  cta: T(l, 'Ehegattenunterhalt-Rechner', 'Spousal maintenance calculator'),
  inputs: [{ id: 'p', label: T(l, 'Netto des Zahlenden', 'Payer’s net income'), def: 3800, unit: '€', max: 100000 }, { id: 'b', label: T(l, 'Netto des anderen', 'Other spouse’s net income'), def: 1500, unit: '€', max: 100000 }],
  run: ({ p, b }: Record<string, number>) => { const r = ehegattenunterhalt({ pflichtigErwerb: p, berechtigtErwerb: b });
    return { head: [T(l, 'Unterhalt pro Monat', 'Maintenance per month'), eur(r.unterhalt, l)], rows: [[T(l, 'Differenz der Einkommen', 'Income difference'), eur(Math.max(0, p - b), l)], [T(l, 'Dem Zahlenden bleiben', 'Payer keeps'), eur(r.verbleibtPflichtig, l)], [T(l, 'Der andere hat dann', 'Other spouse then has'), eur(b + r.unterhalt, l)]] as Rows }; },
});
