import { defineGuide } from '../../lib/guide-types';
import { unterhaltsvorschuss, uvgVoll } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const U = P.uvg;
const KG = P.kindergeld.monat;
const MU = P.mindestunterhalt.stufen;
const A = P.dt.altersstufen;
const voll = [uvgVoll(0), uvgVoll(1), uvgVoll(2)];
/** Vergleich mit 2025: Mindestunterhalt (1. Gruppe der DT 2025) minus damaliges Kindergeld. */
const vorjahr = [0, 1, 2].map((s) => P.dt2025.bedarf[0][s] - P.dt2025.kindergeld);
const unveraendert = voll.every((v, i) => v === vorjahr[i]);
/** Mia, 8 Jahre: der Vater zahlt unregelmäßig 150 € im Monat. */
const teil = unterhaltsvorschuss({ alter: 8, unterhaltErhalten: 150 });
/** Ben, 3 Jahre: Halbwaise mit 120 € Waisenrente. */
const waise = unterhaltsvorschuss({ alter: 3, waisenbezuege: 120 });
/** Lea, 14 Jahre: die Voraussetzungen des § 1 Abs. 1a UVG fehlen. */
const ohne = unterhaltsvorschuss({ alter: 14, ab12Voraussetzung: false });
const mit = unterhaltsvorschuss({ alter: 14, ab12Voraussetzung: true });

