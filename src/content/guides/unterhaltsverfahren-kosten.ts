import { defineGuide } from '../../lib/guide-types';
import { famgkgGebuehr, rvgGebuehr, pkh } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';
import { r2 } from '../../lib/engine/params';

const F = P.famgkg;
const R = P.rvg;
/** Kosten eines Unterhaltsverfahrens erster Instanz wie im Mini „unterhaltsverfahren“: Wert nach § 51 FamGKG, KV 1220, VV 3100 + 3104 (+ 1003 bei Einigung), Auslagen 7002, USt. */
function verfahren(monat: number, rueckstand: number) {
  const wert = 12 * monat + rueckstand;
  const gericht = r2(F.kv1220_satz * famgkgGebuehr(wert));
  const rv = rvgGebuehr(wert);
  const anwalt = (mitEinigung: boolean) => {
    const geb = (R.vv3100 + R.vv3104 + (mitEinigung ? R.vv1003 : 0)) * rv;
    return r2((geb + Math.min(R.vv7002_max, R.vv7002_anteil * geb)) * (1 + R.ust));
  };
  const einAnwalt = anwalt(false);
  return { wert, gericht, einAnwalt, mitEinigung: anwalt(true), risiko: r2(gericht + 2 * einAnwalt) };
}
/** Beispiele: Kindesunterhalt 400 €, Trennungsunterhalt 650 € mit 2 Monaten Rückstand, nachehelicher Unterhalt 1.100 € mit 3 Monaten Rückstand. */
const kind = verfahren(400, 0);
const trennung = verfahren(650, 1300);
const ehe = verfahren(1100, 3300);
/** Verfahrenskostenhilfe: Mutter mit 1.900 € netto, ein Kind (4), Warmmiete 650 €; Vater mit 2.300 €, Warmmiete 750 €. */
const vkhMutter = pkh({ netto: 1900, erwerbstaetig: true, kinder: [4], wohnkosten: 650 });
const vkhVater = pkh({ netto: 2300, erwerbstaetig: true, wohnkosten: 750 });

