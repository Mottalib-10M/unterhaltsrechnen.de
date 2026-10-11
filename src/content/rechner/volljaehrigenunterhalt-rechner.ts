import { defineGuide } from '../../lib/guide-types';
import { volljaehrigenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const KG = P.kindergeld.monat;
const BED = P.dt.student_bedarf;
const SOCKEL = P.leitlinien.sockel_volljaehrig;
/** Sohn, 19, wohnt beim Vater: Eltern 3.400 € und 2.200 €. */
const daheim = volljaehrigenunterhalt({ einkommenA: 3400, einkommenB: 2200, eigenerHaushalt: false });
/** Derselbe Sohn zieht zum Studium aus. */
const ausgezogen = volljaehrigenunterhalt({ einkommenA: 3400, einkommenB: 2200, eigenerHaushalt: true });
/** Schülerin, 18, Abiturklasse: Eltern 2.300 € und 1.700 €, privilegiert und nicht privilegiert. */
const schuelerin = volljaehrigenunterhalt({ einkommenA: 2300, einkommenB: 1700, eigenerHaushalt: false, privilegiert: true });
const schuelerinNicht = volljaehrigenunterhalt({ einkommenA: 2300, einkommenB: 1700, eigenerHaushalt: false, privilegiert: false });
/** Auszubildender zu Hause mit 520 € anrechenbarer Vergütung, Eltern 4.400 € und 2.600 €. */
const azubi = volljaehrigenunterhalt({ einkommenA: 4400, einkommenB: 2600, eigenerHaushalt: false, eigenesEinkommen: 520 });

export default defineGuide({
  id: 'volljaehrigenunterhalt-rechner',
  group: 'kind',
  order: 40,
  tool: 'volljaehrig',
  related: ['studentenunterhalt', 'kindergeld-anrechnung', 'selbstbehalt', 'bereinigtes-netto', 'kindesunterhalt-rechner', 'zahlbetragstabelle'],
  sources: ['olgLeitlinien', 'olgDtPdf', 'bgb1606', 'bgb1603'],
  de: {
    slug: 'volljaehrigenunterhalt-rechner',
    nav: 'Volljährigenunterhalt-Rechner',
    card: 'Beide Eltern, eigene Wohnung oder Elternhaus, BAföG oder Lohn des Kindes: die Anteile mit Rechenweg.',
    title: 'Volljährigenunterhalt-Rechner 2026: Anteil beider Eltern',
    description: `Volljährigenunterhalt-Rechner 2026: Bedarf ${DE.eur(BED)} oder 4. Altersstufe, volles Kindergeld, Haftungsquote über ${DE.eur(SOCKEL)}, Kappung nach Nummer 13 der Leitlinien NRW.`,
    h1: 'Unterhalt für ein volljähriges Kind berechnen',
    intro: 'Zwei Einkommen, die Wohnform und das eigene Geld des Kindes: Daraus ergibt sich, wer wie viel zahlt.',
    resume: `Der Rechner teilt den Unterhalt eines volljährigen Kindes 2026 auf beide Eltern auf. Bei eigener Wohnung setzt er den Regelbedarf von ${DE.eur(BED)} an, wohnt das Kind zu Hause, die vierte Altersstufe der Düsseldorfer Tabelle nach dem zusammengerechneten Netto beider Eltern. Davon zieht er das volle Kindergeld von ${DE.eur(KG)} und das eingetragene Einkommen des Kindes ab. Den Rest verteilt er nach den Einkommen über ${DE.eur(SOCKEL)}. Ein Beispiel: Vater ${DE.eur(3400)}, Mutter ${DE.eur(2200)}, der Sohn wohnt noch beim Vater. Der Bedarf liegt bei ${DE.eur(daheim.bedarf)}, offen sind ${DE.eur(daheim.restbedarf, 2)}. Rechnerisch trüge der Vater ${DE.pct(daheim.quoteA, 0)}, er zahlt aber höchstens den Betrag, der sich aus seinem eigenen Einkommen allein ergäbe: ${DE.eur(daheim.anteilA, 2)}. Die Mutter zahlt ${DE.eur(daheim.anteilB, 2)}, ${DE.eur(daheim.ungedeckt, 2)} bleiben ungedeckt. Zieht der Sohn zum Studium aus, ändert sich die Rechnung: offener Bedarf ${DE.eur(ausgezogen.restbedarf, 2)}, davon ${DE.eur(ausgezogen.anteilA, 2)} und ${DE.eur(ausgezogen.anteilB, 2)}. Für Schüler unter 21 im Elternhaus senkt der Rechner den Sockel, wenn der Bedarf sonst offenbliebe.`,
    faqs: [
      { q: 'Warum zahlt im Volljährigenunterhalt-Rechner ein Elternteil weniger als seine Quote?', a: 'Wohnt das Kind noch zu Hause, wird der Bedarf aus beiden Einkommen zusammen ermittelt und ist entsprechend hoch. Nummer 13 der Leitlinien der Oberlandesgerichte in NRW begrenzt aber jeden Elternteil auf den Betrag, den er nach seinem eigenen Einkommen allein zahlen müsste. Greift diese Kappung, erscheint im Rechenweg ein Hinweis und unter dem Ergebnis ein ungedeckter Rest.' },
      { q: 'Was bedeutet die Frage „Unter 21 und Schüler?“ im Volljährigenunterhalt-Rechner?', a: `Volljährige unter 21, die eine allgemeinbildende Schule besuchen und bei einem Elternteil wohnen, stehen Minderjährigen gleich (§ 1603 Abs. 2 Satz 2 BGB). Für sie darf der Sockel von ${DE.eur(SOCKEL)} bis auf den notwendigen Selbstbehalt sinken, wenn der Bedarf sonst nicht gedeckt wäre. Der Rechner nimmt dafür ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)} an, den Wert für erwerbstätige Eltern. Studierende und Auszubildende sind nie privilegiert.` },
      { q: 'Welches Einkommen des Kindes trage ich beim Volljährigenunterhalt ein?', a: `Den Betrag, der auf den Bedarf angerechnet wird: BAföG einschließlich Darlehensanteil, eine Ausbildungsvergütung nach Abzug der ausbildungsbedingten Kosten, bei Auszubildenden im Elternhaus in der Regel pauschal ${DE.eur(P.leitlinien.ausbildungsaufwand)}. Das Kindergeld gehört nicht in dieses Feld, der Rechner zieht es selbst ab. Kleine Nebenjobs neben einem Vollzeitstudium bleiben oft unberücksichtigt.` },
      { q: 'Muss ich Unterhalt für jüngere Geschwister vorher abziehen?', a: 'Ja, aber selbst. Minderjährige Kinder haben Vorrang vor einem studierenden volljährigen Kind, ihr Unterhalt mindert das Einkommen, mit dem ein Elternteil für das ältere Kind haftet. Der Rechner fragt das nicht ab. Ziehen Sie den Zahlbetrag für die jüngeren Geschwister vor der Eingabe vom Netto des betreffenden Elternteils ab.' },
    ],
    body: (h) => `<h2>Die Eingaben</h2>
<ul>
<li><strong>Netto Elternteil A und B</strong>: jeweils das bereinigte Nettoeinkommen, also nach Steuern, Sozialabgaben, berufsbedingten Kosten und anerkannten Schulden. Welcher Elternteil A oder B ist, spielt keine Rolle.</li>
<li><strong>Eigene Wohnung?</strong>: „Ja“ setzt den Regelbedarf von ${h.eur(BED)} nach Anmerkung A IV der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} an, „Nein“ die vierte Altersstufe nach dem zusammengerechneten Einkommen.</li>
<li><strong>Einkommen des Kindes</strong>: BAföG, Ausbildungsvergütung nach der Pauschale, sonstige anzurechnende Einkünfte.</li>
<li><strong>Unter 21 und Schüler?</strong>: erscheint nur, wenn das Kind zu Hause wohnt, und betrifft privilegierte Volljährige nach § 1603 Abs. 2 Satz 2 BGB.</li>
</ul>
<p>Das Ergebnis zeigt oben die Summe beider Anteile und den Restbedarf, darunter, was jeder Elternteil zahlt, den Bedarf vor Kindergeld und, falls vorhanden, den ungedeckten Teil. Der Rechenweg nennt Bedarf, Abzüge, Haftungsbeträge und Quoten. Die Eingaben stehen in der Adresszeile und lassen sich als Link teilen.</p>
<h2>Vier Familien im Vergleich</h2>
${h.table(['Fall', 'Bedarf', 'offen', 'A zahlt', 'B zahlt', 'ungedeckt'], [
  [`Sohn zu Hause, ${h.eur(3400)} / ${h.eur(2200)}`, h.eur(daheim.bedarf), h.eur(daheim.restbedarf, 2), h.eur(daheim.anteilA, 2), h.eur(daheim.anteilB, 2), h.eur(daheim.ungedeckt, 2)],
  [`derselbe, eigene Wohnung`, h.eur(ausgezogen.bedarf), h.eur(ausgezogen.restbedarf, 2), h.eur(ausgezogen.anteilA, 2), h.eur(ausgezogen.anteilB, 2), h.eur(ausgezogen.ungedeckt, 2)],
  [`Schülerin, privilegiert, ${h.eur(2300)} / ${h.eur(1700)}`, h.eur(schuelerin.bedarf), h.eur(schuelerin.restbedarf, 2), h.eur(schuelerin.anteilA, 2), h.eur(schuelerin.anteilB, 2), h.eur(schuelerin.ungedeckt, 2)],
  [`Azubi zu Hause, ${h.eur(520)} Vergütung, ${h.eur(4400)} / ${h.eur(2600)}`, h.eur(azubi.bedarf), h.eur(azubi.restbedarf, 2), h.eur(azubi.anteilA, 2), h.eur(azubi.anteilB, 2), h.eur(azubi.ungedeckt, 2)],
], 'Vom Rechner ermittelt, Werte 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Der Umzug des Sohnes senkt hier den Bedarf, weil die Eltern zusammen gut verdienen und die vierte Altersstufe ihrer Gruppe über ${h.eur(BED)} liegt; zugleich entfällt die Kappung. Bei der Schülerin zeigt sich die Privilegierung: Mit dem vollen Sockel von ${h.eur(SOCKEL)} müsste die Mutter mit ${h.eur(1700)} gar nichts zahlen und ${h.eur(schuelerinNicht.ungedeckt, 2)} blieben offen. Weil der Rechner den Sockel auf ${h.eur(schuelerin.sockel)} senkt, trägt sie ${h.eur(schuelerin.anteilB, 2)} bei.</p>
<h2>Grenzen des Rechners</h2>
<p>Er arbeitet mit dem Regelbedarf und kennt keinen erhöhten Bedarf, keine Beiträge zur Kranken- und Pflegeversicherung und keine Studiengebühren, die nach der Tabelle hinzukommen können. Vorrangige Unterhaltspflichten, etwa für minderjährige Geschwister oder einen Ehegatten, zieht er nicht ab; das muss vor der Eingabe geschehen. Für privilegierte Volljährige setzt er den Selbstbehalt Erwerbstätiger an, für nicht erwerbstätige Eltern wäre er niedriger. Nummer 13 der ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} erlaubt außerdem, die Quote bei besonderen Umständen wertend zu verändern, etwa bei einem Kind mit Behinderung.</p>
<p>Das Ergebnis ist eine allgemeine Berechnung nach ${h.src('bgb1606', '§ 1606 Abs. 3 BGB')}, Tabelle und Leitlinien 2026 und keine Rechtsberatung. Hintergründe zu Bedarf, BAföG und Pflichten des Kindes stehen auf der Seite zum ${h.a('studentenunterhalt', 'Unterhalt im Studium')}, die Abzüge vom Netto beim ${h.a('bereinigtes-netto', 'bereinigten Nettoeinkommen')}.</p>`,
  },
  en: {
    slug: 'adult-child-support-calculator',
    nav: 'Adult child support calculator',
    card: 'Both parents, own flat or parental home, the child’s grant or wages: each parent’s share, step by step.',
    title: 'Adult Child Support Calculator Germany 2026: Both Parents',
    description: `Adult child support calculator for Germany 2026: need ${EN.eur(BED)} or the 4th age band, full child benefit, shares above ${EN.eur(SOCKEL)} and the cap in the NRW guidelines.`,
    h1: 'Work out support for an adult child in Germany',
    intro: 'Two incomes, where the child lives and the child’s own money: that is all it takes to see who pays what.',
    resume: `The calculator splits support for an adult child in Germany between both parents for 2026. For a child with his or her own home it uses the standard need of ${EN.eur(BED)}; for a child living with a parent, the fourth age band of the Düsseldorf Table (Düsseldorfer Tabelle) on the parents’ combined net income. It then deducts the full child benefit (Kindergeld) of ${EN.eur(KG)} and any income of the child you enter, and divides the rest by each parent’s income above ${EN.eur(SOCKEL)}. Example: father ${EN.eur(3400)}, mother ${EN.eur(2200)}, the son still lives with his father. Need is ${EN.eur(daheim.bedarf)}, open need ${EN.eur(daheim.restbedarf, 2)}. On the ratio the father would bear ${EN.pct(daheim.quoteA, 0)}, but no parent pays more than his or her own income alone would require, so he pays ${EN.eur(daheim.anteilA, 2)}. The mother pays ${EN.eur(daheim.anteilB, 2)} and ${EN.eur(daheim.ungedeckt, 2)} stays uncovered. If the son moves out to study, the open need becomes ${EN.eur(ausgezogen.restbedarf, 2)}, split ${EN.eur(ausgezogen.anteilA, 2)} and ${EN.eur(ausgezogen.anteilB, 2)}. For school pupils under 21 living at home, the tool lowers the base when the need would otherwise stay open.`,
    faqs: [
      { q: 'Why does one parent pay less than his share in the adult child calculator?', a: 'When the child lives at home, need is set on both incomes combined and can be high. Number 13 of the NRW court guidelines caps each parent at the amount the table would require on his or her own income alone. When that cap bites, the breakdown says so and an uncovered remainder appears under the result.' },
      { q: 'What does “Under 21 and at school?” mean in the adult child support calculator?', a: `Adults under 21 who attend a general school and live with a parent rank with minors (section 1603(2) BGB). For them the base of ${EN.eur(SOCKEL)} may drop to the minimum self-retention if the need would otherwise stay open. The tool uses ${EN.eur(P.selbstbehalt.notwendig_erwerbstaetig)}, the figure for working parents. University students and apprentices never count as privileged.` },
      { q: 'One parent lives abroad and earns in another currency. How do I enter that?', a: 'Convert the net income to euros and enter it after the tax and social contributions actually paid in that country, minus recognised work costs. The calculator treats both parents the same, wherever they live. Which country’s law applies and how foreign income is assessed are questions the court decides; the result is a German-law estimate.' },
      { q: 'Should I subtract support for younger siblings before entering incomes?', a: 'Yes. Minor children rank ahead of an adult student, and their support reduces the income a parent has available for the older child. The calculator does not ask about siblings, so deduct the amount paid for each younger child from the relevant parent’s net income before you enter it.' },
    ],
    body: (h) => `<h2>The inputs</h2>
<ul>
<li><strong>Net income parent A and B</strong>: each parent’s adjusted net income (bereinigtes Nettoeinkommen), after tax, social contributions, work costs and recognised debts. Which parent is A or B makes no difference.</li>
<li><strong>Own home?</strong>: “Yes” applies the standard need of ${h.eur(BED)} from note A IV of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}; “No” uses the fourth age band on the combined income.</li>
<li><strong>Child’s income</strong>: BAföG, training pay after the flat allowance, other income that counts.</li>
<li><strong>Under 21 and at school?</strong>: shown only for a child living at home; it covers privileged adults under section 1603(2) BGB.</li>
</ul>
<p>The result shows the total of both shares and the remaining need, then what each parent pays, the need before child benefit and any uncovered part. The breakdown lists need, deductions, liable amounts and shares. Your inputs are saved in the page address, so you can bookmark or share the link.</p>
<h2>Four families compared</h2>
${h.table(['Case', 'Need', 'Open', 'A pays', 'B pays', 'Uncovered'], [
  [`son at home, ${h.eur(3400)} / ${h.eur(2200)}`, h.eur(daheim.bedarf), h.eur(daheim.restbedarf, 2), h.eur(daheim.anteilA, 2), h.eur(daheim.anteilB, 2), h.eur(daheim.ungedeckt, 2)],
  ['same son, own flat', h.eur(ausgezogen.bedarf), h.eur(ausgezogen.restbedarf, 2), h.eur(ausgezogen.anteilA, 2), h.eur(ausgezogen.anteilB, 2), h.eur(ausgezogen.ungedeckt, 2)],
  [`pupil, privileged, ${h.eur(2300)} / ${h.eur(1700)}`, h.eur(schuelerin.bedarf), h.eur(schuelerin.restbedarf, 2), h.eur(schuelerin.anteilA, 2), h.eur(schuelerin.anteilB, 2), h.eur(schuelerin.ungedeckt, 2)],
  [`apprentice at home, ${h.eur(520)} pay, ${h.eur(4400)} / ${h.eur(2600)}`, h.eur(azubi.bedarf), h.eur(azubi.restbedarf, 2), h.eur(azubi.anteilA, 2), h.eur(azubi.anteilB, 2), h.eur(azubi.ungedeckt, 2)],
], 'Computed by the calculator, 2026 values', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Moving out lowers the need here, because the parents together earn well and the fourth age band of their group is above ${h.eur(BED)}; the cap also disappears. The pupil shows the effect of privilege: with the full base of ${h.eur(SOCKEL)} the mother on ${h.eur(1700)} would pay nothing and ${h.eur(schuelerinNicht.ungedeckt, 2)} would stay open. Because the base drops to ${h.eur(schuelerin.sockel)}, she contributes ${h.eur(schuelerin.anteilB, 2)}.</p>
<h2>Limits of the calculator</h2>
<p>It works with the standard need and ignores higher needs, health and care insurance contributions and tuition fees, which the table allows on top. It does not deduct higher-ranking support such as for minor siblings or a spouse; do that before entering incomes. For privileged adults it applies the working parent’s self-retention; for a parent without work it would be lower. Number 13 of the ${h.src('olgLeitlinien', 'NRW court guidelines')} also lets the court adjust the shares in special circumstances, for example for a child with a disability.</p>
<p>The result is a general calculation under ${h.src('bgb1606', 'section 1606(3) BGB')} and the 2026 table and guidelines, not legal advice. Background on need, BAföG and the student’s duties is on the ${h.a('studentenunterhalt', 'student maintenance')} page; deductions from net pay are explained under ${h.a('bereinigtes-netto', 'adjusted net income')}.</p>`,
  },
});