export default defineGuide({
  id: 'unterhaltsvorschuss',
  group: 'kind',
  order: 30,
  mini: 'uvg',
  related: ['unterhaltsvorschuss-rechner', 'mindestunterhalt', 'kindesunterhalt', 'kindergeld-anrechnung', 'selbstbehalt', 'unterhaltsverfahren-kosten'],
  sources: ['uvg1', 'uvg2', 'bgb1612a', 'estg66', 'olgDtPdf'],
  de: {
    slug: 'unterhaltsvorschuss',
    nav: 'Unterhaltsvorschuss',
    card: 'Beträge 2026 nach Alter, die Regeln ab zwölf Jahren, Antrag beim Jugendamt und Rückgriff auf den anderen Elternteil.',
    title: 'Unterhaltsvorschuss 2026: Beträge, Alter und Antrag',
    description: `Unterhaltsvorschuss 2026: ${DE.eur(voll[0])}, ${DE.eur(voll[1])} oder ${DE.eur(voll[2])} im Monat je nach Alter des Kindes, Bedingungen ab ${U.alter_grenze_ohne_bedingung} Jahren, Antrag beim Jugendamt und der Rückgriff.`,
    h1: 'Unterhaltsvorschuss: wenn der andere Elternteil nicht zahlt',
    intro: 'Der Staat springt ein, wenn der Unterhalt ausbleibt, und holt sich das Geld später vom säumigen Elternteil zurück.',
    resume: `Der Unterhaltsvorschuss beträgt 2026 monatlich ${DE.eur(voll[0])} für Kinder von ${A[0][0]} bis ${A[0][1]} Jahren, ${DE.eur(voll[1])} von ${A[1][0]} bis ${A[1][1]} und ${DE.eur(voll[2])} von ${A[2][0]} bis ${A[2][1]} Jahren. Die Formel steht in § 2 UVG: Mindestunterhalt nach § 1612a BGB (${DE.eur(MU[0])}, ${DE.eur(MU[1])}, ${DE.eur(MU[2])}) minus das Kindergeld für ein erstes Kind von ${DE.eur(KG)}. Anspruch hat ein Kind, das in Deutschland bei einem alleinstehenden, geschiedenen oder dauernd getrennt lebenden Elternteil wohnt und vom anderen Elternteil keinen oder zu wenig Unterhalt bekommt. Bis zum ${U.alter_grenze_ohne_bedingung}. Geburtstag genügt das; danach bis zum ${U.alter_grenze}. Geburtstag nur, wenn das Kind keine Leistungen nach dem SGB II bezieht oder der Elternteil ohne Kindergeld mindestens ${DE.eur(U.mindesteinkommen_elternteil_ab12)} Einkommen hat (§ 1 Abs. 1a UVG). Gezahlter Unterhalt und Waisenbezüge werden abgezogen. Den schriftlichen Antrag stellt der betreuende Elternteil bei der zuständigen Stelle, meist dem Jugendamt. Der Anspruch des Kindes gegen den anderen Elternteil geht in Höhe der Zahlung auf das Land über, das ihn anschließend selbst eintreibt.`,
    faqs: [
      { q: 'Wie viel Unterhaltsvorschuss bekommt ein Kind 2026 je nach Alter?', a: `Bis einschließlich ${A[0][1]} Jahre ${DE.eur(voll[0])}, von ${A[1][0]} bis ${A[1][1]} Jahre ${DE.eur(voll[1])}, von ${A[2][0]} bis ${A[2][1]} Jahre ${DE.eur(voll[2])} im Monat. Das ist jeweils der gesetzliche Mindestunterhalt abzüglich des vollen Kindergeldes für ein erstes Kind. Zahlt der andere Elternteil einen Teil, sinkt der Vorschuss um genau diesen Betrag. Die höhere Stufe gilt ab dem Monat, in dem das Kind Geburtstag hat.` },
      { q: 'Gibt es Unterhaltsvorschuss für Jugendliche ab zwölf Jahren?', a: `Ja, bis zum ${U.alter_grenze}. Geburtstag, aber nur unter einer von zwei Bedingungen: Das Kind bezieht keine Leistungen nach dem SGB II, oder der Vorschuss beendet seine Hilfebedürftigkeit; alternativ verdient der betreuende Elternteil ohne Kindergeld mindestens ${DE.eur(U.mindesteinkommen_elternteil_ab12)} im Monat (§ 1 Abs. 1a UVG). Maßgeblich ist der Bescheid des Jobcenters für den Monat des zwölften Geburtstags oder der späteren Antragstellung.` },
      { q: 'Muss der andere Elternteil den Unterhaltsvorschuss zurückzahlen?', a: 'Grundsätzlich ja. Mit jeder Zahlung geht der Unterhaltsanspruch des Kindes in derselben Höhe auf das Land über, einschließlich des Rechts, Auskunft über das Einkommen zu verlangen (§ 7 UVG). Für zurückliegende Monate haftet der Elternteil ab dem Zeitpunkt, zu dem er vom Antrag erfahren hat und über die Folgen belehrt wurde. Wie viel tatsächlich zurückgeholt werden kann, hängt von seiner Leistungsfähigkeit nach dem BGB ab.' },
      { q: 'Kann ich Unterhaltsvorschuss rückwirkend beantragen?', a: 'Nur sehr begrenzt. Gezahlt wird ab dem Monat des Antrags, wenn alle Voraussetzungen schon am Monatsanfang vorlagen. Rückwirkend gibt es den Vorschuss höchstens für den einen Monat vor der Antragstellung, und auch das nur, wenn sich der betreuende Elternteil zumutbar darum bemüht hat, den anderen zur Zahlung zu bewegen (§ 4 UVG). Wer wartet, verliert also Monat für Monat Geld.' },
      { q: 'Endet der Unterhaltsvorschuss, wenn ich wieder heirate?', a: 'Ja. Voraussetzung ist, dass das Kind bei einem Elternteil lebt, der ledig, verwitwet, geschieden oder dauernd getrennt ist (§ 1 Abs. 1 Nr. 2 UVG). Mit der Heirat entfällt diese Bedingung, auch wenn der neue Ehegatte für das Kind nicht unterhaltspflichtig ist. Ebenso entfällt der Anspruch, wenn beide leiblichen Eltern wieder zusammenziehen. Die Änderung ist der Unterhaltsvorschussstelle mitzuteilen.' },
      { q: 'Wird der Unterhaltsvorschuss auf das Bürgergeld angerechnet?', a: 'Ja, er zählt beim Jobcenter als Einkommen des Kindes, so wie gezahlter Unterhalt auch. Deshalb verlangt das Gesetz ab dem zwölften Geburtstag, dass der Vorschuss die Hilfebedürftigkeit des Kindes beseitigt oder der Elternteil selbst ein Mindesteinkommen hat. Umgekehrt wird das Kindergeld nicht noch einmal vom Vorschuss abgezogen, als es § 2 Abs. 2 UVG ohnehin schon vorsieht.' },
    ],
    body: (h) => `<h2>Die Beträge 2026 und woher sie kommen</h2>
<p>Der Vorschuss ist kein frei festgesetzter Sozialbetrag. Er knüpft an den Mindestunterhalt an, den § 1612a BGB jedem minderjährigen Kind zuspricht und der zugleich die erste Einkommensgruppe der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} bildet. Davon zieht ${h.src('uvg2', '§ 2 Abs. 2 UVG')} das Kindergeld für ein erstes Kind ab, ${h.eur(h.P.kindergeld.monat)} nach ${h.src('estg66', '§ 66 EStG')}, und zwar in voller Höhe, nicht nur zur Hälfte wie beim Barunterhalt.</p>
${h.table(['Alter', 'Mindestunterhalt', 'minus Kindergeld', 'Vorschuss 2026', 'Vorschuss 2025'], [0, 1, 2].map((s) => [`${A[s][0]} bis ${A[s][1]} Jahre`, h.eur(MU[s]), h.eur(KG), h.eur(voll[s]), h.eur(vorjahr[s])]), 'Monatliche Unterhaltsleistung nach § 2 UVG, aus den Werten 2026 und 2025 berechnet', ['l', 'r', 'r', 'r', 'r'])}
<p>${unveraendert ? `Auffällig: Die Beträge sind gegenüber 2025 gleich geblieben. Der Mindestunterhalt ist zwar gestiegen, das Kindergeld aber um genau denselben Betrag, und das volle Kindergeld wird abgezogen.` : `Gegenüber 2025 haben sich die Beträge verändert, weil Mindestunterhalt und Kindergeld nicht im gleichen Maß gestiegen sind.`} Wer den Mindestunterhalt nach einer Erhöhung prüft, sollte deshalb immer beide Werte nebeneinanderlegen. Auf das Jahr gerechnet erhält ein Grundschulkind ${h.eur(voll[1] * 12)}, ein Teenager mit erfüllten Zusatzbedingungen ${h.eur(voll[2] * 12)}.</p>
<h2>Wer Anspruch hat</h2>
<p>${h.src('uvg1', '§ 1 UVG')} verlangt drei Dinge. Das Kind lebt in Deutschland bei einem seiner Elternteile. Dieser Elternteil ist ledig, verwitwet, geschieden oder lebt von seinem Ehegatten dauernd getrennt. Und das Kind erhält vom anderen Elternteil keinen oder keinen regelmäßigen Unterhalt in Höhe des Vorschusses, oder nach dessen Tod keine Waisenbezüge in dieser Höhe.</p>
<p>Ausgeschlossen ist der Anspruch in einigen Konstellationen, die in der Praxis oft übersehen werden:</p>
<ul>
<li>Die Eltern leben wieder zusammen, auch ohne Trauschein.</li>
<li>Der betreuende Elternteil verweigert Auskünfte oder die Mitwirkung bei der Feststellung der Vaterschaft oder des Aufenthalts des anderen Elternteils.</li>
<li>Der andere Elternteil hat den Unterhalt für die betreffenden Monate im Voraus gezahlt.</li>
<li>Der Bedarf des Kindes ist durch Jugendhilfe gedeckt, etwa bei Unterbringung in einer Pflegefamilie.</li>
</ul>
<p>Eine Höchstdauer gibt es nicht mehr: Nach § 3 UVG wird gezahlt, bis eine Voraussetzung entfällt, längstens bis zum ${U.alter_grenze}. Geburtstag.</p>
<h2>Zwölf bis siebzehn Jahre: die Zusatzbedingung</h2>
<p>Für Jugendliche ab ${U.alter_grenze_ohne_bedingung} Jahren greift § 1 Abs. 1a UVG. Es muss eine von zwei Bedingungen erfüllt sein. Entweder bezieht das Kind keine Leistungen nach dem SGB II, oder der Vorschuss würde seine Hilfebedürftigkeit beenden. Oder der betreuende Elternteil hat ohne das Kindergeld ein Einkommen von mindestens ${h.eur(U.mindesteinkommen_elternteil_ab12)} im Monat, wobei die sonst üblichen Freibeträge nicht abgezogen werden. Entscheidend ist der Bescheid des Jobcenters für den Monat des zwölften Geburtstags.</p>
<p>Ein Beispiel zeigt die Wirkung: Lea ist 14 Jahre alt, ihre Mutter bezieht Leistungen des Jobcenters und verdient nichts hinzu. Ohne Zusatzbedingung liefert der Rechner ${h.eur(ohne.leistung)}. Nimmt die Mutter eine Teilzeitstelle mit mindestens ${h.eur(U.mindesteinkommen_elternteil_ab12)} an, stehen Lea ${h.eur(mit.leistung)} im Monat zu.</p>
<h2>Was angerechnet wird</h2>
<p>Nach § 2 Abs. 3 UVG mindern Unterhaltszahlungen des anderen Elternteils und Waisenbezüge den Vorschuss Euro für Euro. Der Vater von Mia, 8 Jahre, überweist unregelmäßig ${h.eur(150)}. Mia erhält dann noch ${h.eur(teil.leistung)} Vorschuss, zusammen also den Mindestunterhalt abzüglich Kindergeld. Ben, 3 Jahre, bezieht nach dem Tod seines Vaters ${h.eur(120)} Waisenrente; ihm bleiben ${h.eur(waise.leistung)}.</p>
<p>Für Jugendliche, die keine allgemeinbildende Schule mehr besuchen, etwa weil sie eine Ausbildung begonnen haben, zählen nach § 2 Abs. 4 UVG auch eigene Einkünfte, allerdings nur zur Hälfte. Einkommen des betreuenden Elternteils spielt dagegen bis zum zwölften Geburtstag keine Rolle; eine gut verdienende Mutter erhält den Vorschuss ebenso.</p>
<h2>Antrag, Zahlung, Rückgriff</h2>
<p>Den Antrag stellt schriftlich der Elternteil, bei dem das Kind lebt, oder ein gesetzlicher Vertreter, bei der Stelle, die das Landesrecht bestimmt. In den meisten Kommunen ist das die Unterhaltsvorschussstelle des Jugendamts, viele bieten den Antrag auch online an. Beizufügen sind in der Regel Geburtsurkunde, Nachweise über Trennung oder Scheidung und alles, was über den anderen Elternteil bekannt ist. Gezahlt wird monatlich im Voraus, auf volle Euro aufgerundet (§ 9 UVG).</p>
<p>Mit der Zahlung wechselt der Unterhaltsanspruch des Kindes in Höhe des Vorschusses den Gläubiger: Nach § 7 UVG geht er mit dem Auskunftsanspruch auf das Land über. Das Land fordert den Betrag vom anderen Elternteil zurück und kann künftigen Unterhalt als dynamischen Mindestunterhalt gerichtlich festsetzen lassen. Wie viel es durchsetzen kann, richtet sich nach dem BGB: Auch gegenüber dem Land bleibt dem Pflichtigen sein ${h.a('selbstbehalt', 'notwendiger Selbstbehalt')}. Verdient der andere Elternteil genug für einen höheren Unterhalt als den Mindestbetrag, lässt sich der Unterschied direkt für das Kind geltend machen, zum Beispiel über eine kostenlose Beistandschaft des Jugendamts. Die Höhe nach Einkommen zeigt die Seite zum ${h.a('kindesunterhalt', 'Kindesunterhalt')}.</p>
<p>Diese Darstellung ist eine allgemeine Information zum Unterhaltsvorschussgesetz in der Fassung 2026 und keine Rechtsberatung; über den Einzelfall entscheidet die zuständige Unterhaltsvorschussstelle. Den eigenen Betrag rechnet der ${h.a('unterhaltsvorschuss-rechner', 'Unterhaltsvorschuss-Rechner')} aus.</p>`,
  },
  en: {
    slug: 'maintenance-advance',
    nav: 'Maintenance advance',
    card: '2026 rates by age, the extra rules from twelve, how to apply at the Jugendamt and how the state recovers the money.',
    title: 'Maintenance Advance Germany 2026: Unterhaltsvorschuss',
    description: `German maintenance advance 2026: ${EN.eur(voll[0])}, ${EN.eur(voll[1])} or ${EN.eur(voll[2])} a month by age, extra conditions from ${U.alter_grenze_ohne_bedingung}, applying at the Jugendamt and recovery from the other parent.`,
    h1: 'Maintenance advance: when the other parent does not pay',
    intro: 'The German state steps in when child support fails to arrive, then claims the money back from the parent who owes it.',
    resume: `In 2026 the German maintenance advance (Unterhaltsvorschuss) pays ${EN.eur(voll[0])} a month for children aged ${A[0][0]} to ${A[0][1]}, ${EN.eur(voll[1])} for ages ${A[1][0]} to ${A[1][1]} and ${EN.eur(voll[2])} for ages ${A[2][0]} to ${A[2][1]}. Section 2 of the Maintenance Advance Act (UVG) sets the formula: the statutory minimum child support under section 1612a of the Civil Code (${EN.eur(MU[0])}, ${EN.eur(MU[1])}, ${EN.eur(MU[2])}) minus the child benefit for a first child, ${EN.eur(KG)}. A child qualifies if it lives in Germany with a parent who is single, widowed, divorced or permanently separated, and receives no support, or too little, from the other parent. Up to the ${U.alter_grenze_ohne_bedingung}th birthday that is enough. From then until ${U.alter_grenze}, the child must not depend on job-centre benefits under Social Code II, or the resident parent must earn at least ${EN.eur(U.mindesteinkommen_elternteil_ab12)} a month excluding child benefit (section 1(1a) UVG). Any support or orphan’s pension actually received is deducted. The resident parent applies in writing, usually at the youth welfare office (Jugendamt), and the child’s claim against the absent parent passes to the federal state, which then recovers it.`,
    faqs: [
      { q: 'How much maintenance advance does a child get in Germany in 2026?', a: `${EN.eur(voll[0])} a month up to age ${A[0][1]}, ${EN.eur(voll[1])} from ${A[1][0]} to ${A[1][1]}, and ${EN.eur(voll[2])} from ${A[2][0]} to ${A[2][1]}. Each figure is the statutory minimum support minus the full child benefit for a first child. If the other parent pays part of the support, the advance falls by exactly that amount. The higher rate applies from the month of the birthday that moves the child into the next band.` },
      { q: 'Can a non-EU parent in Germany receive Unterhaltsvorschuss?', a: 'EU and EEA citizens with free movement rights are treated like Germans. Other foreign nationals qualify only with certain residence titles, among them a settlement permit, an EU Blue Card or a residence permit that allows gainful work for a longer period, while some permits for study or job-seeking are excluded (section 1(2a) UVG). The local office checks the permit of the parent or the child.' },
      { q: 'Does the advance continue if the other parent lives abroad?', a: 'The law looks at where the child lives, not the other parent. If the child lives in Germany with the resident parent and receives too little support, the advance is paid even when the other parent is in another country. The claim then passes to the federal state, which tries to recover it there. How successful that is depends on the country and its cooperation with German authorities.' },
      { q: 'What happens to the advance if I remarry or move in with the other parent?', a: 'It stops. The child must live with a parent who is single, widowed, divorced or permanently separated, so a new marriage ends entitlement even if the new spouse owes the child nothing. Moving back in with the child’s other parent also ends it, married or not (section 1(3) UVG). You must report such changes to the maintenance advance office, otherwise overpayments are reclaimed.' },
      { q: 'Can the maintenance advance be backdated to when payments stopped?', a: 'Only by one month. Payment starts in the month you apply if all conditions were met on the first day; for earlier periods the office pays at most the month before the application, and only if you made reasonable efforts to get the other parent to pay (section 4 UVG). Applying promptly therefore matters, because missed months are simply lost.' },
    ],
    body: (h) => `<h2>The 2026 rates and how they are built</h2>
<p>Unlike most German benefits, the advance is not a separate social rate. It is tied to the minimum child support that section 1612a of the Civil Code (BGB) grants every minor, the same figures that make up income group 1 of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}. ${h.src('uvg2', 'Section 2(2) UVG')} then deducts child benefit (Kindergeld) for a first child, ${h.eur(h.P.kindergeld.monat)} under ${h.src('estg66', 'section 66 of the Income Tax Act')}. The whole amount comes off, not half as in ordinary support between parents.</p>
${h.table(['Age', 'Minimum support', 'less child benefit', 'Advance 2026', 'Advance 2025'], [0, 1, 2].map((s) => [`${A[s][0]} to ${A[s][1]}`, h.eur(MU[s]), h.eur(KG), h.eur(voll[s]), h.eur(vorjahr[s])]), 'Monthly payment under section 2 UVG, computed from the 2026 and 2025 values', ['l', 'r', 'r', 'r', 'r'])}
<p>${unveraendert ? `The rates have not moved since 2025. Minimum support rose, but child benefit rose by exactly the same amount, and since the full benefit is deducted the two changes cancel out.` : `The rates differ from 2025 because minimum support and child benefit did not rise by the same amount.`} Over a year that is ${h.eur(voll[1] * 12)} for a primary-school child and ${h.eur(voll[2] * 12)} for a teenager who meets the extra conditions.</p>
<h2>Who can claim</h2>
<p>${h.src('uvg1', 'Section 1 UVG')} sets three conditions. The child lives in Germany with one parent. That parent is single, widowed, divorced or permanently separated from a spouse. And the child gets no support, or no regular support at the level of the advance, from the other parent, or no orphan’s pension of that size if the other parent has died.</p>
<p>Several situations rule the advance out:</p>
<ul>
<li>the parents live together again, married or not;</li>
<li>the resident parent refuses information or will not help establish paternity or the other parent’s whereabouts;</li>
<li>the other parent paid support for those months in advance;</li>
<li>the child’s needs are covered by youth welfare, for example in foster care.</li>
</ul>
<p>There is no longer a maximum period. Under section 3 UVG payment continues until a condition lapses, at the latest at the ${U.alter_grenze}th birthday.</p>
<h2>Teenagers from twelve: one more hurdle</h2>
<p>From age ${U.alter_grenze_ohne_bedingung}, section 1(1a) UVG adds a test aimed at families on job-centre benefits (Grundsicherung under Social Code II, often called Bürgergeld). The advance continues if the child receives no such benefits, or if the advance would lift the child out of need. Alternatively, the resident parent must have income of at least ${h.eur(U.mindesteinkommen_elternteil_ab12)} a month, child benefit excluded and without the usual allowances deducted. The job-centre decision for the month of the twelfth birthday is decisive.</p>
<p>Take Noah, 14, whose father lives on job-centre benefits with no earnings. Without the extra condition the result is ${h.eur(ohne.leistung)}. Once the father takes a part-time job paying at least ${h.eur(U.mindesteinkommen_elternteil_ab12)}, Noah is entitled to ${h.eur(mit.leistung)} a month.</p>
<h2>What is deducted</h2>
<p>Under section 2(3) UVG, support from the absent parent and orphan’s pensions reduce the advance one for one. Sofia is 8; her mother, who moved back to Spain, sends ${h.eur(150)} when she can. The advance tops this up with ${h.eur(teil.leistung)}. Jonas, 3, receives ${h.eur(120)} orphan’s pension after his father’s death and is left with ${h.eur(waise.leistung)} from the advance.</p>
<p>Teenagers who have left general school, for instance to start vocational training, also have their own earnings counted, but only half of them (section 2(4) UVG). The resident parent’s income, by contrast, plays no role before the twelfth birthday: a well-paid expat parent still qualifies.</p>
<h2>Applying, payment and recovery</h2>
<p>The resident parent or the child’s legal representative applies in writing to the office designated by state law, in most towns the maintenance advance unit (Unterhaltsvorschussstelle) of the Jugendamt. Many municipalities accept online applications. Typical documents are the birth certificate, proof of separation or divorce and whatever you know about the other parent; foreign documents may need a translation. The advance is paid monthly in advance and rounded up to whole euros (section 9 UVG).</p>
<p>Each payment moves the child’s claim, up to the amount paid, to the federal state, together with the right to demand income information (section 7 UVG). The state then pursues the absent parent and may ask the family court (Familiengericht) to set future support as a dynamic minimum. What it can actually recover follows the Civil Code, so the absent parent keeps the ${h.a('selbstbehalt', 'minimum self-retention')}. If that parent earns enough for more than the minimum, the difference can be claimed for the child directly, for instance through the Jugendamt’s free support service (Beistandschaft). The ${h.a('kindesunterhalt', 'child support')} page shows the amounts by income.</p>
<p>This page is general information on the Maintenance Advance Act as it stands in 2026, not legal advice; the local maintenance advance office decides each case. To work out your own figure, use the ${h.a('unterhaltsvorschuss-rechner', 'maintenance advance calculator')}.</p>`,
  },
});
