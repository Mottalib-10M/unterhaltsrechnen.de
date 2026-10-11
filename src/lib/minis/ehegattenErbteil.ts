import { erbfolge, type Gueterstand } from '../engine/erbe';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
const GS: Gueterstand[] = ['zugewinn', 'trennung', 'gemeinschaft'];
export default (l: L) => ({
  title: T(l, 'Erbteil des Ehegatten nach Güterstand', 'Spouse’s share by matrimonial regime'),
  cta: T(l, 'Erbrechner', 'Inheritance calculator'),
  inputs: [{ id: 'g', label: T(l, 'Güterstand', 'Matrimonial regime'), def: 0, options: [{ value: '0', label: T(l, 'Zugewinngemeinschaft', 'Community of gains') }, { value: '1', label: T(l, 'Gütertrennung', 'Separation of property') }, { value: '2', label: T(l, 'Gütergemeinschaft', 'Community of property') }] }, { id: 'k', label: T(l, 'Kinder', 'Children'), def: 1, options: zahlOpt(0, 4, l) }, { id: 'n', label: T(l, 'Nachlass', 'Estate'), def: 200000, unit: '€', max: 100000000 }],
  run: ({ g, k, n }: Record<string, number>) => { const r = erbfolge({ verheiratet: true, gueterstand: GS[g], kinder: k, elternLebend: k ? 0 : 2, nachlass: n }); const e = r.anteile[0];
    return { head: [T(l, 'Erbteil des Ehegatten', 'Spouse’s share'), eur(e.betragJe, l)], rows: [[T(l, 'Quote', 'Fraction'), `${Math.round(e.quoteJe * 1000) / 10} %`], [T(l, 'Pflichtteil', 'Compulsory share'), eur(e.pflichtteilJe, l)]] as Rows, note: k === 0 ? T(l, 'Ohne Kinder: neben beiden Eltern gerechnet.', 'Without children: computed alongside both parents.') : undefined }; },
});
