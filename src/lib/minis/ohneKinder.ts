import { erbfolge } from '../engine/erbe';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Erbfolge ohne Kinder', 'Succession without children'),
  cta: T(l, 'Erbrechner', 'Inheritance calculator'),
  inputs: [{ id: 'v', label: T(l, 'Verheiratet?', 'Married?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein', 'No') }] }, { id: 'e', label: T(l, 'Lebende Eltern', 'Living parents'), def: 1, options: zahlOpt(0, 2, l) }, { id: 's', label: T(l, 'Geschwister', 'Siblings'), def: 2, options: zahlOpt(0, 5, l) }],
  run: ({ v, e, s }: Record<string, number>) => { const n = 100000; const r = erbfolge({ verheiratet: v === 1, kinder: 0, elternLebend: e as 0 | 1 | 2, geschwister: s, grosseltern: false, nachlass: n });
    const lab: Record<string, string> = { ehegatte: T(l, 'Ehegatte', 'Spouse'), elternteil: T(l, 'je Elternteil', 'each parent'), geschwister: T(l, 'je Geschwister', 'each sibling'), staat: T(l, 'entferntere Verwandte oder Staat', 'distant relatives or the state'), grosseltern: T(l, 'Großeltern', 'Grandparents') };
    return { head: [T(l, 'Bei 100.000 € Nachlass', 'On a €100,000 estate'), r.anteile.length ? `${lab[r.anteile[0].wer]}: ${eur(r.anteile[0].betragJe, l)}` : '–'], rows: r.anteile.slice(1).map((a) => [lab[a.wer], eur(a.betragJe, l)]) as Rows }; },
});
