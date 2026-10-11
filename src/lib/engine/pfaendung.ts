/**
 * Pfändbares Arbeitseinkommen nach § 850c ZPO mit den Beträgen der Pfändungsfreigrenzenbekanntmachung 2026
 * (gültig ab 1. Juli 2026) und Freibetrag des P-Kontos nach §§ 899, 902 ZPO.
 * Der Motor reproduziert jede Zeile der amtlichen Monatstabelle (Test: tests/engine.test.ts).
 */
import { P, r2 } from './params';

export type Periode = 'monat' | 'woche' | 'tag';
export interface PfaendungOut {
  netto: number; personen: number; freibetrag: number; abgerundet: number; ueberObergrenze: number;
  anteilPfaendbar: number; pfaendbar: number; verbleibt: number; obergrenze: number;
}
const Z = P.pfaendung;

export function freibetrag(personen: number, periode: Periode = 'monat'): number {
  const w = Z[periode];
  const n = Math.max(0, Math.min(Z.max_personen, Math.round(personen)));
  return r2(w.grundfreibetrag + (n >= 1 ? w.erste_person : 0) + Math.max(0, n - 1) * w.weitere_person);
}

export function pfaendbar(netto: number, personen: number, periode: Periode = 'monat'): PfaendungOut {
  const w = Z[periode];
  const n = Math.max(0, Math.min(Z.max_personen, Math.round(personen)));
  const x = Math.max(0, netto);
  const ueber = Math.max(0, x - w.obergrenze);
  const basis = Math.min(x, w.obergrenze);
  // § 850c Abs. 5 ZPO: abrunden auf ein Vielfaches von 10 € (Woche 2,50 €, Tag 0,50 €).
  const ab = Math.floor(basis / w.rundung + 1e-9) * w.rundung;
  const frei = freibetrag(n, periode);
  const anteil = 1 - Z.unpfaendbar_zehntel[n] / 10;
  const p = r2(Math.max(0, ab - frei) * anteil + ueber);
  return { netto: x, personen: n, freibetrag: frei, abgerundet: r2(ab), ueberObergrenze: r2(ueber), anteilPfaendbar: anteil, pfaendbar: p, verbleibt: r2(x - p), obergrenze: w.obergrenze };
}

/** P-Konto: Grundfreibetrag (aufgerundet auf volle 10 €) plus Erhöhungsbeträge und Kindergeld (§§ 899, 902 ZPO). */
export function pKonto(personen: number, kindergeldKinder = 0): { grund: number; erhoehung: number; kindergeld: number; summe: number } {
  const w = Z.monat;
  const grund = Math.ceil(w.grundfreibetrag / P.pkonto.rundung) * P.pkonto.rundung;
  const n = Math.max(0, Math.min(Z.max_personen, Math.round(personen)));
  const erh = r2((n >= 1 ? w.erste_person : 0) + Math.max(0, n - 1) * w.weitere_person);
  const kg = Math.max(0, Math.round(kindergeldKinder)) * P.kindergeld.monat;
  return { grund, erhoehung: erh, kindergeld: kg, summe: r2(grund + erh + kg) };
}

/** Einkommen, ab dem bei n Unterhaltspflichten erstmals etwas pfändbar ist (Beginn der Tabellenzeile). */
export const pfaendbarAb = (personen: number) => Math.floor(freibetrag(personen) / Z.monat.rundung) * Z.monat.rundung + Z.monat.rundung;
