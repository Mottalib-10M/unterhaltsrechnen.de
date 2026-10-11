import { defineGuide } from '../../lib/guide-types';
import { bedarf, zahlbetrag, kgAnteil, kindesunterhalt, type Stufe } from '../../lib/engine/dt';
import { volljaehrigenunterhalt, uvgVoll } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Kindergeldanrechnung nach § 1612b BGB, alle Beispiele aus dem Motor. */
const KG = P.kindergeld.monat;
const AS = P.dt.altersstufen;
const STUFEN: Stufe[] = [0, 1, 2, 3];
const vor18 = kindesunterhalt(3800, [{ alter: 17 }]);
const ab18 = kindesunterhalt(3800, [{ alter: 18, privilegiert: true }]);
/** Studierende mit eigenem Haushalt, Eltern mit 3.200 € und 2.100 € bereinigtem Netto. */
const stud = volljaehrigenunterhalt({ einkommenA: 3200, einkommenB: 2100, eigenerHaushalt: true });
const G = 5; // Gruppe 6 als Anschauungszeile
/** Rechenweg: 2.700 € Netto, Kind von 14 Jahren. */
const vierzehn = kindesunterhalt(2700, [{ alter: 14 }]);
const k14 = vierzehn.kinder[0];

export default defineGuide({
  id: 'kindergeld-anrechnung',
  group: 'kind',
  order: 24,
  mini: 'kgAnrechnung',
  related: ['zahlbetragstabelle', 'studentenunterhalt', 'wechselmodell-unterhalt', 'unterhaltsvorschuss', 'kindesunterhalt', 'mangelfall'],
  sources: ['bgb1612b', 'estg66', 'bgb1606', 'olgLeitlinien', 'olgDtPdf'],
  de: {
    slug: 'kindergeld-anrechnung',
    nav: 'Kindergeld und Unterhalt',
    card: 'Warum beim minderjährigen Kind die Hälfte und beim volljährigen das ganze Kindergeld vom Unterhalt abgeht.',
    title: 'Kindergeld-Anrechnung beim Unterhalt 2026: halb oder ganz',
    description: `Kindergeld-Anrechnung 2026 nach § 1612b BGB: von ${DE.eur(KG)} gehen bei Minderjährigen ${DE.eur(KG / 2, 2)} vom Unterhalt ab, bei Volljährigen alles. Mit Beispielen und Tabelle.`,
    h1: 'Wie das Kindergeld auf den Unterhalt angerechnet wird',
    intro: 'Das Kindergeld gehört rechtlich dem Kind. Deshalb deckt es einen Teil seines Bedarfs und senkt den Betrag, den der zahlende Elternteil überweist.',
    resume: `Das Kindergeld beträgt 2026 ${DE.eur(KG)} je Kind und wird nach § 1612b BGB auf den Barbedarf des Kindes angerechnet. Lebt ein minderjähriges Kind bei einem Elternteil, der es betreut, wird die Hälfte abgezogen, also ${DE.eur(KG / 2, 2)}: Diese Hälfte entlastet den zahlenden Elternteil, die andere bleibt beim betreuenden, der das Kindergeld von der Familienkasse bezieht. In allen anderen Fällen, vor allem bei volljährigen Kindern, wird das Kindergeld voll angerechnet. Deshalb sinkt der Zahlbetrag mit dem 18. Geburtstag oft, obwohl der Tabellenbedarf steigt: Bei ${DE.eur(3800)} Netto zahlt ein Elternteil für ein siebzehnjähriges Kind ${DE.eur(vor18.summe, 2)}, für ein volljähriges Schulkind ${DE.eur(ab18.summe, 2)}. Beim Studierenden mit eigenem Haushalt bleiben vom Bedarf von ${DE.eur(P.dt.student_bedarf)} nach Abzug des vollen Kindergeldes ${DE.eur(P.dt.student_bedarf - KG)}, die beide Eltern nach ihren Einkommen teilen. Für die Eltern selbst ist Kindergeld kein Einkommen; es erhöht also weder die Einkommensgruppe des Zahlenden noch mindert es den Bedarf des betreuenden Elternteils.`,
    faqs: [
      { q: 'Wer bekommt das Kindergeld nach einer Trennung?', a: `Für jedes Kind wird Kindergeld nur an eine berechtigte Person gezahlt, und zwar an den Elternteil, der das Kind in seinen Haushalt aufgenommen hat (§ 64 Abs. 2 EStG). Lebt das Kind beim Vater, beantragt er es bei der Familienkasse. Der Unterhaltsabzug sorgt dann dafür, dass die Mutter über einen niedrigeren Zahlbetrag an der Hälfte teilhat.` },
      { q: 'Wird das Kindergeld beim Unterhalt doppelt angerechnet, wenn ich es selbst bekomme?', a: `Nein. Bezieht ausnahmsweise der barunterhaltspflichtige Elternteil das Kindergeld, etwa weil der Antrag noch nicht umgestellt ist, muss er den Kindergeldanteil des Kindes zusätzlich zum Zahlbetrag weitergeben oder den Tabellenbedarf ohne Abzug zahlen. Ein Abzug vom Unterhalt setzt voraus, dass das Geld dem Kind über den anderen Elternteil zufließt.` },
      { q: 'Warum zahle ich für mein 18-jähriges Kind weniger als vorher?', a: `Weil ab der Volljährigkeit das volle Kindergeld von ${DE.eur(KG)} statt der Hälfte abgezogen wird. Bei ${DE.eur(3800)} Netto sinkt der Zahlbetrag dadurch von ${DE.eur(vor18.summe, 2)} auf ${DE.eur(ab18.summe, 2)}, obwohl der Bedarf in der vierten Altersstufe höher ist. Zugleich wird auch der andere Elternteil barunterhaltspflichtig, was Ihren Anteil weiter senken kann.` },
      { q: 'Zählt Kindergeld als Einkommen bei der Unterhaltsberechnung?', a: `Nein, Kindergeld wird nicht zum Einkommen der Eltern gerechnet (Nummer 3 der Leitlinien NRW). Es ist zweckgebunden für das Kind und wirkt nur über § 1612b BGB auf dessen Bedarf. Auch beim Ehegattenunterhalt bleibt es außen vor; der betreuende Elternteil muss sich das Kindergeld also nicht als eigenes Einkommen anrechnen lassen.` },
      { q: 'Wie wird das Kindergeld bei der Anrechnung im Wechselmodell geteilt?', a: `Die Hälfte, die auf den Barunterhalt entfällt, kommt den Eltern nach ihrer Haftungsquote zugute; die Hälfte für die Betreuung wird zwischen ihnen hälftig geteilt (Nummer 14 Absatz 2 der Leitlinien NRW). Wer das Kindergeld bezieht, gibt also einen Teil an den anderen weiter, meist verrechnet mit der Unterhaltsspitze.` },
      { q: 'Was bedeutet die Regel zum Zählkindvorteil in § 1612b BGB?', a: `Wird Kindergeld erhöht, weil ein nicht gemeinsames Kind mitgezählt wird, mindert dieser Erhöhungsbetrag den Barbedarf nicht (§ 1612b Abs. 2 BGB). Weil das Kindergeld 2026 einheitlich ${DE.eur(KG)} je Kind beträgt, spielt die Vorschrift derzeit praktisch keine Rolle; sie greift erst wieder, wenn das Kindergeld nach der Kinderzahl gestaffelt wird.` },
    ],
    body: (h) => `<h2>Die Regel des § 1612b BGB</h2>
<p>Das Gesetz behandelt das Kindergeld als Geld, das den Bedarf des Kindes deckt. ${h.src('bgb1612b', '§ 1612b Abs. 1 BGB')} unterscheidet zwei Fälle:</p>
<ul>
<li>Ein Elternteil erfüllt seine Pflicht durch Betreuung (${h.src('bgb1606', '§ 1606 Abs. 3 Satz 2 BGB')}): Das Kindergeld wird zur Hälfte auf den Barbedarf angerechnet.</li>
<li>In allen anderen Fällen wird es voll angerechnet. Das betrifft vor allem volljährige Kinder, aber auch Kinder, die bei Dritten oder in einem Internat leben, sodass beide Eltern bar zahlen.</li>
</ul>
<p>Die Höhe des Kindergeldes regelt ${h.src('estg66', '§ 66 EStG')}: ${h.eur(h.P.kindergeld.monat)} je Kind und Monat im Jahr 2026, für das erste wie für das vierte Kind.</p>
<h2>Warum gerade die Hälfte</h2>
<p>Hinter der Halbteilung steht ein einfacher Gedanke. Beide Eltern leisten gleichwertigen Unterhalt, der eine durch Betreuung, der andere durch Geld. Also soll auch die staatliche Leistung für das Kind beiden zugutekommen. Der betreuende Elternteil erhält das Kindergeld ausgezahlt und behält seine Hälfte; der zahlende Elternteil profitiert, indem er seinen Anteil vom Tabellenbedarf abzieht. Im Ergebnis hat jeder ${h.eur(h.P.kindergeld.monat / 2, 2)} im Monat.</p>
${h.table(['Altersstufe', 'Bedarf Gruppe 6', 'angerechnet', 'Zahlbetrag'], STUFEN.map((s) => [s === 3 ? `ab ${AS[3][0]} (voll)` : `${AS[s][0]} bis ${AS[s][1]} Jahre (halb)`, h.eur(bedarf(G, s)), h.eur(kgAnteil(s), 2), h.eur(zahlbetrag(G, s), 2)]), 'Gruppe 6, bereinigtes Netto bis ' + h.eur(h.P.dt.gruppen_bis[G]) + ', vom Motor berechnet', ['l', 'r', 'r', 'r'])}
<p>Die ganze Zahlbetragstabelle mit allen Gruppen steht unter ${h.a('zahlbetragstabelle', 'Zahlbetragstabelle 2026')}.</p>
<h2>Der Sprung mit 18</h2>
<p>Mit der Volljährigkeit kippt die Rechnung zweifach. Erstens endet die Betreuungspflicht im Rechtssinn, auch wenn das Kind noch zu Hause wohnt; damit gilt die Vollanrechnung. Zweitens haften jetzt beide Eltern für den Barbedarf nach ihren Einkommen. In der Tabelle sieht man den ersten Effekt: Bei ${h.eur(3800)} Netto liegt der Zahlbetrag für ein siebzehnjähriges Kind bei ${h.eur(vor18.summe, 2)}, für ein achtzehnjähriges Schulkind bei ${h.eur(ab18.summe, 2)}, obwohl der Bedarf von ${h.eur(vor18.kinder[0].bedarf)} auf ${h.eur(ab18.kinder[0].bedarf)} steigt.</p>
<p>Bei Studierenden mit eigener Wohnung ist der Bedarf nach der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} in der Regel ${h.eur(h.P.dt.student_bedarf)}. Das volle Kindergeld geht ab, es bleiben ${h.eur(stud.restbedarf)}. Verdienen die Eltern ${h.eur(3200)} und ${h.eur(2100)}, tragen sie nach Abzug ihres Sockels von je ${h.eur(stud.sockel)} ${h.eur(stud.anteilA, 2)} und ${h.eur(stud.anteilB, 2)}. Wie das im Einzelnen gerechnet wird, zeigt die Seite zum ${h.a('studentenunterhalt', 'Unterhalt im Studium')}.</p>
<h2>Ein Rechenweg in vier Schritten</h2>
<p>Eine Mutter verdient bereinigt ${h.eur(2700)}, ihr Sohn ist vierzehn und lebt beim Vater. So kommt der Zahlbetrag zustande:</p>
<ul>
<li>Einkommensgruppe: Gruppe ${vierzehn.gruppe + 1}.</li>
<li>Tabellenbedarf in der dritten Altersstufe: ${h.eur(k14.bedarf)}.</li>
<li>Kindergeldanteil, weil der Vater betreut: ${h.eur(k14.kindergeld, 2)}.</li>
<li>Zahlbetrag: ${h.eur(k14.zahlbetrag, 2)} im Monat.</li>
</ul>
<p>Im Haushalt des Vaters kommen für den Sohn damit ${h.eur(k14.zahlbetrag + h.P.kindergeld.monat, 2)} an: der Unterhalt plus das volle Kindergeld. Das ist mehr als der Tabellenbedarf, und genau diese Differenz von ${h.eur(h.P.kindergeld.monat / 2, 2)} ist die Hälfte, die dem betreuenden Elternteil für seine Betreuungsleistung verbleibt. Wer den Zahlbetrag für zu niedrig hält, übersieht häufig diesen Zusammenhang.</p>
<h2>Wer das Kindergeld bekommt</h2>
<p>Für jedes Kind zahlt die Familienkasse das Kindergeld nur an eine Person. Bei getrennten Eltern ist das derjenige, in dessen Haushalt das Kind lebt (§ 64 Abs. 2 EStG). Nach einem Umzug des Kindes muss der Antrag bei der Familienkasse umgestellt werden. Der Unterhalt rechnet immer so, als ob der betreuende Elternteil das Kindergeld erhält. Bekommt es tatsächlich der Zahlende, muss er ausgleichen, sonst würde er doppelt profitieren.</p>
<h2>Besondere Konstellationen</h2>
<ul>
<li>Wechselmodell: Nach Nummer 14 Absatz 2 der ${h.src('olgLeitlinien', 'Leitlinien NRW')} wird die Barhälfte nach Einkommensquote, die Betreuungshälfte hälftig geteilt. Details unter ${h.a('wechselmodell-unterhalt', 'Wechselmodell')}.</li>
<li>Mangelfall: Eingesetzt wird der Zahlbetrag nach Kindergeldabzug, nicht der Tabellenbedarf. Das hält die Kinder untereinander gleich, siehe ${h.a('mangelfall', 'Mangelfall')}.</li>
<li>Unterhaltsvorschuss: Hier wird vom Mindestunterhalt das volle Kindergeld abgezogen, weil der Staat nicht für den Betreuungsanteil eintritt. Der Vorschuss beträgt deshalb ${h.eur(uvgVoll(0))} bis ${h.eur(uvgVoll(2))}, siehe ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')}.</li>
<li>Kindergeld ist kein Einkommen der Eltern (Nummer 3 der Leitlinien); es verändert weder die Einkommensgruppe noch den Ehegattenunterhalt.</li>
</ul>
<p>Die Darstellung der Kindergeldanrechnung ist allgemeine Information und keine Rechtsberatung; wie das Kindergeld in Ihrem Fall verrechnet wird, entscheiden im Streit das Familiengericht und für die Auszahlung die Familienkasse.</p>`,
  },
  en: {
    slug: 'child-benefit-offset',
    nav: 'Child benefit offset',
    card: 'Why half the child benefit comes off support for a minor and all of it for an adult child.',
    title: 'Child Benefit Offset in German Child Support 2026 Explained',
    description: `How German child benefit offsets support in 2026: of the ${EN.eur(KG)}, ${EN.eur(KG / 2, 2)} comes off for minors and the full amount for adults (section 1612b BGB). With examples.`,
    h1: 'How child benefit reduces German child support',
    intro: 'Legally, child benefit is the child’s money. It covers part of the child’s need, so the paying parent transfers less.',
    resume: `German child benefit (Kindergeld) is ${EN.eur(KG)} per child a month in 2026, and under section 1612b of the Civil Code (BGB) it is set against the child’s cash need. Where a minor lives with one parent who provides the care, half is deducted, ${EN.eur(KG / 2, 2)}: that half relieves the paying parent, while the other half stays with the resident parent who receives the benefit from the family benefits office (Familienkasse). In every other case, above all for adult children, the full benefit is deducted. That is why support often drops at 18 although the table need rises: on ${EN.eur(3800)} net, a parent pays ${EN.eur(vor18.summe, 2)} for a seventeen-year-old but ${EN.eur(ab18.summe, 2)} for an adult pupil living at home. For a student with a flat of their own, the ${EN.eur(P.dt.student_bedarf)} need shrinks to ${EN.eur(P.dt.student_bedarf - KG)} after the full benefit, shared between both parents by income. Child benefit is not income of either parent, so it neither lifts the payer’s income group nor reduces any spousal claim.`,
    faqs: [
      { q: 'Who receives child benefit in Germany after parents separate?', a: `Only one person per child, namely the parent in whose household the child lives (section 64(2) of the Income Tax Act, EStG). If the children move to their father, he must apply to the Familienkasse. The support calculation then lets the mother share in half of it through a lower payment amount, so neither parent loses out.` },
      { q: 'I still receive the Kindergeld although the children moved out: what now?', a: `Then the offset in the support calculation does not fit your case. A paying parent who also receives the benefit must pass the child’s share on in addition to the payment amount, or pay the table need without deduction. Have the claim switched to the other parent at the Familienkasse; until then, keep records of what you forward.` },
      { q: 'Why does support for my child fall when the child turns 18?', a: `Because the full ${EN.eur(KG)} is deducted from the need instead of half. On ${EN.eur(3800)} net the payment drops from ${EN.eur(vor18.summe, 2)} to ${EN.eur(ab18.summe, 2)}, although the need in the fourth age band is higher. At the same time the other parent becomes liable for cash support too, which can lower your share further.` },
      { q: 'Does child benefit count as my income in a German maintenance case?', a: `No. Under point 3 of the NRW guidelines child benefit is not income of the parents. It is earmarked for the child and acts only through section 1612b BGB on the child’s need. It is also left out of spousal maintenance, so the resident parent’s claim is not reduced because the benefit is paid to them.` },
      { q: 'We receive a family benefit from another country instead of Kindergeld: how is it treated?', a: `German rules are written for German Kindergeld. Where a comparable foreign family benefit is paid instead, courts generally look at how that payment relates to the child’s need, but there is no single formula in the guidelines. Gather the award letters and ask the Jugendamt or the court how they apply section 1612b BGB to your situation.` },
      { q: 'How is the child benefit offset split when care is shared equally?', a: `The half linked to cash support benefits the parents according to their income shares; the half linked to care is split equally (point 14(2) of the NRW guidelines). The parent who receives the benefit therefore passes part of it to the other, usually set off against the support balance between them.` },
    ],
    body: (h) => `<h2>The rule in section 1612b BGB</h2>
<p>German law treats child benefit as money that covers the child’s need. ${h.src('bgb1612b', 'Section 1612b(1) BGB')} distinguishes two situations:</p>
<ul>
<li>One parent fulfils the duty by providing care (${h.src('bgb1606', 'section 1606(3) BGB')}): half of the benefit is offset against the cash need.</li>
<li>In every other case the full benefit is offset. This mainly concerns adult children, but also children living with third parties or at a boarding school, where both parents pay cash.</li>
</ul>
<p>The amount is set by ${h.src('estg66', 'section 66 EStG')}: ${h.eur(h.P.kindergeld.monat)} per child per month in 2026, the same for the first child as for the fourth.</p>
<h2>Why exactly half</h2>
<p>The split mirrors the idea that both parents contribute equally, one through care and one through money. The benefit for the child should therefore help both. The resident parent receives it and keeps one half; the paying parent gets the other half by deducting it from the table need. Each ends up with ${h.eur(h.P.kindergeld.monat / 2, 2)} a month.</p>
${h.table(['Age band', 'Need in group 6', 'Offset', 'Payable'], STUFEN.map((s) => [s === 3 ? `${AS[3][0]}+ (full)` : `${AS[s][0]} to ${AS[s][1]} (half)`, h.eur(bedarf(G, s)), h.eur(kgAnteil(s), 2), h.eur(zahlbetrag(G, s), 2)]), 'Group 6, adjusted net income up to ' + h.eur(h.P.dt.gruppen_bis[G]) + ', computed by the engine', ['l', 'r', 'r', 'r'])}
<p>The full grid for all groups is on the ${h.a('zahlbetragstabelle', 'payment table')} page.</p>
<h2>The turn at 18</h2>
<p>Adulthood changes the arithmetic in two ways. The legal duty of care ends, even if the young person still lives at home, so the full offset applies. And both parents now owe cash support according to their incomes. The first effect is visible on ${h.eur(3800)} of net income: ${h.eur(vor18.summe, 2)} for a child of seventeen, ${h.eur(ab18.summe, 2)} for an adult pupil, although the need rises from ${h.eur(vor18.kinder[0].bedarf)} to ${h.eur(ab18.kinder[0].bedarf)}.</p>
<p>A student living away from home normally has a need of ${h.eur(h.P.dt.student_bedarf)} under the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}. After the full benefit, ${h.eur(stud.restbedarf)} remain. With parents earning ${h.eur(3200)} and ${h.eur(2100)}, each first keeps a base of ${h.eur(stud.sockel)}, and they pay ${h.eur(stud.anteilA, 2)} and ${h.eur(stud.anteilB, 2)}. The detail is explained under ${h.a('studentenunterhalt', 'student maintenance')}. The table figure is a benchmark; courts may go above it where the parents’ standard of living justifies it.</p>
<h2>A worked example in four steps</h2>
<p>A father has adjusted net income of ${h.eur(2700)}; his daughter of fourteen lives with her mother. The payment amount is built like this:</p>
<ul>
<li>Income group: group ${vierzehn.gruppe + 1}.</li>
<li>Table need in the third age band: ${h.eur(k14.bedarf)}.</li>
<li>Child benefit share, since the mother provides care: ${h.eur(k14.kindergeld, 2)}.</li>
<li>Amount payable: ${h.eur(k14.zahlbetrag, 2)} a month.</li>
</ul>
<p>The mother’s household therefore receives ${h.eur(k14.zahlbetrag + h.P.kindergeld.monat, 2)} for the girl: support plus the full benefit. That is more than the table need, and the difference of ${h.eur(h.P.kindergeld.monat / 2, 2)} is precisely the half that rewards the care. Parents who think the payment looks low often miss this link.</p>
<h2>Who receives the benefit</h2>
<p>The Familienkasse pays one person per child: after a separation, the parent whose household the child lives in (section 64(2) EStG). When a child moves, the claim must be switched. The support calculation always assumes the resident parent receives the money; if the payer gets it instead, he or she must make up for it, otherwise the payer would benefit twice.</p>
<h2>Special situations</h2>
<ul>
<li>Equal shared care: under point 14(2) of the ${h.src('olgLeitlinien', 'NRW guidelines')} the cash half is split by income share and the care half equally. See ${h.a('wechselmodell-unterhalt', 'equal shared care')}.</li>
<li>Shortfall: the weighting uses the payment amount after the offset, not the table need, which keeps children treated alike. See ${h.a('mangelfall', 'shortfall case')}.</li>
<li>Maintenance advance: the full benefit is deducted from the statutory minimum, because the state does not cover the care share. The advance is therefore ${h.eur(uvgVoll(0))} to ${h.eur(uvgVoll(2))}; see ${h.a('unterhaltsvorschuss', 'maintenance advance')}.</li>
<li>Child benefit is not parental income (point 3 of the guidelines) and changes neither the income group nor spousal maintenance.</li>
</ul>
<p>This explanation of the child benefit offset is general information, not legal advice; in a dispute the family court decides how the benefit is credited, and the Familienkasse decides who receives it.</p>`,
  },
});
