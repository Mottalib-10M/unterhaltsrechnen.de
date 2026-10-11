/**
 * Scheidungskosten: Gerichtsgebühren nach FamGKG (§ 28, KV 1110), Anwaltsgebühren nach RVG (§ 13, VV 3100,
 * 3104, 1003, 7002, 7008), Verfahrenswert nach §§ 43, 44, 50 FamGKG; Prozess- und Verfahrenskostenhilfe
 * nach § 115 ZPO mit den Freibeträgen der PKHB 2026. Beide Gebührentabellen werden gegen Anlage 2 getestet.
 */
import { P, r2 } from './params';

type Tab = { basis_bis: number; basis_gebuehr: number; stufen: Array<Array<number | null>>; mindestgebuehr: number };
function wertgebuehr(t: Tab, wert: number): number {
  const w = Math.max(0, wert);
  let g = t.basis_gebuehr;
  let von = t.basis_bis;
  for (const [bis, schritt, betrag] of t.stufen as Array<[number | null, number, number]>) {
    if (w <= von) break;
    const oben = bis === null ? w : Math.min(w, bis);
    if (oben > von) g += Math.ceil((oben - von) / schritt - 1e-9) * betrag;
    if (bis === null) break;
    von = bis;
  }
  return r2(Math.max(t.mindestgebuehr, g));
}
/** Eine volle Gerichtsgebühr (1,0) nach § 28 FamGKG. */
export const famgkgGebuehr = (wert: number) => wertgebuehr(P.famgkg as Tab, wert);
/** Eine volle Anwaltsgebühr (1,0) nach § 13 RVG. */
export const rvgGebuehr = (wert: number) => wertgebuehr(P.rvg as Tab, wert);

export interface ScheidungIn {
  netto1: number;
  netto2: number;
  /** Zahl der Anrechte im Versorgungsausgleich (beide Ehegatten zusammen); 0 = kein Versorgungsausgleich. */
  anrechte: number;
  /** Abzug je Monat vom Nettoeinkommen (z. B. für Kinder), Gerichtspraxis, Ihre Annahme. */
  abzugMonat?: number;
  /** Zuschlag zum Verfahrenswert für Vermögen, Gerichtspraxis, Ihre Annahme. */
  vermoegenszuschlag?: number;
  /** Sorge- oder Umgangsrecht als Folgesache im Verbund (§ 44 Abs. 2 FamGKG). */
  kindschaftssachen?: number;
  /** Weitere Folgesachen (Unterhalt, Zugewinn …) mit ihrem Wert. */
  folgesachenWert?: number;
  anwaelte: 1 | 2;
  /** Einigung über anhängige Folgesachen: Wert, auf den die Einigungsgebühr VV 1003 fällt. */
  einigungWert?: number;
  ustPflichtig?: boolean;
}
export interface Gebuehrenblock { verfahren: number; termin: number; einigung: number; auslagen: number; netto: number; ust: number; brutto: number }
export interface ScheidungOut {
  eheWert: number; vaWert: number; kindWert: number; folgeWert: number; gesamtWert: number;
  gerichtsgebuehr: number; gerichtskosten: number; anwalt: Gebuehrenblock; anwaelte: 1 | 2; gesamt: number;
  antragsteller: number; antragsgegner: number;
}
export function scheidungskosten(x: ScheidungIn): ScheidungOut {
  const F = P.famgkg, R = P.rvg;
  const n3 = F.ehe_monate_netto * (Math.max(0, x.netto1) + Math.max(0, x.netto2));
  const eheRoh = n3 - F.ehe_monate_netto * Math.max(0, x.abzugMonat ?? 0) + Math.max(0, x.vermoegenszuschlag ?? 0);
  const eheWert = Math.min(F.ehe_hoechstwert, Math.max(F.ehe_mindestwert, eheRoh));
  const anr = Math.max(0, Math.round(x.anrechte));
  const vaWert = anr > 0 ? Math.max(F.va_mindestwert, F.va_prozent_je_anrecht * n3 * anr) : 0;
  const kindWert = Math.max(0, Math.round(x.kindschaftssachen ?? 0)) * Math.min(F.kindschaft_zuschlag * eheWert, F.kindschaft_zuschlag_max);
  const folgeWert = Math.max(0, x.folgesachenWert ?? 0);
  const gesamt = eheWert + vaWert + kindWert + folgeWert;
  const gg = famgkgGebuehr(gesamt);
  const gerichtskosten = r2(F.kv1110_satz * gg);
  const rv = rvgGebuehr(gesamt);
  const verfahren = r2(R.vv3100 * rv), termin = r2(R.vv3104 * rv);
  const ew = Math.min(Math.max(0, x.einigungWert ?? 0), gesamt);
  const einigung = ew > 0 ? r2(R.vv1003 * rvgGebuehr(ew)) : 0;
  const geb = verfahren + termin + einigung;
  const auslagen = r2(Math.min(R.vv7002_max, R.vv7002_anteil * geb));
  const netto = r2(geb + auslagen);
  const ust = (x.ustPflichtig ?? true) ? r2(netto * R.ust) : 0;
  const anwalt = { verfahren, termin, einigung, auslagen, netto, ust, brutto: r2(netto + ust) };
  const total = r2(gerichtskosten + anwalt.brutto * x.anwaelte);
  // § 150 Abs. 1 FamFG: Kosten gegeneinander aufgehoben: Gericht je zur Hälfte, jeder trägt seinen Anwalt.
  return {
    eheWert: r2(eheWert), vaWert: r2(vaWert), kindWert: r2(kindWert), folgeWert: r2(folgeWert), gesamtWert: r2(gesamt),
    gerichtsgebuehr: gg, gerichtskosten, anwalt, anwaelte: x.anwaelte, gesamt: total,
    antragsteller: r2(gerichtskosten / 2 + anwalt.brutto), antragsgegner: r2(gerichtskosten / 2 + (x.anwaelte === 2 ? anwalt.brutto : 0)),
  };
}

