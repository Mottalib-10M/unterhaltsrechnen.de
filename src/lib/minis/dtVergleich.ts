import { P } from '../engine/params';
import { gruppeVon, type Stufe } from '../engine/dt';
import { T, eur, altersstufeOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, '2025 und 2026 im Vergleich', '2025 and 2026 compared'),
  cta: T(l, 'Düsseldorfer Tabelle 2026', 'Düsseldorf Table 2026'),
  inputs: [{ id: 'n', label: T(l, 'Bereinigtes Netto', 'Adjusted net income'), def: 3500, unit: '€', max: 100000 }, { id: 's', label: T(l, 'Altersstufe', 'Age band'), def: 1, options: altersstufeOpt(l) }],
  run: ({ n, s }: Record<string, number>) => { const g = gruppeVon(n); const st = s as Stufe; const kgT = (k: number) => (st === 3 ? k : k / 2);
    const z25 = P.dt2025.bedarf[g][st] - kgT(P.dt2025.kindergeld); const z26 = P.dt.bedarf[g][st] - kgT(P.kindergeld.monat);
    return { head: [T(l, 'Zahlbetrag 2026', 'Payable 2026'), eur(z26, l)], rows: [[T(l, 'Zahlbetrag 2025', 'Payable 2025'), eur(z25, l)], [T(l, 'Bedarf 2025 → 2026', 'Need 2025 → 2026'), `${eur(P.dt2025.bedarf[g][st], l)} → ${eur(P.dt.bedarf[g][st], l)}`], [T(l, 'Unterschied', 'Difference'), eur(z26 - z25, l)]] as Rows }; },
});
