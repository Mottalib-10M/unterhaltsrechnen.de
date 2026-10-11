import { scheidungskosten } from '../engine/kosten';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Verfahrenswert der Scheidung', 'Value of the divorce proceedings'),
  cta: T(l, 'Scheidungskosten-Rechner', 'Divorce cost calculator'),
  inputs: [{ id: 'n', label: T(l, 'Netto beider Ehegatten zusammen', 'Both spouses’ net income combined'), def: 4200, unit: '€', max: 200000 }, { id: 'v', label: T(l, 'Anrechte im Versorgungsausgleich', 'Pension entitlements'), def: 2, options: zahlOpt(0, 6, l) }],
  run: ({ n, v }: Record<string, number>) => { const r = scheidungskosten({ netto1: n, netto2: 0, anrechte: v, anwaelte: 1 });
    return { head: [T(l, 'Verfahrenswert', 'Value of proceedings'), eur(r.gesamtWert, l)], rows: [[T(l, 'Ehesache (3 Monatsnetto)', 'Divorce (3 months’ net)'), eur(r.eheWert, l)], [T(l, 'Versorgungsausgleich', 'Pension splitting'), eur(r.vaWert, l)]] as Rows }; },
});
