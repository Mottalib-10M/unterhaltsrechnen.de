import { ehegattenunterhalt } from '../engine/unterhalt';
import { kindesunterhalt } from '../engine/dt';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Trennungsunterhalt, wenn Kinder da sind', 'Separation maintenance when there are children'),
  cta: T(l, 'Trennungsunterhalt-Rechner', 'Separation maintenance calculator'),
  inputs: [{ id: 'p', label: T(l, 'Netto des Zahlenden', 'Payer’s net income'), def: 4200, unit: '€', max: 100000 }, { id: 'b', label: T(l, 'Netto des anderen', 'Other spouse’s net income'), def: 800, unit: '€', max: 100000 }, { id: 'k', label: T(l, 'Kinder (unter 6)', 'Children (under 6)'), def: 1, options: zahlOpt(0, 3, l) }],
  run: ({ p, b, k }: Record<string, number>) => { const ku = kindesunterhalt(p, Array.from({ length: k }, () => ({ alter: 3 }))); const r = ehegattenunterhalt({ pflichtigErwerb: p, berechtigtErwerb: b, kindesunterhalt: ku.summe });
    return { head: [T(l, 'Trennungsunterhalt', 'Separation maintenance'), eur(r.unterhalt, l)], rows: [[T(l, 'Kindesunterhalt vorab', 'Child support first'), eur(ku.summe, l)], [T(l, 'Dem Zahlenden bleiben', 'Payer keeps'), eur(r.verbleibtPflichtig, l)]] as Rows }; },
});
