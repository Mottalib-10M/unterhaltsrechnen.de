import { P } from '../engine/params';
import { bedarf, gruppeVon, type Stufe } from '../engine/dt';
import { T, eur, altersstufeOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wie viel Kindergeld wird angerechnet?', 'How much child benefit is offset?'),
  cta: T(l, 'Zahlbeträge der Tabelle', 'Payment amounts of the table'),
  inputs: [{ id: 'n', label: T(l, 'Netto des Zahlenden', 'Payer’s net income'), def: 2700, unit: '€', max: 100000 }, { id: 's', label: T(l, 'Altersstufe', 'Age band'), def: 2, options: altersstufeOpt(l) }],
  run: ({ n, s }: Record<string, number>) => { const kg = P.kindergeld.monat; const st = s as Stufe; const anteil = st === 3 ? kg : kg / 2; const b = bedarf(gruppeVon(n), st);
    return { head: [T(l, 'Angerechnet', 'Offset'), eur(anteil, l)], rows: [[T(l, 'Kindergeld 2026', 'Child benefit 2026'), eur(kg, l)], [T(l, 'Bedarf', 'Need'), eur(b, l)], [T(l, 'Zahlbetrag', 'Amount payable'), eur(b - anteil, l)]] as Rows }; },
});
