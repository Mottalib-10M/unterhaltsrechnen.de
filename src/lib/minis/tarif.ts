import { steuerNachTarif, type Klasse } from '../engine/erbe';
import { T, eur, pct, type L, type Rows } from './_kit';
const K: Klasse[] = ['I', 'II', 'III'];
export default (l: L) => ({
  title: T(l, 'Steuersatz und Härteausgleich', 'Tax rate and hardship relief'),
  cta: T(l, 'Erbschaftsteuer-Rechner', 'Inheritance tax calculator'),
  inputs: [{ id: 's', label: T(l, 'Steuerpflichtiger Erwerb', 'Taxable acquisition'), def: 310000, unit: '€', max: 500000000 }, { id: 'k', label: T(l, 'Steuerklasse', 'Tax class'), def: 0, options: K.map((k, i) => ({ value: String(i), label: k })) }],
  run: ({ s, k }: Record<string, number>) => { const t = steuerNachTarif(Math.floor(s / 100) * 100, K[k]);
    return { head: [T(l, 'Steuer', 'Tax'), eur(t.steuer, l)], rows: [[T(l, 'Steuersatz', 'Rate'), pct(t.satz, l, 0)], [T(l, 'Ohne Härteausgleich', 'Without hardship relief'), eur(Math.floor(s / 100) * 100 * t.satz, l)], [T(l, 'Härteausgleich greift', 'Hardship relief applies'), t.haerteausgleich ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')]] as Rows }; },
});
