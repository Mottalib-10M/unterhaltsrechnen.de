import { kindesunterhalt, mangelfallGrenze } from '../engine/dt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Mangelfall mit zwei Kindern', 'Shortfall case with two children'),
  cta: T(l, 'Mit allen Kindern rechnen', 'Calculate with all children'),
  inputs: [{ id: 'n', label: T(l, 'Bereinigtes Netto', 'Adjusted net income'), def: 1900, unit: '€', max: 100000 }, { id: 'e', label: T(l, 'Erwerbstätig?', 'Working?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein', 'No') }] }],
  run: ({ n, e }: Record<string, number>) => { const kids = [{ alter: 4 }, { alter: 10 }]; const r = kindesunterhalt(n, kids, { erwerbstaetig: e === 1 });
    return { head: [T(l, r.mangelfall ? 'Verteilt werden' : 'Kein Mangelfall', r.mangelfall ? 'Amount shared out' : 'No shortfall'), eur(r.summe, l)], rows: [[T(l, 'Kind 4 Jahre', 'Child aged 4'), eur(r.kinder[0].zahlbetrag, l)], [T(l, 'Kind 10 Jahre', 'Child aged 10'), eur(r.kinder[1].zahlbetrag, l)], [T(l, 'Kein Mangelfall ab', 'No shortfall from'), eur(mangelfallGrenze(kids, e === 1), l)]] as Rows }; },
});
