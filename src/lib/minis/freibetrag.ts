import { erbschaftsteuer, BEZIEHUNGEN, type Beziehung } from '../engine/erbe';
import { T, eur, type L, type Rows } from './_kit';
const NAMEN: Record<Beziehung, [string, string]> = { ehegatte: ['Ehegatte', 'Spouse'], kind: ['Kind', 'Child'], enkel_kind_verstorben: ['Enkel, Elternteil verstorben', 'Grandchild, parent deceased'], enkel: ['Enkel', 'Grandchild'], eltern: ['Eltern', 'Parents'], geschwister: ['Geschwister', 'Sibling'], nichte_neffe: ['Nichte/Neffe', 'Niece/nephew'], stiefeltern: ['Stiefeltern', 'Step-parent'], schwiegerkind: ['Schwiegerkind', 'Child-in-law'], schwiegereltern: ['Schwiegereltern', 'Parent-in-law'], geschieden: ['Geschiedener Ehegatte', 'Divorced spouse'], sonstige: ['Lebensgefährte, Freunde', 'Partner, friends'] };
export default (l: L) => ({
  title: T(l, 'Freibetrag und Steuer für Ihren Erbteil', 'Allowance and tax on your share'),
  cta: T(l, 'Erbschaftsteuer-Rechner', 'Inheritance tax calculator'),
  inputs: [{ id: 'b', label: T(l, 'Verhältnis', 'Relationship'), def: 1, options: BEZIEHUNGEN.map((b, i) => ({ value: String(i), label: T(l, NAMEN[b][0], NAMEN[b][1]) })) }, { id: 'w', label: T(l, 'Erbteil', 'Share received'), def: 500000, unit: '€', max: 500000000 }],
  run: ({ b, w }: Record<string, number>) => { const r = erbschaftsteuer({ erwerb: w, beziehung: BEZIEHUNGEN[b], erbfall: true, alterKind: 30 });
    return { head: [T(l, 'Erbschaftsteuer', 'Inheritance tax'), eur(r.steuer, l)], rows: [[T(l, `Freibetrag (Klasse ${r.klasse})`, `Allowance (class ${r.klasse})`), eur(r.freibetrag + r.versorgung, l)], [T(l, 'Steuerpflichtig', 'Taxable'), eur(r.steuerpflichtig, l)]] as Rows, note: T(l, 'Mit Erbfallkostenpauschale; Kind über 27 Jahre.', 'Including the flat estate-cost allowance; child over 27.') }; },
});
