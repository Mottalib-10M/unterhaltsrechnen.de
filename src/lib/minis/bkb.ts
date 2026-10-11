import { kindesunterhalt } from '../engine/dt';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Bedarfskontrollbetrag: wird herabgestuft?', 'Needs-control amount: is the group lowered?'),
  cta: T(l, 'Kindesunterhaltsrechner', 'Child support calculator'),
  inputs: [{ id: 'n', label: T(l, 'Bereinigtes Netto', 'Adjusted net income'), def: 3400, unit: '€', max: 100000 }, { id: 'k', label: T(l, 'Kinder (6 bis 11 Jahre)', 'Children (age 6 to 11)'), def: 3, options: zahlOpt(1, 5, l) }],
  run: ({ n, k }: Record<string, number>) => { const kinder = Array.from({ length: k }, () => ({ alter: 8 })); const mit = kindesunterhalt(n, kinder); const ohne = kindesunterhalt(n, kinder, { bkb: false });
    return { head: [T(l, 'Gruppe nach Kontrolle', 'Group after the check'), `${mit.gruppe + 1} (${T(l, 'statt', 'instead of')} ${mit.gruppeEinkommen + 1})`], rows: [[T(l, 'Unterhalt ohne Kontrolle', 'Support without the check'), eur(ohne.summe, l)], [T(l, 'Unterhalt mit Kontrolle', 'Support with the check'), eur(mit.summe, l)], [T(l, 'Bedarfskontrollbetrag', 'Needs-control amount'), eur(mit.bkbWert, l)]] as Rows }; },
});
