/**
 * Ehegatten- und Trennungsunterhalt (Anm. B DT 2026, Nr. 15.2 Leitlinien NRW), Volljährigenunterhalt
 * (Nr. 13 Leitlinien NRW), Wechselmodell (Nr. 12.3 und 14 Leitlinien, BGH XII ZB 565/15),
 * Elternunterhalt (Anm. D I DT, § 94 Abs. 1a SGB XII) und Unterhaltsvorschuss (§§ 1, 2 UVG).
 */
import { P, r2 } from './params';
import { bedarf, gruppeVon, stufeVonAlter, zahlbetrag, type Stufe } from './dt';

const KG = P.kindergeld.monat;

/* ------------------------------------------------------------------ Ehegatte */
export interface EhegatteIn {
  /** Bereinigtes Erwerbseinkommen des Pflichtigen (netto, nach berufsbedingten Aufwendungen). */
  pflichtigErwerb: number;
  pflichtigSonstige?: number;
  berechtigtErwerb?: number;
  berechtigtSonstige?: number;
  /** Bereits gezahlter Kindesunterhalt (Zahlbeträge), vorab abzuziehen. */
  kindesunterhalt?: number;
  pflichtigErwerbstaetig?: boolean;
}
export interface EhegatteOut {
  basisPflichtig: number;
  quote: number;
  bedarfQuote: number;
  selbstbehalt: number;
  leistungsfaehig: number;
  unterhalt: number;
  begrenztDurchSelbstbehalt: boolean;
  familieneinkommen: number;
  konkreterBedarfMoeglich: boolean;
  verbleibtPflichtig: number;
}
export function ehegattenunterhalt(x: EhegatteIn): EhegatteOut {
  const E = P.ehegatte;
  const erw = x.pflichtigErwerbstaetig ?? true;
  const ku = Math.max(0, x.kindesunterhalt ?? 0);
  const pS = Math.max(0, x.pflichtigSonstige ?? 0), bE = Math.max(0, x.berechtigtErwerb ?? 0), bS = Math.max(0, x.berechtigtSonstige ?? 0);
  const basisP = Math.max(0, x.pflichtigErwerb - ku);
  const q = erw ? E.quote_erwerb : E.quote_nicht_erwerbstaetig;
  // Anm. B I 1 b DT: 45 % der Differenz der Erwerbseinkommen, Halbteilung der sonstigen Einkünfte.
  const quote = r2(q * (basisP - bE) + E.quote_sonstige * (pS - bS));
  const sb = erw ? P.selbstbehalt.ehegatte_erwerbstaetig : P.selbstbehalt.ehegatte_nicht_erwerbstaetig;
  const leistungsfaehig = r2(Math.max(0, basisP + pS - sb));
  const u = Math.max(0, Math.min(Math.max(0, quote), leistungsfaehig));
  const fam = r2(basisP + pS + bE + bS);
  return {
    basisPflichtig: r2(basisP), quote: Math.max(0, quote), bedarfQuote: r2(Math.max(0, quote) + bE + bS), selbstbehalt: sb, leistungsfaehig,
    unterhalt: r2(u), begrenztDurchSelbstbehalt: quote > leistungsfaehig, familieneinkommen: fam,
    konkreterBedarfMoeglich: fam > E.konkreter_bedarf_ab_familieneinkommen, verbleibtPflichtig: r2(basisP + pS - u),
  };
}

