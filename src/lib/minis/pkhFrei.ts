import { pkh } from '../engine/kosten';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Bekommen Sie Verfahrenskostenhilfe ohne Raten?', 'Do you get legal aid without instalments?'),
  cta: T(l, 'PKH-Rechner', 'Legal aid calculator'),
  inputs: [{ id: 'n', label: T(l, 'Nettoeinkommen', 'Net income'), def: 1900, unit: '€', max: 50000 }, { id: 'w', label: T(l, 'Miete und Heizung', 'Rent and heating'), def: 700, unit: '€', max: 10000 }, { id: 'k', label: T(l, 'Kinder unter 6', 'Children under 6'), def: 0, options: zahlOpt(0, 4, l) }],
  run: ({ n, w, k }: Record<string, number>) => { const r = pkh({ netto: n, erwerbstaetig: true, wohnkosten: w, kinder: Array.from({ length: k }, () => 3) });
    return { head: [T(l, 'Monatsrate', 'Monthly instalment'), r.ratenfrei ? T(l, 'keine', 'none') : eur(r.rate, l)], rows: [[T(l, 'Einzusetzendes Einkommen', 'Income to be used'), eur(r.einzusetzen, l)], [T(l, 'Höchstens 48 Raten', 'At most 48 instalments'), eur(r.summeMax, l)]] as Rows }; },
});
