import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt } from '../../lib/engine/dt';
import { P, DE, EN } from '../../lib/fmt';

/**
 * BGH, Beschluss vom 15. April 2026, XII ZB 415/25 (research/bgh-xii-zb-415-25.txt, Leitsätze c und d, Rn. 67 bis 73).
 * Diese Werte fehlen in params-2026.json (gemeldet); sie stehen nur hier, aus dem Beschluss gelesen.
 */
const BGH = {
  abzugRegel: 0.1, // Pauschalabzug vom Bedarf im Regelfall des erweiterten Umgangs
  abzugMax: 0.15, // ausnahmsweise, wenn sich der Umgang stark einer hälftigen Mitbetreuung nähert
  naechteBeispiel: 4, // Übernachtungen je Zweiwochenzeitraum, ab denen ein erweiterter Umgang naheliegt
  quoteBeispiel: 0.3, // entspricht mit hälftigem Ferienumgang rund 30 % Mitbetreuung
  fallNaechteVater: 6, // im entschiedenen Fall: 6 von 14 Übernachtungen beim Vater
  fallNaechteGesamt: 14,
  fallQuoteMax: 0.45, // Betreuungsanteil des Vaters höchstens 45 %
  reformVon: 0.3, // Diskussionsentwurf BMJ 9.12.2024: asymmetrisches Wechselmodell ab 30 %
  reformBis: 0.49, // bis 49 % Betreuungsanteil (Rn. 46 des Beschlusses)
};

/** Beispiele aus dem Motor: ein Kind von 9 Jahren bei 3.600 € (Startwerte des Mini-Rechners) und Varianten. */
const k9 = [{ alter: 9 }];
const basis = kindesunterhalt(3600, k9);
const regel = kindesunterhalt(3600, k9, { umgangAbzug: BGH.abzugRegel, umgangHerabstufung: 1 });
const maxi = kindesunterhalt(3600, k9, { umgangAbzug: BGH.abzugMax, umgangHerabstufung: 1 });
const nurAbzug = kindesunterhalt(3600, k9, { umgangAbzug: BGH.abzugRegel });
const geschw = [{ alter: 9 }, { alter: 12 }];
const g0 = kindesunterhalt(4300, geschw);
const g1 = kindesunterhalt(4300, geschw, { umgangAbzug: BGH.abzugRegel, umgangHerabstufung: 1 });
const g2 = kindesunterhalt(4300, geschw, { umgangAbzug: BGH.abzugMax, umgangHerabstufung: 2 });
const mind = kindesunterhalt(2000, k9);
const mindStufe = kindesunterhalt(2000, k9, { umgangHerabstufung: 1 });

