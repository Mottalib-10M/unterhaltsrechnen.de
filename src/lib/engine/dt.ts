/**
 * Düsseldorfer Tabelle 2026: Kindesunterhalt eines barunterhaltspflichtigen Elternteils.
 * Anm. A (Tabelle, Kindergeld, Bedarfskontrollbetrag, Selbstbehalt) und Anm. C (Mangelfall) der Tabelle,
 * § 1603, § 1609, § 1612a, § 1612b BGB. Alle Werte aus params-2026.json (Block „dt“ und „selbstbehalt“).
 */
import { P, r2 } from './params';

export type Stufe = 0 | 1 | 2 | 3;
const D = P.dt;
const KG = P.kindergeld.monat;
export const GRUPPEN = D.gruppen_bis.length; // 15

/** Altersstufe nach § 1612a Abs. 1 und 3 BGB: 0–5, 6–11, 12–17, ab 18. */
export function stufeVonAlter(alter: number): Stufe {
  const a = Math.max(0, Math.floor(alter));
  return (D.altersstufen.findIndex(([von, bis]) => a >= von && a <= bis) as Stufe);
}

/** Einkommensgruppe (0 = Gruppe 1) nach dem bereinigten Nettoeinkommen; über 11.200 € bleibt es bei Gruppe 15. */
export function gruppeVon(netto: number): number {
  const i = D.gruppen_bis.findIndex((g) => netto <= g);
  return i === -1 ? GRUPPEN - 1 : i;
}
export const ueberTabelle = (netto: number) => netto > D.gruppen_bis[GRUPPEN - 1];
export const gruppeVonBis = (g: number): [number, number] => [g === 0 ? 0 : D.gruppen_bis[g - 1] + 1, D.gruppen_bis[g]];

export const bedarf = (g: number, s: Stufe) => D.bedarf[Math.max(0, Math.min(GRUPPEN - 1, g))][s];
/** Kindergeldanteil nach § 1612b Abs. 1 BGB: Hälfte bei Minderjährigen (ein Elternteil betreut), voll bei Volljährigen. */
export const kgAnteil = (s: Stufe) => (s === 3 ? KG : KG / 2);
/** Zahlbetrag = Tabellenbedarf minus Kindergeldanteil (Anhang der Tabelle). */
export const zahlbetrag = (g: number, s: Stufe) => r2(bedarf(g, s) - kgAnteil(s));
export const bkb = (g: number, erwerbstaetig = true) => (g === 0 && !erwerbstaetig ? D.bkb_gruppe1_nicht_erwerbstaetig : D.bkb[Math.max(0, Math.min(GRUPPEN - 1, g))]);
export const notwendigerSelbstbehalt = (erwerbstaetig: boolean) => (erwerbstaetig ? P.selbstbehalt.notwendig_erwerbstaetig : P.selbstbehalt.notwendig_nicht_erwerbstaetig);

export interface Kind {
  alter: number;
  /** Volljährig, unter 21, im Haushalt eines Elternteils und in allgemeiner Schulausbildung (§ 1603 Abs. 2 Satz 2 BGB). */
  privilegiert?: boolean;
}
export interface KuOptionen {
  erwerbstaetig?: boolean;
  /** Herabstufung, bis der Bedarfskontrollbetrag gewahrt ist (Anm. A III). Standard: an. */
  bkb?: boolean;
  /** Ab- oder Zuschlag nach der Zahl der Berechtigten (Anm. A I, Tabelle auf zwei Berechtigte zugeschnitten). Standard: aus. */
  anzahlAnpassung?: boolean;
  /** Weitere Unterhaltsberechtigte (z. B. Ehegatte), die bei der Zahl der Berechtigten mitzählen. */
  weitereBerechtigte?: number;
  /** Erweiterter Umgang: Herabstufung um Gruppen (BGH, 15.04.2026, XII ZB 415/25). */
  umgangHerabstufung?: number;
  /** Erweiterter Umgang: Abzug vom Bedarf, typischerweise 0,10, höchstens 0,15 (ebenda). */
  umgangAbzug?: number;
}
export interface KindErgebnis { alter: number; stufe: Stufe; bedarf: number; kindergeld: number; tabellenZahlbetrag: number; zahlbetrag: number; rang: 1 | 4 }
export interface KuErgebnis {
  netto: number;
  gruppeEinkommen: number;
  gruppeNachAnzahl: number;
  gruppe: number;
  herabgestuftBkb: number;
  ueberTabelle: boolean;
  kinder: KindErgebnis[];
  summe: number;
  verbleibt: number;
  selbstbehalt: number;
  bkbWert: number;
  mangelfall: boolean;
  verteilungsmasse: number;
}

/**
 * Kindesunterhalt für ein oder mehrere Kinder. Reihenfolge: Gruppe nach Einkommen, optional Anpassung
 * nach Zahl der Berechtigten und Herabstufung wegen erweiterten Umgangs, dann Herabstufung bis zum
 * Bedarfskontrollbetrag, zuletzt Mangelfallprüfung gegen den notwendigen Selbstbehalt (Anm. C).
 * Nicht privilegierte Volljährige stehen im Rang 4 (§ 1609 Nr. 4 BGB) und erhalten nur, was über dem
 * angemessenen Selbstbehalt bleibt.
 */
