import { kindesunterhalt } from '../engine/dt';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr Einkommen, Ihre Kinder', 'Your income, your children'),
  cta: T(l, 'Vollständiger Kindesunterhaltsrechner', 'Full child support calculator'),
  inputs: [{ id: 'n', label: T(l, 'Bereinigtes Netto', 'Adjusted net income'), def: 2500, unit: '€', max: 100000 }, { id: 'k', label: T(l, 'Kinder (je 8 Jahre)', 'Children (each aged 8)'), def: 2, options: zahlOpt(1, 4, l) }],
  run: ({ n, k }: Record<string, number>) => { const r = kindesunterhalt(n, Array.from({ length: k }, () => ({ alter: 8 })));
    return { head: [T(l, 'Unterhalt zusammen', 'Total support'), eur(r.summe, l)], rows: [[T(l, 'je Kind', 'per child'), eur(r.kinder[0].zahlbetrag, l)], [T(l, 'Gruppe', 'Group'), `${r.gruppe + 1}${r.gruppe !== r.gruppeEinkommen ? T(l, ` (herabgestuft von ${r.gruppeEinkommen + 1})`, ` (lowered from ${r.gruppeEinkommen + 1})`) : ''}`], [T(l, 'Ihnen bleiben', 'You keep'), eur(r.verbleibt, l)]] as Rows, note: r.mangelfall ? T(l, 'Mangelfall: Selbstbehalt erreicht.', 'Shortfall case: self-retention reached.') : undefined }; },
});
