import { erbfolge } from '../engine/erbe';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Pflichtteil eines enterbten Kindes', 'Compulsory share of a disinherited child'),
  cta: T(l, 'Pflichtteilsrechner mit Schenkungen', 'Compulsory share calculator with gifts'),
  inputs: [{ id: 'n', label: T(l, 'Nachlass', 'Estate'), def: 360000, unit: '€', max: 100000000 }, { id: 'k', label: T(l, 'Kinder insgesamt', 'Children in total'), def: 2, options: zahlOpt(1, 6, l) }, { id: 'v', label: T(l, 'Ehegatte lebt (Zugewinngemeinschaft)?', 'Surviving spouse (community of gains)?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein', 'No') }] }],
  run: ({ n, k, v }: Record<string, number>) => { const r = erbfolge({ verheiratet: v === 1, kinder: k, nachlass: n }); const c = r.anteile.find((a) => a.wer === 'kind')!;
    return { head: [T(l, 'Pflichtteil', 'Compulsory share'), eur(c.pflichtteilJe, l)], rows: [[T(l, 'Gesetzlicher Erbteil', 'Statutory share'), eur(c.betragJe, l)], [T(l, 'Quote des Pflichtteils', 'Compulsory fraction'), `1/${Math.round(1 / (c.quoteJe / 2))}`]] as Rows }; },
});
