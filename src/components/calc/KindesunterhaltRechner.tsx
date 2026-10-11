/** Kindesunterhalt nach Düsseldorfer Tabelle 2026: mehrere Kinder, Bedarfskontrollbetrag, Mangelfall (Anm. C), erweiterter Umgang. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { kindesunterhalt, gruppeVonBis, type Kind } from '../../lib/engine/dt';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

export interface KuPreset { netto?: number; kinder?: Kind[]; umgang?: boolean }
const kinderZuText = (k: Kind[]) => k.map((x) => `${x.alter}${x.privilegiert ? 'p' : ''}`).join('-');
const textZuKinder = (s: string): Kind[] => s.split('-').filter(Boolean).slice(0, 6).map((t) => ({ alter: Math.min(20, Math.max(0, parseInt(t, 10) || 0)), privilegiert: t.endsWith('p') }));

export default function KindesunterhaltRechner({ lang = 'de', methodHref, preset = {} }: { lang?: L; methodHref?: string; preset?: KuPreset }) {
  const f = fm(lang);
  const def = { netto: preset.netto ?? 2800, kinder: preset.kinder ?? [{ alter: 7 }] };
  const [netto, setNetto] = useState(def.netto);
  const [erw, setErw] = useState('1');
  const [kinder, setKinder] = useState<Kind[]>(def.kinder);
  const [bkbAn, setBkbAn] = useState('1');
  const [anzahl, setAnzahl] = useState('0');
  const [weitere, setWeitere] = useState('0');
  const [abzug, setAbzug] = useState(preset.umgang ? '10' : '0');
  const [herab, setHerab] = useState('0');
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setNetto(num(u, 'n', def.netto)); setErw(str(u, 'e', '1')); const k = str(u, 'k', ''); if (k) setKinder(textZuKinder(k));
    setBkbAn(str(u, 'b', '1')); setAnzahl(str(u, 'a', '0')); setWeitere(str(u, 'w', '0')); setAbzug(str(u, 'u', abzug)); setHerab(str(u, 'h', '0'));
  }, []);
  useEffect(() => { updateURL({ n: netto, e: erw, k: kinderZuText(kinder), b: bkbAn, a: anzahl, w: weitere, u: abzug, h: herab }); }, [netto, erw, kinder, bkbAn, anzahl, weitere, abzug, herab]);
  const r = useMemo(() => kindesunterhalt(netto, kinder, { erwerbstaetig: erw === '1', bkb: bkbAn === '1', anzahlAnpassung: anzahl === '1', weitereBerechtigte: Number(weitere), umgangAbzug: Number(abzug) / 100, umgangHerabstufung: Number(herab) }), [netto, erw, kinder, bkbAn, anzahl, weitere, abzug, herab]);
  const setAnzahlKinder = (n: number) => setKinder((k) => (n > k.length ? [...k, ...Array.from({ length: n - k.length }, () => ({ alter: 5 }))] : k.slice(0, n)));
  const setKind = (i: number, x: Partial<Kind>) => setKinder((k) => k.map((c, j) => (j === i ? { ...c, ...x } : c)));
  const [von, bis] = gruppeVonBis(r.gruppeEinkommen);
  const stufeTxt = (s: number) => [tx(lang, '0–5 Jahre', '0–5 years'), tx(lang, '6–11 Jahre', '6–11 years'), tx(lang, '12–17 Jahre', '12–17 years'), tx(lang, 'ab 18', '18+')][s];
  const steps: string[] = [
    tx(lang, `Bereinigtes Netto ${f.eur(netto)}: Einkommensgruppe ${r.gruppeEinkommen + 1} (${f.eur(von)} bis ${f.eur(bis)}).${r.ueberTabelle ? ' Über 11.200 € endet die Tabelle: der Bedarf wird dann konkret dargelegt, hier bleibt es bei Gruppe 15.' : ''}`,
      `Adjusted net income ${f.eur(netto)}: income group ${r.gruppeEinkommen + 1} (${f.eur(von)} to ${f.eur(bis)}).${r.ueberTabelle ? ' The table ends at €11,200; above it the need is shown in detail, here we stay in group 15.' : ''}`),
  ];
  if (r.gruppeNachAnzahl !== r.gruppeEinkommen) steps.push(tx(lang, `Anpassung nach Zahl der Berechtigten und Umgang: Gruppe ${r.gruppeNachAnzahl + 1}.`, `Adjusted for the number of dependants and contact: group ${r.gruppeNachAnzahl + 1}.`));
  if (r.herabgestuftBkb > 0) steps.push(tx(lang, `Bedarfskontrollbetrag (Anm. A III) nicht gewahrt: Herabstufung um ${r.herabgestuftBkb} Gruppe(n) auf Gruppe ${r.gruppe + 1}.`, `Needs-control amount (note A III) not respected: down ${r.herabgestuftBkb} group(s) to group ${r.gruppe + 1}.`));
  r.kinder.forEach((k, i) => steps.push(tx(lang, `Kind ${i + 1} (${k.alter} J., ${stufeTxt(k.stufe)}): Bedarf ${f.eur2(k.bedarf)} minus ${k.stufe === 3 ? 'volles' : 'halbes'} Kindergeld ${f.eur2(k.kindergeld)} = ${f.eur2(k.tabellenZahlbetrag)}.`, `Child ${i + 1} (${k.alter}, ${stufeTxt(k.stufe)}): need ${f.eur2(k.bedarf)} minus ${k.stufe === 3 ? 'full' : 'half'} child benefit ${f.eur2(k.kindergeld)} = ${f.eur2(k.tabellenZahlbetrag)}.`)));
  if (r.mangelfall) steps.push(tx(lang, `Mangelfall (Anm. C): ${f.eur(netto)} minus Selbstbehalt ${f.eur(r.selbstbehalt)} = ${f.eur2(r.verteilungsmasse)} werden im Verhältnis der Zahlbeträge verteilt.`, `Shortfall case (note C): ${f.eur(netto)} minus the ${f.eur(r.selbstbehalt)} self-retention = ${f.eur2(r.verteilungsmasse)}, shared in proportion to the payment amounts.`));
  else steps.push(tx(lang, `Es bleiben ${f.eur2(r.verbleibt)}, mehr als der Selbstbehalt von ${f.eur(r.selbstbehalt)}: voller Zahlbetrag.`, `${f.eur2(r.verbleibt)} remains, above the ${f.eur(r.selbstbehalt)} self-retention: full payment amount.`));
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ku-n" label={tx(lang, 'Bereinigtes Nettoeinkommen', 'Adjusted net income')} value={netto} onChange={setNetto} unit="€" max={100000} lang={lang} help={tx(lang, 'Netto minus berufsbedingte Kosten und Schulden, die anerkannt werden', 'Net pay minus recognised work costs and debts')} />
            <Toggle id="ku-e" label={tx(lang, 'Erwerbstätig?', 'Working?')} value={erw} onChange={setErw} options={[{ value: '1', label: tx(lang, 'Ja', 'Yes') }, { value: '0', label: tx(lang, 'Nein', 'No') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="ku-k" label={tx(lang, 'Kinder, für die Sie zahlen', 'Children you pay for')} value={String(kinder.length)} onChange={(v) => setAnzahlKinder(Number(v))} options={[1, 2, 3, 4, 5, 6].map((i) => ({ value: String(i), label: String(i) }))} />
            <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
            {kinder.map((k, i) => (
              <div key={i} className="grid grid-rows-subgrid row-span-3">
                <NumberField id={`ku-a${i}`} label={tx(lang, `Alter Kind ${i + 1}`, `Age of child ${i + 1}`)} value={k.alter} onChange={(v) => setKind(i, { alter: Math.round(v) })} unit={tx(lang, 'J.', 'yrs')} max={20} lang={lang}
                  help={k.alter >= 18 ? tx(lang, k.privilegiert ? 'Schüler(in) im Haushalt' : 'nicht privilegiert, Rang 4', k.privilegiert ? 'at school, living at home' : 'not privileged, rank 4') : undefined} />
              </div>
            ))}
          </div>
          {kinder.some((k) => k.alter >= 18) && (
            <div className="space-y-2 rounded-lg bg-navy-50 p-3 text-sm text-navy-800">
              {kinder.map((k, i) => k.alter >= 18 && (
                <label key={i} className="flex items-center gap-2"><input type="checkbox" checked={!!k.privilegiert} onChange={(e) => setKind(i, { privilegiert: e.target.checked })} />{tx(lang, `Kind ${i + 1}: unter 21, allgemeine Schule, wohnt bei einem Elternteil (§ 1603 Abs. 2 Satz 2 BGB)`, `Child ${i + 1}: under 21, at general school, living with a parent (section 1603(2) BGB)`)}</label>
              ))}
              <p className="text-xs text-navy-600">{tx(lang, 'Für Volljährige haften beide Eltern anteilig; dieser Rechner nimmt an, dass der andere Elternteil nichts über seinem Selbstbehalt verdient. Sonst: Volljährigenunterhalt-Rechner.', 'Both parents share liability for adult children; this tool assumes the other parent earns nothing above the self-retention. Otherwise use the adult-child calculator.')}</p>
            </div>
          )}
          <details className="rounded-lg border border-navy-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{tx(lang, 'Optionen: Bedarfskontrolle, Zahl der Berechtigten, erweiterter Umgang', 'Options: needs control, number of dependants, extended contact')}</summary>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <Toggle id="ku-b" label={tx(lang, 'Bedarfskontrollbetrag', 'Needs-control amount')} value={bkbAn} onChange={setBkbAn} options={[{ value: '1', label: tx(lang, 'An', 'On') }, { value: '0', label: tx(lang, 'Aus', 'Off') }]} />
              <Toggle id="ku-z" label={tx(lang, 'Zahl der Berechtigten', 'Number of dependants')} value={anzahl} onChange={setAnzahl} options={[{ value: '0', label: tx(lang, 'Aus', 'Off') }, { value: '1', label: tx(lang, 'An', 'On') }]} />
              <SelectField id="ku-w" label={tx(lang, 'Weitere Berechtigte (Ehegatte)', 'Other dependants (spouse)')} value={weitere} onChange={setWeitere} options={['0', '1', '2'].map((v) => ({ value: v, label: v }))} />
              <SelectField id="ku-u" label={tx(lang, 'Erweiterter Umgang: Abzug', 'Extended contact: deduction')} value={abzug} onChange={setAbzug} options={[{ value: '0', label: '0 %' }, { value: '10', label: '10 %' }, { value: '15', label: '15 %' }]} />
              <SelectField id="ku-h" label={tx(lang, 'Erweiterter Umgang: Herabstufung', 'Extended contact: step down')} value={herab} onChange={setHerab} options={['0', '1', '2'].map((v) => ({ value: v, label: tx(lang, `${v} Gruppe(n)`, `${v} group(s)`) }))} />
            </div>
            <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Zahl der Berechtigten: Die Tabelle ist auf zwei Berechtigte zugeschnitten (Anm. A I); bei mehr kann eine Gruppe tiefer, bei einem Kind höher gerechnet werden. Erweiterter Umgang: BGH, 15. April 2026, XII ZB 415/25 (Abzug typischerweise 10 %, höchstens 15 %). Beides liegt im Ermessen des Gerichts.', 'Number of dependants: the table assumes two (note A I); with more, one group lower can apply, with one child one higher. Extended contact: Federal Court of Justice, 15 April 2026, XII ZB 415/25 (typically 10%, at most 15%). Both are at the court’s discretion.')}</p>
          </details>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Kindesunterhalt pro Monat (Zahlbetrag)', 'Child support per month (amount payable)')} wert={f.eur2(r.summe)} unter={tx(lang, `Gruppe ${r.gruppe + 1} · ${P.dt.prozent[r.gruppe]} % des Mindestunterhalts`, `Group ${r.gruppe + 1} · ${P.dt.prozent[r.gruppe]}% of the minimum`)} />
          <Zeilen rows={[
            ...r.kinder.map((k, i) => ({ label: tx(lang, `Kind ${i + 1}, ${k.alter} Jahre`, `Child ${i + 1}, age ${k.alter}`), value: f.eur2(k.zahlbetrag) })),
            { label: tx(lang, 'Ihnen bleiben', 'Left for you'), value: f.eur2(r.verbleibt), strong: true, sep: true },
            { label: tx(lang, 'Notwendiger Selbstbehalt', 'Minimum self-retention'), value: f.eur(r.selbstbehalt), muted: true },
            { label: tx(lang, `Bedarfskontrollbetrag Gruppe ${r.gruppe + 1}`, `Needs-control amount group ${r.gruppe + 1}`), value: f.eur(r.bkbWert), muted: true },
          ]} />
          {r.mangelfall && <p className="mt-3 rounded-md border-l-4 border-amber-600 bg-amber-50 p-2 text-sm text-amber-900">{tx(lang, `Mangelfall: Das Einkommen reicht nicht für den Mindestunterhalt aller Kinder. Verteilt werden ${f.eur2(r.verteilungsmasse)}.`, `Shortfall case: income does not cover the minimum for every child. ${f.eur2(r.verteilungsmasse)} is shared out.`)}</p>}
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Kindesunterhalt nach Düsseldorfer Tabelle 2026: ${f.eur2(r.summe)} im Monat bei ${f.eur(netto)} netto`, `Child support under the 2026 Düsseldorf Table: ${f.eur2(r.summe)} a month on ${f.eur(netto)} net`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