/* ------------------------------------------------- Prozess-/Verfahrenskostenhilfe */
export interface PkhIn {
  netto: number;
  erwerbstaetig: boolean;
  ehegatte?: boolean;
  einkommenEhegatte?: number;
  /** Alter der unterhaltsberechtigten Kinder. */
  kinder?: number[];
  wohnkosten: number;
  sonstigeBelastungen?: number;
}
export interface PkhOut { abzuege: Array<[string, number]>; einzusetzen: number; rate: number; ratenfrei: boolean; maxRaten: number; summeMax: number }
export function kinderFreibetrag(alter: number): number {
  const K = P.pkh;
  const a = Math.floor(Math.max(0, alter));
  return a < 6 ? K.kinder_bis_6 : a < 14 ? K.kinder_7_14 : a < 18 ? K.jugendliche_15_17 : K.erwachsene;
}
export function pkh(x: PkhIn): PkhOut {
  const K = P.pkh;
  const ab: Array<[string, number]> = [];
  if (x.erwerbstaetig) ab.push(['erwerb', K.erwerbstaetige]);
  ab.push(['partei', K.partei]);
  if (x.ehegatte) ab.push(['ehegatte', Math.max(0, K.ehegatte - Math.max(0, x.einkommenEhegatte ?? 0))]);
  for (const a of x.kinder ?? []) ab.push([`kind:${a}`, kinderFreibetrag(a)]);
  ab.push(['wohnen', Math.max(0, x.wohnkosten)]);
  if ((x.sonstigeBelastungen ?? 0) > 0) ab.push(['sonstige', Math.max(0, x.sonstigeBelastungen!)]);
  const einz = r2(Math.max(0, x.netto - ab.reduce((s, [, v]) => s + v, 0)));
  let rate = einz > K.rate_schwelle ? K.rate_sockel + (einz - K.rate_schwelle) : einz * K.rate_anteil;
  rate = Math.floor(rate + 1e-9);
  const frei = rate < K.rate_mindest;
  if (frei) rate = 0;
  return { abzuege: ab, einzusetzen: einz, rate, ratenfrei: frei, maxRaten: K.max_raten, summeMax: rate * K.max_raten };
}
