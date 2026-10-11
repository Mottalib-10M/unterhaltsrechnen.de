/** Gemeinsame Helfer der Mini-Rechner (vom Register ignoriert: Präfix „_“). */
import { formatMoney, formatPercent, formatNumber } from '../format';
export type L = 'de' | 'en';
export const T = <A>(l: L, de: A, en: A) => (l === 'en' ? en : de);
export const eur = (x: number, l: L, d?: number) => formatMoney(x, d ?? (Math.abs(x - Math.round(x)) > 0.004 ? 2 : 0), l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
/** Ja/Nein-Auswahl für Mini-Rechner (Wert 0 oder 1). */
export const janein = (l: L) => [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }];
export const zahlOpt = (von: number, bis: number, l: L, plus?: string) => Array.from({ length: bis - von + 1 }, (_, i) => ({ value: String(von + i), label: i + von === bis && plus ? `${bis} ${plus}` : String(von + i) }));
export const altersstufeOpt = (l: L) => [{ value: '0', label: T(l, '0 bis 5 Jahre', 'age 0 to 5') }, { value: '1', label: T(l, '6 bis 11 Jahre', 'age 6 to 11') }, { value: '2', label: T(l, '12 bis 17 Jahre', 'age 12 to 17') }, { value: '3', label: T(l, 'ab 18 Jahre', 'age 18+') }];
export type Rows = [string, string][];
