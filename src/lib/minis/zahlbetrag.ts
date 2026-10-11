import { zahlbetrag, bedarf, kgAnteil, type Stufe } from '../engine/dt';
import { T, eur, altersstufeOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Zahlbetrag aus der Tabelle ablesen', 'Read the amount payable from the table'),
  cta: T(l, 'Zur ganzen Tabelle', 'See the whole table'),
  inputs: [{ id: 'g', label: T(l, 'Einkommensgruppe', 'Income group'), def: 3, options: Array.from({ length: 15 }, (_, i) => ({ value: String(i), label: String(i + 1) })) }, { id: 's', label: T(l, 'Altersstufe', 'Age band'), def: 1, options: altersstufeOpt(l) }],
  run: ({ g, s }: Record<string, number>) => { const st = s as Stufe;
    return { head: [T(l, 'Zahlbetrag', 'Amount payable'), eur(zahlbetrag(g, st), l)], rows: [[T(l, 'Bedarf laut Tabelle', 'Need per table'), eur(bedarf(g, st), l)], [T(l, st === 3 ? 'volles Kindergeld' : 'halbes Kindergeld', st === 3 ? 'full child benefit' : 'half child benefit'), `− ${eur(kgAnteil(st), l)}`]] as Rows }; },
});
