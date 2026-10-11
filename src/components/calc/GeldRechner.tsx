/** Pfändungs-, Scheidungskosten-, PKH-, Zugewinn- und Versorgungsausgleichsrechner. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { pfaendbar, pKonto, type Periode } from '../../lib/engine/pfaendung';
import { scheidungskosten, pkh, kinderFreibetrag } from '../../lib/engine/kosten';
import { zugewinnausgleich, versorgungsausgleich } from '../../lib/engine/vermoegen';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

type Props = { lang?: L; methodHref?: string };
const janein = (l: L) => [{ value: '1', label: tx(l, 'Ja', 'Yes') }, { value: '0', label: tx(l, 'Nein', 'No') }];

export function PfaendungRechner({ lang = 'de', methodHref, preset = {} }: Props & { preset?: { n?: number; p?: number } }) {
  const f = fm(lang);
  const [n, setN] = useState(preset.n ?? 2400); const [pers, setPers] = useState(String(preset.p ?? 0)); const [per, setPer] = useState<Periode>('monat'); const [kg, setKg] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setN(num(u, 'n', 2400)); setPers(str(u, 'p', '0')); const pp = str(u, 't', 'monat'); setPer(pp === 'woche' || pp === 'tag' ? pp : 'monat'); setKg(num(u, 'k', 0)); }, []);
  useEffect(() => { updateURL({ n, p: pers, t: per, k: kg }); }, [n, pers, per, kg]);
  const r = useMemo(() => pfaendbar(n, Number(pers), per), [n, pers, per]);
  const pk = useMemo(() => pKonto(Number(pers), kg), [pers, kg]);
  const alle = [0, 1, 2, 3, 4, 5].map((p) => pfaendbar(n, p, per).pfaendbar);
  const perTxt = { monat: tx(lang, 'im Monat', 'a month'), woche: tx(lang, 'in der Woche', 'a week'), tag: tx(lang, 'am Tag', 'a day') }[per];
  const steps = [
    tx(lang, `Freibetrag: Grundbetrag ${f.eur2(P.pfaendung[per].grundfreibetrag)}${r.personen ? ` plus Erhöhung für ${r.personen} Person(en)` : ''} = ${f.eur2(r.freibetrag)}.`, `Exempt amount: basic ${f.eur2(P.pfaendung[per].grundfreibetrag)}${r.personen ? ` plus increase for ${r.personen} dependant(s)` : ''} = ${f.eur2(r.freibetrag)}.`),
    tx(lang, `Einkommen bis zur Obergrenze, abgerundet nach § 850c Abs. 5 ZPO: ${f.eur2(r.abgerundet)}.`, `Income up to the ceiling, rounded down under section 850c(5) ZPO: ${f.eur2(r.abgerundet)}.`),
    tx(lang, `Vom Teil über dem Freibetrag sind ${f.pct(r.anteilPfaendbar, 0)} pfändbar.`, `${f.pct(r.anteilPfaendbar, 0)} of the part above the exempt amount can be garnished.`),
    ...(r.ueberObergrenze > 0 ? [tx(lang, `Über ${f.eur2(r.obergrenze)} voll pfändbar: ${f.eur2(r.ueberObergrenze)}.`, `Fully garnishable above ${f.eur2(r.obergrenze)}: ${f.eur2(r.ueberObergrenze)}.`)] : []),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pf-n" label={tx(lang, 'Nettoeinkommen', 'Net income')} value={n} onChange={setN} unit="€" max={100000} decimals={2} lang={lang} help={tx(lang, 'nach Steuern und Sozialabgaben (§ 850e ZPO)', 'after tax and social contributions (section 850e ZPO)')} />
            <SelectField id="pf-p" label={tx(lang, 'Unterhaltspflichten', 'People you support')} value={pers} onChange={setPers} options={['0', '1', '2', '3', '4', '5'].map((v) => ({ value: v, label: v === '5' ? tx(lang, '5 und mehr', '5 or more') : v }))} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="pf-t" label={tx(lang, 'Auszahlung für', 'Paid per')} value={per} onChange={(v) => setPer(v as Periode)} options={[{ value: 'monat', label: tx(lang, 'Monat', 'month') }, { value: 'woche', label: tx(lang, 'Woche', 'week') }, { value: 'tag', label: tx(lang, 'Tag', 'day') }]} />
            <NumberField id="pf-k" label={tx(lang, 'Kinder mit Kindergeld (P-Konto)', 'Children with child benefit (P-Konto)')} value={kg} onChange={(v) => setKg(Math.round(v))} max={10} lang={lang} />
          </div>
          <div className="overflow-x-auto rounded-lg bg-navy-50 p-3">
            <table className="w-full text-sm tabular-nums">
              <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{tx(lang, `Pfändbar bei ${f.eur2(n)} ${perTxt}, nach Zahl der Unterhaltspflichten`, `Garnishable on ${f.eur2(n)} ${perTxt}, by number of dependants`)}</caption>
              <thead><tr className="text-navy-700">{alle.map((_, i) => <th key={i} scope="col" className="text-right">{i === 5 ? '5+' : i}</th>)}</tr></thead>
              <tbody><tr className="border-t border-navy-200">{alle.map((v, i) => <td key={i} className={`text-right ${String(i) === pers ? 'font-bold text-navy-900' : 'text-navy-700'}`}>{f.eur2(v)}</td>)}</tr></tbody>
            </table>
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, `Pfändbarer Betrag ${perTxt}`, `Garnishable amount ${perTxt}`)} wert={f.eur2(r.pfaendbar)} unter={tx(lang, `Ihnen bleiben ${f.eur2(r.verbleibt)}`, `You keep ${f.eur2(r.verbleibt)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Pfändungsfreibetrag', 'Exempt amount'), value: f.eur2(r.freibetrag) },
            { label: tx(lang, 'Gilt ab', 'Applies from'), value: tx(lang, '1. Juli 2026', '1 July 2026'), muted: true },
            { label: tx(lang, 'P-Konto: geschützt im Monat', 'P-Konto: protected per month'), value: f.eur2(pk.summe), strong: true, sep: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Pfändungstabelle 2026: bei ${f.eur2(n)} netto und ${pers} Unterhaltspflichten sind ${f.eur2(r.pfaendbar)} pfändbar`, `German garnishment table 2026: on ${f.eur2(n)} net with ${pers} dependants, ${f.eur2(r.pfaendbar)} can be garnished`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function ScheidungRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [n1, setN1] = useState(2800); const [n2, setN2] = useState(1900); const [anr, setAnr] = useState(2); const [anw, setAnw] = useState('1');
  const [kind, setKind] = useState('0'); const [abzug, setAbzug] = useState(0); const [verm, setVerm] = useState(0); const [folge, setFolge] = useState(0); const [einig, setEinig] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setN1(num(u, 'a', 2800)); setN2(num(u, 'b', 1900)); setAnr(num(u, 'v', 2)); setAnw(str(u, 'w', '1')); setKind(str(u, 'k', '0')); setAbzug(num(u, 'x', 0)); setVerm(num(u, 'm', 0)); setFolge(num(u, 'f', 0)); setEinig(num(u, 'e', 0)); }, []);
  useEffect(() => { updateURL({ a: n1, b: n2, v: anr, w: anw, k: kind, x: abzug, m: verm, f: folge, e: einig }); }, [n1, n2, anr, anw, kind, abzug, verm, folge, einig]);
  const r = useMemo(() => scheidungskosten({ netto1: n1, netto2: n2, anrechte: anr, anwaelte: anw === '2' ? 2 : 1, kindschaftssachen: Number(kind), abzugMonat: abzug, vermoegenszuschlag: verm, folgesachenWert: folge, einigungWert: einig }), [n1, n2, anr, anw, kind, abzug, verm, folge, einig]);
  const steps = [
    tx(lang, `Ehesache: drei Monatsnetto beider Ehegatten ${f.eur(3 * (n1 + n2))}${abzug ? ` minus ${f.eur(3 * abzug)}` : ''}${verm ? ` plus ${f.eur(verm)} Vermögen` : ''}, mindestens ${f.eur(P.famgkg.ehe_mindestwert)}: ${f.eur(r.eheWert)} (§ 43 FamGKG).`, `Divorce itself: three months' net income of both ${f.eur(3 * (n1 + n2))}${abzug ? ` minus ${f.eur(3 * abzug)}` : ''}${verm ? ` plus ${f.eur(verm)} for assets` : ''}, at least ${f.eur(P.famgkg.ehe_mindestwert)}: ${f.eur(r.eheWert)} (section 43 FamGKG).`),
    ...(r.vaWert ? [tx(lang, `Versorgungsausgleich: ${anr} Anrechte × 10 % des Dreimonatsnettos, mindestens ${f.eur(P.famgkg.va_mindestwert)}: ${f.eur(r.vaWert)} (§ 50 FamGKG).`, `Pension splitting: ${anr} entitlements × 10% of three months' net, at least ${f.eur(P.famgkg.va_mindestwert)}: ${f.eur(r.vaWert)} (section 50 FamGKG).`)] : []),
    ...(r.kindWert ? [tx(lang, `Sorge- oder Umgangsrecht im Verbund: 20 %, höchstens ${f.eur(P.famgkg.kindschaft_zuschlag_max)}: ${f.eur(r.kindWert)} (§ 44 FamGKG).`, `Custody or contact in the same proceedings: 20%, at most ${f.eur(P.famgkg.kindschaft_zuschlag_max)}: ${f.eur(r.kindWert)} (section 44 FamGKG).`)] : []),
    tx(lang, `Verfahrenswert gesamt ${f.eur(r.gesamtWert)}: Gerichtsgebühr 2,0 × ${f.eur2(r.gerichtsgebuehr)} = ${f.eur2(r.gerichtskosten)} (KV 1110).`, `Total value ${f.eur(r.gesamtWert)}: court fee 2.0 × ${f.eur2(r.gerichtsgebuehr)} = ${f.eur2(r.gerichtskosten)} (schedule no. 1110).`),
    tx(lang, `Je Anwalt: Verfahrensgebühr 1,3 (${f.eur2(r.anwalt.verfahren)}), Terminsgebühr 1,2 (${f.eur2(r.anwalt.termin)})${r.anwalt.einigung ? `, Einigung 1,0 (${f.eur2(r.anwalt.einigung)})` : ''}, Pauschale ${f.eur2(r.anwalt.auslagen)}, 19 % USt.`, `Per lawyer: procedure fee 1.3 (${f.eur2(r.anwalt.verfahren)}), hearing fee 1.2 (${f.eur2(r.anwalt.termin)})${r.anwalt.einigung ? `, settlement 1.0 (${f.eur2(r.anwalt.einigung)})` : ''}, flat expenses ${f.eur2(r.anwalt.auslagen)}, 19% VAT.`),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sk-a" label={tx(lang, 'Netto Ehegatte 1', 'Net income spouse 1')} value={n1} onChange={setN1} unit="€" max={100000} lang={lang} />
            <NumberField id="sk-b" label={tx(lang, 'Netto Ehegatte 2', 'Net income spouse 2')} value={n2} onChange={setN2} unit="€" max={100000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sk-v" label={tx(lang, 'Anrechte im Versorgungsausgleich', 'Pension entitlements to split')} value={anr} onChange={(v) => setAnr(Math.round(v))} max={20} lang={lang} help={tx(lang, 'je Rentenkonto, Betriebsrente, Riester: 1; 0 = kein Ausgleich', 'one per pension account; 0 = none')} />
            <Toggle id="sk-w" label={tx(lang, 'Anwälte', 'Lawyers')} value={anw} onChange={setAnw} options={[{ value: '1', label: tx(lang, 'Einer', 'One') }, { value: '2', label: tx(lang, 'Zwei', 'Two') }]} />
          </div>
          <details className="rounded-lg border border-navy-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{tx(lang, 'Folgesachen, Kinder, Vermögen', 'Ancillary matters, children, assets')}</summary>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <Toggle id="sk-k" label={tx(lang, 'Sorge/Umgang im Verbund?', 'Custody in the same case?')} value={kind} onChange={setKind} options={[{ value: '0', label: tx(lang, 'Nein', 'No') }, { value: '1', label: tx(lang, 'Ja', 'Yes') }]} />
              <NumberField id="sk-x" label={tx(lang, 'Abzug je Monat (z. B. Kinder)', 'Monthly deduction (e.g. children)')} value={abzug} onChange={setAbzug} unit="€" max={10000} lang={lang} help={tx(lang, 'Gerichtspraxis, Ihre Annahme', 'court practice, your assumption')} />
              <NumberField id="sk-m" label={tx(lang, 'Zuschlag für Vermögen', 'Surcharge for assets')} value={verm} onChange={setVerm} unit="€" max={1000000} lang={lang} help={tx(lang, 'Gerichtspraxis, Ihre Annahme', 'court practice, your assumption')} />
              <NumberField id="sk-f" label={tx(lang, 'Wert weiterer Folgesachen', 'Value of other ancillary matters')} value={folge} onChange={setFolge} unit="€" max={1000000} lang={lang} />
              <NumberField id="sk-e" label={tx(lang, 'Davon durch Einigung erledigt', 'Of which settled by agreement')} value={einig} onChange={setEinig} unit="€" max={1000000} lang={lang} />
            </div>
          </details>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Scheidungskosten gesamt', 'Total divorce costs')} wert={f.eur2(r.gesamt)} unter={tx(lang, `Verfahrenswert ${f.eur(r.gesamtWert)}`, `Value of proceedings ${f.eur(r.gesamtWert)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Gerichtskosten', 'Court fees'), value: f.eur2(r.gerichtskosten) },
            { label: tx(lang, `Anwalt (je), brutto`, 'Lawyer (each), incl. VAT'), value: f.eur2(r.anwalt.brutto) },
            { label: tx(lang, 'Antragsteller trägt', 'Petitioner pays'), value: f.eur2(r.antragsteller), strong: true, sep: true },
            { label: tx(lang, 'Antragsgegner trägt', 'Respondent pays'), value: f.eur2(r.antragsgegner), strong: true },
          ]} />
          <p className="mt-2 text-xs text-navy-600">{tx(lang, 'Kosten gegeneinander aufgehoben (§ 150 Abs. 1 FamFG): Gericht je zur Hälfte, jeder seinen Anwalt.', 'Costs set off against each other (section 150(1) FamFG): court fees halved, each pays his or her own lawyer.')}</p>
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Scheidungskosten 2026: ${f.eur2(r.gesamt)} bei Verfahrenswert ${f.eur(r.gesamtWert)}`, `Divorce costs in Germany 2026: ${f.eur2(r.gesamt)} at a value of ${f.eur(r.gesamtWert)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function PkhRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [n, setN] = useState(2100); const [erw, setErw] = useState('1'); const [eh, setEh] = useState('0'); const [ehE, setEhE] = useState(0); const [kAnz, setKAnz] = useState('0'); const [kAlter, setKAlter] = useState<number[]>([]); const [wohn, setWohn] = useState(750); const [sonst, setSonst] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setN(num(u, 'n', 2100)); setErw(str(u, 'e', '1')); setEh(str(u, 'h', '0')); setEhE(num(u, 'hh', 0)); const k = str(u, 'k', ''); const ks = k ? k.split('-').map((x) => Math.min(25, Math.max(0, parseInt(x, 10) || 0))).slice(0, 6) : []; setKAlter(ks); setKAnz(String(ks.length)); setWohn(num(u, 'w', 750)); setSonst(num(u, 's', 0)); }, []);
  useEffect(() => { updateURL({ n, e: erw, h: eh, hh: ehE, k: kAlter.join('-'), w: wohn, s: sonst }); }, [n, erw, eh, ehE, kAlter, wohn, sonst]);
  const setAnz = (v: string) => { const c = Number(v); setKAnz(v); setKAlter((k) => (c > k.length ? [...k, ...Array(c - k.length).fill(8)] : k.slice(0, c))); };
  const r = useMemo(() => pkh({ netto: n, erwerbstaetig: erw === '1', ehegatte: eh === '1', einkommenEhegatte: ehE, kinder: kAlter, wohnkosten: wohn, sonstigeBelastungen: sonst }), [n, erw, eh, ehE, kAlter, wohn, sonst]);
  const lab = (k: string) => k === 'erwerb' ? tx(lang, 'Erwerbstätigenfreibetrag', 'Earner allowance') : k === 'partei' ? tx(lang, 'Freibetrag für Sie', 'Allowance for you') : k === 'ehegatte' ? tx(lang, 'Freibetrag Ehegatte', 'Spouse allowance') : k === 'wohnen' ? tx(lang, 'Miete und Heizung', 'Rent and heating') : k === 'sonstige' ? tx(lang, 'Besondere Belastungen', 'Special burdens') : tx(lang, `Kind (${k.split(':')[1]} J.)`, `Child (age ${k.split(':')[1]})`);
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pk-n" label={tx(lang, 'Nettoeinkommen', 'Net income')} value={n} onChange={setN} unit="€" max={50000} lang={lang} help={tx(lang, 'mit Kindergeld, das Ihnen zusteht', 'including child benefit you receive')} />
            <Toggle id="pk-e" label={tx(lang, 'Erwerbstätig?', 'Working?')} value={erw} onChange={setErw} options={janein(lang)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pk-w" label={tx(lang, 'Miete und Heizung', 'Rent and heating')} value={wohn} onChange={setWohn} unit="€" max={10000} lang={lang} />
            <NumberField id="pk-s" label={tx(lang, 'Besondere Belastungen', 'Special burdens')} value={sonst} onChange={setSonst} unit="€" max={10000} lang={lang} help={tx(lang, 'z. B. Kreditraten, Unterhalt', 'e.g. loan instalments, maintenance')} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Toggle id="pk-h" label={tx(lang, 'Ehegatte ohne volles Einkommen?', 'Supporting a spouse?')} value={eh} onChange={setEh} options={janein(lang)} />
            {eh === '1' ? <NumberField id="pk-hh" label={tx(lang, 'Einkommen des Ehegatten', 'Spouse’s income')} value={ehE} onChange={setEhE} unit="€" max={20000} lang={lang} /> : <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
            <SelectField id="pk-k" label={tx(lang, 'Unterhaltsberechtigte Kinder', 'Dependent children')} value={kAnz} onChange={setAnz} options={['0', '1', '2', '3', '4', '5', '6'].map((v) => ({ value: v, label: v }))} />
            {kAlter.map((a, i) => <NumberField key={i} id={`pk-a${i}`} label={tx(lang, `Alter Kind ${i + 1}`, `Age of child ${i + 1}`)} value={a} onChange={(v) => setKAlter((k) => k.map((x, j) => (j === i ? Math.round(v) : x)))} unit={tx(lang, 'J.', 'yrs')} max={25} lang={lang} help={`${f.eur(kinderFreibetrag(a))}`} />)}
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Monatsrate Verfahrenskostenhilfe', 'Monthly legal aid instalment')} wert={r.ratenfrei ? tx(lang, 'ratenfrei', 'no instalments') : f.eur(r.rate)} unter={r.ratenfrei ? tx(lang, 'unter 10 € wird keine Rate festgesetzt', 'below €10 no instalment is set') : tx(lang, `höchstens ${r.maxRaten} Raten, zusammen ${f.eur(r.summeMax)}`, `at most ${r.maxRaten} instalments, ${f.eur(r.summeMax)} in total`)} />
          <Zeilen rows={[...r.abzuege.map(([k, v]) => ({ label: lab(k), value: `− ${f.eur(v)}`, muted: true })), { label: tx(lang, 'Einzusetzendes Einkommen', 'Income to be used'), value: f.eur2(r.einzusetzen), strong: true, sep: true }]} />
          <Rechenweg lang={lang} steps={[tx(lang, `Bis ${f.eur(P.pkh.rate_schwelle)} einzusetzendes Einkommen: Rate = Hälfte; darüber ${f.eur(P.pkh.rate_sockel)} plus alles über ${f.eur(P.pkh.rate_schwelle)}; abgerundet auf volle Euro (§ 115 Abs. 2 ZPO).`, `Up to ${f.eur(P.pkh.rate_schwelle)} of income to be used: instalment = half; above that ${f.eur(P.pkh.rate_sockel)} plus everything over ${f.eur(P.pkh.rate_schwelle)}; rounded down to full euros (section 115(2) ZPO).`)]} />
          <Aktionen lang={lang} text={() => tx(lang, `Verfahrenskostenhilfe 2026: ${r.ratenfrei ? 'ratenfrei' : `Rate ${f.eur(r.rate)}`}`, `Legal aid in Germany 2026: ${r.ratenfrei ? 'no instalments' : `instalment ${f.eur(r.rate)}`}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function ZugewinnRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [aA, setAA] = useState(20000); const [eA, setEA] = useState(180000); const [aB, setAB] = useState(5000); const [eB, setEB] = useState(45000);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setAA(num(u, 'aa', 20000)); setEA(num(u, 'ea', 180000)); setAB(num(u, 'ab', 5000)); setEB(num(u, 'eb', 45000)); }, []);
  useEffect(() => { updateURL({ aa: aA, ea: eA, ab: aB, eb: eB }); }, [aA, eA, aB, eB]);
  const r = useMemo(() => zugewinnausgleich({ anfangA: aA, endA: eA, anfangB: aB, endB: eB }), [aA, eA, aB, eB]);
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField min={-50000000} id="zg-aa" label={tx(lang, 'Anfangsvermögen A', 'Initial assets A')} value={aA} onChange={setAA} unit="€" max={50000000} lang={lang} help={tx(lang, 'bei Heirat, plus Erbschaften und Schenkungen', 'at marriage, plus inheritances and gifts')} />
            <NumberField min={-50000000} id="zg-ea" label={tx(lang, 'Endvermögen A', 'Final assets A')} value={eA} onChange={setEA} unit="€" max={50000000} lang={lang} help={tx(lang, 'bei Zustellung des Scheidungsantrags', 'when the divorce petition is served')} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField min={-50000000} id="zg-ab" label={tx(lang, 'Anfangsvermögen B', 'Initial assets B')} value={aB} onChange={setAB} unit="€" max={50000000} lang={lang} />
            <NumberField min={-50000000} id="zg-eb" label={tx(lang, 'Endvermögen B', 'Final assets B')} value={eB} onChange={setEB} unit="€" max={50000000} lang={lang} />
          </div>
          <p className="text-xs text-navy-600">{tx(lang, 'Schulden abziehen; ein negatives Anfangsvermögen tippen Sie mit Minus. Die Hochrechnung des Anfangsvermögens mit dem Verbraucherpreisindex ist hier nicht enthalten.', 'Deduct debts; type a negative initial value with a minus sign. Indexing the initial assets for inflation is not included here.')}</p>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Ausgleichsforderung', 'Equalisation claim')} wert={f.eur(r.forderung)} unter={r.berechtigt ? tx(lang, `steht ${r.berechtigt} zu`, `owed to ${r.berechtigt}`) : tx(lang, 'kein Ausgleich', 'no claim')} />
          <Zeilen rows={[
            { label: tx(lang, 'Zugewinn A', 'Gain A'), value: f.eur(r.zugewinnA) },
            { label: tx(lang, 'Zugewinn B', 'Gain B'), value: f.eur(r.zugewinnB) },
            { label: tx(lang, 'Überschuss', 'Difference'), value: f.eur(r.ueberschuss), muted: true },
          ]} />
          {r.gekappt && <p className="mt-2 text-sm text-amber-900">{tx(lang, 'Begrenzt auf das Endvermögen des Pflichtigen (§ 1378 Abs. 2 BGB).', 'Limited to the payer’s final assets (section 1378(2) BGB).')}</p>}
          <Rechenweg lang={lang} steps={[tx(lang, 'Zugewinn = Endvermögen minus Anfangsvermögen, nie unter null (§ 1373 BGB); die Hälfte des Überschusses geht an den Ehegatten mit dem kleineren Zugewinn (§ 1378 Abs. 1 BGB).', 'Gain = final minus initial assets, never below zero (section 1373 BGB); half the difference goes to the spouse with the smaller gain (section 1378(1) BGB).')]} />
          <Aktionen lang={lang} text={() => tx(lang, `Zugewinnausgleich: ${f.eur(r.forderung)}`, `Accrued gain equalisation: ${f.eur(r.forderung)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function VaRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [rA, setRA] = useState(420); const [rB, setRB] = useState(180); const [kA, setKA] = useState(24000); const [kB, setKB] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setRA(num(u, 'ra', 420)); setRB(num(u, 'rb', 180)); setKA(num(u, 'ka', 24000)); setKB(num(u, 'kb', 0)); }, []);
  useEffect(() => { updateURL({ ra: rA, rb: rB, ka: kA, kb: kB }); }, [rA, rB, kA, kB]);
  const r = useMemo(() => versorgungsausgleich({ renteA: rA, renteB: rB, kapitalA: kA, kapitalB: kB }), [rA, rB, kA, kB]);
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="va-ra" label={tx(lang, 'Ehezeitanteil Rente A', 'Marriage-period pension A')} value={rA} onChange={setRA} unit="€" max={20000} decimals={2} lang={lang} help={tx(lang, 'Monatsrente aus der Ehezeit', 'monthly pension earned during marriage')} />
            <NumberField id="va-rb" label={tx(lang, 'Ehezeitanteil Rente B', 'Marriage-period pension B')} value={rB} onChange={setRB} unit="€" max={20000} decimals={2} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="va-ka" label={tx(lang, 'Kapitalwert A (Betriebsrente)', 'Capital value A (company pension)')} value={kA} onChange={setKA} unit="€" max={10000000} lang={lang} />
            <NumberField id="va-kb" label={tx(lang, 'Kapitalwert B', 'Capital value B')} value={kB} onChange={setKB} unit="€" max={10000000} lang={lang} />
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Ausgleich der Renten (Differenz)', 'Pension balance (difference)')} wert={f.eur2(r.differenzRente)} unter={r.geringRente ? tx(lang, `gering: höchstens ${f.eur2(r.grenzeRente)}, Ausgleich soll entfallen`, `minor: at most ${f.eur2(r.grenzeRente)}, should not be split`) : tx(lang, 'monatlich, zugunsten des Ehegatten mit weniger Anrechten', 'monthly, in favour of the spouse with less')} />
          <Zeilen rows={[
            { label: tx(lang, 'Ausgleichswert Rente A', 'Equalisation value pension A'), value: f.eur2(r.ausgleichRenteA) },
            { label: tx(lang, 'Ausgleichswert Rente B', 'Equalisation value pension B'), value: f.eur2(r.ausgleichRenteB) },
            { label: tx(lang, 'Ausgleichswert Kapital A', 'Equalisation value capital A'), value: f.eur(r.ausgleichKapitalA) },
            { label: tx(lang, 'Ausgleichswert Kapital B', 'Equalisation value capital B'), value: f.eur(r.ausgleichKapitalB) },
            { label: tx(lang, 'Geringfügig bis (Kapital)', 'Minor up to (capital)'), value: f.eur(r.grenzeKapital), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={[tx(lang, `Jeder Ehegatte gibt die Hälfte seines Ehezeitanteils ab (§ 1 VersAusglG). Geringfügig ist eine Differenz bis 1 % (Rente: ${f.eur2(r.grenzeRente)}) oder 120 % (Kapital: ${f.eur(r.grenzeKapital)}) der Bezugsgröße 2026 von ${f.eur(P.versorgungsausgleich.bezugsgroesse_monat)} (§ 18 VersAusglG).`, `Each spouse gives up half of the marriage-period share (section 1 VersAusglG). A difference is minor up to 1% (pension: ${f.eur2(r.grenzeRente)}) or 120% (capital: ${f.eur(r.grenzeKapital)}) of the 2026 reference value of ${f.eur(P.versorgungsausgleich.bezugsgroesse_monat)} (section 18 VersAusglG).`)]} />
          <Aktionen lang={lang} text={() => tx(lang, `Versorgungsausgleich: Differenz ${f.eur2(r.differenzRente)} Rente im Monat`, `Pension splitting: difference ${f.eur2(r.differenzRente)} a month`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export default PfaendungRechner;
