/** Ehegatten- und Trennungsunterhalt nach Anm. B DT 2026: 45 % der Differenz (Rentner 50 %), Selbstbehalt 1.600 / 1.475 €. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

export default function EhegattenRechner({ lang = 'de', methodHref, preset = {} }: { lang?: L; methodHref?: string; preset?: { modus?: 'ehegatte' | 'trennung'; p?: number; b?: number } }) {
  const f = fm(lang);
  const trennung = preset.modus === 'trennung';
  const [p, setP] = useState(preset.p ?? 3600);
  const [b, setB] = useState(preset.b ?? 1200);
  const [ku, setKu] = useState(0);
  const [erw, setErw] = useState('1');
  const [ps, setPs] = useState(0);
  const [bs, setBs] = useState(0);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setP(num(u, 'p', p)); setB(num(u, 'b', b)); setKu(num(u, 'k', 0)); setErw(str(u, 'e', '1')); setPs(num(u, 'ps', 0)); setBs(num(u, 'bs', 0));
  }, []);
  useEffect(() => { updateURL({ p, b, k: ku, e: erw, ps, bs }); }, [p, b, ku, erw, ps, bs]);
  const r = useMemo(() => ehegattenunterhalt({ pflichtigErwerb: p, berechtigtErwerb: b, kindesunterhalt: ku, pflichtigErwerbstaetig: erw === '1', pflichtigSonstige: ps, berechtigtSonstige: bs }), [p, b, ku, erw, ps, bs]);
  const q = erw === '1' ? P.ehegatte.quote_erwerb : P.ehegatte.quote_nicht_erwerbstaetig;
  const steps = [
    tx(lang, `Einkommen des Pflichtigen ${f.eur(p)}${ku ? ` minus Kindesunterhalt ${f.eur2(ku)} (Vorrang, § 1609 Nr. 1 BGB)` : ''} = ${f.eur2(r.basisPflichtig)}.`, `Payer's income ${f.eur(p)}${ku ? ` minus child support ${f.eur2(ku)} (priority, section 1609 no. 1 BGB)` : ''} = ${f.eur2(r.basisPflichtig)}.`),
    tx(lang, `${f.pct(q, 0)} der Differenz zum Einkommen des Berechtigten (${f.eur(b)})${ps || bs ? ', sonstige Einkünfte je zur Hälfte' : ''}: ${f.eur2(r.quote)}.`, `${f.pct(q, 0)} of the difference to the recipient's income (${f.eur(b)})${ps || bs ? ', other income split in half' : ''}: ${f.eur2(r.quote)}.`),
    tx(lang, `Selbstbehalt des Pflichtigen ${f.eur(r.selbstbehalt)}: leistungsfähig bis ${f.eur2(r.leistungsfaehig)}.`, `Payer's self-retention ${f.eur(r.selbstbehalt)}: can pay up to ${f.eur2(r.leistungsfaehig)}.`),
  ];
  if (r.konkreterBedarfMoeglich) steps.push(tx(lang, `Familieneinkommen über ${f.eur(P.ehegatte.konkreter_bedarf_ab_familieneinkommen)}: Der Bedarf kann konkret statt nach Quote bemessen werden (Nr. 15.3 Leitlinien NRW).`, `Family income above ${f.eur(P.ehegatte.konkreter_bedarf_ab_familieneinkommen)}: the need may be assessed in detail instead of by quota (no. 15.3 NRW guidelines).`));
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="eg-p" label={tx(lang, 'Netto des Zahlenden', 'Payer’s net income')} value={p} onChange={setP} unit="€" max={100000} lang={lang} help={tx(lang, 'bereinigt, ohne Kindergeld', 'adjusted, without child benefit')} />
            <NumberField id="eg-b" label={tx(lang, trennung ? 'Netto des getrennt lebenden Partners' : 'Netto des Berechtigten', trennung ? 'Separated partner’s net income' : 'Recipient’s net income')} value={b} onChange={setB} unit="€" max={100000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="eg-k" label={tx(lang, 'Gezahlter Kindesunterhalt', 'Child support paid')} value={ku} onChange={setKu} unit="€" max={20000} lang={lang} help={tx(lang, 'Summe der Zahlbeträge', 'total amounts payable')} />
            <Toggle id="eg-e" label={tx(lang, 'Zahlender erwerbstätig?', 'Payer working?')} value={erw} onChange={setErw} options={[{ value: '1', label: tx(lang, 'Ja', 'Yes') }, { value: '0', label: tx(lang, 'Nein', 'No') }]} />
          </div>
          <details className="rounded-lg border border-navy-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{tx(lang, 'Sonstige Einkünfte (Miete, Zinsen, Rente)', 'Other income (rent, interest, pension)')}</summary>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="eg-ps" label={tx(lang, 'Zahlender', 'Payer')} value={ps} onChange={setPs} unit="€" max={100000} lang={lang} />
              <NumberField id="eg-bs" label={tx(lang, 'Berechtigter', 'Recipient')} value={bs} onChange={setBs} unit="€" max={100000} lang={lang} />
            </div>
          </details>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, trennung ? 'Trennungsunterhalt pro Monat' : 'Ehegattenunterhalt pro Monat', trennung ? 'Separation maintenance per month' : 'Spousal maintenance per month')} wert={f.eur2(r.unterhalt)} unter={r.begrenztDurchSelbstbehalt ? tx(lang, 'durch den Selbstbehalt begrenzt', 'capped by the self-retention') : tx(lang, `Quote ${f.pct(q, 0)} der Differenz`, `${f.pct(q, 0)} of the difference`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Rechnerischer Anspruch', 'Calculated claim'), value: f.eur2(r.quote) },
            { label: tx(lang, 'Leistungsfähig bis', 'Payer can afford up to'), value: f.eur2(r.leistungsfaehig) },
            { label: tx(lang, 'Dem Zahlenden bleiben', 'Payer keeps'), value: f.eur2(r.verbleibtPflichtig), strong: true, sep: true },
            { label: tx(lang, 'Bedarf des Berechtigten (Quote + eigenes Einkommen)', 'Recipient’s need (quota + own income)'), value: f.eur2(r.bedarfQuote), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `${trennung ? 'Trennungsunterhalt' : 'Ehegattenunterhalt'} 2026: ${f.eur2(r.unterhalt)} im Monat`, `${trennung ? 'Separation' : 'Spousal'} maintenance 2026: ${f.eur2(r.unterhalt)} a month`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