export function kindesunterhalt(netto: number, kinder: Kind[], opt: KuOptionen = {}): KuErgebnis {
  const erw = opt.erwerbstaetig ?? true;
  const n = Math.max(0, netto);
  const g0 = gruppeVon(n);
  let g1 = g0;
  if (opt.anzahlAnpassung) {
    const anzahl = kinder.length + (opt.weitereBerechtigte ?? 0);
    if (anzahl > D.berechtigte_tabellenbasis) g1 = g0 - (anzahl - D.berechtigte_tabellenbasis);
    else if (anzahl > 0 && anzahl < D.berechtigte_tabellenbasis) g1 = g0 + (D.berechtigte_tabellenbasis - anzahl);
  }
  g1 = Math.max(0, Math.min(GRUPPEN - 1, g1 - Math.max(0, Math.round(opt.umgangHerabstufung ?? 0))));
  const abzug = Math.min(0.15, Math.max(0, opt.umgangAbzug ?? 0));
  const stufen = kinder.map((k) => stufeVonAlter(k.alter));
  const rang = (k: Kind, s: Stufe): 1 | 4 => (s < 3 || (k.privilegiert && k.alter < 21) ? 1 : 4);
  const zahlIn = (g: number, s: Stufe) => r2(bedarf(g, s) * (1 - abzug) - kgAnteil(s));
  const summeIn = (g: number) => stufen.reduce((sum, s) => sum + Math.max(0, zahlIn(g, s)), 0);
  let g = g1;
  if (opt.bkb ?? true) while (g > 0 && n - summeIn(g) < bkb(g, erw)) g--;
  const sb = notwendigerSelbstbehalt(erw);
  const kids: KindErgebnis[] = kinder.map((k, i) => {
    const s = stufen[i];
    const z = Math.max(0, zahlIn(g, s));
    return { alter: k.alter, stufe: s, bedarf: r2(bedarf(g, s) * (1 - abzug)), kindergeld: kgAnteil(s), tabellenZahlbetrag: z, zahlbetrag: z, rang: rang(k, s) };
  });
  // Rang 1: Mangelfall nach Anm. C.
  const r1 = kids.filter((k) => k.rang === 1);
  const sum1 = r1.reduce((s, k) => s + k.tabellenZahlbetrag, 0);
  let mangel = false;
  let masse = 0;
  if (sum1 > 0 && n - sum1 < sb) {
    mangel = true;
    masse = Math.max(0, n - sb);
    for (const k of r1) k.zahlbetrag = r2((k.tabellenZahlbetrag * masse) / sum1);
    // Rundungsrest (höchstens ein Cent je Kind) dem größten Anteil zuschlagen: verteilt wird genau die Masse.
    const rest = r2(masse - r1.reduce((s, k) => s + k.zahlbetrag, 0));
    if (rest !== 0) { const gr = r1.reduce((a, b) => (b.zahlbetrag > a.zahlbetrag ? b : a)); gr.zahlbetrag = r2(gr.zahlbetrag + rest); }
  }
  const bezahlt1 = r1.reduce((s, k) => s + k.zahlbetrag, 0);
  // Rang 4: nur aus dem Einkommen über dem angemessenen Selbstbehalt.
  const r4 = kids.filter((k) => k.rang === 4);
  const sum4 = r4.reduce((s, k) => s + k.tabellenZahlbetrag, 0);
  const frei4 = Math.max(0, n - bezahlt1 - P.selbstbehalt.angemessen);
  if (sum4 > frei4) for (const k of r4) k.zahlbetrag = sum4 > 0 ? r2((k.tabellenZahlbetrag * frei4) / sum4) : 0;
  const summe = r2(kids.reduce((s, k) => s + k.zahlbetrag, 0));
  return {
    netto: n, gruppeEinkommen: g0, gruppeNachAnzahl: g1, gruppe: g, herabgestuftBkb: g1 - g, ueberTabelle: ueberTabelle(n),
    kinder: kids, summe, verbleibt: r2(n - summe), selbstbehalt: sb, bkbWert: bkb(g, erw), mangelfall: mangel, verteilungsmasse: r2(masse),
  };
}

/** Kleinstes Nettoeinkommen (auf 10 € genau), ab dem für die gegebenen Kinder kein Mangelfall mehr vorliegt. */
export function mangelfallGrenze(kinder: Kind[], erwerbstaetig = true): number {
  const sb = notwendigerSelbstbehalt(erwerbstaetig);
  const sum = kinder.reduce((s, k) => s + (stufeVonAlter(k.alter) < 3 || k.privilegiert ? zahlbetrag(0, stufeVonAlter(k.alter)) : 0), 0);
  return Math.ceil((sb + sum) / 10) * 10;
}