/* ------------------------------------------------------------- Volljährige */
export interface VolljaehrigIn {
  einkommenA: number;
  einkommenB: number;
  /** Eigener Haushalt (Studium, Ausbildung auswärts): Regelbedarf 990 €. */
  eigenerHaushalt: boolean;
  /** Anzurechnendes Einkommen des Kindes (BAföG, Ausbildungsvergütung nach Abzug von 100 €). */
  eigenesEinkommen?: number;
  /** Unter 21, Schule, im Haushalt eines Elternteils (§ 1603 Abs. 2 Satz 2 BGB). */
  privilegiert?: boolean;
  /** Abweichender Bedarf bei eigenem Haushalt (Anm. A IV DT: nach oben möglich). */
  bedarfAbweichend?: number;
}
export interface VolljaehrigOut {
  bedarf: number; gruppe: number | null; restbedarf: number; sockel: number;
  haftungA: number; haftungB: number; quoteA: number; quoteB: number;
  anteilA: number; anteilB: number; kappungA: boolean; kappungB: boolean; ungedeckt: number;
}
export function volljaehrigenunterhalt(x: VolljaehrigIn): VolljaehrigOut {
  const A = Math.max(0, x.einkommenA), B = Math.max(0, x.einkommenB);
  const g = x.eigenerHaushalt ? null : gruppeVon(A + B);
  const bed = x.eigenerHaushalt ? Math.max(P.dt.student_bedarf, x.bedarfAbweichend ?? 0) : bedarf(g!, 3);
  const rest = Math.max(0, bed - KG - Math.max(0, x.eigenesEinkommen ?? 0));
  const calc = (sockel: number) => {
    const hA = Math.max(0, A - sockel), hB = Math.max(0, B - sockel), s = hA + hB;
    const qA = s > 0 ? hA / s : 0, qB = s > 0 ? hB / s : 0;
    let aA = Math.min(rest * qA, hA), aB = Math.min(rest * qB, hB);
    // Nr. 13.1 Abs. 1 Leitlinien NRW: höchstens der Betrag nach dem eigenen Einkommen allein (nur bei Kind im Elternhaushalt).
    const capA = x.eigenerHaushalt ? Infinity : zahlbetrag(gruppeVon(A), 3);
    const capB = x.eigenerHaushalt ? Infinity : zahlbetrag(gruppeVon(B), 3);
    const kA = aA > capA, kB = aB > capB;
    aA = Math.min(aA, capA); aB = Math.min(aB, capB);
    return { sockel, hA, hB, qA, qB, aA, aB, kA, kB };
  };
  let c = calc(P.leitlinien.sockel_volljaehrig);
  // Nr. 13.3 Abs. 3: bei privilegierten Volljährigen Sockel bis zum notwendigen Selbstbehalt, wenn der Bedarf sonst offen bleibt.
  if (x.privilegiert && c.aA + c.aB < rest - 0.005) c = calc(P.selbstbehalt.notwendig_erwerbstaetig);
  return {
    bedarf: bed, gruppe: g, restbedarf: r2(rest), sockel: c.sockel, haftungA: r2(c.hA), haftungB: r2(c.hB),
    quoteA: c.qA, quoteB: c.qB, anteilA: r2(c.aA), anteilB: r2(c.aB), kappungA: c.kA, kappungB: c.kB, ungedeckt: r2(Math.max(0, rest - c.aA - c.aB)),
  };
}

/* ------------------------------------------------------------ Wechselmodell */
export interface WechselIn { einkommenA: number; einkommenB: number; alter: number; mehrbedarf?: number; kindergeldAn: 'A' | 'B' }
export interface WechselOut {
  stufe: Stufe; gruppe: number; tabellenbedarf: number; gesamtbedarf: number; barbedarf: number;
  quoteA: number; quoteB: number; anteilA: number; anteilB: number; spitze: number; zahlt: 'A' | 'B' | null;
  kgWeitergabe: number; ausgleich: number; ausgleichZahlt: 'A' | 'B' | null;
}
/**
 * Paritätisches Wechselmodell: Bedarf nach dem zusammengerechneten Einkommen plus Mehrkosten, hälftiges
 * Kindergeld auf den Barbedarf, Haftung nach Einkommen über dem angemessenen Selbstbehalt; zu zahlen ist
 * die Hälfte der Differenz der Haftungsanteile. Die Betreuungshälfte des Kindergeldes wird hälftig
 * geteilt, die Barhälfte nach Quote (Nr. 14 Abs. 2 Leitlinien NRW).
 */
