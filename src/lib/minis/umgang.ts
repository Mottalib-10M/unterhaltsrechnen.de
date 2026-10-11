import { kindesunterhalt } from '../engine/dt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Erweiterter Umgang: was der BGH 2026 abzieht', 'Extended contact: what the 2026 BGH ruling deducts'),
  cta: T(l, 'Kindesunterhaltsrechner mit Umgang', 'Child support calculator with contact'),
  inputs: [{ id: 'n', label: T(l, 'Netto des Umgangselternteils', 'Net income of the contact parent'), def: 3600, unit: '€', max: 100000 }, { id: 'p', label: T(l, 'Abzug vom Bedarf', 'Deduction from need'), def: 10, options: [{ value: '0', label: '0 %' }, { value: '10', label: '10 %' }, { value: '15', label: '15 %' }] }, { id: 'h', label: T(l, 'Herabstufung', 'Step down'), def: 1, options: [{ value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }] }],
  run: ({ n, p, h }: Record<string, number>) => { const k = [{ alter: 9 }]; const a = kindesunterhalt(n, k); const b = kindesunterhalt(n, k, { umgangAbzug: p / 100, umgangHerabstufung: h });
    return { head: [T(l, 'Unterhalt mit erweitertem Umgang', 'Support with extended contact'), eur(b.summe, l)], rows: [[T(l, 'ohne erweiterten Umgang', 'without extended contact'), eur(a.summe, l)], [T(l, 'Ersparnis im Monat', 'Saving per month'), eur(a.summe - b.summe, l)]] as Rows, note: T(l, 'Beispiel: ein Kind von 9 Jahren.', 'Example: one child aged 9.') }; },
});
