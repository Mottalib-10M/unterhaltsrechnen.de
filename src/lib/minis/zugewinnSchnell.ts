import { zugewinnausgleich } from '../engine/vermoegen';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Zugewinn in zwei Zahlen', 'Accrued gain in two figures'),
  cta: T(l, 'Zugewinnausgleich-Rechner', 'Accrued gain calculator'),
  inputs: [{ id: 'a', label: T(l, 'Zugewinn Ehegatte A', 'Gain spouse A'), def: 90000, unit: '€', max: 50000000 }, { id: 'b', label: T(l, 'Zugewinn Ehegatte B', 'Gain spouse B'), def: 30000, unit: '€', max: 50000000 }],
  run: ({ a, b }: Record<string, number>) => { const r = zugewinnausgleich({ anfangA: 0, endA: a, anfangB: 0, endB: b });
    return { head: [T(l, 'Ausgleichsforderung', 'Equalisation claim'), eur(r.forderung, l)], rows: [[T(l, 'Überschuss', 'Difference'), eur(r.ueberschuss, l)], [T(l, 'Berechtigt', 'Owed to'), r.berechtigt ?? '–']] as Rows }; },
});
