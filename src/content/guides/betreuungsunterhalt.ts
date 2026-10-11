import { defineGuide } from '../../lib/guide-types';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

const S = P.selbstbehalt;
/**
 * § 1615l BGB nach Anm. D III/IV DT 2026 und Nummer 18 der Leitlinien NRW (wie Mini „betreuung“):
 * Bedarf = früheres Einkommen, mindestens 1.200 €; höchstens, was einem Ehegatten in gleicher Lage zustünde
 * (Quote nach dem Motor); begrenzt durch den Selbstbehalt des Zahlenden.
 */
function nichtehelich(vorher: number, nettoNachKu: number) {
  const bedarf = Math.max(S.bedarf_1615l_mindest, vorher);
  const halbteilung = ehegattenunterhalt({ pflichtigErwerb: nettoNachKu, berechtigtErwerb: 0 }).quote;
  const leistungsfaehig = Math.max(0, nettoNachKu - S.ehegatte_erwerbstaetig);
  const betrag = Math.min(bedarf, halbteilung, leistungsfaehig);
  const grenze = betrag === leistungsfaehig ? 'sb' : betrag === halbteilung ? 'quote' : 'bedarf';
  return { bedarf, halbteilung, leistungsfaehig, betrag, grenze };
}
/** Beispiele: Verkäuferin (1.900 € vorher, Vater 2.600 € nach Kindesunterhalt), Studentin (900 €, Vater 3.400 €), Ingenieurin (2.600 €, Vater 4.500 €). */
const verk = nichtehelich(1900, 2600);
const stud = nichtehelich(900, 3400);
const ing = nichtehelich(2600, 4500);
/** Verheiratet, Scheidung, Kind 2 Jahre: Vater 3.800 €, Mutter ohne Einkommen. */
const ku = kindesunterhalt(3800, [{ alter: 2 }]);
const ehe = ehegattenunterhalt({ pflichtigErwerb: 3800, berechtigtErwerb: 0, kindesunterhalt: ku.summe });

