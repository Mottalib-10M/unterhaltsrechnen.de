import { defineGuide } from '../../lib/guide-types';
import { zahlbetrag, mangelfallGrenze, kindesunterhalt, type Stufe } from '../../lib/engine/dt';
import { uvgVoll } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Mindestunterhalt 2026 aus params, Zahlbeträge und Unterhaltsvorschuss aus dem Motor. */
const M = P.mindestunterhalt.stufen;
const PZ = P.mindestunterhalt.prozent_existenzminimum;
const M25 = P.dt2025.bedarf[0];
const KG = P.kindergeld.monat;
const AS = P.dt.altersstufen;
const MIN: Stufe[] = [0, 1, 2];
const familien = [
  { de: 'ein Kind, 3 Jahre', en: 'one child aged 3', k: [{ alter: 3 }] },
  { de: 'ein Kind, 8 Jahre', en: 'one child aged 8', k: [{ alter: 8 }] },
  { de: 'ein Kind, 14 Jahre', en: 'one child aged 14', k: [{ alter: 14 }] },
  { de: 'zwei Kinder, 4 und 9 Jahre', en: 'two children aged 4 and 9', k: [{ alter: 4 }, { alter: 9 }] },
  { de: 'drei Kinder, 2, 7 und 13 Jahre', en: 'three children aged 2, 7 and 13', k: [{ alter: 2 }, { alter: 7 }, { alter: 13 }] },
].map((f) => ({ ...f, summe: f.k.reduce((s, k) => s + zahlbetrag(0, (k.alter < 6 ? 0 : k.alter < 12 ? 1 : 2) as Stufe), 0), grenze: mangelfallGrenze(f.k) }));
const knapp = kindesunterhalt(1800, [{ alter: 8 }]);

