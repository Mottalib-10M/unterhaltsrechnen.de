import { P } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Betreuungsunterhalt für den unverheirateten Elternteil', 'Childcare maintenance for an unmarried parent'),
  cta: T(l, 'Unterhalt für die ganze Familie', 'Maintenance for the whole family'),
  inputs: [{ id: 'v', label: T(l, 'Einkommen vor der Geburt (netto)', 'Net income before the birth'), def: 1900, unit: '€', max: 100000 }, { id: 'p', label: T(l, 'Netto des anderen Elternteils nach Kindesunterhalt', 'Other parent’s net after child support'), def: 2600, unit: '€', max: 100000 }],
  run: ({ v, p }: Record<string, number>) => { const bed = Math.max(P.selbstbehalt.bedarf_1615l_mindest, v); const sb = P.selbstbehalt.ehegatte_erwerbstaetig; const lf = Math.max(0, p - sb);
    return { head: [T(l, 'Betreuungsunterhalt (höchstens)', 'Childcare maintenance (at most)'), eur(Math.min(bed, lf), l)], rows: [[T(l, 'Bedarf nach Lebensstellung', 'Need by standard of living'), eur(bed, l)], [T(l, 'Selbstbehalt des Zahlenden', 'Payer’s self-retention'), eur(sb, l)], [T(l, 'Leistungsfähig bis', 'Can pay up to'), eur(lf, l)]] as Rows, note: T(l, 'Eigenes Einkommen während der Betreuung wird angerechnet.', 'Own income during the care period is deducted.') }; },
});
