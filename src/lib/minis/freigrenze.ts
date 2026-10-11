import { P } from '../engine/params';
import { freibetrag, pfaendbarAb } from '../engine/pfaendung';
import { T, eur, zahlOpt, type L, type Rows } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihre Pfändungsfreigrenze', 'Your garnishment exemption limit'),
  cta: T(l, 'Pfändungsrechner', 'Garnishment calculator'),
  inputs: [{ id: 'p', label: T(l, 'Unterhaltspflichten', 'People you support'), def: 1, options: zahlOpt(0, 5, l, '+') }],
  run: ({ p }: Record<string, number>) => { const alt = P.pfaendung.vorjahr_monat; const altFrei = alt.grundfreibetrag + (p >= 1 ? alt.erste_person : 0) + Math.max(0, p - 1) * alt.weitere_person;
    return { head: [T(l, 'Freibetrag ab 1. Juli 2026', 'Exemption from 1 July 2026'), eur(freibetrag(p), l, 2)], rows: [[T(l, 'bis 30. Juni 2026', 'until 30 June 2026'), eur(altFrei, l, 2)], [T(l, 'Pfändbar erst ab Nettolohn', 'Garnishable only from net pay of'), eur(pfaendbarAb(p), l)]] as Rows }; },
});
