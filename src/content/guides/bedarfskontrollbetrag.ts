import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, zahlbetrag, bkb, GRUPPEN } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Beispiele aus dem Motor (Anm. A III DT 2026), nie von Hand:
 * drei Schulkinder bei 3.400 € (Startwerte des Mini-Rechners) und zwei Jugendliche bei 3.000 €.
 */
const drei = kindesunterhalt(3400, [{ alter: 8 }, { alter: 8 }, { alter: 8 }]);
const dreiOhne = kindesunterhalt(3400, [{ alter: 8 }, { alter: 8 }, { alter: 8 }], { bkb: false });
const teens = kindesunterhalt(3000, [{ alter: 13 }, { alter: 16 }]);
const teensOhne = kindesunterhalt(3000, [{ alter: 13 }, { alter: 16 }], { bkb: false });
const vier = kindesunterhalt(4900, [{ alter: 2 }, { alter: 6 }, { alter: 10 }, { alter: 15 }]);
const vierOhne = kindesunterhalt(4900, [{ alter: 2 }, { alter: 6 }, { alter: 10 }, { alter: 15 }], { bkb: false });
const ruhig = kindesunterhalt(3300, [{ alter: 10 }, { alter: 14 }]);
const B = P.dt.bkb;
const gruppenIdx = Array.from({ length: GRUPPEN }, (_, i) => i);
/** Mindestnetto, das in Gruppe g für zwei Kinder von 6 bis 11 Jahren nötig ist, damit der BKB gewahrt bleibt. */
const schwelleZwei = (g: number) => bkb(g) + 2 * zahlbetrag(g, 1);