export default defineGuide({
  id: 'mindestunterhalt',
  group: 'kind',
  order: 22,
  mini: 'mindestunterhalt',
  related: ['unterhaltsvorschuss', 'mangelfall', 'zahlbetragstabelle', 'selbstbehalt', 'kindesunterhalt', 'duesseldorfer-tabelle-aenderungen'],
  sources: ['bgb1612a', 'olgDtPdf', 'uvg2', 'bgb1603', 'olgLeitlinien'],
  de: {
    slug: 'mindestunterhalt',
    nav: 'Mindestunterhalt',
    card: 'Die gesetzliche Untergrenze für minderjährige Kinder: Beträge, Prozentsätze, Zahlbetrag und Unterhaltsvorschuss.',
    title: 'Mindestunterhalt 2026: Beträge nach Alter und § 1612a BGB',
    description: `Mindestunterhalt 2026 nach § 1612a BGB: ${DE.eur(M[0])}, ${DE.eur(M[1])} und ${DE.eur(M[2])} je Altersstufe, Zahlbetrag nach Abzug des halben Kindergeldes, Bezug zum Unterhaltsvorschuss.`,
    h1: 'Mindestunterhalt 2026 für minderjährige Kinder',
    intro: 'Unter diesen Betrag sinkt der Bedarf eines minderjährigen Kindes nicht, gleich wie wenig der zahlende Elternteil verdient.',
    resume: `Der Mindestunterhalt 2026 beträgt ${DE.eur(M[0])} für Kinder von ${AS[0][0]} bis ${AS[0][1]} Jahren, ${DE.eur(M[1])} von ${AS[1][0]} bis ${AS[1][1]} Jahren und ${DE.eur(M[2])} von ${AS[2][0]} bis ${AS[2][1]} Jahren. Er ist in § 1612a BGB geregelt und knüpft an das steuerfrei zu stellende sächliche Existenzminimum des Kindes an: ${DE.pct(PZ[0])}, ${DE.pct(PZ[1])} und ${DE.pct(PZ[2])} davon, auf volle Euro aufgerundet. Die konkreten Beträge legt das Bundesjustizministerium durch die Mindestunterhaltsverordnung fest; für 2026 gilt die Siebte Änderungsverordnung vom 15. November 2024. Gegenüber 2025 ist der Mindestunterhalt um ${DE.eur(M[0] - M25[0])} je Stufe gestiegen. Nach Abzug des halben Kindergeldes von ${DE.eur(KG / 2, 2)} zahlt der Elternteil mindestens ${DE.eur(zahlbetrag(0, 0), 2)}, ${DE.eur(zahlbetrag(0, 1), 2)} oder ${DE.eur(zahlbetrag(0, 2), 2)}. Der Mindestunterhalt ist zugleich die erste Gruppe der Düsseldorfer Tabelle und die Grundlage des Unterhaltsvorschusses: Zahlt der andere Elternteil nicht, leistet das Jugendamt den Mindestunterhalt abzüglich des vollen Kindergeldes, also ${DE.eur(uvgVoll(0))} bis ${DE.eur(uvgVoll(2))}.`,
    faqs: [
      { q: 'Muss ich den Mindestunterhalt auch zahlen, wenn ich wenig verdiene?', a: `Nur soweit Ihnen der notwendige Selbstbehalt von ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)} bleibt, wenn Sie arbeiten. Das Gesetz verlangt aber, dass Sie alle zumutbaren Anstrengungen unternehmen, um den Mindestunterhalt aufzubringen (§ 1603 Abs. 2 BGB). Gerichte rechnen deshalb oft ein Einkommen aus Vollzeitarbeit oder einem Nebenjob zu, auch wenn es tatsächlich nicht erzielt wird.` },
      { q: 'Gibt es einen Mindestunterhalt für volljährige Kinder?', a: `Nein, § 1612a BGB gilt nur für Minderjährige. Für volljährige Schulkinder unter 21, die bei einem Elternteil wohnen, verwenden Gerichte aber die vierte Altersstufe der ersten Gruppe, ${DE.eur(P.dt.bedarf[0][3])}, als Untergrenze. Davon geht das volle Kindergeld ab, und beide Eltern haften anteilig nach ihren Einkommen.` },
      { q: 'Wie hängen Mindestunterhalt und Unterhaltsvorschuss zusammen?', a: `Der Unterhaltsvorschuss entspricht dem Mindestunterhalt abzüglich des vollen Kindergeldes (§ 2 UVG). Für 2026 sind das ${DE.eur(uvgVoll(0))}, ${DE.eur(uvgVoll(1))} und ${DE.eur(uvgVoll(2))}. Der Abzug ist größer als beim Unterhalt, weil der betreuende Elternteil das Kindergeld ganz behält. Ab ${DE.num(P.uvg.alter_grenze_ohne_bedingung)} Jahren gibt es den Vorschuss nur unter zusätzlichen Voraussetzungen.` },
      { q: 'Kann ein Titel auf den Mindestunterhalt dynamisch lauten?', a: `Ja. Minderjährige Kinder können Unterhalt als Prozentsatz des Mindestunterhalts verlangen, etwa „${DE.num(P.dt.prozent[0])} % des Mindestunterhalts der jeweiligen Altersstufe abzüglich des hälftigen Kindergeldes“. Ein solcher Titel steigt automatisch, sobald eine neue Mindestunterhaltsverordnung gilt oder das Kind in die nächste Altersstufe wechselt; ein Abänderungsverfahren ist dafür nicht nötig.` },
      { q: 'Warum ist der Mindestunterhalt bei Teenagern höher?', a: `Weil § 1612a BGB den Mindestunterhalt nach Alter staffelt: ${DE.pct(PZ[0])} des sächlichen Existenzminimums bis zum sechsten Geburtstag, ${DE.pct(PZ[1])} bis zum zwölften und ${DE.pct(PZ[2])} danach. Ältere Kinder brauchen mehr für Essen, Kleidung, Schulbedarf und Freizeit. Der höhere Betrag gilt ab dem Monat, in dem das Kind Geburtstag hat.` },
      { q: 'Muss ich als Bürgergeld-Empfänger den Mindestunterhalt zahlen?', a: `Bürgergeld zählt beim Unterhaltspflichtigen zwar als Einkommen (Nummer 2 der Leitlinien NRW), liegt aber in aller Regel unter dem notwendigen Selbstbehalt von ${DE.eur(P.selbstbehalt.notwendig_nicht_erwerbstaetig)}. Aus dem Bürgergeld selbst ist dann nichts zu zahlen. Das Gericht prüft jedoch, ob Sie arbeiten könnten, und rechnet gegebenenfalls ein fiktives Einkommen zu. Für das Kind springt in der Zwischenzeit oft der Unterhaltsvorschuss ein.` },
    ],
    body: (h) => `<h2>Die Beträge 2026 im Überblick</h2>
<p>Der Mindestunterhalt ist eine gesetzliche Größe, keine bloße Tabellenempfehlung. ${h.src('bgb1612a', '§ 1612a Abs. 1 BGB')} legt drei Altersstufen fest und bindet jede an einen Prozentsatz des sächlichen Existenzminimums des Kindes. Daraus ergeben sich für 2026 folgende Werte:</p>
${h.table(['Altersstufe', 'Anteil am Existenzminimum', 'Mindestunterhalt 2025', 'Mindestunterhalt 2026', 'Zahlbetrag 2026', 'Unterhaltsvorschuss 2026'], MIN.map((s) => [`${AS[s][0]} bis ${AS[s][1]} Jahre`, h.pct(PZ[s], 0), h.eur(M25[s]), h.eur(M[s]), h.eur(zahlbetrag(0, s), 2), h.eur(uvgVoll(s as 0 | 1 | 2))]), 'Zahlbetrag nach halbem Kindergeld, Vorschuss nach vollem Kindergeld', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Prozentsätze sind auf eine Nachkommastelle begrenzt, der errechnete Betrag wird auf volle Euro aufgerundet (§ 1612a Abs. 2 BGB). Die höhere Stufe gilt ab dem Ersten des Monats, in dem das Kind ${h.num(AS[1][0])} oder ${h.num(AS[2][0])} Jahre alt wird.</p>
<h2>Wer die Zahlen festlegt</h2>
<p>Das Bundesministerium der Justiz setzt den Mindestunterhalt durch Rechtsverordnung fest, ohne dass der Bundesrat zustimmen muss (§ 1612a Abs. 4 BGB). Für 2025 und 2026 hat die Siebte Verordnung zur Änderung der Mindestunterhaltsverordnung vom 15. November 2024 die Beträge geregelt. Die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} übernimmt sie in Anmerkung A II wörtlich als erste Einkommensgruppe.</p>
<p>Alle höheren Gruppen der Tabelle sind Vielfache davon: Gruppe 2 verlangt ${h.num(h.P.dt.prozent[1])} %, Gruppe 15 ${h.num(h.P.dt.prozent[14])} % des Mindestunterhalts. Steigt der Mindestunterhalt, steigt deshalb die ganze Tabelle mit; das erklärt die Änderungen auf der Seite ${h.a('duesseldorfer-tabelle-aenderungen', 'Düsseldorfer Tabelle 2026')}.</p>
<h2>Welches Einkommen der Mindestunterhalt voraussetzt</h2>
<p>Der Mindestunterhalt ist erst gesichert, wenn dem Zahlenden danach sein notwendiger ${h.a('selbstbehalt', 'Selbstbehalt')} bleibt. Für einen erwerbstätigen Elternteil sind das ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)}. Die folgende Tabelle zeigt, ab welchem bereinigten Netto (auf ${h.eur(10)} gerundet) kein ${h.a('mangelfall', 'Mangelfall')} mehr vorliegt:</p>
${h.table(['Familie', 'Mindest-Zahlbetrag gesamt', 'nötiges Netto'], familien.map((f) => [f.de, h.eur(f.summe, 2), h.eur(f.grenze)]), 'Vom Motor berechnet, erwerbstätiger Elternteil', ['l', 'r', 'r'])}
<p>Darunter wird gekürzt. Ein Vater mit ${h.eur(1800)} Netto und einem achtjährigen Kind kann nach dem Motor nur ${h.eur(knapp.summe, 2)} statt ${h.eur(zahlbetrag(0, 1), 2)} zahlen, weil ihm sonst weniger als ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} bliebe. Die Lücke kann der ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')} teilweise schließen.</p>
<h2>Gesteigerte Pflichten, solange der Mindestunterhalt fehlt</h2>
<p>Gegenüber minderjährigen Kindern trifft Eltern eine gesteigerte Unterhaltspflicht (${h.src('bgb1603', '§ 1603 Abs. 2 BGB')}). Die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} knüpfen daran mehrere Folgen, die genau so lange gelten, bis der Mindestunterhalt gedeckt ist:</p>
<ul>
<li>Überstunden und Einkünfte aus Nebentätigkeiten werden in der Regel voll angerechnet; unter Umständen muss ein Nebenjob aufgenommen werden (Nummer 1 Absatz 3 und Nummer 9).</li>
<li>Schulden mindern das Einkommen regelmäßig nur dann voll, wenn der Mindestunterhalt sichergestellt bleibt; im Extremfall kann sogar ein Insolvenzverfahren zumutbar sein (Nummer 10 Absatz 4).</li>
<li>Eine zusätzliche private Altersvorsorge von ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_kind_ehegatte, 0)} des Bruttoeinkommens wird beim Kindesunterhalt erst anerkannt, wenn der Mindestbedarf gedeckt ist.</li>
<li>Freiwillige Leistungen Dritter, etwa mietfreies Wohnen bei den Eltern, können ausnahmsweise als Einkommen zählen.</li>
</ul>
<p>Wer arbeitslos ist, muss sich ernsthaft bewerben; sonst rechnet das Gericht ein fiktives Einkommen zu, oft aus einer Vollzeitstelle im erlernten oder einem erreichbaren Beruf.</p>
<h2>Der Mindestunterhalt als Untergrenze in anderen Rechnungen</h2>
<p>Der Mindestunterhalt taucht nicht nur in Gruppe 1 auf. Er wirkt in mehreren Regeln als Haltelinie, an der Kürzungen enden:</p>
<ul>
<li>Bedarfskontrollbetrag: Gerichte stufen herab, wenn dem Zahlenden zu wenig bleibt, aber nach Anmerkung A I der Tabelle höchstens bis in die unterste Gruppe. Tiefer geht es nur über den Mangelfall.</li>
<li>Erweiterter Umgang: Betreut der Zahlende das Kind deutlich mehr als üblich, sind Abschläge möglich, nach Nummer 12 Absatz 5 der Leitlinien aber nur, soweit der Mindestunterhalt gewährleistet bleibt. Mehr dazu unter ${h.a('erweiterter-umgang', 'erweiterter Umgang')}.</li>
<li>Mehrbedarf wie Kita-Beiträge ohne Verpflegung kommt auf den Mindestunterhalt obendrauf und wird nach den Einkommen beider Eltern verteilt.</li>
<li>Bei mehreren Kindern aus verschiedenen Beziehungen haben alle minderjährigen Kinder denselben ersten Rang; reicht das Geld nicht für alle Mindestbeträge, wird anteilig gekürzt.</li>
</ul>
<p>Für den betreuenden Elternteil bedeutet das: Der Mindestunterhalt ist die Zahl, auf die er sich auch in knappen Verhältnissen am ehesten verlassen kann, notfalls über den Vorschuss des Staates.</p>
<h2>Mindestunterhalt im Verfahren</h2>
<p>Für den Mindestunterhalt gibt es einen besonders einfachen Weg zum Titel: das vereinfachte Verfahren über den Unterhalt Minderjähriger beim Familiengericht, das mit Formularen und in der Regel ohne mündliche Verhandlung auskommt. Alternativ verpflichtet sich der Zahlende in einer kostenlosen Urkunde beim Jugendamt. In beiden Fällen bietet sich der dynamische Titel an, der als Prozentsatz des Mindestunterhalts formuliert wird und mit jeder neuen Verordnung von selbst steigt.</p>
<p>Diese Darstellung des Mindestunterhalts 2026 ist allgemeine Information und keine Rechtsberatung; wie viel in Ihrer Lage tatsächlich verlangt werden kann, beurteilen das Jugendamt oder das Familiengericht.</p>`,
  },
  en: {
    slug: 'minimum-child-support',
    nav: 'Minimum child support',
    card: 'The statutory floor for minor children: amounts, percentages, net payment and the state maintenance advance.',
    title: 'Minimum Child Support in Germany 2026: Amounts by Age',
    description: `Minimum child support in Germany 2026 under section 1612a BGB: ${EN.eur(M[0])}, ${EN.eur(M[1])} and ${EN.eur(M[2])} by age band, net amounts after child benefit, link to the state advance.`,
    h1: 'Minimum child support in Germany for 2026',
    intro: 'A minor child’s need never falls below this amount, however little the paying parent earns.',
    resume: `Germany’s minimum child support (Mindestunterhalt) for 2026 is ${EN.eur(M[0])} a month for children aged ${AS[0][0]} to ${AS[0][1]}, ${EN.eur(M[1])} for ages ${AS[1][0]} to ${AS[1][1]} and ${EN.eur(M[2])} for ages ${AS[2][0]} to ${AS[2][1]}. It is set by section 1612a of the Civil Code (BGB) as ${EN.pct(PZ[0])}, ${EN.pct(PZ[1])} and ${EN.pct(PZ[2])} of the child’s tax-free material subsistence minimum, rounded up to whole euros. The Federal Ministry of Justice fixes the figures by ordinance; the 2026 amounts come from the Seventh Amending Ordinance of 15 November 2024 and are ${EN.eur(M[0] - M25[0])} higher per band than in 2025. After deducting half the child benefit, ${EN.eur(KG / 2, 2)}, a parent pays at least ${EN.eur(zahlbetrag(0, 0), 2)}, ${EN.eur(zahlbetrag(0, 1), 2)} or ${EN.eur(zahlbetrag(0, 2), 2)}. The minimum is also group 1 of the Düsseldorf Table and the basis of the state maintenance advance (Unterhaltsvorschuss): when the other parent does not pay, the youth welfare office pays the minimum less the full child benefit, ${EN.eur(uvgVoll(0))} to ${EN.eur(uvgVoll(2))} a month.`,
    faqs: [
      { q: 'Do I owe minimum child support in Germany on a low income?', a: `Only as far as you keep the minimum self-retention (Selbstbehalt) of ${EN.eur(P.selbstbehalt.notwendig_erwerbstaetig)} while working. The law, however, expects every reasonable effort to raise the minimum (section 1603(2) BGB). Courts therefore often assume income from full-time work or a side job, even if you do not actually earn it.` },
      { q: 'Is there a statutory minimum for children over 18?', a: `No, section 1612a BGB covers minors only. For pupils under 21 who live with a parent, courts use the fourth column of group 1, ${EN.eur(P.dt.bedarf[0][3])}, as a practical floor. The full child benefit is deducted from that, and both parents share the rest according to their incomes.` },
      { q: 'How does the maintenance advance relate to minimum support?', a: `The advance (Unterhaltsvorschuss) equals the statutory minimum less the full child benefit (section 2 of the Maintenance Advance Act, UVG): ${EN.eur(uvgVoll(0))}, ${EN.eur(uvgVoll(1))} and ${EN.eur(uvgVoll(2))} in 2026. The deduction is larger than for support because the resident parent keeps all the child benefit. From age ${EN.num(P.uvg.alter_grenze_ohne_bedingung)} extra conditions apply.` },
      { q: 'My ex lives abroad and pays nothing: does the German minimum still apply?', a: `The minimum describes your child’s need under German law, which usually governs when the child lives in Germany. Collecting it from a parent abroad is a separate step, often done through the Jugendamt or international enforcement channels. Meanwhile the German maintenance advance may be available to children living in Germany, subject to its conditions.` },
      { q: 'Why is minimum support higher for teenagers?', a: `Because section 1612a BGB grades the minimum by age: ${EN.pct(PZ[0])} of the material subsistence minimum until the sixth birthday, ${EN.pct(PZ[1])} until the twelfth and ${EN.pct(PZ[2])} after that. Older children cost more in food, clothing, school supplies and activities. The higher amount applies from the month of the birthday.` },
      { q: 'I receive Bürgergeld: do I still owe minimum child support?', a: `Citizen’s income (Bürgergeld) counts as the payer’s income under point 2 of the NRW guidelines, but it is almost always below the ${EN.eur(P.selbstbehalt.notwendig_nicht_erwerbstaetig)} self-retention of a non-working parent, so nothing is payable from it. The court will still ask whether you could work and may assume a notional income. In the meantime the child can often receive the maintenance advance.` },
    ],
    body: (h) => `<h2>The 2026 amounts at a glance</h2>
<p>The minimum is a statutory figure, not just a table recommendation. ${h.src('bgb1612a', 'Section 1612a(1) BGB')} sets three age bands and ties each to a share of the child’s material subsistence minimum. For 2026 that gives:</p>
${h.table(['Age band', 'Share of subsistence minimum', 'Minimum 2025', 'Minimum 2026', 'Payable 2026', 'Advance 2026'], MIN.map((s) => [`${AS[s][0]} to ${AS[s][1]}`, h.pct(PZ[s], 0), h.eur(M25[s]), h.eur(M[s]), h.eur(zahlbetrag(0, s), 2), h.eur(uvgVoll(s as 0 | 1 | 2))]), 'Payable after half child benefit, advance after full child benefit', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Percentages are limited to one decimal place and the result is rounded up to the next euro (section 1612a(2) BGB). The higher band applies from the first day of the month in which the child turns ${h.num(AS[1][0])} or ${h.num(AS[2][0])}.</p>
<h2>Who sets the figures</h2>
<p>The Federal Ministry of Justice fixes the minimum by ordinance, without needing the upper house’s consent (section 1612a(4) BGB). The Seventh Ordinance amending the Minimum Maintenance Ordinance of 15 November 2024 covers both 2025 and 2026. The ${h.src('olgDtPdf', '2026 Düsseldorf Table')} adopts these figures as its first income group (note A II).</p>
<p>Every higher group is a multiple: group 2 asks ${h.num(h.P.dt.prozent[1])}% and group 15 ${h.num(h.P.dt.prozent[14])}% of the minimum. When the minimum rises, the whole table moves, as described under ${h.a('duesseldorfer-tabelle-aenderungen', 'Düsseldorf Table 2026 changes')}.</p>
<h2>What income the minimum requires</h2>
<p>The minimum is secured only if the payer still keeps the minimum ${h.a('selbstbehalt', 'self-retention')}, ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} for a working parent. The table shows the adjusted net income (rounded to ${h.eur(10)}) from which there is no longer a ${h.a('mangelfall', 'shortfall case')}:</p>
${h.table(['Family', 'Minimum payable in total', 'Net income needed'], familien.map((f) => [f.en, h.eur(f.summe, 2), h.eur(f.grenze)]), 'Computed by the engine, working parent', ['l', 'r', 'r'])}
<p>Below that line the amounts are cut. A mother earning ${h.eur(1800)} net with one eight-year-old can pay only ${h.eur(knapp.summe, 2)} instead of ${h.eur(zahlbetrag(0, 1), 2)}, because she would otherwise fall below ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)}. The ${h.a('unterhaltsvorschuss', 'maintenance advance')} can partly fill the gap.</p>
<h2>Heightened duties while the minimum is not met</h2>
<p>Towards minors, parents carry a heightened duty (${h.src('bgb1603', 'section 1603(2) BGB')}). The ${h.src('olgLeitlinien', 'NRW court guidelines')} attach several consequences that last until the minimum is covered:</p>
<ul>
<li>Overtime pay and side-job income normally count in full, and taking on extra work may be expected (guideline points 1 and 9).</li>
<li>Debt repayments usually reduce income fully only if the minimum stays secured; in extreme cases even personal insolvency proceedings may be expected (guideline point 10).</li>
<li>Extra private pension saving of ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_kind_ehegatte, 0)} of gross income is accepted against child support only once the minimum is covered.</li>
<li>Voluntary help from others, such as rent-free living with one’s parents, may exceptionally count as income.</li>
</ul>
<p>An unemployed parent must apply for jobs seriously. Otherwise the court assumes notional income (fiktives Einkommen), often from full-time work in a reachable occupation.</p>
<h2>The minimum as a floor in other calculations</h2>
<p>The minimum does not only appear in group 1. Several rules use it as the line where reductions stop:</p>
<ul>
<li>Needs-control amount: courts move a payer down the table when too little is left, but under note A I only as far as the lowest group. Anything below is a shortfall case.</li>
<li>Extended contact: where the paying parent cares for the child well beyond the usual weekend rhythm, deductions are possible, yet under guideline point 12 only while the minimum stays secured. See ${h.a('erweiterter-umgang', 'extended contact')}.</li>
<li>Extra need such as nursery fees without meals is added on top of the minimum and shared between both parents by income.</li>
<li>Children from different relationships all share first rank; if money does not stretch to every minimum, each is cut proportionally.</li>
</ul>
<p>For the resident parent, the minimum is the figure most likely to hold even when money is tight, if necessary through the state advance.</p>
<h2>Getting the minimum on paper</h2>
<p>There is a streamlined route for minors: the simplified procedure at the family court (vereinfachtes Verfahren), handled with forms and usually without a hearing. Alternatively the payer signs a free deed at the Jugendamt. In both cases a dynamic order, written as a percentage of the minimum, rises automatically with every new ordinance.</p>
<p>This explanation of the 2026 minimum child support is general information, not legal advice; what can be claimed in your situation is assessed by the Jugendamt or decided by the family court.</p>`,
  },
});
