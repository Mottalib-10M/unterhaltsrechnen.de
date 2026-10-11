import { P } from '../engine/params';
import { famgkgGebuehr } from '../engine/kosten';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Gerichtskosten nach FamGKG', 'Court fees under the FamGKG'),
  cta: T(l, 'Scheidungskosten-Rechner', 'Divorce cost calculator'),
  inputs: [{ id: 'w', label: T(l, 'Verfahrenswert', 'Value of proceedings'), def: 12000, unit: '€', max: 2000000 }],
  run: ({ w }: Record<string, number>) => { const g = famgkgGebuehr(w); const F = P.famgkg;
    return { head: [T(l, 'Gerichtskosten (2,0)', 'Court fees (2.0)'), eur(F.kv1110_satz * g, l)], rows: [[T(l, '1,0-Gebühr', '1.0 fee'), eur(g, l)], [T(l, 'Bei Rücknahme vor Termin (0,5)', 'If withdrawn before the hearing (0.5)'), eur(F.kv1111_satz * g, l)], [T(l, 'Je Ehegatte (Hälfte)', 'Per spouse (half)'), eur(F.kv1110_satz * g / 2, l)]] as Rows }; },
});