export default defineGuide({
  id: 'bedarfskontrollbetrag',
  group: 'kind',
  order: 16,
  mini: 'bkb',
  related: ['kindesunterhalt-rechner', 'zahlbetragstabelle', 'mangelfall', 'selbstbehalt', 'kindesunterhalt', 'erweiterter-umgang'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1603', 'bgb1612b'],
  de: {
    slug: 'bedarfskontrollbetrag',
    nav: 'Bedarfskontrollbetrag',
    card: 'Warum ein Gericht trotz höheren Einkommens eine niedrigere Gruppe ansetzt: alle 15 Kontrollbeträge 2026.',
    title: 'Bedarfskontrollbetrag 2026: Tabelle und Herabstufung',
    description: `Bedarfskontrollbetrag 2026 nach Anmerkung A III der Düsseldorfer Tabelle: ${DE.eur(B[0])} bis ${DE.eur(B[14])} je Gruppe, wann herabgestuft wird, mit drei Rechenbeispielen.`,
    h1: 'Bedarfskontrollbetrag: wann der Kindesunterhalt eine Gruppe tiefer rutscht',
    intro: 'Der Kontrollbetrag prüft, ob nach allen Zahlbeträgen genug für den Zahlenden übrig bleibt. Wenn nicht, sinkt die Gruppe.',
    resume: `Der Bedarfskontrollbetrag ist der Betrag, der einem barunterhaltspflichtigen Elternteil nach Zahlung des Kindesunterhalts mindestens bleiben soll, damit das Einkommen ausgewogen zwischen ihm und den Kindern verteilt ist. Die Düsseldorfer Tabelle 2026 nennt ihn für jede der fünfzehn Einkommensgruppen: ${DE.eur(P.dt.bkb_gruppe1_nicht_erwerbstaetig)} oder ${DE.eur(B[0])} in Gruppe 1 (nicht erwerbstätig oder erwerbstätig), ${DE.eur(B[1])} in Gruppe 2 und steigend bis ${DE.eur(B[14])} in Gruppe 15. Wird er unterschritten, kann der Tabellenbetrag der nächstniedrigeren Gruppe angesetzt werden, deren Kontrollbetrag gewahrt ist (Anmerkung A III). Beispiel: Wer ${DE.eur(3400)} bereinigt verdient und drei Kinder von acht Jahren hat, liegt in Gruppe ${drei.gruppeEinkommen + 1}. Nach den Zahlbeträgen dieser Gruppe blieben ihm ${DE.eur(dreiOhne.verbleibt, 2)}, weniger als ${DE.eur(dreiOhne.bkbWert)}. Gerechnet wird deshalb in Gruppe ${drei.gruppe + 1}: zusammen ${DE.eur(drei.summe, 2)} statt ${DE.eur(dreiOhne.summe, 2)} im Monat. Der Kontrollbetrag ist kein Selbstbehalt; er wirkt nur auf die Wahl der Gruppe und nie unter Gruppe 1.`,
    faqs: [
      { q: 'Ist der Bedarfskontrollbetrag dasselbe wie der Selbstbehalt?', a: `Nein. Die Tabelle sagt ausdrücklich, dass er nicht mit dem Eigenbedarf identisch ist. Der notwendige Selbstbehalt von ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)} ist eine harte Untergrenze, unter die kein Gericht den Zahlenden drückt. Der Kontrollbetrag dagegen entscheidet nur, ob eine höhere oder niedrigere Tabellengruppe angemessen ist. In Gruppe 1 fallen beide Werte zusammen, darüber liegt der Kontrollbetrag höher.` },
      { q: 'Muss ein Familiengericht bei Unterschreiten des Bedarfskontrollbetrags herabstufen?', a: `Die Anmerkung A III formuliert eine Kann-Regel: Der Betrag der niedrigeren Gruppe kann angesetzt werden. Die Leitlinien der Oberlandesgerichte in NRW sprechen davon, dass die Kontrollbeträge im Rahmen der Angemessenheitsprüfung herangezogen werden können. In der Praxis stufen viele Gerichte herab, sie sind dazu aber nicht gezwungen. Der Rechner dieser Seite stuft standardmäßig herab und lässt die Kontrolle abschalten.` },
      { q: 'Zählt Ehegattenunterhalt beim Bedarfskontrollbetrag mit?', a: `Ja, nach dem Wortlaut der Anmerkung A III wird die Unterschreitung unter Berücksichtigung auch anderer Unterhaltspflichten geprüft. Zahlt der Vater neben dem Kindesunterhalt Trennungsunterhalt an die Mutter, kann ihm nach beiden Zahlungen weniger als der Kontrollbetrag bleiben, sodass das Gericht für die Kinder eine niedrigere Gruppe wählt. Der Rechner auf dieser Seite berücksichtigt nur den Kindesunterhalt.` },
      { q: 'Wie weit kann der Bedarfskontrollbetrag den Unterhalt nach unten ziehen?', a: `Höchstens bis Gruppe 1, also bis zum Mindestunterhalt nach § 1612a BGB. Darunter wirkt der Kontrollbetrag nicht mehr. Reicht das Einkommen selbst für die Beträge der ersten Gruppe nicht, weil sonst weniger als ${DE.eur(P.selbstbehalt.notwendig_erwerbstaetig)} blieben, beginnt die Mangelfallrechnung nach Anmerkung C, bei der die Kinder anteilig gekürzt werden.` },
      { q: 'Gilt der Bedarfskontrollbetrag auch für volljährige Kinder?', a: `Die Leitlinien in NRW bemessen den Bedarf volljähriger Kinder im Elternhaushalt nach dem zusammengerechneten Einkommen beider Eltern ausdrücklich ohne Höher- oder Herabgruppierung. Für Studierende mit eigener Wohnung gilt ohnehin ein fester Bedarf von ${DE.eur(P.dt.student_bedarf)}. Der Kontrollbetrag spielt seine Rolle daher vor allem beim Unterhalt minderjähriger Kinder.` },
    ],
    body: (h) => `<h2>Was die Anmerkung A III regelt</h2>
<p>Die Tabelle ordnet jedem bereinigten Nettoeinkommen eine von fünfzehn Gruppen zu. Neben den Bedarfssätzen steht in der letzten Spalte der Bedarfskontrollbetrag. Er soll, so die Tabelle, eine ausgewogene Verteilung des Einkommens zwischen dem Pflichtigen und den Kindern gewährleisten. Bleibt dem Zahlenden nach allen Unterhaltspflichten weniger als dieser Betrag, kann der Tabellenbetrag der nächstniedrigeren Gruppe angesetzt werden, deren Kontrollbetrag nicht unterschritten wird.</p>
<p>Gerichte sprechen von Herabstufung oder Herabgruppierung. Sie ist das Gegenstück zur Einstufung nach der Zahl der Berechtigten in Anmerkung A I: Die Tabelle ist auf zwei Berechtigte zugeschnitten, und wer mehr Kinder hat, gerät schneller unter den Kontrollbetrag.</p>
<h2>Alle Bedarfskontrollbeträge 2026</h2>
${h.table(['Gruppe', 'Netto bis', 'Bedarfskontrollbetrag', 'Zahlbetrag 6 bis 11 J.', 'Netto für 2 Kinder ohne Herabstufung'],
  gruppenIdx.map((g) => [String(g + 1), h.eur(h.P.dt.gruppen_bis[g]), g === 0 ? `${h.eur(h.P.dt.bkb_gruppe1_nicht_erwerbstaetig)} / ${h.eur(B[0])}` : h.eur(B[g]), h.eur(zahlbetrag(g, 1), 2), g === 0 ? '' : h.eur(schwelleZwei(g), 2)]),
  'Düsseldorfer Tabelle 2026, letzte Spalte: Kontrollbetrag des Zahlenden; letzte Spalte hier: Kontrollbetrag plus zwei Zahlbeträge der Gruppe, erwerbstätig', ['l', 'r', 'r', 'r', 'r'])}
<p>Die letzte Spalte zeigt, ab welchem Einkommen ein Vater oder eine Mutter mit zwei Grundschulkindern die jeweilige Gruppe tatsächlich behält. Liegt diese Schwelle über der Untergrenze der Gruppe, rutscht der untere Teil der Gruppe für diese Familie eine Stufe tiefer. Mit jedem weiteren Kind steigt die Schwelle um einen Zahlbetrag.</p>
<h2>Zwei Familien mit Herabstufung</h2>
<p>Familie A: ${h.eur(3000)} bereinigtes Netto, zwei Jugendliche von 13 und 16 Jahren. Das Einkommen gehört in Gruppe ${teens.gruppeEinkommen + 1}. Nach deren Zahlbeträgen von zusammen ${h.eur(teensOhne.summe, 2)} blieben ${h.eur(teensOhne.verbleibt, 2)}, der Kontrollbetrag dieser Gruppe ist aber ${h.eur(teensOhne.bkbWert)}. Der Motor geht Gruppe für Gruppe nach unten und landet bei Gruppe ${teens.gruppe + 1}: Dort sind es ${h.eur(teens.summe, 2)}, und es bleiben ${h.eur(teens.verbleibt, 2)}, mehr als ${h.eur(teens.bkbWert)}.</p>
<p>Familie B: ${h.eur(4900)} Netto, vier Kinder von 2, 6, 10 und 15 Jahren. Hier reicht eine einzige Stufe: Gruppe ${vier.gruppeEinkommen + 1} verlangte ${h.eur(vierOhne.summe, 2)}, Gruppe ${vier.gruppe + 1} ergibt ${h.eur(vier.summe, 2)}. Die Kinder erhalten zusammen ${h.eur(vierOhne.summe - vier.summe, 2)} weniger, der Vater behält ${h.eur(vier.verbleibt, 2)}.</p>
${h.table(['Fall', 'Gruppe nach Einkommen', 'Gruppe nach Kontrolle', 'ohne Kontrolle', 'mit Kontrolle'], [
  [`${h.eur(3400)}, drei Kinder 8 J.`, String(drei.gruppeEinkommen + 1), String(drei.gruppe + 1), h.eur(dreiOhne.summe, 2), h.eur(drei.summe, 2)],
  [`${h.eur(3000)}, Kinder 13 und 16 J.`, String(teens.gruppeEinkommen + 1), String(teens.gruppe + 1), h.eur(teensOhne.summe, 2), h.eur(teens.summe, 2)],
  [`${h.eur(4900)}, vier Kinder`, String(vier.gruppeEinkommen + 1), String(vier.gruppe + 1), h.eur(vierOhne.summe, 2), h.eur(vier.summe, 2)],
  [`${h.eur(3300)}, Kinder 10 und 14 J.`, String(ruhig.gruppeEinkommen + 1), String(ruhig.gruppe + 1), h.eur(ruhig.summe, 2), h.eur(ruhig.summe, 2)],
], 'Summe der monatlichen Zahlbeträge, vom Motor gerechnet, erwerbstätiger Elternteil', ['l', 'r', 'r', 'r', 'r'])}
<p>Die letzte Zeile ist die Gegenprobe: Mit ${h.eur(3300)} und zwei Kindern bleiben ${h.eur(ruhig.verbleibt, 2)}, der Kontrollbetrag von ${h.eur(ruhig.bkbWert)} ist gewahrt, die Gruppe bleibt.</p>
<h2>Kontrollbetrag, Selbstbehalt, Mangelfall: drei verschiedene Grenzen</h2>
<ul>
<li><strong>Bedarfskontrollbetrag</strong>: bestimmt die Gruppe. Er kann den Unterhalt nur bis zur ersten Gruppe senken.</li>
<li><strong>Notwendiger Selbstbehalt</strong> nach § 1603 Abs. 2 BGB: ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} für Erwerbstätige, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} für Nichterwerbstätige. Darunter muss niemand zahlen. Mehr dazu auf der Seite zum ${h.a('selbstbehalt', 'Selbstbehalt')}.</li>
<li><strong>Mangelfall</strong>: Reicht das Einkommen nicht für die Beträge der ersten Gruppe plus Selbstbehalt, wird der Überschuss nach Anmerkung C verteilt, siehe ${h.a('mangelfall', 'Mangelfall')}.</li>
</ul>
<p>In Gruppe 1 sind Kontrollbetrag und notwendiger Selbstbehalt gleich hoch. Deshalb geht die Herabstufung dort fließend in die Mangelfallprüfung über.</p>
<h2>Was die Herabstufung verschiebt und was nicht</h2>
<p>Die Herabstufung ändert den Tabellenbetrag, nicht die Kindergeldanrechnung. Das halbe Kindergeld von ${h.eur(h.P.kindergeld.monat / 2, 2)} je minderjährigem Kind wird nach § 1612b BGB in jeder Gruppe gleich abgezogen. Auch Mehrbedarf wie Kita-Beiträge ohne Verpflegung bleibt unberührt; ihn tragen beide Eltern anteilig nach ihren Einkommen.</p>
<p>Eine Besonderheit: Der Bundesgerichtshof erlaubt seit seinem Beschluss vom April 2026 eine Herabstufung auch wegen der Kosten eines deutlich erweiterten Umgangs. Diese Herabstufung erfolgt zusätzlich und hat einen anderen Grund; sie wird auf der Seite zum ${h.a('erweiterter-umgang', 'erweiterten Umgang')} erklärt.</p>
<h2>Herabstufung im Unterhaltstitel: Prozent statt Euro</h2>
<p>Minderjähriger Kindesunterhalt kann als fester Betrag oder als Prozentsatz des Mindestunterhalts tituliert werden; die Leitlinien in NRW nennen beide Wege. Die Herabstufung schlägt sich dann direkt im Prozentsatz nieder. Für Familie A bedeutet Gruppe ${teens.gruppe + 1} einen Satz von ${h.num(h.P.dt.prozent[teens.gruppe])} Prozent statt ${h.num(h.P.dt.prozent[teens.gruppeEinkommen])} Prozent in Gruppe ${teens.gruppeEinkommen + 1}. Ein solcher dynamischer Titel passt sich an, wenn der Mindestunterhalt steigt, und erfasst den Wechsel in die nächste Altersstufe ohne neues Verfahren.</p>
<p>Ändert sich das Einkommen oder kommt ein Kind hinzu, kann sich die Gruppe nach der Kontrolle verschieben. Ein Anlass zur Neuberechnung sind daher Gehaltserhöhung, Jobwechsel, Geburt eines weiteren Kindes oder der Wegfall einer Unterhaltspflicht, etwa wenn ein Kind eine Ausbildung mit eigenem Einkommen beginnt.</p>
<h2>Woher die Werte stammen</h2>
<p>Alle Beträge stammen aus der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und den ${h.src('olgLeitlinien', 'Unterhaltsleitlinien der Oberlandesgerichte in NRW')}; die Tabelle hat keine Gesetzeskraft, sie ist eine Richtlinie, der die Familiengerichte in aller Regel folgen. Mit dem ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')} lässt sich die Kontrolle an- und abschalten. Diese Seite ist eine allgemeine Information zur Herabstufung, keine Rechtsberatung für Ihren Fall.</p>`,
  },
  en: {
    slug: 'needs-control-amount',
    nav: 'Needs-control amount',
    card: 'Why a German court may use a lower income group than your pay suggests: all 15 control amounts for 2026.',
    title: 'Needs-Control Amount Germany 2026: Table and Step-Down',
    description: `Germany's 2026 needs-control amount (Bedarfskontrollbetrag), note A III of the Düsseldorf Table: ${EN.eur(B[0])} to ${EN.eur(B[14])} per group, when support is stepped down.`,
    h1: 'The needs-control amount: when child support drops an income group',
    intro: 'A check on what the paying parent keeps after every child has been paid. If too little remains, the income group goes down.',
    resume: `The needs-control amount (Bedarfskontrollbetrag) is the sum a paying parent should keep after child support so that income is split fairly between that parent and the children. The 2026 Düsseldorf Table (Düsseldorfer Tabelle) sets one for each of its fifteen income groups: ${EN.eur(P.dt.bkb_gruppe1_nicht_erwerbstaetig)} or ${EN.eur(B[0])} in group 1 (not working or working), ${EN.eur(B[1])} in group 2, rising to ${EN.eur(B[14])} in group 15. If the parent would fall below it, the court may use the table amount of the next lower group whose control amount is respected (note A III). Take a parent on ${EN.eur(3400)} adjusted net income with three children aged eight: the income sits in group ${drei.gruppeEinkommen + 1}, but after that group's amounts only ${EN.eur(dreiOhne.verbleibt, 2)} would remain, less than ${EN.eur(dreiOhne.bkbWert)}. The calculation therefore runs in group ${drei.gruppe + 1}, giving ${EN.eur(drei.summe, 2)} a month instead of ${EN.eur(dreiOhne.summe, 2)}. It is not a self-retention floor: it only steers the group, and never below group 1.`,
    faqs: [
      { q: 'Is the needs-control amount the same as the self-retention?', a: `No. The table states plainly that it differs from the parent's own needs. The minimum self-retention (Selbstbehalt) of ${EN.eur(P.selbstbehalt.notwendig_erwerbstaetig)} for a working parent is a hard floor no court goes below. The control amount only decides whether a higher or lower table group is fair. In group 1 the two figures coincide; in every higher group the control amount is larger.` },
      { q: 'Must a German family court step down when the control amount is not kept?', a: `Note A III is worded as an option: the lower group's amount may be applied. The guidelines of the North Rhine-Westphalia higher regional courts say the control amounts can be used when checking whether a result is reasonable. Many family courts (Familiengerichte) do step down, but they are not bound to. The calculator here applies the check by default and lets you switch it off.` },
      { q: 'Does spousal maintenance count towards the needs-control check?', a: `Yes. Note A III looks at whether the amount is undercut once other maintenance duties are taken into account too. A father paying separation maintenance (Trennungsunterhalt) to the mother as well as child support may keep less than the control amount after both, which can justify a lower group for the children. The calculator on this page looks at child support only.` },
      { q: 'I earn my salary abroad but my children live in Germany: which income group applies?', a: `German courts usually work from your adjusted net income converted into euros, after the tax and social charges you actually pay. That income is placed in a group, and the needs-control amount is then checked in the same way as for a local salary. How a foreign tax system or cost of living is weighed is a matter for the court in each case.` },
      { q: 'Does the needs-control amount apply to children over 18?', a: `The NRW guidelines set the need of an adult child living with a parent from both parents' combined income, explicitly without moving up or down a group. A student with their own home has a fixed standard need of ${EN.eur(P.dt.student_bedarf)}. In practice the control amount matters mainly for children under 18.` },
    ],
    body: (h) => `<h2>What note A III says</h2>
<p>The Düsseldorf Table places every adjusted net income in one of fifteen groups. Next to the amounts for each age band, its last column shows the needs-control amount. According to the table, it is meant to secure a balanced split of income between the paying parent and the children. If, after all maintenance duties, the parent keeps less, the amount of the next lower group whose control amount is respected can be used instead.</p>
<p>German lawyers call this a step-down (Herabstufung). It mirrors note A I: the table is built for two people entitled to support, so a parent with three or four children falls below the control amount much sooner.</p>
<h2>All needs-control amounts for 2026</h2>
${h.table(['Group', 'Net up to', 'Control amount', 'Payable, age 6 to 11', 'Net to keep group with 2 children'],
  gruppenIdx.map((g) => [String(g + 1), h.eur(h.P.dt.gruppen_bis[g]), g === 0 ? `${h.eur(h.P.dt.bkb_gruppe1_nicht_erwerbstaetig)} / ${h.eur(B[0])}` : h.eur(B[g]), h.eur(zahlbetrag(g, 1), 2), g === 0 ? '' : h.eur(schwelleZwei(g), 2)]),
  'Düsseldorf Table 2026; last column: control amount plus two payable amounts of that group, working parent', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column tells a parent with two primary-school children from which income the group actually holds. Where that figure is above the bottom of the group, the lower part of the group slides one step for this family. Each additional child raises the threshold by one more payable amount.</p>
<h2>Worked examples</h2>
<p>A mother earning ${h.eur(3000)} net with teenagers of 13 and 16 sits in group ${teens.gruppeEinkommen + 1}. Paying ${h.eur(teensOhne.summe, 2)} would leave her ${h.eur(teensOhne.verbleibt, 2)}, below the ${h.eur(teensOhne.bkbWert)} control amount. Stepping down one group at a time, the calculation stops at group ${teens.gruppe + 1}: ${h.eur(teens.summe, 2)} in total, leaving ${h.eur(teens.verbleibt, 2)}.</p>
<p>An engineer posted to Germany on ${h.eur(4900)} net, with four children aged 2, 6, 10 and 15 living with their mother in Munich, needs just one step: group ${vier.gruppeEinkommen + 1} would cost ${h.eur(vierOhne.summe, 2)}, group ${vier.gruppe + 1} costs ${h.eur(vier.summe, 2)}.</p>
${h.table(['Family', 'Group by income', 'Group after check', 'Without check', 'With check'], [
  [`${h.eur(3400)}, three children aged 8`, String(drei.gruppeEinkommen + 1), String(drei.gruppe + 1), h.eur(dreiOhne.summe, 2), h.eur(drei.summe, 2)],
  [`${h.eur(3000)}, children 13 and 16`, String(teens.gruppeEinkommen + 1), String(teens.gruppe + 1), h.eur(teensOhne.summe, 2), h.eur(teens.summe, 2)],
  [`${h.eur(4900)}, four children`, String(vier.gruppeEinkommen + 1), String(vier.gruppe + 1), h.eur(vierOhne.summe, 2), h.eur(vier.summe, 2)],
  [`${h.eur(3300)}, children 10 and 14`, String(ruhig.gruppeEinkommen + 1), String(ruhig.gruppe + 1), h.eur(ruhig.summe, 2), h.eur(ruhig.summe, 2)],
], 'Total monthly amounts payable, computed by the engine, working parent', ['l', 'r', 'r', 'r', 'r'])}
<p>The last row is the counter-check: on ${h.eur(3300)} with two children, ${h.eur(ruhig.verbleibt, 2)} remains, above the ${h.eur(ruhig.bkbWert)} control amount, so the group stays.</p>
<h2>Three different limits</h2>
<ul>
<li><strong>Needs-control amount</strong>: decides the group, and can lower support only as far as group 1.</li>
<li><strong>Minimum self-retention</strong> under section 1603(2) of the Civil Code (BGB): ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} if working, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} if not. Nobody pays below it; see ${h.a('selbstbehalt', 'self-retention')}.</li>
<li><strong>Shortfall case</strong> (Mangelfall): if income cannot cover group 1 plus the self-retention, the surplus is shared out under note C; see ${h.a('mangelfall', 'shortfall case')}.</li>
</ul>
<p>In group 1 the control amount and the minimum self-retention are equal, which is why the step-down flows straight into the shortfall check there.</p>
<h2>What a step-down leaves untouched</h2>
<p>Only the table amount changes. Half of the ${h.eur(h.P.kindergeld.monat)} child benefit (Kindergeld) still comes off for each minor child under section 1612b BGB, whatever the group. Extra need (Mehrbedarf) such as nursery fees without meals is shared by both parents according to their incomes and is not affected.</p>
<p>Since April 2026 the Federal Court of Justice (Bundesgerichtshof) also allows a step-down for the costs of substantially extended contact. That is a separate step with a different reason, covered under ${h.a('erweiterter-umgang', 'extended contact')}.</p>
<h2>Step-downs in a maintenance order: percentages, not euros</h2>
<p>Support for a minor can be fixed as a euro amount or as a percentage of the statutory minimum (Mindestunterhalt); the NRW guidelines allow both. A step-down then shows directly in the percentage: for the mother with two teenagers, group ${teens.gruppe + 1} means ${h.num(h.P.dt.prozent[teens.gruppe])} per cent rather than ${h.num(h.P.dt.prozent[teens.gruppeEinkommen])} per cent in group ${teens.gruppeEinkommen + 1}. Such a dynamic order follows future rises in the minimum and the move into the next age band without fresh proceedings.</p>
<p>A pay rise, a new job, the birth of another child or a child starting paid training can all move the group after the check. Those are the moments when a recalculation is worth doing.</p>
<h2>Sources</h2>
<p>Figures come from the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the ${h.src('olgLeitlinien', 'NRW maintenance guidelines')}. The table is not law but a guideline that family courts follow in almost every case. You can switch the check on and off in the ${h.a('kindesunterhalt-rechner', 'child support calculator')}. This page is general information on the needs-control step-down, not legal advice on your situation.</p>`,
  },
});
