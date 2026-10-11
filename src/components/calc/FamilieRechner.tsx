/** Volljährigen-, Wechselmodell-, Eltern- und Unterhaltsvorschuss-Rechner (Leitlinien NRW 2026, DT 2026, UVG). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { volljaehrigenunterhalt, wechselmodell, elternunterhalt, unterhaltsvorschuss } from '../../lib/engine/unterhalt';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

type Props = { lang?: L; methodHref?: string };
const janein = (l: L) => [{ value: '1', label: tx(l, 'Ja', 'Yes') }, { value: '0', label: tx(l, 'Nein', 'No') }];

export function VolljaehrigRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [a, setA] = useState(3200); const [b, setB] = useState(2100); const [haus, setHaus] = useState('0'); const [eig, setEig] = useState(0); const [priv, setPriv] = useState('0');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setA(num(u, 'a', 3200)); setB(num(u, 'b', 2100)); setHaus(str(u, 'h', '0')); setEig(num(u, 'k', 0)); setPriv(str(u, 'p', '0')); }, []);
  useEffect(() => { updateURL({ a, b, h: haus, k: eig, p: priv }); }, [a, b, haus, eig, priv]);
  const r = useMemo(() => volljaehrigenunterhalt({ einkommenA: a, einkommenB: b, eigenerHaushalt: haus === '1', eigenesEinkommen: eig, privilegiert: priv === '1' && haus === '0' }), [a, b, haus, eig, priv]);
  const steps = [
    haus === '1' ? tx(lang, `Eigener Haushalt: Regelbedarf ${f.eur(P.dt.student_bedarf)} (Anm. A IV DT, davon bis ${f.eur(P.dt.student_warmmiete)} Warmmiete).`, `Own household: standard need ${f.eur(P.dt.student_bedarf)} (note A IV, up to ${f.eur(P.dt.student_warmmiete)} warm rent).`)
      : tx(lang, `Im Elternhaushalt: 4. Altersstufe nach dem zusammengerechneten Einkommen ${f.eur(a + b)}, Gruppe ${(r.gruppe ?? 0) + 1}: ${f.eur(r.bedarf)}.`, `Living at home: 4th age band on the combined income ${f.eur(a + b)}, group ${(r.gruppe ?? 0) + 1}: ${f.eur(r.bedarf)}.`),
    tx(lang, `Minus volles Kindergeld ${f.eur(P.kindergeld.monat)}${eig ? ` und eigenes Einkommen ${f.eur(eig)}` : ''}: Restbedarf ${f.eur2(r.restbedarf)}.`, `Minus full child benefit ${f.eur(P.kindergeld.monat)}${eig ? ` and own income ${f.eur(eig)}` : ''}: remaining need ${f.eur2(r.restbedarf)}.`),
    tx(lang, `Haftung nach Einkommen über ${f.eur(r.sockel)}: ${f.eur2(r.haftungA)} und ${f.eur2(r.haftungB)}, Quoten ${f.pct(r.quoteA)} / ${f.pct(r.quoteB)}.`, `Liability on income above ${f.eur(r.sockel)}: ${f.eur2(r.haftungA)} and ${f.eur2(r.haftungB)}, shares ${f.pct(r.quoteA)} / ${f.pct(r.quoteB)}.`),
  ];
  if (r.kappungA || r.kappungB) steps.push(tx(lang, 'Ein Elternteil zahlt höchstens, was er nach seinem eigenen Einkommen allein zahlen müsste (Nr. 13.1 Leitlinien NRW).', 'A parent never pays more than his or her own income alone would require (no. 13.1 NRW guidelines).'));
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="vj-a" label={tx(lang, 'Netto Elternteil A', 'Net income parent A')} value={a} onChange={setA} unit="€" max={100000} lang={lang} />
            <NumberField id="vj-b" label={tx(lang, 'Netto Elternteil B', 'Net income parent B')} value={b} onChange={setB} unit="€" max={100000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Toggle id="vj-h" label={tx(lang, 'Eigene Wohnung?', 'Own home?')} value={haus} onChange={setHaus} options={janein(lang)} />
            <NumberField id="vj-k" label={tx(lang, 'Einkommen des Kindes', 'Child’s income')} value={eig} onChange={setEig} unit="€" max={10000} lang={lang} help={tx(lang, 'BAföG, Lohn nach 100 € Pauschale', 'BAföG, pay after €100 allowance')} />
          </div>
          {haus === '0' && <div className="grid grid-cols-2 gap-x-4 gap-y-4"><Toggle id="vj-p" label={tx(lang, 'Unter 21 und Schüler?', 'Under 21 and at school?')} value={priv} onChange={setPriv} options={janein(lang)} /><div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" /></div>}
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Unterhalt für das volljährige Kind', 'Support for the adult child')} wert={f.eur2(r.anteilA + r.anteilB)} unter={tx(lang, `Restbedarf ${f.eur2(r.restbedarf)}`, `Remaining need ${f.eur2(r.restbedarf)}`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Elternteil A zahlt', 'Parent A pays'), value: f.eur2(r.anteilA) },
            { label: tx(lang, 'Elternteil B zahlt', 'Parent B pays'), value: f.eur2(r.anteilB) },
            { label: tx(lang, 'Bedarf vor Kindergeld', 'Need before child benefit'), value: f.eur(r.bedarf), muted: true },
            ...(r.ungedeckt > 0 ? [{ label: tx(lang, 'Nicht gedeckt', 'Not covered'), value: f.eur2(r.ungedeckt), muted: true }] : []),
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Volljährigenunterhalt 2026: A ${f.eur2(r.anteilA)}, B ${f.eur2(r.anteilB)}`, `Adult child support 2026: A ${f.eur2(r.anteilA)}, B ${f.eur2(r.anteilB)}`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function WechselRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [a, setA] = useState(3800); const [b, setB] = useState(2400); const [alter, setAlter] = useState(8); const [mehr, setMehr] = useState(0); const [kg, setKg] = useState<'A' | 'B'>('B');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setA(num(u, 'a', 3800)); setB(num(u, 'b', 2400)); setAlter(num(u, 'k', 8)); setMehr(num(u, 'm', 0)); setKg(str(u, 'g', 'B') === 'A' ? 'A' : 'B'); }, []);
  useEffect(() => { updateURL({ a, b, k: alter, m: mehr, g: kg }); }, [a, b, alter, mehr, kg]);
  const r = useMemo(() => wechselmodell({ einkommenA: a, einkommenB: b, alter, mehrbedarf: mehr, kindergeldAn: kg }), [a, b, alter, mehr, kg]);
  const steps = [
    tx(lang, `Bedarf nach zusammengerechnetem Einkommen ${f.eur(a + b)}: Gruppe ${r.gruppe + 1}, ${f.eur(r.tabellenbedarf)}${mehr ? ` plus Mehrkosten ${f.eur(mehr)}` : ''}.`, `Need on the combined income ${f.eur(a + b)}: group ${r.gruppe + 1}, ${f.eur(r.tabellenbedarf)}${mehr ? ` plus extra costs ${f.eur(mehr)}` : ''}.`),
    tx(lang, `Minus halbes Kindergeld: Barbedarf ${f.eur2(r.barbedarf)}.`, `Minus half the child benefit: cash need ${f.eur2(r.barbedarf)}.`),
    tx(lang, `Haftung über ${f.eur(P.leitlinien.sockel_volljaehrig)}: A ${f.pct(r.quoteA)}, B ${f.pct(r.quoteB)} → ${f.eur2(r.anteilA)} / ${f.eur2(r.anteilB)}.`, `Liability above ${f.eur(P.leitlinien.sockel_volljaehrig)}: A ${f.pct(r.quoteA)}, B ${f.pct(r.quoteB)} → ${f.eur2(r.anteilA)} / ${f.eur2(r.anteilB)}.`),
    tx(lang, `Beide leisten die Hälfte in Natur; zu zahlen bleibt die halbe Differenz: ${f.eur2(r.spitze)}${r.zahlt ? ` von ${r.zahlt}` : ''}.`, `Each provides half in kind; what remains is half the difference: ${f.eur2(r.spitze)}${r.zahlt ? ` from ${r.zahlt}` : ''}.`),
    tx(lang, `Kindergeld bei ${kg}: gibt ${f.eur2(r.kgWeitergabe)} weiter (Betreuungsanteil hälftig, Baranteil nach Quote).`, `Child benefit received by ${kg}: passes on ${f.eur2(r.kgWeitergabe)} (care half split equally, cash half by share).`),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="wm-a" label={tx(lang, 'Netto Elternteil A', 'Net income parent A')} value={a} onChange={setA} unit="€" max={100000} lang={lang} />
            <NumberField id="wm-b" label={tx(lang, 'Netto Elternteil B', 'Net income parent B')} value={b} onChange={setB} unit="€" max={100000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="wm-k" label={tx(lang, 'Alter des Kindes', 'Child’s age')} value={alter} onChange={(v) => setAlter(Math.round(v))} unit={tx(lang, 'J.', 'yrs')} max={17} lang={lang} />
            <NumberField id="wm-m" label={tx(lang, 'Mehrkosten des Wechselmodells', 'Extra costs of shared care')} value={mehr} onChange={setMehr} unit="€" max={5000} lang={lang} help={tx(lang, 'Wohnung, Fahrten, Kita: Ihre Annahme', 'housing, travel, daycare: your estimate')} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Toggle id="wm-g" label={tx(lang, 'Kindergeld erhält', 'Child benefit paid to')} value={kg} onChange={(v) => setKg(v === 'A' ? 'A' : 'B')} options={[{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }]} />
            <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Ausgleichszahlung pro Monat', 'Balancing payment per month')} wert={f.eur2(r.ausgleich)} unter={r.ausgleichZahlt ? tx(lang, `zahlt Elternteil ${r.ausgleichZahlt}`, `paid by parent ${r.ausgleichZahlt}`) : tx(lang, 'kein Ausgleich', 'no payment')} />
          <Zeilen rows={[
            { label: tx(lang, 'Unterhaltsspitze (halbe Differenz)', 'Support peak (half the difference)'), value: f.eur2(r.spitze) },
            { label: tx(lang, `Kindergeldweitergabe durch ${kg}`, `Child benefit passed on by ${kg}`), value: f.eur2(r.kgWeitergabe) },
            { label: tx(lang, 'Gesamtbedarf des Kindes', 'Child’s total need'), value: f.eur(r.gesamtbedarf), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Wechselmodell 2026: Ausgleich ${f.eur2(r.ausgleich)} im Monat`, `Shared care 2026: balancing payment ${f.eur2(r.ausgleich)} a month`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function ElternRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [n, setN] = useState(4800); const [brutto, setBrutto] = useState(105000); const [l, setL] = useState(1400);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setN(num(u, 'n', 4800)); setBrutto(num(u, 'j', 105000)); setL(num(u, 'l', 1400)); }, []);
  useEffect(() => { updateURL({ n, j: brutto, l }); }, [n, brutto, l]);
  const r = useMemo(() => elternunterhalt({ nettoBereinigt: n, jahresbrutto: brutto, luecke: l }), [n, brutto, l]);
  const steps = [
    tx(lang, `Jahreseinkommen ${f.eur(brutto)} ${r.rueckgriffMoeglich ? 'über' : 'nicht über'} ${f.eur(r.grenze)}: ${r.rueckgriffMoeglich ? 'das Sozialamt kann Elternunterhalt verlangen' : 'kein Übergang des Anspruchs auf das Sozialamt (§ 94 Abs. 1a SGB XII)'}.`, `Annual income ${f.eur(brutto)} ${r.rueckgriffMoeglich ? 'above' : 'not above'} ${f.eur(r.grenze)}: ${r.rueckgriffMoeglich ? 'the social welfare office can claim parental maintenance' : 'no transfer of the claim to the welfare office (section 94(1a) SGB XII)'}.`),
    tx(lang, `Selbstbehalt ${f.eur(P.selbstbehalt.eltern)} plus ${f.pct(P.selbstbehalt.eltern_anrechnungsfrei_anteil, 0)} des Mehreinkommens: ${f.eur2(r.selbstbehalt)}.`, `Self-retention ${f.eur(P.selbstbehalt.eltern)} plus ${f.pct(P.selbstbehalt.eltern_anrechnungsfrei_anteil, 0)} of the excess: ${f.eur2(r.selbstbehalt)}.`),
    tx(lang, `Leistungsfähig: ${f.eur2(r.leistungsfaehig)}; offene Lücke der Eltern ${f.eur(l)}.`, `Ability to pay: ${f.eur2(r.leistungsfaehig)}; parents' unmet need ${f.eur(l)}.`),
  ];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="el-n" label={tx(lang, 'Ihr bereinigtes Netto', 'Your adjusted net income')} value={n} onChange={setN} unit="€" max={100000} lang={lang} />
            <NumberField id="el-j" label={tx(lang, 'Jahresbruttoeinkommen', 'Annual gross income')} value={brutto} onChange={setBrutto} unit="€" max={5000000} lang={lang} help={tx(lang, 'Gesamtbetrag der Einkünfte (§ 16 SGB IV)', 'total income (section 16 SGB IV)')} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="el-l" label={tx(lang, 'Ungedeckter Bedarf der Eltern', 'Parents’ unmet need')} value={l} onChange={setL} unit="€" max={20000} lang={lang} help={tx(lang, 'Heimkosten minus Rente, Pflegegeld, Grundsicherung', 'care costs minus pension, care benefits, basic income')} />
            <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Elternunterhalt pro Monat', 'Parental maintenance per month')} wert={f.eur2(r.unterhalt)} unter={r.rueckgriffMoeglich ? tx(lang, 'Rückgriff des Sozialamts möglich', 'welfare office may claim') : tx(lang, `unter der ${f.eur(r.grenze)}-Grenze: kein Rückgriff`, `under the ${f.eur(r.grenze)} limit: no claim`)} />
          <Zeilen rows={[
            { label: tx(lang, 'Selbstbehalt', 'Self-retention'), value: f.eur2(r.selbstbehalt) },
            { label: tx(lang, 'Leistungsfähig bis', 'Can pay up to'), value: f.eur2(r.leistungsfaehig) },
            { label: tx(lang, 'Jahreseinkommensgrenze', 'Annual income limit'), value: f.eur(r.grenze), muted: true },
          ]} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Elternunterhalt 2026: ${f.eur2(r.unterhalt)} im Monat`, `Parental maintenance 2026: ${f.eur2(r.unterhalt)} a month`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export function UvgRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const [alter, setAlter] = useState(7); const [erh, setErh] = useState(0); const [waise, setWaise] = useState(0); const [ab12, setAb12] = useState('1');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setAlter(num(u, 'k', 7)); setErh(num(u, 'u', 0)); setWaise(num(u, 'w', 0)); setAb12(str(u, 'z', '1')); }, []);
  useEffect(() => { updateURL({ k: alter, u: erh, w: waise, z: ab12 }); }, [alter, erh, waise, ab12]);
  const r = useMemo(() => unterhaltsvorschuss({ alter, unterhaltErhalten: erh, waisenbezuege: waise, ab12Voraussetzung: ab12 === '1' }), [alter, erh, waise, ab12]);
  const steps = r.grund === 'ok' ? [
    tx(lang, `Mindestunterhalt der Altersstufe: ${f.eur(r.mindestunterhalt)} (§ 2 Abs. 1 UVG).`, `Minimum maintenance for the age band: ${f.eur(r.mindestunterhalt)} (section 2(1) UVG).`),
    tx(lang, `Minus Kindergeld für ein erstes Kind: ${f.eur(r.kindergeldAbzug)} (§ 2 Abs. 2 UVG).`, `Minus child benefit for a first child: ${f.eur(r.kindergeldAbzug)} (section 2(2) UVG).`),
    ...(erh || waise ? [tx(lang, `Minus erhaltener Unterhalt und Waisenbezüge: ${f.eur(erh + waise)} (§ 2 Abs. 3 UVG).`, `Minus maintenance and orphan's benefits received: ${f.eur(erh + waise)} (section 2(3) UVG).`)] : []),
  ] : [];
  return (
    <div className={rahmen} data-chrome><div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="uv-k" label={tx(lang, 'Alter des Kindes', 'Child’s age')} value={alter} onChange={(v) => setAlter(Math.round(v))} unit={tx(lang, 'J.', 'yrs')} max={20} lang={lang} />
            <NumberField id="uv-u" label={tx(lang, 'Unterhalt, der ankommt', 'Maintenance actually received')} value={erh} onChange={setErh} unit="€" max={5000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="uv-w" label={tx(lang, 'Waisenbezüge', 'Orphan’s benefits')} value={waise} onChange={setWaise} unit="€" max={5000} lang={lang} />
            {alter >= P.uvg.alter_grenze_ohne_bedingung && alter < P.uvg.alter_grenze
              ? <Toggle id="uv-z" label={tx(lang, `Kein Bürgergeld oder ≥ ${P.uvg.mindesteinkommen_elternteil_ab12} € Einkommen?`, `No Bürgergeld or ≥ €${P.uvg.mindesteinkommen_elternteil_ab12} income?`)} value={ab12} onChange={setAb12} options={janein(lang)} />
              : <div className="grid grid-rows-subgrid row-span-3" aria-hidden="true" />}
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Unterhaltsvorschuss pro Monat', 'Maintenance advance per month')} wert={f.eur2(r.leistung)} unter={r.grund === 'alter' ? tx(lang, 'ab 18 Jahren kein Anspruch', 'no entitlement from age 18') : r.grund === 'ab12' ? tx(lang, 'ab 12 nur mit den Voraussetzungen des § 1 Abs. 1a UVG', 'from 12 only under section 1(1a) UVG') : tx(lang, 'beim Jugendamt zu beantragen', 'apply at the youth welfare office')} />
          <Zeilen rows={[0, 1, 2].map((s) => ({ label: [tx(lang, '0 bis 5 Jahre', 'age 0 to 5'), tx(lang, '6 bis 11 Jahre', 'age 6 to 11'), tx(lang, '12 bis 17 Jahre', 'age 12 to 17')][s], value: f.eur(P.mindestunterhalt.stufen[s] - P.kindergeld.monat), muted: r.stufe !== s }))} caption={tx(lang, 'Volle Leistung 2026', 'Full amount 2026')} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Unterhaltsvorschuss 2026: ${f.eur2(r.leistung)} im Monat`, `Maintenance advance 2026: ${f.eur2(r.leistung)} a month`)} />
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}

export default VolljaehrigRechner;
