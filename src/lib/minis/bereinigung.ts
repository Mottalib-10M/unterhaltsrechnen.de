import { P } from '../engine/params';
import { gruppeVon } from '../engine/dt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Vom Netto zum bereinigten Netto', 'From net pay to adjusted net income'),
  cta: T(l, 'Mit dem Ergebnis Unterhalt rechnen', 'Use the result to calculate support'),
  inputs: [{ id: 'n', label: T(l, 'Nettolohn', 'Net pay'), def: 3100, unit: '€', max: 100000 }, { id: 'k', label: T(l, 'Arbeitsweg (einfach)', 'Commute (one way)'), def: 25, unit: 'km', max: 200 }, { id: 's', label: T(l, 'Raten für eheliche Schulden', 'Instalments on joint debts'), def: 0, unit: '€', max: 20000 }],
  run: ({ n, k, s }: Record<string, number>) => { const LL = P.leitlinien; const km = Math.max(0, k); const tage = 220 / 12;
    const fahrt = (Math.min(km, 30) * LL.kfz_km + Math.max(0, km - 30) * LL.kfz_km_ab_31) * 2 * tage; const ber = Math.max(0, n - fahrt - s);
    return { head: [T(l, 'Bereinigtes Netto', 'Adjusted net income'), eur(ber, l)], rows: [[T(l, 'Fahrtkosten im Monat', 'Commuting costs per month'), `− ${eur(fahrt, l)}`], [T(l, 'Schuldenraten', 'Debt instalments'), `− ${eur(s, l)}`], [T(l, 'Einkommensgruppe', 'Income group'), String(gruppeVon(ber) + 1)]] as Rows, note: T(l, 'Annahme: 220 Arbeitstage im Jahr; das Gericht prüft, ob das Auto nötig ist.', 'Assumption: 220 working days a year; the court checks whether a car is necessary.') }; },
});
