import { pflichtteilsergaenzung } from '../engine/erbe';
import { T, eur, pct, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wie viel einer Schenkung zählt noch?', 'How much of a gift still counts?'),
  cta: T(l, 'Pflichtteilsrechner', 'Compulsory share calculator'),
  inputs: [{ id: 's', label: T(l, 'Wert der Schenkung', 'Value of the gift'), def: 120000, unit: '€', max: 100000000 }, { id: 'j', label: T(l, 'Volle Jahre bis zum Erbfall', 'Full years until the death'), def: 4, max: 30 }, { id: 'q', label: T(l, 'Ihre Pflichtteilsquote', 'Your compulsory fraction'), def: 4, options: [{ value: '2', label: '1/2' }, { value: '4', label: '1/4' }, { value: '6', label: '1/6' }, { value: '8', label: '1/8' }, { value: '12', label: '1/12' }] }],
  run: ({ s, j, q }: Record<string, number>) => { const r = pflichtteilsergaenzung(s, j, 1 / q);
    return { head: [T(l, 'Ergänzungsanspruch', 'Top-up claim'), eur(r.ergaenzung, l)], rows: [[T(l, 'Angerechnet', 'Counted'), `${pct(r.faktor, l, 0)} = ${eur(r.angerechnet, l)}`]] as Rows }; },
});
