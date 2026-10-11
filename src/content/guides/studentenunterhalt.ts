import { defineGuide } from '../../lib/guide-types';
import { volljaehrigenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const KG = P.kindergeld.monat;
const BED = P.dt.student_bedarf;
const MIETE = P.dt.student_warmmiete;
const SOCKEL = P.leitlinien.sockel_volljaehrig;
/** Studentin in Leipzig: Mutter 2.900 €, Vater 3.700 €, eigene Wohnung. */
const basis = volljaehrigenunterhalt({ einkommenA: 2900, einkommenB: 3700, eigenerHaushalt: true });
/** Dieselbe Studentin mit 350 € BAföG. */
const bafoeg = volljaehrigenunterhalt({ einkommenA: 2900, einkommenB: 3700, eigenerHaushalt: true, eigenesEinkommen: 350 });
/** Ein Elternteil unter dem Sockel: 5.200 € und 1.400 €. */
const einseitig = volljaehrigenunterhalt({ einkommenA: 5200, einkommenB: 1400, eigenerHaushalt: true });
/** Beide Eltern knapp über dem Sockel: 2.100 € und 1.900 €. */
const knapp = volljaehrigenunterhalt({ einkommenA: 2100, einkommenB: 1900, eigenerHaushalt: true });

export default defineGuide({
  id: 'studentenunterhalt',
  group: 'kind',
  order: 42,
  mini: 'student',
  related: ['volljaehrigenunterhalt-rechner', 'kindergeld-anrechnung', 'selbstbehalt', 'bereinigtes-netto', 'kindesunterhalt', 'zahlbetragstabelle'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1606', 'bgb1603', 'bgb1612b', 'bgb1601'],
  de: {
    slug: 'unterhalt-studium',
    nav: 'Unterhalt im Studium',
    card: `Regelbedarf ${DE.eur(BED)}, volles Kindergeld, BAföG und Ausbildungsvergütung, Haftungsquote beider Eltern.`,
    title: 'Unterhalt im Studium 2026: Bedarf, BAföG und Elternquote',
    description: `Unterhalt für Studierende 2026: Regelbedarf ${DE.eur(BED)} bei eigener Wohnung, volles Kindergeld ${DE.eur(KG)} abziehen, BAföG anrechnen, Haftung beider Eltern über ${DE.eur(SOCKEL)}.`,
    h1: 'Unterhalt für volljährige Kinder in Studium und Ausbildung',
    intro: 'Ab dem 18. Geburtstag zahlen beide Eltern, jeder nach seinem Einkommen, und das Kind rechnet sich BAföG und Lohn selbst an.',
    resume: `Ein volljähriges Kind, das studiert und eine eigene Wohnung hat, hat 2026 in der Regel einen Unterhaltsbedarf von ${DE.eur(BED)} im Monat, darin bis zu ${DE.eur(MIETE)} Warmmiete (Anmerkung A IV der Düsseldorfer Tabelle). Kranken- und Pflegeversicherung sowie Studiengebühren kommen hinzu. Vom Bedarf geht das volle Kindergeld von ${DE.eur(KG)} ab, außerdem eigenes Einkommen des Kindes wie BAföG, auch der Darlehensteil. Den Rest tragen beide Eltern anteilig nach § 1606 Abs. 3 Satz 1 BGB: Jeder behält zunächst einen Sockel von ${DE.eur(SOCKEL)}, das Einkommen darüber bestimmt seine Quote. Verdient die Mutter ${DE.eur(2900)} und der Vater ${DE.eur(3700)}, bleibt ein offener Bedarf von ${DE.eur(basis.restbedarf, 2)}; davon zahlt die Mutter ${DE.eur(basis.anteilA, 2)} (${DE.pct(basis.quoteA, 0)}), der Vater ${DE.eur(basis.anteilB, 2)}. Wohnt das Kind noch zu Hause, richtet sich der Bedarf nach der vierten Altersstufe der Tabelle und dem zusammengerechneten Einkommen beider Eltern, wobei keiner mehr zahlt als nach seinem eigenen Einkommen allein. Der Anspruch gehört dem Kind selbst; es kann ihn ab dem 18. Geburtstag eigenständig geltend machen.`,
    faqs: [
      { q: 'Wie hoch ist der Unterhaltsbedarf eines Studenten mit eigener Wohnung 2026?', a: `In der Regel ${DE.eur(BED)} im Monat, darin bis zu ${DE.eur(MIETE)} für Miete einschließlich Nebenkosten und Heizung. Nicht enthalten sind Kranken- und Pflegeversicherung und Studiengebühren; sie kommen gegebenenfalls hinzu. Bei erhöhtem Bedarf oder sehr gut verdienenden Eltern kann das Gericht nach oben abweichen. Vom Bedarf werden Kindergeld und eigenes Einkommen abgezogen, bevor die Eltern zahlen.` },
      { q: 'Wird BAföG auf den Unterhalt des studierenden Kindes angerechnet?', a: 'Ja. Nach den Leitlinien der Oberlandesgerichte in NRW ist BAföG Einkommen des Kindes, in der Regel auch der Teil, der als Darlehen gewährt wird. Er mindert den Bedarf in voller Höhe. Ausgenommen sind Vorausleistungen nach §§ 36 und 37 BAföG, die das Amt erbringt, weil ein Elternteil nicht zahlt; dann holt sich das Amt den Unterhalt beim Elternteil zurück.' },
      { q: 'Muss ein Elternteil mit wenig Einkommen für das studierende Kind zahlen?', a: `Nur mit dem Teil seines Einkommens, der über dem angemessenen Selbstbehalt von ${DE.eur(SOCKEL)} liegt. Wer darunter bleibt, haftet gar nicht, und der andere Elternteil trägt den offenen Bedarf allein, soweit er dazu in der Lage ist. Gegenüber Studierenden gilt nicht der gesteigerte Maßstab wie bei minderjährigen Kindern, der notwendige Selbstbehalt ist hier also nicht die Grenze.` },
      { q: 'Wer bekommt das Kindergeld, wenn das Kind studiert?', a: `Ausgezahlt wird es weiter an den Elternteil, der es beantragt hat. Unterhaltsrechtlich steht es aber dem volljährigen Kind zu und mindert dessen Bedarf in voller Höhe von ${DE.eur(KG)} (§ 1612b Abs. 1 BGB). In der Praxis leitet der beziehende Elternteil es weiter oder rechnet es auf seinen Anteil an. Wer es behält, ohne dies zu berücksichtigen, zahlt rechnerisch zu wenig.` },
      { q: 'Wird der Nebenjob eines Studenten auf den Unterhalt angerechnet?', a: 'Neben einem Vollzeitstudium muss ein Kind grundsätzlich nicht arbeiten. Einkünfte aus einer solchen nicht gebotenen Tätigkeit werden deshalb nicht automatisch voll abgezogen; die Leitlinien verweisen auf § 1577 Abs. 2 BGB, nach dem sie nur angerechnet werden, soweit das der Billigkeit entspricht. Viele Gerichte lassen kleinere Hinzuverdienste unberücksichtigt, über die Einzelheiten entscheiden sie im Einzelfall.' },
      { q: 'Wie lange müssen Eltern Unterhalt für ein Studium zahlen?', a: 'Eine feste Altersgrenze kennt das Gesetz nicht. Geschuldet ist eine angemessene Ausbildung, die das Kind zielstrebig betreibt. Gerichte gestehen in der Regel eine Orientierungsphase und einen Wechsel des Studienfachs zu, wenn er früh erfolgt. Wer das Studium ohne Grund verschleppt, riskiert den Anspruch. Ob ein Master noch dazugehört, entscheiden Gerichte nach dem Zusammenhang mit dem Bachelor.' },
    ],
    body: (h) => `<h2>Wer zahlt, wenn das Kind volljährig ist</h2>
<p>Mit dem 18. Geburtstag endet die Arbeitsteilung, nach der ein Elternteil betreut und der andere zahlt (§ 1606 Abs. 3 Satz 2 BGB). Ein volljähriges Kind braucht keine Betreuung mehr, deshalb schulden beide Eltern Barunterhalt, jeder nach seinen Erwerbs- und Vermögensverhältnissen (${h.src('bgb1606', '§ 1606 Abs. 3 Satz 1 BGB')}). Das gilt auch für den Elternteil, bei dem das Kind bisher gewohnt hat.</p>
<p>Eine Sonderrolle haben volljährige Kinder unter 21, die noch eine allgemeinbildende Schule besuchen und bei einem Elternteil wohnen. Sie stehen nach § 1603 Abs. 2 Satz 2 BGB minderjährigen Kindern gleich, die Eltern müssen sich stärker einschränken. Für Studierende und Auszubildende gilt das nicht: Ihnen gegenüber behält jeder Elternteil den angemessenen Selbstbehalt von ${h.eur(h.P.selbstbehalt.angemessen)}, nicht nur den notwendigen.</p>
<h2>Der Bedarf: eigene Wohnung oder Elternhaus</h2>
<p>Für ein Kind mit eigenem Haushalt setzt die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} in Anmerkung A IV einen Regelbedarf von ${h.eur(BED)} an. Darin stecken bis ${h.eur(MIETE)} Warmmiete. Wer in einer teuren Universitätsstadt mehr Miete zahlt, erhält deshalb nicht automatisch mehr; eine Abweichung nach oben ist bei erhöhtem Bedarf oder mit Rücksicht auf die Lebensstellung der Eltern möglich, muss aber begründet werden. Beiträge zur Kranken- und Pflegeversicherung und Studiengebühren sind nicht enthalten und kommen gegebenenfalls hinzu.</p>
<p>Wohnt das Kind noch zu Hause, gibt es keinen Pauschalbetrag. Der Bedarf richtet sich nach der vierten Altersstufe der Tabelle, berechnet aus dem zusammengerechneten Einkommen beider Eltern, ohne Höher- oder Herabstufung. Nach Nummer 13 der ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} zahlt dabei kein Elternteil mehr, als er nach seinem eigenen Einkommen allein zahlen müsste.</p>
<h2>Was das Kind selbst einbringt</h2>
<p>Vom Bedarf gehen zuerst die eigenen Mittel des Kindes ab:</p>
<ul>
<li><strong>Kindergeld</strong>: in voller Höhe von ${h.eur(KG)} (${h.src('bgb1612b', '§ 1612b BGB')}), nicht nur zur Hälfte wie bei Minderjährigen.</li>
<li><strong>BAföG</strong>: Einkommen, nach den Leitlinien in der Regel auch der Darlehensanteil. Ausgenommen sind Vorausleistungen des Amts, wenn ein Elternteil nicht zahlt.</li>
<li><strong>Ausbildungsvergütung</strong>: Einkommen nach Abzug ausbildungsbedingter Kosten; wohnt der Auszubildende bei einem Elternteil, setzen die Leitlinien dafür in der Regel ${h.eur(h.P.leitlinien.ausbildungsaufwand)} pauschal an.</li>
<li><strong>Nebenjob</strong>: wird bei einem Vollzeitstudium oft nur teilweise oder gar nicht angerechnet, weil das Kind neben dem Studium nicht arbeiten muss.</li>
</ul>
<p>Im Beispiel unten bezieht die Studentin ${h.eur(350)} BAföG. Ihr offener Bedarf sinkt dadurch von ${h.eur(basis.restbedarf, 2)} auf ${h.eur(bafoeg.restbedarf, 2)}, und beide Eltern werden im gleichen Verhältnis entlastet.</p>
<h2>Die Haftungsquote der Eltern</h2>
<p>Den offenen Bedarf teilen die Eltern nach ihrem bereinigten Einkommen über einem Sockel von ${h.eur(SOCKEL)}, dem angemessenen Selbstbehalt. Wer weniger verdient, haftet nicht; wer mehr verdient, trägt den größeren Anteil. Zuvor werden Unterhaltszahlungen an vorrangige Berechtigte vom Einkommen abgezogen, vor allem der Unterhalt für minderjährige Geschwister.</p>
${h.table(['Eltern (Netto)', 'BAföG', 'offener Bedarf', 'Mutter zahlt', 'Vater zahlt', 'ungedeckt'], [
  [`${h.eur(2900)} / ${h.eur(3700)}`, h.eur(0), h.eur(basis.restbedarf, 2), h.eur(basis.anteilA, 2), h.eur(basis.anteilB, 2), h.eur(basis.ungedeckt, 2)],
  [`${h.eur(2900)} / ${h.eur(3700)}`, h.eur(350), h.eur(bafoeg.restbedarf, 2), h.eur(bafoeg.anteilA, 2), h.eur(bafoeg.anteilB, 2), h.eur(bafoeg.ungedeckt, 2)],
  [`${h.eur(1400)} / ${h.eur(5200)}`, h.eur(0), h.eur(einseitig.restbedarf, 2), h.eur(einseitig.anteilB, 2), h.eur(einseitig.anteilA, 2), h.eur(einseitig.ungedeckt, 2)],
  [`${h.eur(1900)} / ${h.eur(2100)}`, h.eur(0), h.eur(knapp.restbedarf, 2), h.eur(knapp.anteilB, 2), h.eur(knapp.anteilA, 2), h.eur(knapp.ungedeckt, 2)],
], `Studierendes Kind mit eigener Wohnung, Regelbedarf ${h.eur(BED)}, vom Motor berechnet`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die dritte Zeile zeigt den häufigen Fall eines Elternteils unter dem Sockel: Die Mutter mit ${h.eur(1400)} zahlt nichts, der Vater übernimmt den ganzen offenen Bedarf, weil sein Einkommen über ${h.eur(SOCKEL)} dafür reicht. In der vierten Zeile verdienen beide nur knapp mehr als den Sockel. Zusammen können sie ${h.eur(knapp.anteilA + knapp.anteilB, 2)} leisten; ${h.eur(knapp.ungedeckt, 2)} bleiben offen. Diese Lücke muss das Kind auf andere Weise schließen, typischerweise über BAföG, das bei geringem Elterneinkommen höher ausfällt.</p>
<h2>Pflichten des Kindes</h2>
<p>Der Anspruch auf Ausbildungsunterhalt ist an Gegenleistungen geknüpft. Das Kind muss eine Ausbildung wählen, die seinen Fähigkeiten entspricht, und sie zielstrebig betreiben. Gerichte gewähren in der Regel eine Orientierungsphase und akzeptieren einen frühen Fachwechsel; ein Studium ohne erkennbare Fortschritte über viele Semester kann den Anspruch kosten. Das Kind muss seinen Eltern außerdem Auskunft über den Studienverlauf und eigene Einkünfte geben, umgekehrt schulden die Eltern einander und dem Kind Auskunft über ihr Einkommen.</p>
<p>Da das Kind volljährig ist, macht es den Anspruch selbst geltend, nicht mehr ein Elternteil in seinem Namen. Das kann zu der ungewohnten Lage führen, dass ein Kind gegen den Elternteil vorgehen muss, bei dem es lange gelebt hat.</p>
<h2>Rechnen mit beiden Einkommen</h2>
<p>Die bereinigten Nettoeinkommen beider Eltern sind die wichtigste Zahl. Was dabei abgezogen wird, erklärt die Seite zum ${h.a('bereinigtes-netto', 'bereinigten Nettoeinkommen')}; wie das Kindergeld je nach Alter wirkt, die Seite zur ${h.a('kindergeld-anrechnung', 'Kindergeldanrechnung')}. Den vollständigen Rechenweg für beide Wohnformen, einschließlich privilegierter Schüler, liefert der ${h.a('volljaehrigenunterhalt-rechner', 'Volljährigenunterhalt-Rechner')}.</p>
<p>Diese Übersicht zum Unterhalt im Studium ist eine allgemeine Information nach Düsseldorfer Tabelle und Leitlinien 2026, keine Rechtsberatung. Abweichende Bedarfe, Fachwechsel oder Zweitausbildungen beurteilen im Streit die Familiengerichte.</p>`,
  },
  en: {
    slug: 'student-maintenance',
    nav: 'Student maintenance',
    card: `Standard need of ${EN.eur(BED)}, full child benefit, BAföG and training pay, and how both parents split the bill.`,
    title: 'Student Maintenance Germany 2026: Need, BAföG, Parents',
    description: `Support for students in Germany 2026: standard need ${EN.eur(BED)} with own flat, full ${EN.eur(KG)} child benefit deducted, BAföG counted, both parents liable above ${EN.eur(SOCKEL)}.`,
    h1: 'Maintenance for adult children at university or in training',
    intro: 'Once a child turns 18 in Germany, both parents pay according to income, and the child’s own grants and wages come off first.',
    resume: `In 2026 a German court will usually put the needs of an adult child who studies and lives away from home at ${EN.eur(BED)} a month, of which up to ${EN.eur(MIETE)} is warm rent (note A IV of the Düsseldorf Table, Düsseldorfer Tabelle). Health and long-term care insurance and tuition fees come on top. The full child benefit (Kindergeld) of ${EN.eur(KG)} is deducted, and so is the child’s own income such as the state student grant (BAföG), including its loan part. Both parents cover the rest in proportion to their incomes under section 1606(3) of the Civil Code (BGB): each first keeps a base of ${EN.eur(SOCKEL)}, and only the income above it sets the share. With a mother on ${EN.eur(2900)} and a father on ${EN.eur(3700)}, the open need is ${EN.eur(basis.restbedarf, 2)}; the mother pays ${EN.eur(basis.anteilA, 2)} (${EN.pct(basis.quoteA, 0)}), the father ${EN.eur(basis.anteilB, 2)}. A student still living at home is assessed on the fourth age band of the table and the parents’ combined income, but no parent pays more than his or her own income alone would require. The claim belongs to the adult child, who pursues it personally.`,
    faqs: [
      { q: 'How much support does a student living away from home get in Germany in 2026?', a: `The standard need is ${EN.eur(BED)} a month, including up to ${EN.eur(MIETE)} for rent with utilities and heating. Health insurance and tuition fees are not included and may be added. Courts can go higher for special needs or very well-off parents. Child benefit and the student’s own income come off before the parents pay anything, so the actual transfer is usually well below the headline figure.` },
      { q: 'Does an international student grant or scholarship reduce parental support?', a: 'The NRW court guidelines treat the student’s own income, including BAföG, its loan element and training allowances, as fully reducing the need. How a foreign grant or a private scholarship counts is not spelled out there: the family court looks at its purpose and terms in each case. Keep the award letter ready, since it shows whether the money covers living costs or something else.' },
      { q: 'My ex-partner earns very little. Do I have to cover our student’s whole need?', a: `Only up to your own capacity. Each parent keeps ${EN.eur(SOCKEL)}, the reasonable self-retention (angemessener Selbstbehalt); a parent below it pays nothing, and the other covers the open need as far as his or her income above that base allows. Whatever neither can pay stays uncovered, and the student then relies on BAföG, which rises when parental income is low.` },
      { q: 'Our child studies abroad while we live in Germany. Does the standard student rate apply?', a: `The ${EN.eur(BED)} figure is the German standard for a student with his or her own home, and courts may depart from it upwards for higher need. Whether costs abroad justify more is a case-by-case question, and rules of private international law decide which country’s law governs support. Treat the German figure as a starting point, not a guarantee.` },
      { q: 'Does a student’s part-time job reduce what parents pay?', a: 'Not automatically. A full-time student is not expected to work, so earnings from a job alongside the degree are only counted as far as fairness requires (section 1577(2) BGB, applied by analogy under the guidelines). Many courts ignore modest earnings from holiday or weekend jobs. Income from a job the student is actually expected to take, for instance after the studies, counts in full.' },
    ],
    body: (h) => `<h2>Both parents pay once the child is 18</h2>
<p>For minors, German law treats day-to-day care by one parent as that parent’s full contribution (section 1606(3), second sentence, BGB). An adult child no longer needs care, so both parents owe cash support, each according to income and assets (${h.src('bgb1606', 'section 1606(3) BGB')}). That includes the parent the child grew up with.</p>
<p>One group is treated differently: adult children under 21 who still attend a general school and live with a parent. Section 1603(2) BGB ranks them with minors, and the parents must tighten their belts further. University students and apprentices are not in this group. Towards them each parent keeps the reasonable self-retention of ${h.eur(h.P.selbstbehalt.angemessen)} rather than the lower minimum.</p>
<h2>Need: own flat or parental home</h2>
<p>For a child with an own household, note A IV of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} sets a standard need of ${h.eur(BED)}, including up to ${h.eur(MIETE)} warm rent. Paying more for a room in Munich or Hamburg does not raise it automatically; a higher figure needs a reason, such as special needs or the parents’ standard of living. Health and care insurance contributions and tuition fees are outside the figure.</p>
<p>A student still at home has no flat rate. Need follows the fourth age band of the table on the parents’ combined income, without moving up or down a group. Under number 13 of the ${h.src('olgLeitlinien', 'NRW court guidelines')}, no parent pays more than the table would require on his or her own income alone.</p>
<h2>What the student brings in</h2>
<ul>
<li><strong>Child benefit</strong>: the full ${h.eur(KG)} comes off (${h.src('bgb1612b', 'section 1612b BGB')}), not half as for minors. It is often still paid to a parent, who passes it on or offsets it.</li>
<li><strong>BAföG</strong>: income of the student, as a rule including the loan part. Advance payments the office makes because a parent refuses to pay are the exception; the office then recovers them from that parent.</li>
<li><strong>Training pay</strong> (Ausbildungsvergütung): counts after work-related costs; for an apprentice living with a parent the guidelines usually allow a flat ${h.eur(h.P.leitlinien.ausbildungsaufwand)}.</li>
<li><strong>Side jobs</strong>: often counted only partly or not at all, because a full-time student need not work.</li>
</ul>
<p>Take Amira, studying in Leipzig with her own flat. Her mother earns ${h.eur(2900)} net, her father ${h.eur(3700)}. Without a grant the open need is ${h.eur(basis.restbedarf, 2)}. Once she receives ${h.eur(350)} BAföG it falls to ${h.eur(bafoeg.restbedarf, 2)}, and both parents’ shares fall in the same ratio.</p>
<h2>How the parents’ shares are set</h2>
<p>Each parent’s adjusted net income is reduced first by support for higher-ranking dependants, chiefly minor siblings, and then by a base of ${h.eur(SOCKEL)}. The remaining amounts set the ratio. If one parent’s salary is paid abroad, it is converted to euros and taken after the tax actually paid there; the court decides on disputed items.</p>
${h.table(['Parents (net)', 'BAföG', 'Open need', 'Lower earner', 'Higher earner', 'Uncovered'], [
  [`${h.eur(2900)} / ${h.eur(3700)}`, h.eur(0), h.eur(basis.restbedarf, 2), h.eur(basis.anteilA, 2), h.eur(basis.anteilB, 2), h.eur(basis.ungedeckt, 2)],
  [`${h.eur(2900)} / ${h.eur(3700)}`, h.eur(350), h.eur(bafoeg.restbedarf, 2), h.eur(bafoeg.anteilA, 2), h.eur(bafoeg.anteilB, 2), h.eur(bafoeg.ungedeckt, 2)],
  [`${h.eur(1400)} / ${h.eur(5200)}`, h.eur(0), h.eur(einseitig.restbedarf, 2), h.eur(einseitig.anteilB, 2), h.eur(einseitig.anteilA, 2), h.eur(einseitig.ungedeckt, 2)],
  [`${h.eur(1900)} / ${h.eur(2100)}`, h.eur(0), h.eur(knapp.restbedarf, 2), h.eur(knapp.anteilB, 2), h.eur(knapp.anteilA, 2), h.eur(knapp.ungedeckt, 2)],
], `Student with own home, standard need ${h.eur(BED)}, computed by the engine`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>In the third row the parent on ${h.eur(1400)} is below the base and pays nothing; the parent on ${h.eur(5200)} covers the whole open need. In the fourth row both earn only slightly more than the base. Together they can provide ${h.eur(knapp.anteilA + knapp.anteilB, 2)}, leaving ${h.eur(knapp.ungedeckt, 2)} uncovered, a gap the student must close another way, usually through BAföG.</p>
<h2>The student’s side of the deal</h2>
<p>Support for training comes with duties. The student should choose a course that fits his or her abilities and pursue it purposefully. Courts usually allow an orientation phase and an early change of subject, but years without visible progress can end the claim. The student must keep the parents informed about progress and own income, and the parents owe each other and the child information about their incomes.</p>
<p>Because the child is an adult, the claim is the child’s own. Parents cannot settle it between themselves on the child’s behalf, and in a dispute the child may have to take action against the parent he or she lived with for years.</p>
<h2>Next steps</h2>
<p>The key figures are both parents’ adjusted net incomes; the page on ${h.a('bereinigtes-netto', 'adjusted net income')} explains the deductions, and ${h.a('kindergeld-anrechnung', 'child benefit offsetting')} shows how Kindergeld works at each age. The ${h.a('volljaehrigenunterhalt-rechner', 'adult child support calculator')} runs the full calculation for both living situations.</p>
<p>This overview of student maintenance under the 2026 Düsseldorf Table and guidelines is general information, not legal advice. Higher needs, changes of course or second degrees are decided by the family courts (Familiengerichte) in each case.</p>`,
  },
});
