import { P } from '../engine/params';
import { rvgGebuehr } from '../engine/kosten';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Anwaltsgebühren nach RVG', 'Lawyer fees under the RVG'),
  cta: T(l, 'Scheidungskosten-Rechner', 'Divorce cost calculator'),
  inputs: [{ id: 'w', label: T(l, 'Gegenstandswert', 'Value of the matter'), def: 12000, unit: '€', max: 2000000 }],
  run: ({ w }: Record<string, number>) => { const g = rvgGebuehr(w); const R = P.rvg; const geb = (R.vv3100 + R.vv3104) * g; const aus = Math.min(R.vv7002_max, R.vv7002_anteil * geb); const brutto = (geb + aus) * (1 + R.ust);
    return { head: [T(l, 'Anwalt brutto', 'Lawyer incl. VAT'), eur(brutto, l)], rows: [[T(l, '1,0-Gebühr', '1.0 fee'), eur(g, l)], [T(l, 'Verfahrens- und Terminsgebühr (2,5)', 'Procedure and hearing fee (2.5)'), eur(geb, l)], [T(l, 'Auslagenpauschale', 'Flat expenses'), eur(aus, l)]] as Rows }; },
});
