import { P } from '../engine/params';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Welcher Selbstbehalt gilt für Sie?', 'Which self-retention applies to you?'),
  cta: T(l, 'Kindesunterhalt mit Selbstbehalt rechnen', 'Calculate child support with the self-retention'),
  inputs: [{ id: 'p', label: T(l, 'Unterhalt für', 'Maintenance for'), def: 0, options: [{ value: '0', label: T(l, 'minderjährige Kinder', 'minor children') }, { value: '1', label: T(l, 'volljährige Kinder', 'adult children') }, { value: '2', label: T(l, 'Ehegatten', 'a spouse') }, { value: '3', label: T(l, 'Eltern', 'parents') }] }, { id: 'e', label: T(l, 'Erwerbstätig?', 'Working?'), def: 1, options: [{ value: '1', label: T(l, 'Ja', 'Yes') }, { value: '0', label: T(l, 'Nein', 'No') }] }, { id: 'n', label: T(l, 'Ihr bereinigtes Netto', 'Your adjusted net income'), def: 2400, unit: '€', max: 100000 }],
  run: ({ p, e, n }: Record<string, number>) => { const S = P.selbstbehalt;
    const sb = p === 0 ? (e ? S.notwendig_erwerbstaetig : S.notwendig_nicht_erwerbstaetig) : p === 1 ? S.angemessen : p === 2 ? (e ? S.ehegatte_erwerbstaetig : S.ehegatte_nicht_erwerbstaetig) : S.eltern + Math.max(0, n - S.eltern) * S.eltern_anrechnungsfrei_anteil;
    return { head: [T(l, 'Selbstbehalt', 'Self-retention'), eur(Math.min(sb, Math.max(n, sb)), l)], rows: [[T(l, 'Verfügbar für Unterhalt', 'Available for maintenance'), eur(Math.max(0, n - sb), l)], [T(l, 'Warmmiete darin', 'Warm rent included'), eur(p === 0 ? S.notwendig_warmmiete : p === 1 ? S.angemessen_warmmiete : p === 2 ? S.ehegatte_warmmiete : S.eltern_warmmiete, l)]] as Rows }; },
});
