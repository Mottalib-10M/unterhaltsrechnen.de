import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: ein Kind von 7 Jahren bei 2.900 €, eine Einkommensleiter für ein Kind von 10 Jahren. */
const sieben = kindesunterhalt(2900, [{ alter: 7 }]);
const leiter = [1900, 2700, 3600, 4800, 6800].map((n) => ({ n, r: kindesunterhalt(n, [{ alter: 10 }]) }));
const drei = kindesunterhalt(4400, [{ alter: 3 }, { alter: 8 }, { alter: 15 }]);
const AS = P.dt.altersstufen;
const S = P.selbstbehalt;
const KG = P.kindergeld.monat;
const asDe = `${AS[0][0]} bis ${AS[0][1]}, ${AS[1][0]} bis ${AS[1][1]}, ${AS[2][0]} bis ${AS[2][1]} Jahre und ab ${AS[3][0]}`;
const asEn = `${AS[0][0]} to ${AS[0][1]}, ${AS[1][0]} to ${AS[1][1]}, ${AS[2][0]} to ${AS[2][1]} and ${AS[3][0]} or over`;

export default defineGuide({
  id: 'kindesunterhalt',
  group: 'kind',
  order: 8,
  mini: 'kuEinKind',
  related: ['kindesunterhalt-rechner', 'zahlbetragstabelle', 'mindestunterhalt', 'selbstbehalt', 'unterhaltsvorschuss', 'bereinigtes-netto'],
  sources: ['bgb1601', 'bgb1606', 'bgb1609', 'bgb1612a', 'olgDtPdf', 'olgLeitlinien'],
  de: {
    slug: 'kindesunterhalt',
    nav: 'Kindesunterhalt',
    card: 'Wer zahlt, wer betreut, wie die Altersstufen wirken und wie ein Kind seinen Unterhalt sichert.',
    title: 'Kindesunterhalt 2026: wer zahlt, wie viel und wie lange',
    description: `Kindesunterhalt 2026: Barunterhalt und Betreuung, Altersstufen, Rang, Auskunft, Beistandschaft beim Jugendamt, Titel. Mindestbedarf je Kind ab ${DE.eur(P.mindestunterhalt.stufen[0])} im Monat.`,
    h1: 'Kindesunterhalt: die Regeln im Überblick',
    intro: 'Ein Elternteil betreut, der andere zahlt: Diese Arbeitsteilung prägt den gesamten Kindesunterhalt in Deutschland.',
    resume: `Kindesunterhalt schuldet in Deutschland der Elternteil, bei dem das Kind nicht lebt; der andere erfüllt seine Pflicht durch Pflege und Erziehung (§ 1606 Abs. 3 Satz 2 BGB). Wie viel gezahlt wird, legt die Düsseldorfer Tabelle 2026 fest: Sie ordnet das bereinigte Nettoeinkommen einer von fünfzehn Gruppen zu und nennt für jede Altersstufe einen Bedarf. Für ein Kind von sieben Jahren und ${DE.eur(2900)} Netto sind das ${DE.eur(sieben.kinder[0].bedarf)} in Gruppe ${sieben.gruppe + 1}; nach Abzug des halben Kindergeldes von ${DE.eur(KG / 2, 2)} bleiben ${DE.eur(sieben.summe, 2)} Zahlbetrag. Die unterste Gruppe ist der gesetzliche Mindestunterhalt, ${DE.eur(P.mindestunterhalt.stufen[0])} bis ${DE.eur(P.mindestunterhalt.stufen[2])} je nach Alter. Dem Zahlenden bleibt gegenüber minderjährigen Kindern ein notwendiger Selbstbehalt von ${DE.eur(S.notwendig_erwerbstaetig)}, wenn er arbeitet, sonst ${DE.eur(S.notwendig_nicht_erwerbstaetig)}. Minderjährige Kinder stehen im ersten Rang vor allen anderen Berechtigten (§ 1609 Nr. 1 BGB). Das Kind kann Auskunft über das Einkommen verlangen, sich vom Jugendamt als Beistand vertreten lassen und den Betrag in einer Urkunde oder einem Beschluss festschreiben lassen.`,
    faqs: [
      { q: 'Muss beim Kindesunterhalt auch der betreuende Elternteil zahlen?', a: `In der Regel nicht: Wer ein minderjähriges Kind im eigenen Haushalt versorgt, leistet seinen Anteil durch die Betreuung. Ausnahmen kennen die Leitlinien NRW, wenn der betreuende Elternteil etwa das ${DE.num(P.leitlinien.betreuender_dreifaches)}fache des anderen verdient oder der Zahlende sonst unter seinen angemessenen Selbstbehalt von ${DE.eur(S.angemessen)} fiele. Dann kann sich die Barpflicht verschieben oder auf beide verteilen.` },
      { q: 'Ab welchem Monat gilt beim Kindesunterhalt die höhere Altersstufe?', a: `Ab dem Ersten des Monats, in dem das Kind Geburtstag hat (§ 1612a Abs. 3 BGB). Wird ein Kind am 28. eines Monats sechs Jahre alt, zahlt der Elternteil schon für diesen ganzen Monat den Betrag der zweiten Stufe. Eine neue Berechnung oder ein neuer Titel ist dafür nicht nötig, wenn der Unterhalt dynamisch als Prozentsatz festgelegt wurde.` },
      { q: 'Wie lange wird Kindesunterhalt gezahlt?', a: `Eine feste Altersgrenze gibt es nicht. Der Anspruch besteht, solange das Kind bedürftig ist, also bis zum Abschluss einer ersten Ausbildung oder eines Studiums in angemessener Zeit. Mit der Volljährigkeit ändert sich aber die Rechnung: Beide Eltern haften dann anteilig nach ihren Einkommen, das volle Kindergeld wird angerechnet und der Selbstbehalt gegenüber Studierenden ist höher.` },
      { q: 'Kann das Kind Unterhalt für vergangene Monate fordern?', a: `Nur ab dem Monat, in dem der Zahlende zur Auskunft über sein Einkommen aufgefordert, in Verzug gesetzt oder gerichtlich in Anspruch genommen wurde (§ 1613 Abs. 1 BGB). Wer lange wartet, verliert deshalb Geld. Ein einfaches Schreiben, das Auskunft zum Zweck der Unterhaltsberechnung verlangt, genügt bereits, um diesen Zeitpunkt festzuhalten.` },
      { q: 'Was kostet die Beistandschaft des Jugendamts für den Kindesunterhalt?', a: `Nichts. Auf schriftlichen Antrag des betreuenden Elternteils wird das Jugendamt Beistand des Kindes (§ 1712 BGB). Es fordert dann Auskunft an, berechnet den Unterhalt, lässt ihn beurkunden und kann ihn auch gerichtlich geltend machen. Der Elternteil behält das Sorgerecht und kann die Beistandschaft jederzeit wieder beenden.` },
      { q: 'Zählt beim Kindesunterhalt das Einkommen des neuen Partners mit?', a: `Nein, eingestuft wird nur nach dem bereinigten Einkommen des barunterhaltspflichtigen Elternteils. Ein neuer Partner schuldet dem Kind nichts. Mittelbar kann das Zusammenleben aber wirken: Spart der Zahlende Wohnkosten, weil er sie teilt, können Gerichte seinen Selbstbehalt maßvoll kürzen. Neue Kinder aus der Beziehung stehen im selben ersten Rang wie die älteren.` },
    ],
    body: (h) => `<h2>Wer Kindesunterhalt schuldet</h2>
<p>Eltern sind ihren Kindern als Verwandte in gerader Linie zum Unterhalt verpflichtet (${h.src('bgb1601', '§ 1601 BGB')}). Nach einer Trennung teilt das Gesetz die Last in zwei Formen. Der Elternteil, bei dem das Kind wohnt, leistet Naturalunterhalt: Er kocht, wäscht, begleitet zur Schule und trägt die Alltagsverantwortung. Der andere leistet Barunterhalt, also Geld. ${h.src('bgb1606', '§ 1606 Abs. 3 Satz 2 BGB')} stellt beide Beiträge in der Regel gleich.</p>
<p>Diese Gleichwertigkeit erklärt, warum der betreuende Elternteil keinen Tabellenbetrag zahlt, selbst wenn er gut verdient. Sie endet erst bei deutlichem Ungleichgewicht. Die Leitlinien der Oberlandesgerichte in NRW nennen als Anhaltspunkt ein etwa ${h.num(h.P.leitlinien.betreuender_dreifaches)}faches Einkommen des betreuenden Elternteils; darunter kann bei großer Differenz eine anteilige Barpflicht beider Eltern in Betracht kommen. Leben die Kinder abwechselnd zu gleichen Teilen bei beiden, gilt das ${h.a('wechselmodell-unterhalt', 'Wechselmodell')} mit eigener Rechnung.</p>
<h2>Wie der Betrag entsteht</h2>
<p>Ausgangspunkt ist das ${h.a('bereinigtes-netto', 'bereinigte Nettoeinkommen')} des Zahlenden: Nettolohn im Jahresdurchschnitt, abzüglich anerkannter Fahrtkosten, berücksichtigungsfähiger Schulden und weiterer Posten. Mit diesem Betrag sucht man die Einkommensgruppe der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}. Sie reicht von bis ${h.eur(h.P.dt.gruppen_bis[0])} in Gruppe 1 bis ${h.eur(h.P.dt.gruppen_bis[14])} in Gruppe 15 und ist auf zwei Berechtigte zugeschnitten.</p>
<p>In der Gruppe richtet sich der Bedarf nach dem Alter. Die Stufen lauten ${asDe}. Vom Bedarf wird das Kindergeld abgezogen, beim minderjährigen Kind zur Hälfte. Das Ergebnis ist der Zahlbetrag, der tatsächlich überwiesen wird. Die fertigen Werte stehen in der ${h.a('zahlbetragstabelle', 'Zahlbetragstabelle')}.</p>
${h.table(['Bereinigtes Netto', 'Gruppe', 'Bedarf', 'Zahlbetrag'], leiter.map(({ n, r }) => [h.eur(n), String(r.gruppe + 1), h.eur(r.kinder[0].bedarf), h.eur(r.summe, 2)]), 'Ein Kind von 10 Jahren, erwerbstätiger Elternteil, vom Motor berechnet', ['r', 'r', 'r', 'r'])}
<p>Bei einem Kind setzt die Tabelle den Bedarf eher vorsichtig an, weil sie zwei Berechtigte unterstellt; manche Gerichte stufen dann eine Gruppe höher ein. Bei mehreren Kindern wird geprüft, ob dem Zahlenden der ${h.a('bedarfskontrollbetrag', 'Bedarfskontrollbetrag')} seiner Gruppe bleibt. Ein Vater mit ${h.eur(4400)} Netto und drei Kindern von drei, acht und fünfzehn Jahren zahlt nach dem Motor zusammen ${h.eur(drei.summe, 2)} in Gruppe ${drei.gruppe + 1}.</p>
<h2>Altersstufen und Mindestunterhalt</h2>
<p>Die erste Einkommensgruppe entspricht dem ${h.a('mindestunterhalt', 'Mindestunterhalt')} nach ${h.src('bgb1612a', '§ 1612a BGB')}: ${h.eur(h.P.mindestunterhalt.stufen[0])}, ${h.eur(h.P.mindestunterhalt.stufen[1])} und ${h.eur(h.P.mindestunterhalt.stufen[2])} für die drei Stufen bis zur Volljährigkeit. Unter diesen Betrag geht der Bedarf eines minderjährigen Kindes nicht. Reicht das Einkommen nicht einmal dafür, entsteht ein ${h.a('mangelfall', 'Mangelfall')}, und das Jugendamt kann den Ausfall mit ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')} teilweise auffangen.</p>
<p>Ab ${h.num(AS[3][0])} gilt die vierte Spalte. Lebt das volljährige Kind noch bei einem Elternteil, haften dann beide Eltern nach ihren Einkommen, und das ganze Kindergeld wird angerechnet. Das Kind wird selbst Inhaber seines Anspruchs und muss ihn nun selbst verfolgen.</p>
<h2>Der Rang: wer zuerst bezahlt wird</h2>
<p>Reicht das Geld nicht für alle, entscheidet die Reihenfolge des ${h.src('bgb1609', '§ 1609 BGB')}:</p>
<ul>
<li>Rang 1: minderjährige Kinder und volljährige Schulkinder unter 21 im Haushalt eines Elternteils,</li>
<li>Rang 2: Elternteile, die wegen der Betreuung eines Kindes unterhaltsberechtigt sind, sowie Ehegatten nach langer Ehe,</li>
<li>Rang 3: übrige Ehegatten und geschiedene Ehegatten,</li>
<li>Rang 4: alle anderen Kinder, etwa Studierende,</li>
<li>danach Enkel, Eltern und weitere Verwandte.</li>
</ul>
<p>Kinder aus erster und zweiter Beziehung stehen gleich. Der Ehegatte bekommt nur, was nach dem Kindesunterhalt bleibt; deshalb rechnet der ${h.a('unterhaltsrechner', 'Unterhaltsrechner')} immer in dieser Reihenfolge.</p>
<h2>Der Selbstbehalt des Zahlenden</h2>
<p>Gegenüber minderjährigen Kindern ist die Pflicht gesteigert (§ 1603 Abs. 2 BGB): Der Elternteil muss alle verfügbaren Mittel einsetzen und darf nur den notwendigen ${h.a('selbstbehalt', 'Selbstbehalt')} behalten, ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} bei Erwerbstätigkeit, ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} ohne. Darin ist eine Warmmiete bis ${h.eur(h.P.selbstbehalt.notwendig_warmmiete)} enthalten. Wer arbeitslos ist oder wenig verdient, dem rechnen Gerichte häufig ein erzielbares Einkommen zu, weil er sich um Arbeit oder einen Nebenjob bemühen muss.</p>
<h2>Auskunft, Beistandschaft, Titel</h2>
<p>Um den Betrag zu berechnen, braucht das Kind Zahlen. Nach § 1605 BGB müssen Eltern und Kinder einander Auskunft über Einkommen und Vermögen geben und auf Verlangen Belege vorlegen, typischerweise die Gehaltsabrechnungen eines Jahres und den letzten Steuerbescheid. Die Aufforderung hat einen zweiten Effekt: Ab dem Monat, in dem sie zugeht, kann Unterhalt auch rückwirkend verlangt werden (§ 1613 BGB).</p>
<p>Der betreuende Elternteil muss das nicht allein tun. Das Jugendamt übernimmt auf schriftlichen Antrag kostenlos die Beistandschaft (§ 1712 BGB), fordert die Auskunft an und rechnet nach. Zahlt der andere freiwillig, wird der Betrag am besten festgeschrieben, denn ohne Titel kann nicht vollstreckt werden. Möglich sind:</p>
<ul>
<li>eine Jugendamtsurkunde, in der sich der Zahlende kostenlos verpflichtet,</li>
<li>eine notarielle Urkunde mit Unterwerfung unter die Zwangsvollstreckung,</li>
<li>ein Beschluss des Familiengerichts, im vereinfachten Verfahren oder im regulären Unterhaltsverfahren.</li>
</ul>
<p>Bei minderjährigen Kindern kann der Titel als Festbetrag oder als Prozentsatz des Mindestunterhalts lauten (Nummer 11 Absatz 2 der ${h.src('olgLeitlinien', 'Leitlinien NRW')}). Der dynamische Titel wächst bei jeder neuen Mindestunterhaltsverordnung und jedem Altersstufenwechsel von selbst mit. Was ein Verfahren kostet, steht unter ${h.a('unterhaltsverfahren-kosten', 'Kosten des Unterhaltsverfahrens')}.</p>
<p>Diese Seite gibt allgemeine Information über den Kindesunterhalt nach den Tabellen 2026 und ist keine Rechtsberatung; über den einzelnen Fall entscheiden das Jugendamt in der Beratung oder das Familiengericht.</p>`,
  },
  en: {
    slug: 'child-support',
    nav: 'Child support',
    card: 'Who pays, who cares, how the age bands work and how a child secures the payments.',
    title: 'Child Support in Germany 2026: Who Pays and How Much',
    description: `Child support in Germany 2026: cash support versus care, age bands, ranking, disclosure, Jugendamt help and enforceable titles. Minimum need ${EN.eur(P.mindestunterhalt.stufen[0])} per child.`,
    h1: 'German child support explained',
    intro: 'One parent provides the home, the other provides the money: that division of roles shapes every child support case in Germany.',
    resume: `In Germany child support (Kindesunterhalt) is owed in cash by the parent the child does not live with, while the resident parent meets the duty through day-to-day care (section 1606(3) of the Civil Code, BGB). The amount comes from the 2026 Düsseldorf Table (Düsseldorfer Tabelle), which places the payer’s adjusted net income into one of fifteen groups and sets a need for each age band. A seven-year-old whose father nets ${EN.eur(2900)} has a need of ${EN.eur(sieben.kinder[0].bedarf)} in group ${sieben.gruppe + 1}; after deducting half the ${EN.eur(KG)} child benefit, ${EN.eur(sieben.summe, 2)} a month is payable. The lowest group equals the statutory minimum, ${EN.eur(P.mindestunterhalt.stufen[0])} to ${EN.eur(P.mindestunterhalt.stufen[2])} depending on age. Towards minor children the payer keeps a minimum self-retention (Selbstbehalt) of ${EN.eur(S.notwendig_erwerbstaetig)} when working, ${EN.eur(S.notwendig_nicht_erwerbstaetig)} otherwise. Minors rank ahead of every other claimant. The child may demand income disclosure, be represented free of charge by the youth welfare office (Jugendamt) and have the amount recorded in an enforceable deed or court order.`,
    faqs: [
      { q: 'Does the parent with whom the child lives also pay German child support?', a: `Usually not. Caring for a minor child at home counts as that parent’s full contribution. The NRW court guidelines allow exceptions, for instance when the resident parent earns roughly ${EN.num(P.leitlinien.betreuender_dreifaches)} times as much as the other, or when paying would push the other parent below the ${EN.eur(S.angemessen)} reasonable self-retention. Courts then share or shift the cash duty.` },
      { q: 'I live abroad and my child lives in Germany: which rules apply?', a: `As a rule the law of the country where the child habitually lives governs maintenance, so a child resident in Germany is normally assessed under German rules and the Düsseldorf Table. Your foreign salary is converted into euros and taken net of the tax and contributions you actually pay. Within the EU, German maintenance orders can usually be enforced in other member states.` },
      { q: 'When does the higher age band start for child support in Germany?', a: `On the first day of the month in which the child has the birthday (section 1612a(3) BGB). A child turning twelve on the 30th of a month moves into the third band for that whole month. If the order was made as a percentage of the statutory minimum, the new amount applies without any fresh court application.` },
      { q: 'Can my child claim support for months that have already passed?', a: `Only from the month in which the payer was asked to disclose income for maintenance purposes, was formally put in default, or was served with court proceedings (section 1613(1) BGB). A simple written request for income details is enough to fix that date, so waiting usually means losing money for the months in between.` },
      { q: 'What does the Jugendamt charge for help with child support?', a: `Nothing. On a written application by the resident parent, the youth welfare office becomes the child’s adviser and representative (Beistand, section 1712 BGB). It requests income details, calculates the claim, records it in a free deed and can take it to the family court (Familiengericht). Parental responsibility stays with you, and you can end the arrangement at any time.` },
      { q: 'Does a new partner’s income raise the child support I owe?', a: `No. The income group depends only on the adjusted income of the parent who pays. A new partner owes the child nothing. Living together can matter indirectly: if shared rent lowers your costs, courts may reduce your self-retention somewhat. Children born into the new relationship share first rank with the older children.` },
    ],
    body: (h) => `<h2>Who owes support</h2>
<p>Parents owe maintenance to their children as relatives in the direct line (${h.src('bgb1601', 'section 1601 BGB')}). After a separation German law splits the burden into two forms. The resident parent provides support in kind: meals, laundry, school runs and everyday responsibility. The other parent provides cash support (Barunterhalt). Under ${h.src('bgb1606', 'section 1606(3) BGB')} both contributions normally count as equal.</p>
<p>That equivalence is why the resident parent pays no table amount even on a good salary. It only gives way when incomes are badly out of balance. The guidelines of the NRW higher regional courts treat an income about ${h.num(h.P.leitlinien.betreuender_dreifaches)} times that of the other parent as a reference point; below that, a large gap can lead to both parents sharing the cash duty. Where children spend equal time in both homes, the separate rules on ${h.a('wechselmodell-unterhalt', 'equal shared care')} apply.</p>
<h2>How the amount is found</h2>
<p>The starting point is the payer’s ${h.a('bereinigtes-netto', 'adjusted net income')}: average monthly take-home pay over a year, minus recognised commuting costs, allowable debts and similar items. That figure points to an income group in the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}, which runs from up to ${h.eur(h.P.dt.gruppen_bis[0])} in group 1 to ${h.eur(h.P.dt.gruppen_bis[14])} in group 15. The table is not a statute; it is a guideline drawn up by the higher regional courts and followed by family courts across Germany.</p>
<p>Within the group the need depends on age, in bands of ${asEn}. Child benefit (Kindergeld) is then deducted, half of it for a minor. What remains is the amount actually transferred each month; the full grid is on the ${h.a('zahlbetragstabelle', 'payment table')} page.</p>
${h.table(['Adjusted net income', 'Group', 'Need', 'Payable'], leiter.map(({ n, r }) => [h.eur(n), String(r.gruppe + 1), h.eur(r.kinder[0].bedarf), h.eur(r.summe, 2)]), 'One child aged 10, working parent, computed by the engine', ['r', 'r', 'r', 'r'])}
<p>With several children the court checks whether the payer keeps the ${h.a('bedarfskontrollbetrag', 'needs-control amount')} of the group. A mother earning ${h.eur(4400)} net with three children aged three, eight and fifteen pays ${h.eur(drei.summe, 2)} in total in group ${drei.gruppe + 1}, according to the engine. For one child only, some courts move one group up, since the table assumes two dependants.</p>
<h2>Age bands and the statutory minimum</h2>
<p>Group 1 equals the ${h.a('mindestunterhalt', 'minimum child support')} under ${h.src('bgb1612a', 'section 1612a BGB')}: ${h.eur(h.P.mindestunterhalt.stufen[0])}, ${h.eur(h.P.mindestunterhalt.stufen[1])} and ${h.eur(h.P.mindestunterhalt.stufen[2])} for the three bands before adulthood. A minor’s need never falls below it. If income cannot cover even that, the case becomes a ${h.a('mangelfall', 'shortfall case')}, and the state may step in with the ${h.a('unterhaltsvorschuss', 'maintenance advance')}.</p>
<p>From ${h.num(AS[3][0])} the fourth column applies. Both parents then pay in proportion to their incomes, the full child benefit is deducted, and the young adult holds the claim personally.</p>
<h2>Ranking when money is short</h2>
<p>When income cannot cover everyone, ${h.src('bgb1609', 'section 1609 BGB')} sets the order:</p>
<ul>
<li>first: minor children, and pupils under 21 still living with a parent,</li>
<li>second: parents entitled because they care for a child, and spouses after a long marriage,</li>
<li>third: other spouses and former spouses,</li>
<li>fourth: all other children, such as university students,</li>
<li>then grandchildren, parents and more distant relatives.</li>
</ul>
<p>Children from different relationships share the same rank. A spouse only receives what is left after child support, which is why the ${h.a('unterhaltsrechner', 'maintenance calculator')} always works in that order.</p>
<h2>What the payer keeps</h2>
<p>Towards minors the duty is heightened (section 1603(2) BGB): the parent must use all available means and keeps only the minimum ${h.a('selbstbehalt', 'self-retention')}, ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} when working and ${h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig)} otherwise, including warm rent up to ${h.eur(h.P.selbstbehalt.notwendig_warmmiete)}. A parent who earns little or nothing is often assessed on what he or she could earn, because German courts expect real efforts to find work.</p>
<h2>Disclosure, Jugendamt help and enforceable titles</h2>
<p>Section 1605 BGB obliges parents and children to disclose income and assets to each other and to provide evidence on request, typically twelve months of payslips and the latest tax assessment. For expats this includes foreign salary statements and tax returns. The request also fixes the date from which support can be claimed backwards (section 1613 BGB).</p>
<p>The resident parent need not do this alone. On written application the Jugendamt becomes the child’s Beistand at no charge (section 1712 BGB). An agreed amount should be made enforceable, because without a title (Titel) nothing can be collected by force. The usual routes:</p>
<ul>
<li>a deed drawn up free of charge at the Jugendamt (Jugendamtsurkunde),</li>
<li>a notarial deed with submission to enforcement,</li>
<li>an order of the family court, in the simplified procedure or ordinary maintenance proceedings.</li>
</ul>
<p>For minors the order may state a fixed sum or a percentage of the statutory minimum (paragraph 11(2) of the ${h.src('olgLeitlinien', 'NRW guidelines')}); the percentage version adjusts itself when the minimum rises or the child changes band. Costs are covered under ${h.a('unterhaltsverfahren-kosten', 'cost of maintenance proceedings')}.</p>
<p>This page is general information on German child support under the 2026 tables, not legal advice; individual cases are assessed by the Jugendamt or decided by the family court.</p>`,
  },
});
