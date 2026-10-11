import { P } from '../engine/params';
import { famgkgGebuehr, rvgGebuehr } from '../engine/kosten';
import { T, eur, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Kosten eines Unterhaltsverfahrens', 'Cost of maintenance proceedings'),
  cta: T(l, 'Unterhaltsrechner', 'Maintenance calculator'),
  inputs: [{ id: 'm', label: T(l, 'Geforderter Unterhalt pro Monat', 'Maintenance claimed per month'), def: 450, unit: '€', max: 50000 }, { id: 'r', label: T(l, 'Rückstand bei Antrag', 'Arrears when filing'), def: 0, unit: '€', max: 1000000 }],
  run: ({ m, r }: Record<string, number>) => { const wert = 12 * m + r; const g = P.famgkg.kv1220_satz * famgkgGebuehr(wert); const R = P.rvg; const geb = (R.vv3100 + R.vv3104) * rvgGebuehr(wert); const anw = (geb + Math.min(R.vv7002_max, R.vv7002_anteil * geb)) * (1 + R.ust);
    return { head: [T(l, 'Verfahrenswert', 'Value of proceedings'), eur(wert, l)], rows: [[T(l, 'Gerichtsgebühr (3,0)', 'Court fee (3.0)'), eur(g, l)], [T(l, 'Ein Anwalt brutto', 'One lawyer incl. VAT'), eur(anw, l)]] as Rows, note: T(l, 'Zwölf Monatsbeträge plus Rückstand (§ 51 FamGKG); Gerichtsgebühr 3,0 im Verfahren über Unterhalt (KV 1220).', 'Twelve monthly amounts plus arrears (section 51 FamGKG); court fee 3.0 in maintenance proceedings (schedule no. 1220).') }; },
});
