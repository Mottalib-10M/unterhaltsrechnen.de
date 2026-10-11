import { pfaendbar } from '../engine/pfaendung';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Pfändbarer Betrag ab 1. Juli 2026', 'Garnishable amount from 1 July 2026'),
  cta: T(l, 'Pfändungsrechner mit Woche, Tag und P-Konto', 'Garnishment calculator with week, day and P-Konto'),
  inputs: [{ id: 'n', label: T(l, 'Nettolohn im Monat', 'Net pay per month'), def: 2300, unit: '€', max: 100000, decimals: 2 }, { id: 'p', label: T(l, 'Unterhaltspflichten', 'People you support'), def: 0, options: zahlOpt(0, 5, l, '+') }],
  run: ({ n, p }: Record<string, number>) => { const r = pfaendbar(n, p);
    return { head: [T(l, 'Pfändbar im Monat', 'Garnishable per month'), eur(r.pfaendbar, l, 2)], rows: [[T(l, 'Ihnen bleiben', 'You keep'), eur(r.verbleibt, l, 2)], [T(l, 'Freibetrag', 'Exempt amount'), eur(r.freibetrag, l, 2)]] as Rows }; },
});
