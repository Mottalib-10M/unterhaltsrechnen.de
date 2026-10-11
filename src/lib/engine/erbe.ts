/**
 * Gesetzliche Erbfolge (§§ 1924, 1925, 1931, 1371 BGB), Pflichtteil (§ 2303 BGB),
 * Pflichtteilsergänzung (§ 2325 BGB) und Erbschaftsteuer (§§ 10, 13, 15, 16, 17, 19 ErbStG).
 */
import { P, r2 } from './params';

export type Gueterstand = 'zugewinn' | 'trennung' | 'gemeinschaft';
export interface ErbfolgeIn {
  verheiratet: boolean;
  gueterstand?: Gueterstand;
  /** Lebende Kinder (an die Stelle eines verstorbenen Kindes treten dessen Kinder, § 1924 Abs. 3). */
  kinder: number;
  /** Lebende Eltern des Erblassers (nur ohne Kinder relevant). */
  elternLebend?: 0 | 1 | 2;
  /** Vollbürtige Geschwister (treten an die Stelle eines verstorbenen Elternteils). */
  geschwister?: number;
  /** Großeltern oder deren Abkömmlinge vorhanden (dritte Ordnung). */
  grosseltern?: boolean;
  nachlass: number;
}
export interface ErbAnteil { wer: 'ehegatte' | 'kind' | 'elternteil' | 'geschwister' | 'grosseltern' | 'staat'; anzahl: number; quoteJe: number; betragJe: number; pflichtteilJe: number }
export interface ErbfolgeOut { ordnung: 1 | 2 | 3 | 0; anteile: ErbAnteil[]; ehegatteBasis: number; ehegatteErhoehung: number; kleinerPflichtteilEhegatte: number }

export function erbfolge(x: ErbfolgeIn): ErbfolgeOut {
  const E = P.erbrecht;
  const N = Math.max(0, x.nachlass);
  const gs = x.gueterstand ?? 'zugewinn';
  const k = Math.max(0, Math.round(x.kinder));
  const el = x.elternLebend ?? 0, ge = Math.max(0, Math.round(x.geschwister ?? 0));
  const ord: 0 | 1 | 2 | 3 = k > 0 ? 1 : el > 0 || ge > 0 ? 2 : x.grosseltern ? 3 : 0;
  let basis = 0, erh = 0;
  if (x.verheiratet) {
    basis = ord === 1 ? E.ehegatte_neben_ordnung1 : ord === 2 || ord === 3 ? E.ehegatte_neben_ordnung2 : 1;
    if (gs === 'zugewinn' && ord !== 0) erh = E.zugewinn_viertel;
    // § 1931 Abs. 4 BGB: Gütertrennung, ein oder zwei Kinder: gleiche Teile.
    if (gs === 'trennung' && ord === 1 && k <= E.guetertrennung_kinder_max_gleich) basis = 1 / (k + 1);
  }
  const eh = x.verheiratet ? basis + erh : 0;
  const rest = 1 - eh;
  const pq = E.pflichtteil_quote;
  const out: ErbAnteil[] = [];
  const add = (wer: ErbAnteil['wer'], anzahl: number, q: number, pflicht: boolean) => out.push({ wer, anzahl, quoteJe: q, betragJe: r2(q * N), pflichtteilJe: pflicht ? r2(q * pq * N) : 0 });
  if (x.verheiratet) add('ehegatte', 1, eh, true);
  if (ord === 1) add('kind', k, rest / k, true);
  else if (ord === 2) {
    if (el === 2) add('elternteil', 2, rest / 2, true);
    else if (el === 1 && ge > 0) { add('elternteil', 1, rest / 2, true); add('geschwister', ge, rest / 2 / ge, false); }
    else if (el === 1) add('elternteil', 1, rest, true);
    else add('geschwister', ge, rest / ge, false);
  } else if (ord === 3) add('grosseltern', 1, rest, false);
  else if (!x.verheiratet) add('staat', 1, 1, false);
  // § 1371 Abs. 2 BGB: wird der Ehegatte enterbt, Pflichtteil aus dem nicht erhöhten Erbteil (plus Zugewinnausgleich).
  const klein = x.verheiratet ? r2(basis * pq * N) : 0;
  return { ordnung: ord, anteile: out, ehegatteBasis: basis, ehegatteErhoehung: erh, kleinerPflichtteilEhegatte: klein };
}

/** § 2325 Abs. 3 BGB: im ersten Jahr voll, danach je Jahr ein Zehntel weniger; nach zehn Jahren nichts. */
export function ergaenzungsfaktor(jahreSeitSchenkung: number, anEhegatten = false): number {
  if (anEhegatten) return 1;
  const j = Math.floor(Math.max(0, jahreSeitSchenkung));
  return Math.max(0, 1 - P.erbrecht.ergaenzung_abschmelzung_jahr * j);
}
export function pflichtteilsergaenzung(schenkung: number, jahre: number, pflichtteilsquote: number, anEhegatten = false) {
  const f = ergaenzungsfaktor(jahre, anEhegatten);
  const angerechnet = r2(Math.max(0, schenkung) * f);
  return { faktor: f, angerechnet, ergaenzung: r2(angerechnet * pflichtteilsquote) };
}

