/** Zugewinnausgleich (§§ 1373 bis 1378 BGB) und Versorgungsausgleich (§§ 1, 18 VersAusglG). */
import { P, r2 } from './params';

export interface ZugewinnIn { anfangA: number; endA: number; anfangB: number; endB: number }
export interface ZugewinnOut { zugewinnA: number; zugewinnB: number; ueberschuss: number; forderung: number; berechtigt: 'A' | 'B' | null; gekappt: boolean }
/** Zugewinn = Endvermögen minus Anfangsvermögen, nie negativ (§ 1373); die Hälfte des Überschusses steht dem anderen zu (§ 1378 Abs. 1),
 *  begrenzt durch das bei Beendigung vorhandene Vermögen des Pflichtigen (§ 1378 Abs. 2). Anfangs- und Endvermögen dürfen negativ sein. */
export function zugewinnausgleich(x: ZugewinnIn): ZugewinnOut {
  const zA = Math.max(0, x.endA - x.anfangA), zB = Math.max(0, x.endB - x.anfangB);
  const ue = Math.abs(zA - zB);
  const berechtigt: 'A' | 'B' | null = zA > zB ? 'B' : zB > zA ? 'A' : null;
  const roh = ue / 2;
  const endPfl = berechtigt === 'B' ? x.endA : berechtigt === 'A' ? x.endB : 0;
  const f = Math.min(roh, Math.max(0, endPfl));
  return { zugewinnA: r2(zA), zugewinnB: r2(zB), ueberschuss: r2(ue), forderung: r2(f), berechtigt, gekappt: f < roh - 0.005 };
}

export interface VaIn { renteA: number; renteB: number; kapitalA: number; kapitalB: number }
export interface VaOut {
  ausgleichRenteA: number; ausgleichRenteB: number; differenzRente: number; geringRente: boolean; grenzeRente: number;
  ausgleichKapitalA: number; ausgleichKapitalB: number; differenzKapital: number; geringKapital: boolean; grenzeKapital: number;
}
/** Ausgleichswert = Hälfte des Ehezeitanteils (§ 1 Abs. 2); Geringfügigkeit nach § 18 Abs. 3 mit der Bezugsgröße 2026. */
export function versorgungsausgleich(x: VaIn): VaOut {
  const V = P.versorgungsausgleich;
  const gR = r2(V.bezugsgroesse_monat * V.bagatelle_rente_anteil), gK = r2(V.bezugsgroesse_monat * V.bagatelle_kapital_anteil);
  const aRA = r2(Math.max(0, x.renteA) / 2), aRB = r2(Math.max(0, x.renteB) / 2);
  const aKA = r2(Math.max(0, x.kapitalA) / 2), aKB = r2(Math.max(0, x.kapitalB) / 2);
  const dR = r2(Math.abs(aRA - aRB)), dK = r2(Math.abs(aKA - aKB));
  return {
    ausgleichRenteA: aRA, ausgleichRenteB: aRB, differenzRente: dR, geringRente: (aRA > 0 || aRB > 0) && dR <= gR, grenzeRente: gR,
    ausgleichKapitalA: aKA, ausgleichKapitalB: aKB, differenzKapital: dK, geringKapital: (aKA > 0 || aKB > 0) && dK <= gK, grenzeKapital: gK,
  };
}
