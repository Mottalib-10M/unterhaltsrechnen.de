import { erbfolge } from '../engine/erbe';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wer erbt ohne Testament?', 'Who inherits without a will?'),
  cta: T(l, 'Erbrechner mit Eltern und Geschwistern', 'Inheritance calculator with parents and siblings'),
  inputs: [{ id: 'n', label: T(l, 'Nachlass', 'Estate'), def: 240000, unit: '€', max: 100000000 }, { id: 'v', label: T(l, 'Verheiratet (Zugewinngemeinschaft)?', 'Married (community of gains)?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein', 'No') }] }, { id: 'k', label: T(l, 'Kinder', 'Children'), def: 2, options: zahlOpt(1, 6, l) }],
  run: ({ n, v, k }: Record<string, number>) => { const r = erbfolge({ verheiratet: v === 1, kinder: k, nachlass: n }); const e = r.anteile.find((a) => a.wer === 'ehegatte'); const c = r.anteile.find((a) => a.wer === 'kind')!;
    return { head: [T(l, 'Je Kind', 'Each child'), eur(c.betragJe, l)], rows: [...(e ? [[T(l, 'Ehegatte', 'Spouse'), eur(e.betragJe, l)]] : []), [T(l, 'Pflichtteil je Kind', 'Compulsory share per child'), eur(c.pflichtteilJe, l)]] as Rows }; },
});
