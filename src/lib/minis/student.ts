import { volljaehrigenunterhalt } from '../engine/unterhalt';
import { T, eur, pct, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Unterhalt für Studierende mit eigener Wohnung', 'Support for a student living away from home'),
  cta: T(l, 'Volljährigenunterhalt-Rechner', 'Adult child support calculator'),
  inputs: [{ id: 'a', label: T(l, 'Netto Mutter', 'Mother’s net income'), def: 2900, unit: '€', max: 100000 }, { id: 'b', label: T(l, 'Netto Vater', 'Father’s net income'), def: 3700, unit: '€', max: 100000 }, { id: 'e', label: T(l, 'BAföG oder Lohn', 'BAföG or wages'), def: 0, unit: '€', max: 5000 }],
  run: ({ a, b, e }: Record<string, number>) => { const r = volljaehrigenunterhalt({ einkommenA: a, einkommenB: b, eigenerHaushalt: true, eigenesEinkommen: e });
    return { head: [T(l, 'Offener Bedarf', 'Remaining need'), eur(r.restbedarf, l)], rows: [[T(l, `Mutter (${pct(r.quoteA, l, 0)})`, `Mother (${pct(r.quoteA, l, 0)})`), eur(r.anteilA, l)], [T(l, `Vater (${pct(r.quoteB, l, 0)})`, `Father (${pct(r.quoteB, l, 0)})`), eur(r.anteilB, l)]] as Rows }; },
});