/* -------------------------------------------------------------- Erbschaftsteuer */
export type Beziehung = 'ehegatte' | 'kind' | 'enkel_kind_verstorben' | 'enkel' | 'eltern' | 'geschwister' | 'nichte_neffe' | 'stiefeltern' | 'schwiegerkind' | 'schwiegereltern' | 'geschieden' | 'sonstige';
export const BEZIEHUNGEN: Beziehung[] = ['ehegatte', 'kind', 'enkel_kind_verstorben', 'enkel', 'eltern', 'geschwister', 'nichte_neffe', 'stiefeltern', 'schwiegerkind', 'schwiegereltern', 'geschieden', 'sonstige'];
export type Klasse = 'I' | 'II' | 'III';
export function steuerklasse(b: Beziehung, erbfall = true): Klasse {
  if (['ehegatte', 'kind', 'enkel_kind_verstorben', 'enkel'].includes(b)) return 'I';
  if (b === 'eltern') return erbfall ? 'I' : 'II';
  if (b === 'sonstige') return 'III';
  return 'II';
}
export function persoenlicherFreibetrag(b: Beziehung, erbfall = true): number {
  const F = P.erbst.freibetrag;
  switch (b) {
    case 'ehegatte': return F.ehegatte;
    case 'kind': return F.kind;
    case 'enkel_kind_verstorben': return F.enkel_kind_verstorben;
    case 'enkel': return F.enkel;
    case 'eltern': return erbfall ? F.eltern_erbfall : F.stk2;
    case 'sonstige': return F.stk3;
    default: return F.stk2;
  }
}
export function versorgungsfreibetrag(b: Beziehung, alterKind?: number): number {
  if (b === 'ehegatte') return P.erbst.versorgung_ehegatte;
  if (b === 'kind' && alterKind !== undefined) {
    const a = Math.max(0, alterKind);
    for (const [bis, betrag] of P.erbst.versorgung_kind) if (a <= bis && !(bis === 27 && a >= 27)) return betrag;
  }
  return 0;
}
/** Steuer nach § 19 Abs. 1 mit Härteausgleich nach § 19 Abs. 3 ErbStG. */
export function steuerNachTarif(stpfl: number, k: Klasse): { satz: number; steuer: number; haerteausgleich: boolean } {
  const S = P.erbst;
  const x = Math.max(0, stpfl);
  const i = S.stufen_bis.findIndex((g) => x <= g);
  const idx = i === -1 ? S.stufen_bis.length : i;
  const satz = S.saetze[k][idx];
  let steuer = x * satz;
  let haerte = false;
  if (idx > 0) {
    const prev = S.stufen_bis[idx - 1];
    const prevSatz = S.saetze[k][idx - 1];
    if (satz > prevSatz) {
      const stPrev = prev * prevSatz;
      const erlaubt = (x - prev) * (satz <= 0.3 ? S.haerte_bis_30 : S.haerte_ueber_30);
      if (steuer - stPrev > erlaubt) { steuer = stPrev + erlaubt; haerte = true; }
    }
  }
  return { satz, steuer: Math.floor(steuer + 1e-6), haerteausgleich: haerte };
}
export interface ErbStIn { erwerb: number; beziehung: Beziehung; erbfall: boolean; alterKind?: number; hausrat?: number; nachlasskosten?: number; vorerwerbe?: number }
export interface ErbStOut {
  klasse: Klasse; freibetrag: number; versorgung: number; hausratFrei: number; kosten: number;
  steuerpflichtig: number; satz: number; steuer: number; haerteausgleich: boolean; effektiv: number;
}
export function erbschaftsteuer(x: ErbStIn): ErbStOut {
  const S = P.erbst;
  const k = steuerklasse(x.beziehung, x.erbfall);
  const fb = persoenlicherFreibetrag(x.beziehung, x.erbfall);
  const vf = x.erbfall ? versorgungsfreibetrag(x.beziehung, x.alterKind) : 0;
  const hausratMax = k === 'I' ? S.hausrat_stk1 : S.hausrat_stk23;
  const hf = Math.min(Math.max(0, x.hausrat ?? 0), hausratMax);
  const kosten = x.erbfall ? Math.max(S.erbfallkosten_pauschale, Math.max(0, x.nachlasskosten ?? 0)) : 0;
  const gesamt = Math.max(0, x.erwerb) + Math.max(0, x.vorerwerbe ?? 0);
  const roh = Math.max(0, gesamt - hf - kosten - fb - vf);
  const stpfl = Math.floor(roh / S.rundung + 1e-9) * S.rundung;
  const t = steuerNachTarif(stpfl, k);
  return { klasse: k, freibetrag: fb, versorgung: vf, hausratFrei: hf, kosten, steuerpflichtig: stpfl, satz: t.satz, steuer: t.steuer, haerteausgleich: t.haerteausgleich, effektiv: x.erwerb > 0 ? t.steuer / Math.max(1, gesamt) : 0 };
}
