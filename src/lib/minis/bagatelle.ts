import { versorgungsausgleich } from '../engine/vermoegen';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wird Ihre Rente überhaupt geteilt?', 'Will your pension be split at all?'),
  cta: T(l, 'Versorgungsausgleich-Rechner', 'Pension splitting calculator'),
  inputs: [{ id: 'a', label: T(l, 'Ehezeitanteil Rente A (Monat)', 'Marriage-period pension A (month)'), def: 310, unit: '€', max: 20000 }, { id: 'b', label: T(l, 'Ehezeitanteil Rente B (Monat)', 'Marriage-period pension B (month)'), def: 255, unit: '€', max: 20000 }],
  run: ({ a, b }: Record<string, number>) => { const r = versorgungsausgleich({ renteA: a, renteB: b, kapitalA: 0, kapitalB: 0 });
    return { head: [T(l, 'Differenz der Ausgleichswerte', 'Difference of equalisation values'), eur(r.differenzRente, l)], rows: [[T(l, 'Geringfügig bis', 'Minor up to'), eur(r.grenzeRente, l)], [T(l, 'Ergebnis', 'Result'), r.geringRente ? T(l, 'Ausgleich soll entfallen', 'should not be split') : T(l, 'wird geteilt', 'will be split')]] as Rows }; },
});
