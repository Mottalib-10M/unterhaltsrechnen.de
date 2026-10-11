/** Gesetzliche Erbfolge mit Pflichtteil und Pflichtteilsergänzung; Erbschaft- und Schenkungsteuer 2026. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { erbfolge, pflichtteilsergaenzung, erbschaftsteuer, BEZIEHUNGEN, type Gueterstand, type Beziehung } from '../../lib/engine/erbe';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

type Props = { lang?: L; methodHref?: string };
const janein = (l: L) => [{ value: '1', label: tx(l, 'Ja', 'Yes') }, { value: '0', label: tx(l, 'Nein', 'No') }];
const bruch = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(4);
};

export function ErbfolgeRechner({ lang = 'de', methodHref, preset = {} }: Props & { preset?: { modus?: 'erbfolge' | 'pflichtteil' } }) {
  const f = fm(lang);
  const pt = preset.modus === 'pflichtteil';
  const [verh, setVerh] = useState('1'); const [gs, setGs] = useState<Gueterstand>('zugewinn'); const [k, setK] = useState(2); const [el, setEl] = useState('2'); const [ge, setGe] = useState(0); const [gr, setGr] = useState('0'); const [n, setN] = useState(300000);
  const [sch, setSch] = useState(pt ? 50000 : 0); const [jahre, setJahre] = useState(pt ? 3 : 0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setVerh(str(u, 'v', '1')); const g = str(u, 'g', 'zugewinn'); setGs(g === 'trennung' || g === 'gemeinschaft' ? g : 'zugewinn'); setK(num(u, 'k', 2)); setEl(str(u, 'e', '2')); setGe(num(u, 's', 0)); setGr(str(u, 'o', '0')); setN(num(u, 'n', 300000)); setSch(num(u, 'x', sch)); setJahre(num(u, 'j', jahre)); }, []);
  useEffect(() => { updateURL({ v: verh, g: gs, k, e: el, s: ge, o: gr, n, x: sch, j: jahre }); }, [verh, gs, k, el, ge, gr, n, sch, jahre]);
  const r = useMemo(() => erbfolge({ verheiratet: verh === '1', gueterstand: gs, kinder: k, elternLebend: Number(el) as 0 | 1 | 2, geschwister: ge, grosseltern: gr === '1', nachlass: n }), [verh, gs, k, el, ge, gr, n]);
  const wer = (w: string, anz: number) => ({ ehegatte: tx(lang, 'Ehegatte', 'Spouse'), kind: tx(lang, anz > 1 ? `Je Kind (${anz})` : 'Kind', anz > 1 ? `Each child (${anz})` : 'Child'), elternteil: tx(lang, anz > 1 ? 'Je Elternteil' : 'Elternteil', anz > 1 ? 'Each parent' : 'Parent'), geschwister: tx(lang, `Je Geschwister (${anz})`, `Each sibling (${anz})`), grosseltern: tx(lang, 'Großeltern und Abkömmlinge', 'Grandparents and their descendants'), staat: tx(lang, 'Staat (§ 1936 BGB) oder entferntere Verwandte', 'The state (section 1936 BGB) or more distant relatives') } as Record<string, string>)[w];
  const kindAnteil = r.anteile.find((a) => a.wer === 'kind');
  const quotePt = (kindAnteil?.quoteJe ?? 0) * P.erbrecht.pflichtteil_quote;
  const erg = pflichtteilsergaenzung(sch, jahre, quotePt);
  const steps = [
    tx(lang, `${['Keine Verwandten der ersten drei Ordnungen', 'Erste Ordnung: Kinder', 'Zweite Ordnung: Eltern und Geschwister', 'Dritte Ordnung: Großeltern'][r.ordnung]} (§§ 1924 ff. BGB).`, `${['No relatives of the first three orders', 'First order: children', 'Second order: parents and siblings', 'Third order: grandparents'][r.ordnung]} (sections 1924 ff. BGB).`),
    ...(verh === '1' ? [tx(lang, `Ehegatte: ${bruch(r.ehegatteBasis)} nach § 1931 BGB${r.ehegatteErhoehung ? ` plus ${bruch(r.ehegatteErhoehung)} Zugewinnausgleich (§ 1371 Abs. 1 BGB)` : ''}.`, `Spouse: ${bruch(r.ehegatteBasis)} under section 1931 BGB${r.ehegatteErhoehung ? ` plus ${bruch(r.ehegatteErhoehung)} for the accrued gain (section 1371(1) BGB)` : ''}.`)] : []),
    tx(lang, 'Pflichtteil = Hälfte des gesetzlichen Erbteils (§ 2303 BGB); nur Kinder, Ehegatte und, ohne Kinder, Eltern.', 'Compulsory share = half the statutory share (section 2303 BGB); only children, spouse and, without children, parents.'),
    ...(pt && sch > 0 ? [tx(lang, `Schenkung ${f.eur(sch)} vor ${jahre} Jahr(en): zu ${f.pct(erg.faktor, 0)} angerechnet (§ 2325 Abs. 3 BGB).`, `Gift of ${f.eur(sch)} made ${jahre} year(s) ago: counted at ${f.pct(erg.faktor, 0)} (section 2325(3) BGB).`)] : []),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ef-n" label={tx(lang, 'Wert des Nachlasses', 'Value of the estate')} value={n} onChange={setN} unit="€" max={100000000} lang={lang} help={tx(lang, 'nach Abzug der Schulden', 'after debts')} />
            <Toggle id="ef-v" label={tx(lang, 'Verheiratet?', 'Married?')} value={verh} onChange={setVerh} options={janein(lang)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {verh === '1' ? <SelectField id="ef-g" label={tx(lang, 'Güterstand', 'Matrimonial regime')} value={gs} onChange={(v) => setGs(v as Gueterstand)} options={[{ value: 'zugewinn', label: tx(lang, 'Zugewinngemeinschaft (Regelfall)', 'Community of accrued gains (default)') }, { value: 'trennung', label: tx(lang, 'Gütertrennung', 'Separation of property') }, { value: 'gemeinschaft', label: tx(lang, 'Gütergemeinschaft', 'Community of property') }]} /> : <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />}
            <NumberField id="ef-k" label={tx(lang, 'Kinder', 'Children')} value={k} onChange={(v) => setK(Math.round(v))} max={20} lang={lang} help={tx(lang, 'verstorbene Kinder mit eigenen Kindern mitzählen', 'count a deceased child who left children')} />
          </div>
          {k === 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              <SelectField id="ef-e" label={tx(lang, 'Lebende Eltern', 'Living parents')} value={el} onChange={setEl} options={['0', '1', '2'].map((v) => ({ value: v, label: v }))} />
              <NumberField id="ef-s" label={tx(lang, 'Geschwister', 'Siblings')} value={ge} onChange={(v) => setGe(Math.round(v))} max={20} lang={lang} />
              <Toggle id="ef-o" label={tx(lang, 'Großeltern?', 'Grandparents?')} value={gr} onChange={setGr} options={janein(lang)} />
            </div>
          )}
          {pt && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="ef-x" label={tx(lang, 'Schenkung an Dritte', 'Gift to someone else')} value={sch} onChange={setSch} unit="€" max={100000000} lang={lang} />
              <NumberField id="ef-j" label={tx(lang, 'Volle Jahre seit Schenkung', 'Full years since the gift')} value={jahre} onChange={setJahre} max={50} lang={lang} />
            </div>
          )}
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          {pt
            ? <Kopf label={tx(lang, 'Pflichtteil je Kind', 'Compulsory share per child')} wert={f.eur((kindAnteil?.pflichtteilJe ?? 0) + erg.ergaenzung)} unter={tx(lang, `Quote ${bruch(quotePt)}${erg.ergaenzung ? `, davon Ergänzung ${f.eur(erg.ergaenzung)}` : ''}`, `Share ${bruch(quotePt)}${erg.ergaenzung ? `, incl. top-up ${f.eur(erg.ergaenzung)}` : ''}`)} />
            : <Kopf label={tx(lang, 'Gesetzliche Erbfolge', 'Statutory succession')} wert={r.anteile.length ? bruch(r.anteile[0].quoteJe) : '–'} unter={r.anteile.length ? `${wer(r.anteile[0].wer, r.anteile[0].anzahl)}: ${f.eur(r.anteile[0].betragJe)}` : ''} />}
          <Zeilen rows={[
            ...r.anteile.map((a) => ({ label: `${wer(a.wer, a.anzahl)} · ${bruch(a.quoteJe)}`, value: f.eur(a.betragJe) })),
            ...r.anteile.filter((a) => a.pflichtteilJe > 0).map((a) => ({ label: tx(lang, `Pflichtteil: ${wer(a.wer, a.anzahl)}`, `Compulsory share: ${wer(a.wer, a.anzahl)}`), value: f.eur(a.pflichtteilJe), muted: true })),
            ...(verh === '1' && gs === 'zugewinn' && r.ordnung > 0 ? [{ label: tx(lang, 'Kleiner Pflichtteil Ehegatte (+ Zugewinnausgleich)', 'Small compulsory share spouse (+ accrued gain)'), value: f.eur(r.kleinerPflichtteilEhegatte), muted: true }] : []),
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => r.anteile.map((a) => `${wer(a.wer, a.anzahl)} ${bruch(a.quoteJe)} = ${f.eur(a.betragJe)}`).join(' · ')} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function ErbStRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [erw, setErw] = useState(650000); const [bz, setBz] = useState<Beziehung>('kind'); const [fall, setFall] = useState('1'); const [alter, setAlter] = useState(35); const [haus, setHaus] = useState(0); const [vor, setVor] = useState(0); const [quote, setQuote] = useState(100);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setErw(num(u, 'w', 650000)); const b = str(u, 'b', 'kind') as Beziehung; setBz(BEZIEHUNGEN.includes(b) ? b : 'kind'); setFall(str(u, 'f', '1')); setAlter(num(u, 'a', 35)); setHaus(num(u, 'h', 0)); setVor(num(u, 'v', 0)); setQuote(num(u, 'q', 100)); }, []);
  useEffect(() => { updateURL({ w: erw, b: bz, f: fall, a: alter, h: haus, v: vor, q: quote }); }, [erw, bz, fall, alter, haus, vor, quote]);
  const r = useMemo(() => erbschaftsteuer({ erwerb: erw, beziehung: bz, erbfall: fall === '1', alterKind: alter, hausrat: haus, vorerwerbe: vor, anteilNachlass: quote / 100 }), [erw, bz, fall, alter, haus, vor, quote]);
  const BL: Record<Beziehung, [string, string]> = {
    ehegatte: ['Ehegatte / eingetragener Lebenspartner', 'Spouse / registered partner'], kind: ['Kind, Stiefkind', 'Child, stepchild'], enkel_kind_verstorben: ['Enkel (Elternteil verstorben)', 'Grandchild (parent deceased)'], enkel: ['Enkel', 'Grandchild'], eltern: ['Eltern, Großeltern', 'Parents, grandparents'],
    geschwister: ['Geschwister', 'Siblings'], nichte_neffe: ['Nichte, Neffe', 'Niece, nephew'], stiefeltern: ['Stiefeltern', 'Step-parents'], schwiegerkind: ['Schwiegerkind', 'Child-in-law'], schwiegereltern: ['Schwiegereltern', 'Parents-in-law'], geschieden: ['Geschiedener Ehegatte', 'Divorced spouse'], sonstige: ['Andere (z. B. Lebensgefährte)', 'Others (e.g. unmarried partner)'],
  };
  const steps = [
    tx(lang, `Steuerklasse ${r.klasse} (§ 15 ErbStG), persönlicher Freibetrag ${f.eur(r.freibetrag)} (§ 16)${r.versorgung ? `, Versorgungsfreibetrag ${f.eur(r.versorgung)} (§ 17)` : ''}.`, `Tax class ${r.klasse} (section 15 ErbStG), personal allowance ${f.eur(r.freibetrag)} (section 16)${r.versorgung ? `, pension allowance ${f.eur(r.versorgung)} (section 17)` : ''}.`),
    ...(r.kosten ? [tx(lang, `Erbfallkostenpauschale ${f.eur(r.kosten)} (§ 10 Abs. 5 Nr. 3).`, `Flat allowance for estate costs ${f.eur(r.kosten)} (section 10(5) no. 3).`)] : []),
    ...(r.hausratFrei ? [tx(lang, `Hausrat steuerfrei: ${f.eur(r.hausratFrei)} (§ 13 Abs. 1 Nr. 1).`, `Household goods exempt: ${f.eur(r.hausratFrei)} (section 13(1) no. 1).`)] : []),
    tx(lang, `Steuerpflichtiger Erwerb, auf volle 100 € abgerundet: ${f.eur(r.steuerpflichtig)}; Steuersatz ${f.pct(r.satz, 0)}${r.haerteausgleich ? ', gemildert durch den Härteausgleich (§ 19 Abs. 3)' : ''}.`, `Taxable acquisition, rounded down to €100: ${f.eur(r.steuerpflichtig)}; rate ${f.pct(r.satz, 0)}${r.haerteausgleich ? ', reduced by hardship relief (section 19(3))' : ''}.`),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="es-w" label={tx(lang, 'Wert des Erwerbs', 'Value received')} value={erw} onChange={setErw} unit="€" max={500000000} lang={lang} help={tx(lang, 'Steuerwert, nach Schulden', 'tax value, after debts')} />
            <SelectField id="es-b" label={tx(lang, 'Verhältnis zum Erblasser', 'Relationship to the deceased')} value={bz} onChange={(v) => setBz(v as Beziehung)} options={BEZIEHUNGEN.map((b) => ({ value: b, label: tx(lang, BL[b][0], BL[b][1]) }))} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="es-f" label={tx(lang, 'Anlass', 'Occasion')} value={fall} onChange={setFall} options={[{ value: '1', label: tx(lang, 'Erbe', 'Death') }, { value: '0', label: tx(lang, 'Schenkung', 'Gift') }]} />
            {bz === 'kind' && fall === '1' ? <NumberField id="es-a" label={tx(lang, 'Alter des Kindes', 'Child’s age')} value={alter} onChange={(v) => setAlter(Math.round(v))} unit={tx(lang, 'J.', 'yrs')} max={120} lang={lang} /> : <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="es-h" label={tx(lang, 'Davon Hausrat', 'Of which household goods')} value={haus} onChange={setHaus} unit="€" max={10000000} lang={lang} />
            <NumberField id="es-v" label={tx(lang, 'Steuerfreie Vorschenkungen (10 Jahre)', 'Untaxed prior gifts (10 years)')} value={vor} onChange={setVor} unit="€" max={500000000} lang={lang} />
          </div>
          {fall === '1' && <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="es-q" label={tx(lang, 'Ihr Anteil am Nachlass', 'Your share of the estate')} value={quote} onChange={(v) => setQuote(Math.min(100, Math.max(0, v)))} unit="%" max={100} lang={lang} help={tx(lang, 'Alleinerbe 100 %; teilt die Kostenpauschale', 'sole heir 100%; splits the flat cost allowance')} />
          </div>}
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, fall === '1' ? 'Erbschaftsteuer' : 'Schenkungsteuer', fall === '1' ? 'Inheritance tax' : 'Gift tax')} wert={f.eur(r.steuer)} unter={tx(lang, `Steuerklasse ${r.klasse} · Satz ${f.pct(r.satz, 0)}`, `Tax class ${r.klasse} · rate ${f.pct(r.satz, 0)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Freibetrag', 'Allowance'), value: f.eur(r.freibetrag) },
            ...(r.versorgung ? [{ label: tx(lang, 'Versorgungsfreibetrag', 'Pension allowance'), value: f.eur(r.versorgung) }] : []),
            { label: tx(lang, 'Steuerpflichtig', 'Taxable'), value: f.eur(r.steuerpflichtig), strong: true, sep: true },
            { label: tx(lang, 'Belastung des Erwerbs', 'Effective burden'), value: f.pct(r.effektiv), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Erbschaftsteuer 2026: ${f.eur(r.steuer)} auf ${f.eur(erw)} (Klasse ${r.klasse})`, `German inheritance tax 2026: ${f.eur(r.steuer)} on ${f.eur(erw)} (class ${r.klasse})`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export default ErbfolgeRechner;