export default defineGuide({
  id: 'erweiterter-umgang',
  group: 'kind',
  order: 48,
  mini: 'umgang',
  related: ['wechselmodell-unterhalt', 'wechselmodell-rechner', 'bedarfskontrollbetrag', 'kindesunterhalt', 'kindesunterhalt-rechner', 'mindestunterhalt'],
  sources: ['bghUmgang2026', 'olgLeitlinien', 'bgb1606', 'olgDtPdf', 'bghWechsel2017'],
  de: {
    slug: 'erweiterter-umgang',
    nav: 'Erweiterter Umgang',
    card: 'Was der BGH im April 2026 zum Unterhalt bei viel Umgang entschieden hat: Herabstufung und Pauschalabzug.',
    title: 'Erweiterter Umgang und Unterhalt: BGH-Beschluss April 2026',
    description: `Erweiterter Umgang 2026: Laut BGH (XII ZB 415/25) zahlt der Umgangselternteil weiter allein Barunterhalt, aber mit Herabstufung und ${DE.pct(BGH.abzugRegel)} Abzug, höchstens ${DE.pct(BGH.abzugMax)}.`,
    h1: 'Erweiterter Umgang: wie der BGH 2026 den Kindesunterhalt mindert',
    intro: 'Wer sein Kind deutlich öfter als üblich betreut, aber kein echtes Wechselmodell lebt, zahlt weiter Barunterhalt. Seit April 2026 aber spürbar weniger.',
    resume: `Mit Beschluss vom 15. April 2026 (XII ZB 415/25) hat der Bundesgerichtshof entschieden, wie ein deutlich erweiterter Umgang den Kindesunterhalt verändert. Der Elternteil, bei dem das Kind hauptsächlich lebt, bleibt nach § 1606 Abs. 3 Satz 2 BGB von jedem Barunterhalt befreit; eine anteilige Haftung beider Eltern wie im Wechselmodell gibt es nicht. Der Umgangselternteil zahlt aber weniger: Seine Mehrkosten, etwa für Fahrten oder ein größeres Kinderzimmer, kann das Gericht durch Herabstufung um eine oder mehrere Gruppen der Düsseldorfer Tabelle berücksichtigen. Zusätzlich darf es den Bedarf pauschal um typischerweise ${DE.pct(BGH.abzugRegel)} kürzen, ausnahmsweise um höchstens ${DE.pct(BGH.abzugMax)}, weil Verpflegung und Freizeit beim Umgang den Haushalt des anderen Elternteils entlasten. Beispiel des Rechenkerns: Ein Vater mit ${DE.eur(3600)} Netto und einem neunjährigen Kind zahlt regulär ${DE.eur(basis.summe, 2)}; mit einer Gruppe Herabstufung und ${DE.pct(BGH.abzugRegel)} Abzug sind es ${DE.eur(regel.summe, 2)}. Als Anhaltspunkt nennt der BGH etwa ${BGH.naechteBeispiel} Übernachtungen in zwei Wochen.`,
    faqs: [
      { q: 'Ab wann liegt ein erweiterter Umgang im Sinne des BGH vor?', a: `Der BGH nennt als Beispiel ${BGH.naechteBeispiel} Übernachtungen innerhalb von zwei Wochen; mit einem hälftigen Ferienumgang entspricht das einer Mitbetreuung von rund ${DE.pct(BGH.quoteBeispiel)}. Eine feste Grenze ist das nicht. Entscheidend ist, dass der Umgang deutlich über das übliche Maß hinausgeht, etwa jedes zweite Wochenende plus einen Nachmittag, aber keine annähernd hälftige Betreuung erreicht.` },
      { q: 'Muss die Mutter bei erweitertem Umgang des Vaters Barunterhalt mitzahlen?', a: `Nein. Der BGH hat ausdrücklich abgelehnt, den hauptbetreuenden Elternteil für die Zeiten, in denen das Kind beim anderen ist, anteilig am Barunterhalt zu beteiligen. § 1606 Abs. 3 Satz 2 BGB stelle ihn im Regelfall von jeder Heranziehung frei. Rechenmodelle aus der Literatur und dem Reformentwurf des Justizministeriums seien nach geltendem Recht nicht anwendbar.` },
      { q: 'Wann erlaubt der BGH beim erweiterten Umgang den höheren Pauschalabzug?', a: `Nur ausnahmsweise, wenn sich die Umgangskontakte bereits stark einer hälftigen Mitbetreuung annähern. Der BGH begründet das damit, dass die Tabellensätze die Entlastung durch einen üblichen Umgang schon enthalten. Im Regelfall des erweiterten Umgangs hält er ${DE.pct(BGH.abzugRegel)} für angemessen. Mit diesem Höchstabzug und einer Gruppe Herabstufung sinkt der Betrag im Beispiel auf ${DE.eur(maxi.summe, 2)}.` },
      { q: 'Kann der erweiterte Umgang den Mindestunterhalt senken?', a: `Durch Herabstufung nicht: Unterhalb der ersten Gruppe gibt es keine Gruppe mehr, und der BGH betont, dass beim Existenzminimum des Kindes kein Spielraum für Kürzungen ohne echte Ersparnis besteht. Die Leitlinien in NRW lassen Abschläge nur zu, soweit der Mindestunterhalt gewährleistet ist. Ob ein Pauschalabzug für tatsächlich ersparte Kosten den Mindestunterhalt unterschreiten darf, ist noch nicht abschließend geklärt.` },
      { q: 'Werden Fahrtkosten zum Umgang zusätzlich vom Einkommen abgezogen?', a: `Nach den Leitlinien in NRW können Umgangskosten, die deutlich über den verbleibenden Kindergeldanteil hinausgehen, durch einen teilweisen Abzug vom Einkommen oder eine Erhöhung des Selbstbehalts berücksichtigt werden. Beim erweiterten Umgang nennt der BGH Fahrtkosten und Kinderzimmer als typischen Grund für die Herabstufung. Doppelt angesetzt werden dieselben Kosten in der Regel nicht.` },
      { q: 'Gilt der BGH-Beschluss zum erweiterten Umgang auch für alte Unterhaltstitel?', a: `Der Beschluss ändert kein Gesetz, er legt das geltende Recht aus. Wer schon einen Titel hat, kann eine Abänderung beantragen, wenn sich die Verhältnisse wesentlich geändert haben; ob eine neue Auslegung durch den BGH dafür genügt, beurteilt das Familiengericht. Für Unterhaltsberechnungen ab jetzt werden sich die Gerichte an den Beschluss halten.` },
    ],
    body: (h) => `<h2>Der Fall, über den der BGH entschied</h2>
<p>Zwei Kinder, geboren 2011 und 2013, leben nach der Trennung überwiegend bei der Mutter. Ein gerichtlich gebilligter Umgangsvergleich gibt dem Vater in jeweils zwei Wochen ${BGH.fallNaechteVater} von ${BGH.fallNaechteGesamt} Übernachtungen: jedes zweite Wochenende bis Mittwoch und in der anderen Woche Montag bis Mittwochabend. Der Vater wollte deshalb keinen oder deutlich weniger Unterhalt zahlen. Amtsgericht Erkelenz und Oberlandesgericht Düsseldorf sprachen den Kindern den Mindestunterhalt zu, der ${h.src('bghUmgang2026', 'Bundesgerichtshof')} bestätigte das.</p>
<p>Ein Wechselmodell lag nicht vor: Selbst nach der für den Vater günstigsten Zählung kam er auf höchstens ${h.pct(BGH.fallQuoteMax)} der Betreuungszeit, und die Eltern hatten bewusst keine hälftige Aufteilung vereinbart.</p>
<h2>Die drei Kernaussagen</h2>
<ul>
<li><strong>Keine Mithaftung des Hauptbetreuenden.</strong> Wer das Kind überwiegend betreut, erfüllt seine Unterhaltspflicht durch Pflege und Erziehung (${h.src('bgb1606', '§ 1606 Abs. 3 Satz 2 BGB')}). Das gilt auch, wenn der andere sehr viel Umgang hat.</li>
<li><strong>Herabstufung für Mehrkosten.</strong> Kosten, die nur durch den Umgang entstehen und den anderen Haushalt nicht entlasten, etwa Fahrten oder ein Kinderzimmer, kann das Gericht durch eine niedrigere Einkommensgruppe auffangen, um eine oder mehrere Stufen.</li>
<li><strong>Pauschalabzug für gedeckten Bedarf.</strong> Was der Umgangselternteil für Essen, Freizeit, Gesundheit oder Fahrten des Kindes ausgibt, deckt einen Teil des Bedarfs. Statt Belegen genügt eine Schätzung: typischerweise ${h.pct(BGH.abzugRegel)}, ausnahmsweise höchstens ${h.pct(BGH.abzugMax)} des Tabellenbedarfs.</li>
</ul>
<h2>Was das in Euro bedeutet</h2>
${h.table(['Fall', 'Gruppe', 'Unterhalt im Monat', 'Ersparnis'], [
  [`${h.eur(3600)}, Kind 9 J., üblicher Umgang`, String(basis.gruppe + 1), h.eur(basis.summe, 2), ''],
  [`dasselbe, nur ${h.pct(BGH.abzugRegel)} Abzug`, String(nurAbzug.gruppe + 1), h.eur(nurAbzug.summe, 2), h.eur(basis.summe - nurAbzug.summe, 2)],
  [`eine Gruppe tiefer und ${h.pct(BGH.abzugRegel)} Abzug`, String(regel.gruppe + 1), h.eur(regel.summe, 2), h.eur(basis.summe - regel.summe, 2)],
  [`eine Gruppe tiefer und ${h.pct(BGH.abzugMax)} Abzug`, String(maxi.gruppe + 1), h.eur(maxi.summe, 2), h.eur(basis.summe - maxi.summe, 2)],
  [`${h.eur(4300)}, Kinder 9 und 12 J., üblicher Umgang`, String(g0.gruppe + 1), h.eur(g0.summe, 2), ''],
  [`eine Gruppe tiefer und ${h.pct(BGH.abzugRegel)} Abzug`, String(g1.gruppe + 1), h.eur(g1.summe, 2), h.eur(g0.summe - g1.summe, 2)],
  [`zwei Gruppen tiefer und ${h.pct(BGH.abzugMax)} Abzug`, String(g2.gruppe + 1), h.eur(g2.summe, 2), h.eur(g0.summe - g2.summe, 2)],
], 'Zahlbeträge nach Abzug des halben Kindergeldes, vom Rechenkern ermittelt; der Abzug wird vom Tabellenbedarf genommen', ['l', 'r', 'r', 'r'])}
<p>Der Abzug wird auf den Tabellenbedarf angewandt, das halbe Kindergeld von ${h.eur(h.P.kindergeld.monat / 2, 2)} geht danach unverändert ab. Deshalb wirkt der Prozentsatz auf den Zahlbetrag stärker, als er klingt. Wie viele Stufen herabgestuft wird, liegt im Ermessen des Gerichts; der Rechenkern lässt null bis zwei Stufen zu.</p>
<h2>Die Grenze beim Mindestunterhalt</h2>
<p>Bei ${h.eur(2000)} Netto liegt der Vater bereits in Gruppe 1. Eine Herabstufung ändert nichts: ${h.eur(mindStufe.summe, 2)} wie ohne Umgang, ${h.eur(mind.summe, 2)}. Der BGH sieht darin keine Ungerechtigkeit, weil beim sächlichen Existenzminimum des Kindes kein Spielraum für Kürzungen besteht, denen keine echte Ersparnis gegenübersteht. Die ${h.src('olgLeitlinien', 'Leitlinien in NRW')} formulieren es in Nummer 12 Absatz 5 so: Abschläge wegen erweiterten Umgangs nur, soweit der Mindestunterhalt gewährleistet ist. Ob der Pauschalabzug für tatsächlich ersparte Kosten den Mindestunterhalt unterschreiten darf, lässt der Beschluss offen; viele Gerichte werden hier zurückhaltend sein.</p>
<h2>Abgrenzung zum Wechselmodell</h2>
<p>Erst wenn sich die Eltern die Betreuung etwa hälftig teilen, haften beide nach ihren Einkommen für den Barunterhalt, wie der BGH schon 2017 entschieden hat (${h.src('bghWechsel2017', 'XII ZB 565/15')}). Die Zeit ist dabei ein wichtiges Indiz, aber nicht allein entscheidend; auch die Verantwortung für Schule, Arzttermine und Alltag zählt. Wie die Rechnung im echten Wechselmodell aussieht, zeigt die Seite zum ${h.a('wechselmodell-unterhalt', 'Wechselmodell')}, mit eigenem ${h.a('wechselmodell-rechner', 'Wechselmodell-Rechner')}.</p>
<h2>Die Reformdebatte</h2>
<p>Das Bundesjustizministerium hatte im Dezember 2024 einen Diskussionsentwurf vorgelegt, der ein asymmetrisches Wechselmodell bei Betreuungsanteilen von ${h.pct(BGH.reformVon)} bis ${h.pct(BGH.reformBis)} mit eigener Formel vorsah. Der BGH hat deutlich gemacht, dass eine solche Mithaftung des Hauptbetreuenden nur der Gesetzgeber einführen kann. Er hat aber den Ansatz des Entwurfs für den Pauschalabzug übernommen und an die Rechtslage angepasst. Ein Gesetz dazu gab es bei Redaktionsschluss nicht.</p>
<h2>Was im Verfahren vorzutragen ist</h2>
<ul>
<li>der genaue Umgangsplan, mit Übernachtungen je zwei Wochen und Ferienregelung,</li>
<li>Mehrkosten, die nur durch den Umgang entstehen: Fahrten, größere Wohnung,</li>
<li>Leistungen, die den Bedarf decken: Verpflegung, Freizeit, Kleidung im eigenen Haushalt.</li>
</ul>
<p>Mit dem Mini-Rechner oben lassen sich Abzug und Herabstufung für das eigene Einkommen durchspielen; der ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')} rechnet ohne Umgangsabschläge. Diese Seite ist eine allgemeine Information über den BGH-Beschluss zum erweiterten Umgang, keine Rechtsberatung.</p>`,
  },
  en: {
    slug: 'extended-contact',
    nav: 'Extended contact',
    card: 'What Germany’s top civil court ruled in April 2026 on child support when the other parent has lots of contact.',
    title: 'Extended Contact and Child Support: BGH Ruling April 2026',
    description: `Extended contact in Germany, 2026: the Federal Court of Justice keeps one parent paying cash support but allows a lower group and a ${EN.pct(BGH.abzugRegel)} cut, ${EN.pct(BGH.abzugMax)} at most.`,
    h1: 'Extended contact: how the 2026 ruling lowers German child support',
    intro: 'If you look after your child far more than every other weekend but not half the time, you still pay cash support. Since April 2026, noticeably less.',
    resume: `In a decision of 15 April 2026 (XII ZB 415/25), Germany’s Federal Court of Justice (Bundesgerichtshof, BGH) set out how substantially extended contact (erweiterter Umgang) affects child support. The parent the child mainly lives with remains free of any cash support under section 1606(3) sentence 2 of the Civil Code (BGB); there is no shared liability as in true equal shared care (Wechselmodell). The contact parent does pay less, though. Costs that only arise from contact, such as travel or a bigger child’s room, can be reflected by moving down one or more income groups of the Düsseldorf Table. On top of that, the court may cut the child’s need by a flat ${EN.pct(BGH.abzugRegel)} as a rule, exceptionally by at most ${EN.pct(BGH.abzugMax)}, because meals and leisure during contact relieve the other household. Using our engine: a father on ${EN.eur(3600)} net with a nine-year-old normally pays ${EN.eur(basis.summe, 2)}; one group lower with a ${EN.pct(BGH.abzugRegel)} cut, ${EN.eur(regel.summe, 2)}. The court gave about ${BGH.naechteBeispiel} overnight stays per fortnight as an example.`,
    faqs: [
      { q: 'How much contact counts as extended contact under the 2026 ruling?', a: `The court gives ${BGH.naechteBeispiel} overnight stays per fortnight as an example; with half of the school holidays, that is roughly ${EN.pct(BGH.quoteBeispiel)} of the care. It is not a fixed threshold. What matters is that contact clearly exceeds the usual every-other-weekend pattern without reaching a roughly equal split of care, which would be shared care with different rules.` },
      { q: 'Does the main carer have to contribute cash when the other parent has extended contact?', a: `No. The BGH expressly refused to make the main carer share cash support for the periods the child spends with the other parent. Under section 1606(3) sentence 2 BGB, care and upbringing fulfil that parent’s duty. Formula models from legal writing and from the Justice Ministry’s reform draft cannot be applied under current law, the court said.` },
      { q: 'When can a German court apply the higher flat cut for contact?', a: `Only exceptionally, where contact already comes close to half the care. The court points out that the table amounts already reflect the relief from ordinary contact. For other extended-contact cases it considers ${EN.pct(BGH.abzugRegel)} appropriate. In our example the higher cut, with one group lower, would bring support down to ${EN.eur(maxi.summe, 2)} a month.` },
      { q: 'Can extended contact push support below the statutory minimum?', a: `Not by moving down groups: there is nothing below group 1, and the court stresses there is no room to cut the child’s subsistence minimum without real savings in the other home. The NRW guidelines allow contact-related reductions only where the minimum stays secured. Whether a flat cut for genuinely saved costs may go below the minimum has not been finally settled.` },
      { q: 'I live abroad and my child flies to me for long holidays: is that extended contact?', a: `The ruling deals with regular care during the school year as well as holidays, measured in overnight stays per fortnight. Long holiday stays alone may raise travel costs, which German guidelines can treat as contact costs, but whether they amount to extended contact depends on the overall pattern. A family court weighs the facts; the ruling sets no rule for cross-border arrangements.` },
      { q: 'Does the April 2026 ruling change an existing child support order automatically?', a: `No. It interprets the law; it does not change it, and orders stay in force until varied. A parent can apply to vary an order when circumstances change substantially; whether a new interpretation by the BGH is enough is for the family court to decide. New calculations from now on will follow the ruling.` },
    ],
    body: (h) => `<h2>The case the court decided</h2>
<p>Two children born in 2011 and 2013 lived mainly with their mother after the separation. A court-approved contact agreement gave the father ${BGH.fallNaechteVater} of every ${BGH.fallNaechteGesamt} nights: alternate weekends through to Wednesday morning, and Monday to Wednesday evening in the other week. He argued he owed little or nothing. The local court in Erkelenz and the Higher Regional Court in Düsseldorf awarded the children the statutory minimum, and the ${h.src('bghUmgang2026', 'Federal Court of Justice')} upheld that.</p>
<p>It was not shared care: even counted in the way most favourable to him, the father had at most ${h.pct(BGH.fallQuoteMax)} of the care time, and the parents had deliberately not agreed an equal split.</p>
<h2>Three key points</h2>
<ul>
<li><strong>The main carer pays no cash.</strong> The parent who mainly looks after the child fulfils the duty of support through care and upbringing (${h.src('bgb1606', 'section 1606(3) BGB')}), however much contact the other parent has.</li>
<li><strong>A lower group for extra costs.</strong> Costs that exist only because of contact and do not save the other household anything, such as travel or a child’s bedroom, can be met by a lower income group, by one or several steps.</li>
<li><strong>A flat cut for need already covered.</strong> What the contact parent spends on food, leisure, health or transport for the child covers part of its need. Instead of receipts, the court may estimate: ${h.pct(BGH.abzugRegel)} as a rule, ${h.pct(BGH.abzugMax)} at most, of the table need.</li>
</ul>
<h2>What it means in euros</h2>
${h.table(['Situation', 'Group', 'Monthly support', 'Saving'], [
  [`${h.eur(3600)}, child aged 9, usual contact`, String(basis.gruppe + 1), h.eur(basis.summe, 2), ''],
  [`same, ${h.pct(BGH.abzugRegel)} cut only`, String(nurAbzug.gruppe + 1), h.eur(nurAbzug.summe, 2), h.eur(basis.summe - nurAbzug.summe, 2)],
  [`one group lower and ${h.pct(BGH.abzugRegel)} cut`, String(regel.gruppe + 1), h.eur(regel.summe, 2), h.eur(basis.summe - regel.summe, 2)],
  [`one group lower and ${h.pct(BGH.abzugMax)} cut`, String(maxi.gruppe + 1), h.eur(maxi.summe, 2), h.eur(basis.summe - maxi.summe, 2)],
  [`${h.eur(4300)}, children 9 and 12, usual contact`, String(g0.gruppe + 1), h.eur(g0.summe, 2), ''],
  [`one group lower and ${h.pct(BGH.abzugRegel)} cut`, String(g1.gruppe + 1), h.eur(g1.summe, 2), h.eur(g0.summe - g1.summe, 2)],
  [`two groups lower and ${h.pct(BGH.abzugMax)} cut`, String(g2.gruppe + 1), h.eur(g2.summe, 2), h.eur(g0.summe - g2.summe, 2)],
], 'Amounts payable after half the child benefit, computed by our engine; the cut is taken from the table need', ['l', 'r', 'r', 'r'])}
<p>The cut applies to the table need, and half the child benefit (Kindergeld), ${h.eur(h.P.kindergeld.monat / 2, 2)}, still comes off afterwards. That is why the percentage weighs more heavily on the amount you actually transfer than it sounds. How many groups to move down is for the court; the engine allows zero to two.</p>
<h2>The floor: statutory minimum support</h2>
<p>On ${h.eur(2000)} net the father is already in group 1, so moving down changes nothing: ${h.eur(mindStufe.summe, 2)}, the same as ${h.eur(mind.summe, 2)} without it. The court sees no unfairness here, because a child’s material subsistence minimum leaves no room for cuts that are not matched by real savings. Number 12 paragraph 5 of the ${h.src('olgLeitlinien', 'NRW guidelines')} likewise allows contact-related reductions only where the minimum stays secured. Whether a flat cut for genuinely saved costs can go below it is left open; many courts are likely to be cautious.</p>
<h2>Where shared care begins</h2>
<p>Only when parents split care roughly equally do both pay cash support according to their incomes, as the BGH held in 2017 (${h.src('bghWechsel2017', 'XII ZB 565/15')}). Time is an important indicator but not the only one; responsibility for school, doctors and daily life counts too. The calculation for that case is on the ${h.a('wechselmodell-unterhalt', 'shared care')} page, with its own ${h.a('wechselmodell-rechner', 'shared care calculator')}.</p>
<h2>The reform debate</h2>
<p>In December 2024 the Federal Ministry of Justice published a discussion draft with its own formula for an asymmetric shared care model at ${h.pct(BGH.reformVon)} to ${h.pct(BGH.reformBis)} of care. The court made clear that making the main carer share cash support is for Parliament alone. It did borrow the draft’s reasoning for the flat cut and adapted it to current law. No such statute had been passed at the time of writing.</p>
<h2>What to put before the court</h2>
<ul>
<li>the exact contact schedule: overnight stays per fortnight and holiday arrangements,</li>
<li>costs caused only by contact: travel, a larger home,</li>
<li>spending that covers the child’s need: meals, leisure, clothes kept at your home.</li>
</ul>
<p>The mini calculator above lets you try the cut and the step-down with your own income; the ${h.a('kindesunterhalt-rechner', 'child support calculator')} works without contact reductions. This page is general information on the 2026 extended-contact ruling, not legal advice.</p>`,
  },
});
