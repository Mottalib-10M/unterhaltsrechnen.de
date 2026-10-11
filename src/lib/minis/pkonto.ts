import { pKonto } from '../engine/pfaendung';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Geschütztes Guthaben auf dem P-Konto', 'Protected balance on a P-Konto'),
  cta: T(l, 'Pfändungsrechner', 'Garnishment calculator'),
  inputs: [{ id: 'p', label: T(l, 'Unterhaltspflichten', 'People you support'), def: 1, options: zahlOpt(0, 5, l, '+') }, { id: 'k', label: T(l, 'Kinder mit Kindergeld', 'Children with child benefit'), def: 1, options: zahlOpt(0, 5, l) }],
  run: ({ p, k }: Record<string, number>) => { const r = pKonto(p, k);
    return { head: [T(l, 'Geschützt im Monat', 'Protected per month'), eur(r.summe, l, 2)], rows: [[T(l, 'Grundfreibetrag (aufgerundet)', 'Basic amount (rounded up)'), eur(r.grund, l)], [T(l, 'Erhöhung für Unterhalt', 'Increase for dependants'), eur(r.erhoehung, l, 2)], [T(l, 'Kindergeld', 'Child benefit'), eur(r.kindergeld, l)]] as Rows }; },
});
