import { scheidungskosten } from '../engine/kosten';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was kostet Ihre Scheidung?', 'What will your divorce cost?'),
  cta: T(l, 'Scheidungskosten-Rechner mit Folgesachen', 'Divorce cost calculator with ancillary matters'),
  inputs: [{ id: 'a', label: T(l, 'Netto Ehegatte 1', 'Net income spouse 1'), def: 2600, unit: '€', max: 100000 }, { id: 'b', label: T(l, 'Netto Ehegatte 2', 'Net income spouse 2'), def: 1700, unit: '€', max: 100000 }],
  run: ({ a, b }: Record<string, number>) => { const r = scheidungskosten({ netto1: a, netto2: b, anrechte: 2, anwaelte: 1 });
    return { head: [T(l, 'Gesamt mit einem Anwalt', 'Total with one lawyer'), eur(r.gesamt, l)], rows: [[T(l, 'Verfahrenswert', 'Value of proceedings'), eur(r.gesamtWert, l)], [T(l, 'Gericht', 'Court'), eur(r.gerichtskosten, l)], [T(l, 'Anwalt mit USt', 'Lawyer incl. VAT'), eur(r.anwalt.brutto, l)]] as Rows, note: T(l, 'Mit Versorgungsausgleich über zwei Anrechte.', 'Including pension splitting over two entitlements.') }; },
});
