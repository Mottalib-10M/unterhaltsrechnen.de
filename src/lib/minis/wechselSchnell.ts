import { wechselmodell } from '../engine/unterhalt';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wer zahlt im Wechselmodell an wen?', 'Who pays whom under equal shared care?'),
  cta: T(l, 'Wechselmodell-Rechner mit Mehrkosten', 'Shared care calculator with extra costs'),
  inputs: [{ id: 'a', label: T(l, 'Netto Mutter', 'Mother’s net income'), def: 3400, unit: '€', max: 100000 }, { id: 'b', label: T(l, 'Netto Vater', 'Father’s net income'), def: 2300, unit: '€', max: 100000 }, { id: 'k', label: T(l, 'Alter des Kindes', 'Child’s age'), def: 8, max: 17 }],
  run: ({ a, b, k }: Record<string, number>) => { const r = wechselmodell({ einkommenA: a, einkommenB: b, alter: k, kindergeldAn: 'B' });
    const wer = (x: 'A' | 'B' | null) => (x === 'A' ? T(l, 'Mutter', 'mother') : x === 'B' ? T(l, 'Vater', 'father') : T(l, 'niemand', 'nobody'));
    return { head: [T(l, 'Ausgleich im Monat', 'Monthly balancing payment'), eur(r.ausgleich, l)], rows: [[T(l, 'Zahlt', 'Paid by'), wer(r.ausgleichZahlt)], [T(l, 'Barbedarf des Kindes', 'Child’s cash need'), eur(r.barbedarf, l)], [T(l, 'Haftungsanteil Mutter', 'Mother’s share'), eur(r.anteilA, l)], [T(l, 'Haftungsanteil Vater', 'Father’s share'), eur(r.anteilB, l)]] as Rows, note: T(l, 'Kindergeld bezieht hier der Vater; Mehrkosten des Wechselmodells nicht eingerechnet.', 'Here the father receives child benefit; extra costs of shared care not included.') }; },
});
