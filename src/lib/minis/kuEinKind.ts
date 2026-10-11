import { kindesunterhalt } from '../engine/dt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Kindesunterhalt für ein Kind', 'Child support for one child'),
  cta: T(l, 'Mehrere Kinder rechnen', 'Calculate for several children'),
  inputs: [{ id: 'n', label: T(l, 'Bereinigtes Netto', 'Adjusted net income'), def: 3000, unit: '€', max: 100000 }, { id: 'a', label: T(l, 'Alter des Kindes', 'Child’s age'), def: 8, max: 20 }],
  run: ({ n, a }: Record<string, number>) => { const r = kindesunterhalt(n, [{ alter: Math.round(a), privilegiert: a >= 18 && a < 21 }]); const k = r.kinder[0];
    return { head: [T(l, 'Zahlbetrag pro Monat', 'Amount payable per month'), eur(r.summe, l)], rows: [[T(l, 'Einkommensgruppe', 'Income group'), String(r.gruppe + 1)], [T(l, 'Tabellenbedarf', 'Table need'), eur(k.bedarf, l)], [T(l, 'Kindergeld angerechnet', 'Child benefit offset'), eur(k.kindergeld, l)]] as Rows, note: r.mangelfall ? T(l, 'Mangelfall: Selbstbehalt begrenzt den Betrag.', 'Shortfall case: the self-retention caps the amount.') : undefined }; },
});