export function wechselmodell(x: WechselIn): WechselOut {
  const A = Math.max(0, x.einkommenA), B = Math.max(0, x.einkommenB);
  const s = stufeVonAlter(Math.min(17, x.alter));
  const g = gruppeVon(A + B);
  const tb = bedarf(g, s);
  const ges = tb + Math.max(0, x.mehrbedarf ?? 0);
  const bar = Math.max(0, ges - KG / 2);
  const sock = P.leitlinien.sockel_volljaehrig;
  const hA = Math.max(0, A - sock), hB = Math.max(0, B - sock), sum = hA + hB;
  const qA = sum > 0 ? hA / sum : 0.5, qB = 1 - qA;
  const aA = bar * qA, aB = bar * qB;
  const spitze = Math.abs(aA - aB) / 2;
  const zahlt: 'A' | 'B' | null = aA > aB ? 'A' : aB > aA ? 'B' : null;
  // Kindergeld: wer es bezieht, gibt Betreuungsanteil (KG/4) und Baranteil des anderen (KG/2 × Quote) weiter.
  const qAndere = x.kindergeldAn === 'A' ? qB : qA;
  const kgW = KG / 4 + (KG / 2) * qAndere;
  // Verrechnung: Zahlung der Unterhaltsspitze und Kindergeldweitergabe gegeneinander.
  const netto = (zahlt === 'A' ? spitze : zahlt === 'B' ? -spitze : 0) + (x.kindergeldAn === 'A' ? kgW : -kgW);
  return {
    stufe: s, gruppe: g, tabellenbedarf: tb, gesamtbedarf: r2(ges), barbedarf: r2(bar), quoteA: qA, quoteB: qB,
    anteilA: r2(aA), anteilB: r2(aB), spitze: r2(spitze), zahlt, kgWeitergabe: r2(kgW),
    ausgleich: r2(Math.abs(netto)), ausgleichZahlt: netto > 0.004 ? 'A' : netto < -0.004 ? 'B' : null,
  };
}

/* ----------------------------------------------------------- Elternunterhalt */
export interface ElternIn { nettoBereinigt: number; jahresbrutto: number; luecke: number; verheiratet?: boolean; nettoEhegatte?: number }
export interface ElternOut { rueckgriffMoeglich: boolean; grenze: number; selbstbehalt: number; leistungsfaehig: number; unterhalt: number }
/** Anm. D I DT 2026: Selbstbehalt 2.650 € plus 70 % des Mehreinkommens; Sozialamt nur über 100.000 € Jahreseinkommen. */
export function elternunterhalt(x: ElternIn): ElternOut {
  const S = P.selbstbehalt;
  const grenze = P.elternunterhalt.jahreseinkommensgrenze;
  const n = Math.max(0, x.nettoBereinigt);
  const ueber = Math.max(0, n - S.eltern);
  const sb = S.eltern + ueber * S.eltern_anrechnungsfrei_anteil;
  const lf = r2(Math.max(0, n - sb));
  const rueck = x.jahresbrutto > grenze;
  return { rueckgriffMoeglich: rueck, grenze, selbstbehalt: r2(Math.min(n, sb)), leistungsfaehig: lf, unterhalt: rueck ? r2(Math.min(lf, Math.max(0, x.luecke))) : 0 };
}

/* -------------------------------------------------------- Unterhaltsvorschuss */
export interface UvgIn { alter: number; unterhaltErhalten?: number; waisenbezuege?: number; ab12Voraussetzung?: boolean }
export interface UvgOut { berechtigt: boolean; stufe: Stufe | null; mindestunterhalt: number; kindergeldAbzug: number; leistung: number; grund: 'ok' | 'alter' | 'ab12' }
export function unterhaltsvorschuss(x: UvgIn): UvgOut {
  const U = P.uvg;
  const a = Math.floor(Math.max(0, x.alter));
  if (a >= U.alter_grenze) return { berechtigt: false, stufe: null, mindestunterhalt: 0, kindergeldAbzug: 0, leistung: 0, grund: 'alter' };
  if (a >= U.alter_grenze_ohne_bedingung && !x.ab12Voraussetzung) return { berechtigt: false, stufe: stufeVonAlter(a), mindestunterhalt: 0, kindergeldAbzug: 0, leistung: 0, grund: 'ab12' };
  const s = stufeVonAlter(a);
  const mu = P.mindestunterhalt.stufen[s];
  const l = Math.max(0, mu - KG - Math.max(0, x.unterhaltErhalten ?? 0) - Math.max(0, x.waisenbezuege ?? 0));
  return { berechtigt: l > 0, stufe: s, mindestunterhalt: mu, kindergeldAbzug: KG, leistung: r2(l), grund: 'ok' };
}
/** Volle Unterhaltsleistung je Altersstufe ohne Anrechnung (für Tabellen). */
export const uvgVoll = (s: 0 | 1 | 2) => P.mindestunterhalt.stufen[s] - KG;
