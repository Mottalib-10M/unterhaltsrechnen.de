/** Gemeinsame Bausteine der Rechner: Rechenzeilen, Ergebnis-Kopf, Rechenweg, Aktionen (Kopieren, Link, Drucken). */
import { useState } from 'react';
import { formatMoney, formatPercent, formatNumber } from '../../lib/format';

export type L = 'de' | 'en';
export const tx = <A,>(l: L, de: A, en: A) => (l === 'en' ? en : de);
export const fm = (l: L) => ({
  eur: (x: number, d = 0) => formatMoney(x, d, l),
  eur2: (x: number) => formatMoney(x, Number.isInteger(Math.round(x * 100) / 100) ? 0 : 2, l),
  pct: (x: number, d = 1) => formatPercent(x, d, l),
  num: (x: number, d = 0) => formatNumber(x, d, l),
});

export interface Zeile { label: string; value: string; strong?: boolean; muted?: boolean; sep?: boolean }
/** Zeilen einer Abrechnung: Bezeichnung links, Betrag rechts. */
export function Zeilen({ rows, caption }: { rows: Zeile[]; caption?: string }) {
  return (
    <table className="mt-3 w-full text-sm tabular-nums">
      {caption && <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{caption}</caption>}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={`${r.sep ? 'border-t-2 border-navy-800' : 'border-t border-navy-200'} ${r.strong ? 'font-semibold text-navy-900' : r.muted ? 'text-navy-600' : 'text-navy-800'}`}>
            <th scope="row" className="py-1.5 pr-3 text-left font-normal">{r.label}</th>
            <td className="whitespace-nowrap py-1.5 pl-2 text-right">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Rechenweg in Schritten, nummeriert: zeigt, welche Regel welche Zahl erzeugt. */
export function Rechenweg({ lang, steps }: { lang: L; steps: string[] }) {
  if (!steps.length) return null;
  return (
    <details className="mt-4 rounded-lg border border-navy-200 bg-white p-3 text-sm">
      <summary className="cursor-pointer font-semibold text-navy-900">{tx(lang, 'Rechenweg Schritt für Schritt', 'Step-by-step calculation')}</summary>
      <ol className="rechenweg mt-2 list-decimal pl-5 text-navy-800">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </details>
  );
}

export function Aktionen({ lang, text }: { lang: L; text: () => string }) {
  const [done, setDone] = useState('');
  const copy = (what: 'text' | 'link') => {
    const s = what === 'text' ? `${text()} · ${window.location.href}` : window.location.href;
    navigator.clipboard?.writeText(s).then(() => { setDone(what); setTimeout(() => setDone(''), 1500); });
  };
  const b = 'rounded-md border border-navy-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50';
  return (
    <div className="no-print mt-4 flex flex-wrap gap-2">
      <button type="button" className={b} onClick={() => copy('text')}>{done === 'text' ? tx(lang, 'Kopiert', 'Copied') : tx(lang, 'Ergebnis kopieren', 'Copy result')}</button>
      <button type="button" className={b} onClick={() => copy('link')}>{done === 'link' ? tx(lang, 'Link kopiert', 'Link copied') : tx(lang, 'Link teilen', 'Share link')}</button>
      <button type="button" className={b} onClick={() => window.print()}>{tx(lang, 'Drucken', 'Print')}</button>
    </div>
  );
}

/** Ergebnis-Kopf: eine große Zahl, eine Zeile darunter. */
export function Kopf({ label, wert, unter }: { label: string; wert: string; unter?: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 font-serif text-4xl font-bold text-navy-900">{wert}</p>
      {unter && <p className="tabular-nums mt-1 text-sm text-navy-700">{unter}</p>}
    </div>
  );
}

/** Hinweis im Ergebnis: Information, keine Rechtsberatung (RDG). */
export function Hinweis({ lang, methodHref }: { lang: L; methodHref?: string }) {
  return (
    <p className="mt-3 text-xs text-navy-600">
      {tx(lang, 'Berechnung nach den amtlichen Werten 2026, allgemeine Information ohne Prüfung Ihres Einzelfalls (keine Rechtsberatung). ', 'Calculated with the official 2026 values; general information without review of your individual case (not legal advice). ')}
      {methodHref && <a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a>}
    </p>
  );
}

export const kasten = 'mt-6 rounded-xl border border-accent-200 bg-accent-50/50 p-4 sm:p-5 lg:mt-0 lg:sticky lg:top-20';
export const rahmen = 'rechner not-prose overflow-hidden rounded-xl border border-navy-200 bg-white';
export const raster = 'p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6';