export default defineGuide({
  id: 'betreuungsunterhalt',
  group: 'ehe',
  order: 30,
  mini: 'betreuung',
  related: ['ehegattenunterhalt', 'trennungsunterhalt', 'kindesunterhalt', 'selbstbehalt', 'unterhaltsrechner', 'unterhaltsverfahren-kosten'],
  sources: ['bgb1570', 'bgb1615l', 'olgDtPdf', 'olgLeitlinien', 'bgb1609', 'bgb1578b'],
  de: {
    slug: 'betreuungsunterhalt',
    nav: 'Betreuungsunterhalt',
    card: 'Unterhalt für den Elternteil, der ein Kleinkind betreut: verheiratet nach § 1570, unverheiratet nach § 1615l BGB.',
    title: 'Betreuungsunterhalt 2026: § 1570 und § 1615l BGB erklärt',
    description: `Betreuungsunterhalt 2026 für Verheiratete (§ 1570 BGB) und Unverheiratete (§ 1615l BGB): drei Jahre ab Geburt, Mindestbedarf ${DE.eur(S.bedarf_1615l_mindest)}, Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}.`,
    h1: 'Betreuungsunterhalt für den Elternteil eines Kleinkindes',
    intro: 'Wer ein gemeinsames Kind betreut, kann vom anderen Elternteil Unterhalt verlangen, unabhängig davon, ob die Eltern verheiratet waren.',
    resume: `Betreuungsunterhalt steht dem Elternteil zu, der ein gemeinsames Kind betreut und deshalb nicht oder nur eingeschränkt arbeiten kann. Für Geschiedene regelt ihn § 1570 BGB, für Eltern, die nie verheiratet waren, § 1615l BGB. In beiden Fällen besteht der Anspruch mindestens bis zum dritten Geburtstag des Kindes und verlängert sich, solange das der Billigkeit entspricht, vor allem wenn keine passende Betreuung zur Verfügung steht. Beim unverheirateten Elternteil richtet sich der Bedarf nach dem Einkommen, das er ohne Geburt hätte, nach der Düsseldorfer Tabelle 2026 aber in der Regel mindestens ${DE.eur(S.bedarf_1615l_mindest)}; beim geschiedenen nach der Quote von ${DE.pct(P.ehegatte.quote_erwerb)}. Dem Zahlenden bleiben nach dem vorrangigen Kindesunterhalt mindestens ${DE.eur(S.ehegatte_erwerbstaetig)}, wenn er arbeitet. Eine Verkäuferin, die vorher ${DE.eur(1900)} verdiente, erhält von einem Vater mit ${DE.eur(2600)} nach Kindesunterhalt daher nur ${DE.eur(verk.betrag)}. Beide Ansprüche stehen im zweiten Rang nach den Kindern.`,
    faqs: [
      { q: 'Haben unverheiratete Mütter Anspruch auf Betreuungsunterhalt?', a: `Ja, nach § 1615l BGB. Der Vater schuldet Unterhalt für sechs Wochen vor und acht Wochen nach der Geburt und darüber hinaus, solange von der Mutter wegen der Betreuung des Kindes keine Arbeit erwartet werden kann, mindestens drei Jahre ab Geburt. Ihr Bedarf richtet sich nach ihrem früheren Einkommen, in der Regel mindestens ${DE.eur(S.bedarf_1615l_mindest)}. Betreut der Vater das Kind, steht ihm der Anspruch gegen die Mutter zu.` },
      { q: 'Wann wird Betreuungsunterhalt über drei Jahre hinaus gezahlt?', a: 'Wenn es der Billigkeit entspricht. Das Gesetz nennt die Belange des Kindes und die vorhandenen Betreuungsmöglichkeiten: etwa eine Krankheit oder Behinderung, die besondere Betreuung erfordert, oder fehlende Kita- und Hortplätze. Bei Geschiedenen kommen elternbezogene Gründe hinzu, etwa die in der Ehe gelebte Rollenverteilung und ihre Dauer. Die Umstände muss der betreuende Elternteil darlegen; meist folgt ein schrittweiser Übergang zur Teilzeit.' },
      { q: 'Wie hoch ist der Betreuungsunterhalt, wenn die Mutter vorher gut verdient hat?', a: `Ihr früheres Einkommen bestimmt den Bedarf, doch er ist nach den Leitlinien der Oberlandesgerichte in NRW auf das begrenzt, was einem Ehegatten in gleicher Lage zustünde. Hatte eine Ingenieurin ${DE.eur(2600)} netto und hat der Vater nach Kindesunterhalt ${DE.eur(4500)}, deckelt die Quote den Anspruch bei ${DE.eur(ing.betrag)}. Zusätzlich muss dem Vater sein Selbstbehalt bleiben.` },
      { q: 'Wird Elterngeld oder ein Minijob auf den Betreuungsunterhalt angerechnet?', a: 'Eigenes Einkommen während der Betreuung mindert grundsätzlich den Bedarf; für Erwerbseinkommen gelten die Regeln des Ehegattenunterhalts entsprechend, also auch der Abzug eines Erwerbsanreizes. Elterngeld berührt Unterhaltspflichten nach § 11 BEEG nur, soweit es einen gesetzlichen Sockelbetrag übersteigt; beim Elterngeld Plus ist dieser Sockel halb so hoch. Arbeitet jemand neben einem Kleinkind unter drei Jahren mehr, als von ihm verlangt werden kann, wird dieses Einkommen oft nur teilweise angerechnet.' },
      { q: 'Kann Betreuungsunterhalt nach § 1570 BGB befristet werden?', a: `Eine zeitliche Begrenzung nach § 1578b Absatz 2 BGB scheidet beim Betreuungsunterhalt aus, weil § 1570 die Dauer selbst regelt; die Leitlinien in NRW stellen das ausdrücklich fest. Möglich bleibt eine Herabsetzung auf den angemessenen Lebensbedarf. Endet die Betreuungsbedürftigkeit, kann sich ein anderer Anspruch anschließen, zum Beispiel Aufstockungsunterhalt, für den dann die allgemeinen Regeln gelten.` },
    ],
    body: (h) => `<h2>Zwei Vorschriften, ein Gedanke</h2>
<p>Kleine Kinder brauchen Betreuung, und wer sie leistet, kann nicht zugleich voll verdienen. Das Gesetz gleicht das mit zwei parallelen Ansprüchen aus: ${h.src('bgb1570', '§ 1570 BGB')} für geschiedene und, über § 1361 BGB, für getrennt lebende Ehegatten, ${h.src('bgb1615l', '§ 1615l BGB')} für Eltern, die nie verheiratet waren. Beide schützen in erster Linie das Kind, nicht die Partnerschaft.</p>
${h.table(['Frage', 'Geschiedene Eltern (§ 1570)', 'Nicht verheiratete Eltern (§ 1615l)'], [
  ['Beginn', 'mit der Scheidung (vorher Trennungsunterhalt)', 'frühestens vier Monate vor der Geburt'],
  ['Mindestdauer', 'drei Jahre ab Geburt', 'drei Jahre ab Geburt'],
  ['Verlängerung', 'kindbezogen und elternbezogen', 'vor allem kindbezogen'],
  ['Bedarf', `Quote ${h.pct(h.P.ehegatte.quote_erwerb)} nach ehelichen Verhältnissen`, `früheres Einkommen, mindestens ${h.eur(h.P.selbstbehalt.bedarf_1615l_mindest)}`],
  ['Selbstbehalt des Zahlenden', `${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} / ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}`, `${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} / ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}`],
  ['Rang nach § 1609 BGB', 'zweiter Rang', 'zweiter Rang'],
], 'Selbstbehalt: erwerbstätig / nicht erwerbstätig, Stand Düsseldorfer Tabelle 2026', ['l', 'l', 'l'])}
<h2>Die ersten drei Jahre</h2>
<p>Bis zum dritten Geburtstag des Kindes muss der betreuende Elternteil nicht arbeiten. Die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} formulieren es klar: Bis zur Vollendung des dritten Lebensjahres eines gemeinsamen Kindes besteht keine Erwerbsobliegenheit. Wer in dieser Zeit trotzdem arbeitet, tut mehr, als er müsste; die Gerichte rechnen solches Einkommen häufig nur teilweise an.</p>
<p>Bei nicht verheirateten Eltern reicht der Anspruch noch weiter nach vorn. § 1615l Absatz 1 BGB gibt der Mutter Unterhalt für sechs Wochen vor und acht Wochen nach der Geburt, unabhängig von der Betreuung, außerdem die Kosten von Schwangerschaft und Entbindung. Kann sie wegen der Schwangerschaft oder einer dadurch verursachten Krankheit nicht arbeiten, beginnt die Pflicht frühestens vier Monate vor der Geburt.</p>
<h2>Verlängerung über drei Jahre hinaus</h2>
<p>Danach ist der Anspruch nicht automatisch vorbei. Er verlängert sich, solange und soweit es der Billigkeit entspricht. Maßgeblich sind:</p>
<ul>
<li><strong>kindbezogene Gründe</strong>: besondere Betreuungsbedürftigkeit, etwa wegen Krankheit oder Entwicklungsverzögerung, und die Frage, ob eine verlässliche Kita, Ganztagsschule oder ein Hort tatsächlich zur Verfügung steht;</li>
<li><strong>elternbezogene Gründe</strong> (ausdrücklich in § 1570 Absatz 2 BGB genannt): das in der Ehe gewachsene Vertrauen in die vereinbarte Rollenverteilung, die Gestaltung von Betreuung und Beruf und die Dauer der Ehe;</li>
<li><strong>gerechte Lastenverteilung</strong>: ob Vollzeitarbeit neben der verbleibenden Betreuung zu einer überobligatorischen Belastung führen würde.</li>
</ul>
<p>Die Darlegungs- und Beweislast trägt nach den Leitlinien der betreuende Elternteil. In der Praxis verlangen viele Gerichte nach dem dritten Geburtstag einen schrittweisen Einstieg in die Erwerbstätigkeit, statt den Anspruch auf einen Schlag enden zu lassen.</p>
<h2>Wie viel? Drei Beispiele für nicht verheiratete Eltern</h2>
<p>Der Bedarf nach § 1615l BGB richtet sich nach der Lebensstellung des betreuenden Elternteils, also nach dem Einkommen, das er ohne Geburt und Betreuung hätte. Die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} setzt in Anmerkung D einen Mindestbedarf von ${h.eur(h.P.selbstbehalt.bedarf_1615l_mindest)} an. Nach oben begrenzen ihn zwei Schranken: der Betrag, der einem Ehegatten in gleicher Lage zustünde, und der Selbstbehalt des Zahlenden.</p>
${h.table(['Mutter vorher', 'Vater nach Kindesunterhalt', 'Bedarf', 'Grenze', 'Unterhalt'], [
  [h.eur(1900), h.eur(2600), h.eur(verk.bedarf), `Selbstbehalt ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}`, h.eur(verk.betrag)],
  [h.eur(900), h.eur(3400), h.eur(stud.bedarf), 'keine', h.eur(stud.betrag)],
  [h.eur(2600), h.eur(4500), h.eur(ing.bedarf), `Quote ${h.pct(h.P.ehegatte.quote_erwerb)}`, h.eur(ing.betrag)],
], 'Berechnet nach Anmerkung D der Tabelle und Nummer 18 der Leitlinien NRW, Vater erwerbstätig, Mutter ohne eigenes Einkommen während der Betreuung', ['r', 'r', 'r', 'l', 'r'])}
<p>Die Studentin in der zweiten Zeile hatte vorher nur ${h.eur(900)}, ihr Bedarf wird auf den Mindestbetrag angehoben. Die Verkäuferin in der ersten Zeile verliert dagegen den größeren Teil ihres Bedarfs, weil dem Vater nach Kindesunterhalt nur ${h.eur(verk.leistungsfaehig)} über dem ${h.a('selbstbehalt', 'Selbstbehalt')} bleiben.</p>
<h2>Verheiratete Eltern: die Ehe bestimmt den Maßstab</h2>
<p>Beim geschiedenen Ehegatten zählt nicht das frühere eigene Einkommen, sondern der eheliche Lebensstandard. Gerechnet wird mit der Quote des ${h.a('ehegattenunterhalt', 'Ehegattenunterhalts')} nach Abzug des Kindesunterhalts. Verdient der Vater ${h.eur(3800)} und betreut die Mutter ein zweijähriges Kind ohne eigenes Einkommen, gehen zuerst ${h.eur(ku.summe, 2)} ${h.a('kindesunterhalt', 'Kindesunterhalt')} ab; der Betreuungsunterhalt beträgt dann ${h.eur(ehe.unterhalt, 2)}. Während der Trennung heißt derselbe Anspruch ${h.a('trennungsunterhalt', 'Trennungsunterhalt')}.</p>
<p>Eine Befristung nach ${h.src('bgb1578b', '§ 1578b Absatz 2 BGB')} ist beim Unterhalt nach § 1570 ausgeschlossen, eine Herabsetzung bleibt möglich.</p>
<h2>Rang und Unterstützung durch das Jugendamt</h2>
<p>Nach ${h.src('bgb1609', '§ 1609 BGB')} steht jeder Elternteil, der wegen Kinderbetreuung unterhaltsberechtigt ist, im zweiten Rang, direkt hinter den minderjährigen Kindern und gleichauf mit einem Ehegatten aus langer Ehe. Betreuen eine geschiedene Ehefrau und eine neue Partnerin je ein Kind des Vaters, konkurrieren beide Mütter also auf derselben Stufe.</p>
<p>Unverheiratete Elternteile können sich nach § 18 SGB VIII vom Jugendamt bei der Geltendmachung ihres Anspruchs aus § 1615l BGB beraten und unterstützen lassen; die Urkundsperson des Jugendamts kann die Unterhaltsverpflichtung des anderen Elternteils außerdem beurkunden (§ 59 SGB VIII). Der Anspruch erlischt nicht mit dem Tod des Vaters. Einen Überblick über alle Ansprüche der Familie gibt der ${h.a('unterhaltsrechner', 'Unterhaltsrechner')}, die Prozesskosten zeigt die Seite ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')}.</p>
<p>Die Seite ist eine allgemeine Information zum Betreuungsunterhalt, Stand 2026, keine Rechtsberatung; ob eine Verlängerung über drei Jahre hinaus der Billigkeit entspricht, entscheidet das Familiengericht im Einzelfall.</p>`,
  },
  en: {
    slug: 'childcare-maintenance',
    nav: 'Childcare maintenance',
    card: 'Maintenance for the parent caring for a young child in Germany, married (section 1570) or not (section 1615l).',
    title: 'Childcare Maintenance Germany 2026: Married and Unmarried',
    description: `Childcare maintenance in Germany 2026 for married (section 1570 BGB) and unmarried parents (section 1615l): three years from birth, ${EN.eur(S.bedarf_1615l_mindest)} minimum need.`,
    h1: 'Childcare maintenance for the parent of a young child',
    intro: 'A parent caring for a joint child can claim maintenance from the other parent in Germany, whether or not the two were ever married.',
    resume: `German law gives the parent who looks after a young child a maintenance claim against the other parent, called Betreuungsunterhalt. Divorced parents rely on section 1570 of the Civil Code (BGB); parents who never married rely on section 1615l BGB. Both claims last at least until the child’s third birthday and are extended for as long as fairness requires, especially if suitable childcare is not available. For an unmarried parent the need equals the income they would have earned without the birth, usually at least ${EN.eur(S.bedarf_1615l_mindest)} under the 2026 Düsseldorf Table. For a divorced parent it follows the marital standard, worked out with the ${EN.pct(P.ehegatte.quote_erwerb)} quota. Child support is paid first; the paying parent then keeps a self-retention (Selbstbehalt) of ${EN.eur(S.ehegatte_erwerbstaetig)} if working. A student who earned ${EN.eur(900)} before the birth and whose partner has ${EN.eur(3400)} left after child support can claim ${EN.eur(stud.betrag)}. Both claims rank second, right after minor children.`,
    faqs: [
      { q: 'We were never married. Can the mother of my child claim maintenance for herself in Germany?', a: `Yes. Under section 1615l BGB the father owes maintenance for six weeks before and eight weeks after the birth and beyond that while she cannot be expected to work because of the child, at least for three years. Her need depends on what she earned before, usually at least ${EN.eur(S.bedarf_1615l_mindest)}. If the father is the one caring for the child, the claim runs against the mother.` },
      { q: 'Does childcare maintenance stop when a child starts German kindergarten (Kita)?', a: 'Not automatically. After the third birthday the court asks whether work is reasonable, and the real availability of a Kita place, its opening hours and the child’s needs all count. Many courts expect a gradual move into part-time work rather than a sudden switch to full time. The caring parent has to explain why more work is not possible.' },
      { q: 'I earned well in my home country before moving to Germany and having our child. Does that count?', a: `For unmarried parents, the need depends on the income you would have earned without the birth and childcare, which a court assesses from your actual career path, including foreseeable raises. It is capped at what a spouse in the same position would receive under the ${EN.pct(P.ehegatte.quote_erwerb)} quota, and the other parent keeps ${EN.eur(S.ehegatte_erwerbstaetig)}. How a court values a career started abroad is a question of evidence in each case.` },
      { q: 'Can the youth welfare office (Jugendamt) help with a section 1615l claim?', a: 'Yes. Under section 18 of Social Code VIII, single parents who were not married to the other parent are entitled to advice and support from the Jugendamt in asserting their section 1615l claim. The Jugendamt can also formally record the other parent’s commitment to pay (section 59 Social Code VIII). The free official guardianship for children’s claims (Beistandschaft) covers the child’s support, not the parent’s.' },
    ],
    body: (h) => `<h2>Two sections of the Civil Code, one idea</h2>
<p>Someone has to look after a baby, and that person cannot earn a full salary at the same time. German law compensates this through two parallel claims: ${h.src('bgb1570', 'section 1570 BGB')} for divorced spouses (and, through section 1361, separated ones) and ${h.src('bgb1615l', 'section 1615l BGB')} for parents who were never married. The claims exist mainly for the child’s sake.</p>
${h.table(['Question', 'Divorced parents (s. 1570)', 'Unmarried parents (s. 1615l)'], [
  ['Start', 'divorce (separation maintenance before)', 'at the earliest four months before birth'],
  ['Minimum duration', 'three years from birth', 'three years from birth'],
  ['Extension', 'child-related and parent-related reasons', 'mainly child-related reasons'],
  ['Need', `${h.pct(h.P.ehegatte.quote_erwerb)} quota on the marital standard`, `previous income, at least ${h.eur(h.P.selbstbehalt.bedarf_1615l_mindest)}`],
  ['Payer keeps', `${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} / ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}`, `${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} / ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)}`],
  ['Rank (s. 1609)', 'second', 'second'],
], 'Self-retention when working / not working, 2026 Düsseldorf Table', ['l', 'l', 'l'])}
<h2>The first three years</h2>
<p>Until the child turns three, the caring parent has no duty to work; the ${h.src('olgLeitlinien', 'NRW court guidelines')} state this without exception. A parent who nonetheless works during this period does more than required, and courts often count such earnings only in part.</p>
<p>Unmarried mothers are also covered around the birth itself: section 1615l(1) grants maintenance for six weeks before and eight weeks after the birth regardless of childcare, plus pregnancy and delivery costs. If pregnancy-related illness prevents work, the claim can start up to four months before the birth. The claim survives the father’s death.</p>
<h2>After the third birthday</h2>
<p>The claim continues as long as fairness requires. Courts look at:</p>
<ul>
<li><strong>the child</strong>: special care needs because of illness or development, and whether a reliable Kita, all-day school or after-school club (Hort) is actually available;</li>
<li><strong>the marriage</strong> (expressly named in section 1570(2)): the division of roles the couple chose, how childcare and jobs were organised and how long the marriage lasted;</li>
<li><strong>fair burden</strong>: whether full-time work on top of the remaining care would overload the parent.</li>
</ul>
<p>An expat parent may point out that no family network exists in Germany to fill gaps in childcare; whether that tips the balance is for the court.</p>
<h2>Three examples for unmarried parents</h2>
<p>The need under section 1615l reflects the caring parent’s own position: the income they would have had without the birth. Note D of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} sets ${h.eur(h.P.selbstbehalt.bedarf_1615l_mindest)} as the usual minimum. Two ceilings apply: what a spouse in the same situation would receive, and the payer’s self-retention.</p>
${h.table(['Mother before birth', 'Father after child support', 'Need', 'Limit', 'Maintenance'], [
  [h.eur(1900), h.eur(2600), h.eur(verk.bedarf), `self-retention ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)}`, h.eur(verk.betrag)],
  [h.eur(900), h.eur(3400), h.eur(stud.bedarf), 'none', h.eur(stud.betrag)],
  [h.eur(2600), h.eur(4500), h.eur(ing.bedarf), `${h.pct(h.P.ehegatte.quote_erwerb)} quota`, h.eur(ing.betrag)],
], 'Computed under note D of the table and guideline 18 (NRW), working father, mother without own income during care', ['r', 'r', 'r', 'l', 'r'])}
<p>The engineer in the last line earned ${h.eur(2600)}, but a spouse in her position would get only ${h.eur(ing.halbteilung)}, so that is the ceiling. The shop assistant in the first line is limited by the father’s ${h.a('selbstbehalt', 'self-retention')}: he has just ${h.eur(verk.leistungsfaehig)} above it.</p>
<h2>Married parents: the marriage sets the standard</h2>
<p>For divorced parents, the measure is the marital standard of living, calculated like ${h.a('ehegattenunterhalt', 'spousal maintenance')} after ${h.a('kindesunterhalt', 'child support')}. A father with ${h.eur(3800)} and a two-year-old first pays ${h.eur(ku.summe, 2)} for the child; the mother, with no income, then receives ${h.eur(ehe.unterhalt, 2)}. Before the divorce the same claim is part of ${h.a('trennungsunterhalt', 'separation maintenance')}. Under ${h.src('bgb1578b', 'section 1578b(2) BGB')} this claim cannot be time-limited, only reduced.</p>
<h2>Ranking and help from the Jugendamt</h2>
<p>Under ${h.src('bgb1609', 'section 1609 BGB')} every parent entitled because of childcare ranks second, behind minor children and level with a spouse from a long marriage. A father with a child from his marriage and one from a new relationship may therefore owe two mothers on the same level. Unmarried parents can turn to the youth welfare office (Jugendamt) for advice and support with their own claim. The ${h.a('unterhaltsrechner', 'maintenance calculator')} combines child and parent claims; court fees are on the ${h.a('unterhaltsverfahren-kosten', 'cost of maintenance proceedings')} page.</p>
<p>This page is general information on German childcare maintenance as of 2026, not legal advice; whether a claim continues beyond the child’s third birthday is decided case by case by the family court (Familiengericht).</p>`,
  },
});
