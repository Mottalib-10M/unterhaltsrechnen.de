/**
 * Düsseldorfer Tabelle 2026 zum Anklicken: Bedarf oder Zahlbetrag je Einkommensgruppe und Altersstufe,
 * Prozentsatz und Bedarfskontrollbetrag. Ein Klick auf eine Zelle erklärt, wie der Betrag entsteht.
 * Erster Rendervorgang = Gruppe 1, 6–11 Jahre (statisches HTML identisch, §17.5).
 */
import { useState } from 'react';
import { P } from '../../lib/engine/params';
import { bedarf, zahlbetrag, kgAnteil, gruppeVonBis, type Stufe } from '../../lib/engine/dt';
import { tx, fm, type L } from './kit';

export default function DtTabelle({ lang = 'de', rechnerHref }: { lang?: L; rechnerHref?: string }) {
  const f = fm(lang);
  const [modus, setModus] = useState<'zahl' | 'bedarf'>('zahl');
  const [sel, setSel] = useState<[number, Stufe]>([3, 1]);
  const stufen = [tx(lang, '0–5', '0–5'), tx(lang, '6–11', '6–11'), tx(lang, '12–17', '12–17'), tx(lang, 'ab 18', '18+')];
  const [g, s] = sel;
  const [von, bis] = gruppeVonBis(g);
  const wert = (gi: number, si: Stufe) => (modus === 'zahl' ? zahlbetrag(gi, si) : bedarf(gi, si));
  const btn = (m: 'zahl' | 'bedarf', label: string) => (
    <button type="button" aria-pressed={modus === m} onClick={() => setModus(m)} className={`h-full rounded-md px-3 text-sm font-medium ${modus === m ? 'bg-accent-600 text-white' : 'text-navy-700 hover:bg-navy-50'}`}>{label}</button>
  );
  return (
    <div className="not-prose" data-dt>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="grid h-11 grid-flow-col auto-cols-fr gap-1 rounded-lg border border-navy-300 bg-white p-1" role="group" aria-label={tx(lang, 'Anzeige', 'Display')}>
          {btn('zahl', tx(lang, 'Zahlbetrag (nach Kindergeld)', 'Amount payable (after child benefit)'))}
          {btn('bedarf', tx(lang, 'Bedarf (Tabellenbetrag)', 'Need (table amount)'))}
        </div>
        <p className="text-sm text-navy-700">{tx(lang, `Kindergeld 2026: ${f.eur(P.kindergeld.monat)} je Kind`, `Child benefit 2026: ${f.eur(P.kindergeld.monat)} per child`)}</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-navy-200">
        <table className="journal w-full min-w-[40rem] text-sm">
          <caption className="sr-only">{tx(lang, 'Düsseldorfer Tabelle 2026, Beträge in Euro pro Monat', 'Düsseldorf Table 2026, amounts in euros per month')}</caption>
          <thead>
            <tr className="bg-navy-50 text-navy-800">
              <th scope="col" className="px-3 py-2 text-left">{tx(lang, 'Netto des Zahlenden', 'Payer’s net income')}</th>
              {stufen.map((t, i) => <th key={i} scope="col" className="px-3 py-2 text-right">{t} {tx(lang, 'J.', 'yrs')}</th>)}
              <th scope="col" className="px-3 py-2 text-right">%</th>
              <th scope="col" className="px-3 py-2 text-right">{'BKB'}</th>
            </tr>
          </thead>
          <tbody>
            {P.dt.bedarf.map((_, gi) => {
              const [a, b] = gruppeVonBis(gi);
              return (
                <tr key={gi} className="border-t border-navy-100">
                  <th scope="row" className="whitespace-nowrap px-3 py-1.5 text-left font-medium text-navy-800">{gi + 1}. {gi === 0 ? tx(lang, `bis ${f.num(b)}`, `up to ${f.num(b)}`) : `${f.num(a)}–${f.num(b)}`}</th>
                  {([0, 1, 2, 3] as Stufe[]).map((si) => (
                    <td key={si} className={`dt-zelle tabular-nums px-3 py-1.5 text-right text-navy-800 ${g === gi && s === si ? 'dt-aktiv' : ''}`}>
                      <button type="button" className="w-full text-right" onClick={() => setSel([gi, si])} aria-label={tx(lang, `Gruppe ${gi + 1}, ${stufen[si]} Jahre: ${f.eur2(wert(gi, si))}`, `Group ${gi + 1}, age ${stufen[si]}: ${f.eur2(wert(gi, si))}`)}>{f.eur2(wert(gi, si))}</button>
                    </td>
                  ))}
                  <td className="tabular-nums px-3 py-1.5 text-right text-navy-600">{P.dt.prozent[gi]}</td>
                  <td className="tabular-nums px-3 py-1.5 text-right text-navy-600">{gi === 0 ? `${f.num(P.dt.bkb_gruppe1_nicht_erwerbstaetig)}/${f.num(P.dt.bkb[0])}` : f.num(P.dt.bkb[gi])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div aria-live="polite" className="mt-4 rounded-lg border-l-4 border-accent-600 bg-accent-50/60 p-4 text-sm text-navy-800">
        <p className="font-semibold text-navy-900">{tx(lang, `Gruppe ${g + 1} (${f.eur(von)} bis ${f.eur(bis)} netto), Kind ${stufen[s]} Jahre`, `Group ${g + 1} (${f.eur(von)} to ${f.eur(bis)} net), child aged ${stufen[s]}`)}</p>
        <p className="mt-1 tabular-nums">{tx(lang, `Bedarf ${f.eur(bedarf(g, s))} minus ${s === 3 ? 'volles' : 'halbes'} Kindergeld ${f.eur2(kgAnteil(s))} = Zahlbetrag ${f.eur2(zahlbetrag(g, s))} im Monat. Dem Zahlenden müssen nach allen Kindern mindestens ${f.eur(g === 0 ? P.dt.bkb[0] : P.dt.bkb[g])} bleiben, sonst wird herabgestuft.`, `Need ${f.eur(bedarf(g, s))} minus ${s === 3 ? 'full' : 'half'} child benefit ${f.eur2(kgAnteil(s))} = ${f.eur2(zahlbetrag(g, s))} payable a month. After all children the payer must keep at least ${f.eur(g === 0 ? P.dt.bkb[0] : P.dt.bkb[g])}, otherwise a lower group applies.`)}</p>
        {rechnerHref && <a href={rechnerHref} className="mt-2 inline-block font-medium text-accent-700 underline">{tx(lang, 'Mit mehreren Kindern und Selbstbehalt rechnen', 'Calculate with several children and the self-retention')} →</a>}
      </div>
    </div>
  );
}
