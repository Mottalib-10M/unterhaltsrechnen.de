/** Unterhaltsrechner für die ganze Familie: zuerst Kindesunterhalt (Rang 1), dann Ehegatten- oder Trennungsunterhalt aus dem Rest. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { kindesunterhalt, type Kind } from '../../lib/engine/dt';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

export default function GesamtRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fm(lang);
  const [p, setP] = useState(3900); const [b, setB] = useState(900); const [kinder, setKinder] = useState<Kind[]>([{ alter: 4 }, { alter: 9 }]); const [ehe, setEhe] = useState('1');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setP(num(u, 'p', 3900)); setB(num(u, 'b', 900)); const k = str(u, 'k', ''); if (k) setKinder(k.split('-').slice(0, 6).map((x) => ({ alter: Math.min(17, Math.max(0, parseInt(x, 10) || 0)) }))); setEhe(str(u, 'e', '1')); }, []);
  useEffect(() => { updateURL({ p, b, k: kinder.map((k) => k.alter).join('-'), e: ehe }); }, [p, b, kinder, ehe]);
  const ku = useMemo(() => kindesunterhalt(p, kinder, { weitereBerechtigte: ehe === '1' ? 1 : 0 }), [p, kinder, ehe]);
  const eu = useMemo(() => ehegattenunterhalt({ pflichtigErwerb: p, berechtigtErwerb: b, kindesunterhalt: ku.summe }), [p, b, ku.summe]);
  const euBetrag = ehe === '1' ? eu.unterhalt : 0;
  const gesamt = ku.summe + euBetrag;
  const setAnzahl = (n: number) => setKinder((k) => (n > k.length ? [...k, ...Array.from({ length: n - k.length }, () => ({ alter: 6 }))] : k.slice(0, n)));
  const steps = [
    tx(lang, `Kindesunterhalt zuerst (§ 1609 Nr. 1 BGB): ${f.eur2(ku.summe)} nach Gruppe ${ku.gruppe + 1}${ku.mangelfall ? ', Mangelfall' : ''}.`, `Child support first (section 1609 no. 1 BGB): ${f.eur2(ku.summe)} in group ${ku.gruppe + 1}${ku.mangelfall ? ', shortfall case' : ''}.`),
    ...(ehe === '1' ? [tx(lang, `Vom Rest ${f.eur2(eu.basisPflichtig)}: 45 % der Differenz zu ${f.eur(b)} = ${f.eur2(eu.quote)}; Selbstbehalt ${f.eur(eu.selbstbehalt)} lässt ${f.eur2(eu.leistungsfaehig)} zu.`, `From the remaining ${f.eur2(eu.basisPflichtig)}: 45% of the difference to ${f.eur(b)} = ${f.eur2(eu.quote)}; the ${f.eur(eu.selbstbehalt)} self-retention allows ${f.eur2(eu.leistungsfaehig)}.`)] : []),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ge-p" label={tx(lang, 'Netto des Zahlenden', 'Payer’s net income')} value={p} onChange={setP} unit="€" max={100000} lang={lang} help={tx(lang, 'bereinigt', 'adjusted')} />
            <Toggle id="ge-e" label={tx(lang, 'Auch Ehegatte/Partner?', 'Spouse too?')} value={ehe} onChange={setEhe} options={[{ value: '1', label: tx(lang, 'Ja', 'Yes') }, { value: '0', label: tx(lang, 'Nein', 'No') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {ehe === '1' ? <NumberField id="ge-b" label={tx(lang, 'Netto des Ehegatten', 'Spouse’s net income')} value={b} onChange={setB} unit="€" max={100000} lang={lang} /> : <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />}
            <SelectField id="ge-k" label={tx(lang, 'Minderjährige Kinder', 'Minor children')} value={String(kinder.length)} onChange={(v) => setAnzahl(Number(v))} options={['0', '1', '2', '3', '4'].map((v) => ({ value: v, label: v }))} />
          </div>
          {kinder.length > 0 && <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">{kinder.map((k, i) => <NumberField key={i} id={`ge-a${i}`} label={tx(lang, `Alter Kind ${i + 1}`, `Age child ${i + 1}`)} value={k.alter} onChange={(v) => setKinder((ks) => ks.map((c, j) => (j === i ? { alter: Math.round(v) } : c)))} unit={tx(lang, 'J.', 'yrs')} max={17} lang={lang} />)}</div>}
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Unterhalt insgesamt pro Monat', 'Total maintenance per month')} wert={f.eur2(gesamt)} unter={tx(lang, `dem Zahlenden bleiben ${f.eur2(p - gesamt)}`, `the payer keeps ${f.eur2(p - gesamt)}`)} />
          <Zeilen rows={[
            ...ku.kinder.map((k, i) => ({ label: tx(lang, `Kind ${i + 1} (${k.alter} J.)`, `Child ${i + 1} (age ${k.alter})`), value: f.eur2(k.zahlbetrag) })),
            ...(ehe === '1' ? [{ label: tx(lang, 'Ehegatte (nach Kindern)', 'Spouse (after children)'), value: f.eur2(euBetrag) }] : []),
            { label: tx(lang, 'Summe', 'Total'), value: f.eur2(gesamt), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Unterhalt 2026: Kinder ${f.eur2(ku.summe)}, Ehegatte ${f.eur2(euBetrag)}`, `Maintenance 2026: children ${f.eur2(ku.summe)}, spouse ${f.eur2(euBetrag)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