export default defineGuide({
  id: 'unterhaltsverfahren-kosten',
  group: 'scheidung',
  order: 20,
  mini: 'unterhaltsverfahren',
  related: ['verfahrenskostenhilfe', 'prozesskostenhilfe-rechner', 'verfahrenswert', 'anwaltskosten-scheidung', 'gerichtskosten-scheidung', 'unterhaltsvorschuss'],
  sources: ['famgkg51', 'famgkgTabelle', 'famgkgKv', 'rvgVv', 'famfg114', 'zpo115', 'pkhb2026'],
  de: {
    slug: 'kosten-unterhaltsverfahren',
    nav: 'Kosten Unterhaltsverfahren',
    card: 'Was es kostet, Unterhalt einzuklagen: Verfahrenswert, Gerichts- und Anwaltsgebühren, Beistandschaft, Verfahrenskostenhilfe.',
    title: 'Unterhalt einklagen 2026: Kosten von Gericht und Anwalt',
    description: `Unterhalt einklagen 2026: Verfahrenswert nach § 51 FamGKG, Gerichtsgebühr ${DE.num(F.kv1220_satz, 1)}, Anwaltskosten, kostenlose Beistandschaft, Verfahrenskostenhilfe, Beispiele.`,
    h1: 'Was ein Unterhaltsverfahren kostet',
    intro: 'Die Kosten hängen fast nur vom Jahresbetrag des geforderten Unterhalts ab. Drei Beispiele, die Ausnahmen und die Wege, sie zu vermeiden.',
    resume: `Ein gerichtliches Unterhaltsverfahren kostet 2026 Gerichts- und Anwaltsgebühren, die sich nach dem Verfahrenswert richten. Nach § 51 FamGKG ist das der geforderte Betrag für die zwölf Monate nach Antragseinreichung plus die bei Einreichung fälligen Rückstände. Wer ${DE.eur(650)} Trennungsunterhalt im Monat und ${DE.eur(1300)} Rückstand verlangt, kommt auf ${DE.eur(trennung.wert)} Verfahrenswert. Das Gericht erhebt dafür eine Gebühr mit dem Satz ${DE.num(F.kv1220_satz, 1)}, hier ${DE.eur(trennung.gericht, 2)}; ein Anwalt kostet mit Verfahrens- und Terminsgebühr, Auslagen und Umsatzsteuer ${DE.eur(trennung.einAnwalt, 2)}. Haben beide Seiten einen Anwalt, liegt das gesamte Kostenrisiko bei ${DE.eur(trennung.risiko, 2)}; verteilt wird es nach § 243 FamFG nach billigem Ermessen, vor allem nach Erfolg und Auskunftsverhalten. In selbständigen Unterhaltssachen besteht Anwaltszwang, außer für ein Kind, das das Jugendamt als Beistand vertritt: Diese Beistandschaft ist für Kindesunterhalt kostenlos. Wer die Kosten nicht tragen kann, beantragt Verfahrenskostenhilfe nach den Regeln der §§ 114 ff. ZPO.`,
    faqs: [
      { q: 'Wie berechnet sich der Verfahrenswert, wenn man Unterhalt einklagt?', a: `Maßgeblich ist der Betrag, den Sie für die ersten zwölf Monate nach Einreichung des Antrags fordern, höchstens der Gesamtbetrag der Forderung (§ 51 Absatz 1 FamGKG). Bis zur Einreichung aufgelaufene Rückstände werden hinzugerechnet. Bei ${DE.eur(1100)} monatlich und drei offenen Monaten sind das ${DE.eur(ehe.wert)}. Ein Antrag auf Verfahrenskostenhilfe steht der Einreichung gleich, wenn der Hauptantrag alsbald nach der Entscheidung darüber folgt.` },
      { q: 'Braucht man für eine Unterhaltsklage einen Anwalt?', a: 'In der Regel ja. Selbständige Unterhaltsverfahren sind Familienstreitsachen, für die nach § 114 Absatz 1 FamFG Anwaltszwang vor dem Familiengericht gilt. Ausnahmen nennt Absatz 4: unter anderem das Verfahren der einstweiligen Anordnung, das Verfahren über die Verfahrenskostenhilfe und Unterhaltssachen eines Kindes, das vom Jugendamt als Beistand vertreten wird. Der Antragsgegner braucht ebenfalls einen Anwalt, wenn er Anträge stellen will.' },
      { q: 'Wer zahlt die Kosten des Unterhaltsverfahrens, wenn man teilweise gewinnt?', a: 'Das Gericht verteilt sie nach § 243 FamFG nach billigem Ermessen, nicht starr nach Prozentquoten. Es berücksichtigt das Verhältnis von Obsiegen und Unterliegen einschließlich der Dauer der Unterhaltspflicht, ob ein Beteiligter vorher die verlangte Auskunft über sein Einkommen verweigert hat, ob er gerichtliche Auflagen missachtet hat und ob er den Anspruch sofort anerkannt hat. Wer Auskunft verweigert, riskiert also die Kosten, auch wenn er teilweise recht bekommt.' },
      { q: 'Was kostet die Beistandschaft des Jugendamts beim Kindesunterhalt?', a: 'Nichts. Auf schriftlichen Antrag des betreuenden Elternteils wird das Jugendamt nach § 1712 BGB Beistand des Kindes und macht dessen Unterhalt geltend, außergerichtlich und, wenn nötig, vor Gericht. Ein Anwalt ist dann für das Kind nicht vorgeschrieben. Die Beistandschaft gilt nur für den Unterhalt des Kindes, nicht für Trennungs-, Betreuungs- oder Ehegattenunterhalt des Elternteils.' },
      { q: 'Lohnt sich ein Vergleich im Unterhaltsverfahren finanziell?', a: `Für die Gerichtskosten meist ja: Endet das Verfahren durch gerichtlichen Vergleich oder Rücknahme vor Schluss der mündlichen Verhandlung, ermäßigt sich die Gerichtsgebühr nach dem Kostenverzeichnis zum FamGKG erheblich. Die Anwälte erhalten dafür eine zusätzliche Einigungsgebühr; bei ${DE.eur(trennung.wert)} Verfahrenswert steigt ein Anwalt von ${DE.eur(trennung.einAnwalt, 2)} auf ${DE.eur(trennung.mitEinigung, 2)}. Ob sich das insgesamt rechnet, hängt vom Einzelfall ab.` },
      { q: 'Muss der unterhaltspflichtige Ehegatte die Prozesskosten vorschießen?', a: 'Unter Ehegatten kann das so sein. Nach § 1360a Absatz 4 BGB, der über § 1361 Absatz 4 BGB auch während der Trennung gilt, muss ein Ehegatte dem anderen die Kosten eines Verfahrens in einer persönlichen Angelegenheit vorschießen, wenn dieser sie nicht tragen kann und es der Billigkeit entspricht. Ein solcher Vorschuss geht der staatlichen Verfahrenskostenhilfe grundsätzlich vor und kann per einstweiliger Anordnung verlangt werden.' },
    ],
    body: (h) => `<h2>Erst rechnen, dann klagen</h2>
<p>Unterhaltsverfahren gehören zu den häufigsten Verfahren vor dem Familiengericht. Ihre Kosten folgen einem einfachen Prinzip: Je höher die Forderung, desto höher der Verfahrenswert, und an ihm hängen sowohl die Gerichtsgebühren als auch die gesetzlichen Anwaltsgebühren. Wer vorher weiß, welcher Betrag im Raum steht, kann das Kostenrisiko recht genau abschätzen.</p>
<h2>Der Verfahrenswert nach § 51 FamGKG</h2>
<p>Nach ${h.src('famgkg51', '§ 51 FamGKG')} zählt der Betrag, der für die ersten zwölf Monate nach Einreichung des Antrags gefordert wird, höchstens die Gesamtforderung. Hinzu kommen die Beträge, die bei Einreichung schon fällig waren, also die Rückstände. Ein Unterschied zwischen Kindes-, Trennungs- oder nachehelichem Unterhalt besteht dabei nicht.</p>
<ul>
<li>Wird Kindesunterhalt dynamisch als Prozentsatz des Mindestunterhalts verlangt, legt das Gesetz den Monatsbetrag des Mindestunterhalts der Altersstufe bei Einreichung zugrunde.</li>
<li>Ein Antrag auf Verfahrenskostenhilfe gilt als Einreichung, wenn der eigentliche Antrag alsbald nach der Entscheidung darüber folgt. Rückstände bis dahin zählen also mit.</li>
<li>Die Werttabelle ist ${h.src('famgkgTabelle', 'Anlage 2 zum FamGKG')} in der seit 2025 geltenden Fassung; ihre Methodik ist auf der Seite zum ${h.a('verfahrenswert', 'Verfahrenswert')} erklärt.</li>
</ul>
<h2>Gerichtsgebühr und Anwaltsgebühren</h2>
<p>Für ein Unterhaltsverfahren erster Instanz erhebt das Gericht nach Nummer 1220 des ${h.src('famgkgKv', 'Kostenverzeichnisses zum FamGKG')} eine Gebühr mit dem Satz ${h.num(h.P.famgkg.kv1220_satz, 1)}. Das ist mehr als die ${h.num(h.P.famgkg.kv1110_satz, 1)} einer Scheidung, die auf den ${h.a('gerichtskosten-scheidung', 'Gerichtskosten der Scheidung')} beschrieben sind. Der Antragsteller zahlt sie in der Regel vorab.</p>
<p>Der Anwalt rechnet nach dem ${h.src('rvgVv', 'Vergütungsverzeichnis zum RVG')} ab: Verfahrensgebühr ${h.num(h.P.rvg.vv3100, 1)}, Terminsgebühr ${h.num(h.P.rvg.vv3104, 1)}, Auslagenpauschale von ${h.pct(h.P.rvg.vv7002_anteil)} der Gebühren, höchstens ${h.eur(h.P.rvg.vv7002_max)}, und ${h.pct(h.P.rvg.ust)} Umsatzsteuer. Bei einer Einigung kommt eine Einigungsgebühr von ${h.num(h.P.rvg.vv1003, 1)} hinzu. Viele Kanzleien arbeiten auch mit Vergütungsvereinbarungen; die Tabelle zeigt die gesetzlichen Gebühren.</p>
${h.table(['Verfahren', 'Verfahrenswert', `Gericht (${h.num(h.P.famgkg.kv1220_satz, 1)})`, 'ein Anwalt', 'Risiko mit zwei Anwälten'], [
  [`Kindesunterhalt ${h.eur(400)} monatlich`, h.eur(kind.wert), h.eur(kind.gericht, 2), h.eur(kind.einAnwalt, 2), h.eur(kind.risiko, 2)],
  [`Trennungsunterhalt ${h.eur(650)} plus ${h.eur(1300)} Rückstand`, h.eur(trennung.wert), h.eur(trennung.gericht, 2), h.eur(trennung.einAnwalt, 2), h.eur(trennung.risiko, 2)],
  [`Ehegattenunterhalt ${h.eur(1100)} plus ${h.eur(3300)} Rückstand`, h.eur(ehe.wert), h.eur(ehe.gericht, 2), h.eur(ehe.einAnwalt, 2), h.eur(ehe.risiko, 2)],
], 'Erste Instanz, gesetzliche Gebühren 2026, Anwalt mit Verfahrens- und Terminsgebühr, Auslagen und Umsatzsteuer, ohne Einigung', ['l', 'r', 'r', 'r', 'r'])}
<p>Die Anwaltskosten wachsen langsamer als der Wert: Ein fast doppelt so hoher Verfahrenswert in der dritten Zeile führt nicht zu doppelt so hohen Gebühren. Weitere Einzelheiten zur Gebührenberechnung stehen bei den ${h.a('anwaltskosten-scheidung', 'Anwaltskosten')}.</p>
<h2>Wer am Ende zahlt</h2>
<p>Anders als im Zivilprozess richtet sich die Kostenverteilung in Unterhaltssachen nicht schematisch nach dem Ergebnis. § 243 FamFG lässt das Gericht nach billigem Ermessen entscheiden und nennt Gesichtspunkte: das Verhältnis von Obsiegen und Unterliegen, auch mit Blick auf die Dauer der Unterhaltspflicht, eine vor dem Verfahren verweigerte oder unvollständige Auskunft über das Einkommen, das Missachten gerichtlicher Auflagen zur Auskunft und ein sofortiges Anerkenntnis. Wer auf ein Auskunftsschreiben nicht reagiert, verschlechtert damit seine Kostenlage.</p>
<h2>Ohne eigenes Geld: Beistandschaft, Vorschuss, Verfahrenskostenhilfe</h2>
<p>Für Kindesunterhalt gibt es einen kostenlosen Weg: Auf schriftlichen Antrag wird das Jugendamt Beistand des Kindes (§ 1712 BGB) und verlangt den Unterhalt in dessen Namen. Nach ${h.src('famfg114', '§ 114 Absatz 4 FamFG')} braucht das Kind dann keinen Anwalt. Das Jugendamt kann eine Unterhaltsverpflichtung für Kinder unter 21 Jahren auch beurkunden, sodass ohne Gericht ein vollstreckbarer Titel entsteht. Kommt kein Unterhalt, hilft der ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')}.</p>
<p>Unter Ehegatten kann ein Verfahrenskostenvorschuss nach § 1360a Absatz 4 BGB geschuldet sein. Reicht das alles nicht, gewährt das Gericht ${h.a('verfahrenskostenhilfe', 'Verfahrenskostenhilfe')} nach den Regeln von ${h.src('zpo115', '§ 115 ZPO')}, wenn die Rechtsverfolgung hinreichende Aussicht auf Erfolg hat und nicht mutwillig ist. Vom Netto werden Freibeträge nach der ${h.src('pkhb2026', 'Prozesskostenhilfebekanntmachung 2026')} und die Wohnkosten abgezogen:</p>
<ul>
<li>Eine Mutter mit ${h.eur(1900)} netto, einem vierjährigen Kind und ${h.eur(650)} Warmmiete behält ${h.eur(vkhMutter.einzusetzen)} einzusetzendes Einkommen und erhält Verfahrenskostenhilfe ohne Raten.</li>
<li>Ein alleinstehender Antragsteller ohne Unterhaltspflichten mit ${h.eur(2300)} netto und ${h.eur(750)} Warmmiete zahlt eine Monatsrate von ${h.eur(vkhVater.rate)}, höchstens ${h.num(vkhVater.maxRaten)} Raten.</li>
</ul>
<p>Verfahrenskostenhilfe deckt die eigenen Gerichts- und Anwaltskosten, nicht die Anwaltskosten der Gegenseite, falls man verliert. Die Prüfung im Einzelnen übernimmt der ${h.a('prozesskostenhilfe-rechner', 'Prozesskostenhilfe-Rechner')}.</p>
<p>Diese Übersicht über die Kosten eines Unterhaltsverfahrens ist allgemeine Information, Stand 2026, keine Rechtsberatung; den Verfahrenswert setzt das Familiengericht fest, und abweichende Vergütungsvereinbarungen mit Anwälten sind möglich.</p>`,
  },
  en: {
    slug: 'cost-of-maintenance-proceedings',
    nav: 'Cost of maintenance proceedings',
    card: 'What it costs to take a maintenance claim to a German court: value, court and lawyer fees, free help, legal aid.',
    title: 'Maintenance Court Costs Germany 2026: Fees and Legal Aid',
    description: `Cost of maintenance proceedings in Germany 2026: value under section 51 FamGKG, ${EN.num(F.kv1220_satz, 1)} court fee, lawyer fees, free Jugendamt support and legal aid explained.`,
    h1: 'What maintenance proceedings cost in Germany',
    intro: 'Court and lawyer fees depend almost entirely on one year of the maintenance claimed. Three worked examples, plus the ways to avoid paying them yourself.',
    resume: `Taking a maintenance claim to a German family court (Familiengericht) in 2026 costs court fees and lawyer fees, both based on the value of the proceedings (Verfahrenswert). Under section 51 of the Family Court Costs Act (FamGKG), the value is the amount claimed for the twelve months after filing, plus any arrears already due on filing. A claim for ${EN.eur(1100)} a month in spousal maintenance with ${EN.eur(3300)} of arrears has a value of ${EN.eur(ehe.wert)}. The court charges a ${EN.num(F.kv1220_satz, 1)} fee on that value, ${EN.eur(ehe.gericht, 2)}, and one lawyer with the statutory procedure and hearing fees, expenses and VAT costs ${EN.eur(ehe.einAnwalt, 2)}. With lawyers on both sides, ${EN.eur(ehe.risiko, 2)} is at stake in total, shared at the court’s discretion. Lawyers are compulsory in stand-alone maintenance cases, except for a child represented by the youth welfare office (Jugendamt), whose support for child maintenance is free. People on low income can apply for legal aid (Verfahrenskostenhilfe), with or without monthly instalments.`,
    faqs: [
      { q: 'How is the value of a German maintenance case worked out if my ex has not paid for months?', a: `Take the monthly amount you claim, multiply by twelve, and add the arrears that are due on the day you file (section 51 FamGKG). For ${EN.eur(650)} a month with ${EN.eur(1300)} unpaid, the value is ${EN.eur(trennung.wert)}. Arrears can usually only be claimed from the month in which you first asked for income details or demanded payment, so the request letter matters for the value too.` },
      { q: 'Can I go to the German family court about maintenance without a lawyer?', a: 'Generally no. Stand-alone maintenance cases are family disputes (Familienstreitsachen) with mandatory legal representation under section 114(1) of the Family Procedure Act (FamFG). Exceptions include interim orders (einstweilige Anordnung), the legal aid application itself and a child represented by the Jugendamt. If English is easier for you, note that court proceedings are held in German; many lawyers work in English with clients.' },
      { q: 'Who pays the legal costs if the court awards only part of the maintenance claimed?', a: 'German courts split costs in maintenance cases at their discretion (section 243 FamFG). They weigh how far each side won, including how long the obligation runs, whether someone refused to disclose income before the case, whether court requests for information were ignored and whether the claim was accepted at once. Refusing to show payslips can therefore cost the payer even if the amount ends up lower.' },
      { q: 'Does German legal aid also cover the other side’s lawyer if I lose?', a: `No. Legal aid (Verfahrenskostenhilfe) pays your own court fees and your own lawyer, fully or against monthly instalments of up to ${EN.num(vkhVater.maxRaten)} payments. If the court orders you to bear the other side’s costs, those remain your responsibility. In maintenance cases, where courts often split costs, this residual risk is real and worth considering before filing.` },
      { q: 'Is there a cheaper way to secure child support than a court case?', a: 'Yes. The Jugendamt becomes the child’s official adviser (Beistand) on a written request from the parent, free of charge, and pursues child support on the child’s behalf (section 1712 BGB). It can also record a parent’s voluntary commitment to pay support for a child under 21 in an enforceable document, without any court. For the parent’s own claims against a spouse, this route does not exist.' },
    ],
    body: (h) => `<h2>The fee logic in one sentence</h2>
<p>German court and lawyer fees in maintenance cases rise with the amount claimed, measured as one year of payments plus arrears. Once you know that value, the statutory fees follow from two official tables. Many expats are surprised that lawyers in Germany usually charge by these tables rather than by the hour, although fee agreements above the statutory level are allowed.</p>
<h2>Step 1: the value of the case</h2>
<p>${h.src('famgkg51', 'Section 51 FamGKG')} takes the amount claimed for the first twelve months after filing, capped at the total claim, and adds arrears due at filing. It makes no difference whether the claim is for a child, a separated spouse or a former spouse.</p>
<ul>
<li>For dynamic child support, expressed as a percentage of the statutory minimum, the minimum amount for the child’s age band at filing is used.</li>
<li>A legal aid application counts as filing if the main application follows promptly once legal aid is decided, so arrears up to then are included.</li>
<li>The fee table is ${h.src('famgkgTabelle', 'Annex 2 to the FamGKG')}; the method is explained on the ${h.a('verfahrenswert', 'value of proceedings')} page.</li>
</ul>
<h2>Step 2: court fee and lawyer fees</h2>
<p>The court charges ${h.num(h.P.famgkg.kv1220_satz, 1)} times the basic fee under no. 1220 of the ${h.src('famgkgKv', 'FamGKG schedule of costs')}, more than the ${h.num(h.P.famgkg.kv1110_satz, 1)} charged for a divorce (see ${h.a('gerichtskosten-scheidung', 'divorce court fees')}). The applicant normally pays it in advance. A lawyer bills under the ${h.src('rvgVv', 'RVG fee schedule')}: procedure fee ${h.num(h.P.rvg.vv3100, 1)}, hearing fee ${h.num(h.P.rvg.vv3104, 1)}, expenses of ${h.pct(h.P.rvg.vv7002_anteil)} up to ${h.eur(h.P.rvg.vv7002_max)}, and ${h.pct(h.P.rvg.ust)} VAT; a settlement adds a ${h.num(h.P.rvg.vv1003, 1)} settlement fee.</p>
${h.table(['Claim', 'Value', `Court (${h.num(h.P.famgkg.kv1220_satz, 1)})`, 'One lawyer', 'Total risk, two lawyers'], [
  [`child support ${h.eur(400)} a month`, h.eur(kind.wert), h.eur(kind.gericht, 2), h.eur(kind.einAnwalt, 2), h.eur(kind.risiko, 2)],
  [`separation ${h.eur(650)} + ${h.eur(1300)} arrears`, h.eur(trennung.wert), h.eur(trennung.gericht, 2), h.eur(trennung.einAnwalt, 2), h.eur(trennung.risiko, 2)],
  [`spousal ${h.eur(1100)} + ${h.eur(3300)} arrears`, h.eur(ehe.wert), h.eur(ehe.gericht, 2), h.eur(ehe.einAnwalt, 2), h.eur(ehe.risiko, 2)],
], 'First instance, statutory fees 2026, lawyer with procedure and hearing fee, expenses and VAT, no settlement', ['l', 'r', 'r', 'r', 'r'])}
<p>With a settlement, one lawyer for the ${h.eur(trennung.wert)} case costs ${h.eur(trennung.mitEinigung, 2)} instead of ${h.eur(trennung.einAnwalt, 2)}, while the court fee drops considerably under the schedule. More on lawyer fees in family matters is on the ${h.a('anwaltskosten-scheidung', 'lawyer fees')} page.</p>
<h2>Step 3: who bears the costs</h2>
<p>Section 243 FamFG gives the court discretion. Besides the outcome, it looks at whether a party refused to provide income information before the case or ignored the court’s requests, and whether a claim was accepted immediately. In practice, costs are often split.</p>
<h2>When money is short</h2>
<p>For child support, the Jugendamt acts free of charge as the child’s Beistand (section 1712 BGB), and under ${h.src('famfg114', 'section 114(4) FamFG')} the child then needs no lawyer. If no support arrives at all, the state ${h.a('unterhaltsvorschuss', 'maintenance advance')} can bridge the gap. Between spouses, an advance on legal costs may be owed by the better-off spouse (section 1360a(4) BGB). Beyond that, the court grants legal aid if the case has reasonable prospects and is not frivolous; the means test follows ${h.src('zpo115', 'section 115 ZPO')} with the allowances of the ${h.src('pkhb2026', 'Legal Aid Notice 2026')}.</p>
<ul>
<li>A mother earning ${h.eur(1900)} net, with a four-year-old and ${h.eur(650)} rent including heating, has ${h.eur(vkhMutter.einzusetzen)} of assessable income: legal aid without instalments.</li>
<li>A single applicant with no dependants on ${h.eur(2300)} net with ${h.eur(750)} rent pays ${h.eur(vkhVater.rate)} a month, for at most ${h.num(vkhVater.maxRaten)} months.</li>
</ul>
<p>Run your own numbers in the ${h.a('prozesskostenhilfe-rechner', 'legal aid calculator')}; the rules are set out under ${h.a('verfahrenskostenhilfe', 'legal aid in family cases')}.</p>
<p>This overview of maintenance court costs in Germany is general information as of 2026, not legal advice; the family court fixes the value of the case, and lawyers may agree fees that differ from the statutory tables.</p>`,
  },
});
