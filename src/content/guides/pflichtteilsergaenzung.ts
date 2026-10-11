import { defineGuide } from '../../lib/guide-types';
import { erbfolge, pflichtteilsergaenzung, ergaenzungsfaktor } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Bruch aus einer Quote (0,25 → „1/4“), nur zur Anzeige. */
const br = (q: number) => {
  for (const d of [1, 2, 3, 4, 6, 8, 12, 16, 24, 32]) { const n = Math.round(q * d); if (Math.abs(n / d - q) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`; }
  return q.toFixed(3);
};
const E = P.erbrecht;
/** Beispiel aus dem Motor: verwitweter Vater, zwei Kinder, Nachlass 180.000 €, Schenkung 240.000 € an die neue Partnerin. */
const N = 180000;
const S = 240000;
const fam = erbfolge({ verheiratet: false, kinder: 2, nachlass: N });
const kind = fam.anteile.find((a) => a.wer === 'kind')!;
const quote = kind.quoteJe * E.pflichtteil_quote;
const jahre = [0, 1, 3, 5, 7, 9, E.ergaenzung_jahre];
const vierJ = pflichtteilsergaenzung(S, 4, quote);
const nullJ = pflichtteilsergaenzung(S, 0, quote);
const ehefrau = pflichtteilsergaenzung(S, 12, quote, true);
const zehnJ = pflichtteilsergaenzung(S, E.ergaenzung_jahre, quote);

export default defineGuide({
  id: 'pflichtteilsergaenzung',
  group: 'erbe',
  order: 22,
  mini: 'abschmelzung',
  related: ['pflichtteil', 'pflichtteilsrechner', 'gesetzliche-erbfolge', 'ehegattenerbrecht', 'erbschaftsteuer-freibetraege'],
  sources: ['bgb2325', 'bgb2303', 'erbstg14'],
  de: {
    slug: 'pflichtteilsergaenzung',
    nav: 'Pflichtteilsergänzung',
    card: 'Wie Schenkungen vor dem Tod den Pflichtteil erhöhen: Abschmelzung je Jahr, Ehegatten-Ausnahme, Nießbrauch.',
    title: `Pflichtteilsergänzung 2026: ${E.ergaenzung_jahre} Jahre, Abschmelzung je Jahr`,
    description: `Pflichtteilsergänzung 2026 nach § 2325 BGB: Schenkungen zählen ${DE.num(E.ergaenzung_jahre)} Jahre lang, je Jahr ${DE.pct(E.ergaenzung_abschmelzung_jahr)} weniger. Ehegatten-Ausnahme, Nießbrauch, Rechenbeispiel mit Tabelle.`,
    h1: 'Pflichtteilsergänzung: wenn zu Lebzeiten verschenkt wurde',
    intro: 'Wer sein Vermögen vor dem Tod verschenkt, kann den Pflichtteil nicht einfach aushebeln. Das Gesetz rechnet die Schenkung zum Nachlass, mit jedem Jahr etwas weniger.',
    resume: `Hat der Erblasser zu Lebzeiten einem Dritten etwas geschenkt, kann ein Pflichtteilsberechtigter nach § 2325 BGB zusätzlich zum Pflichtteil eine Ergänzung verlangen: den Betrag, um den sein Pflichtteil steigen würde, wenn das Geschenk noch im Nachlass wäre. Die Schenkung zählt im ersten Jahr vor dem Erbfall voll, danach für jedes weitere Jahr um ${DE.pct(E.ergaenzung_abschmelzung_jahr)} weniger; sind ${DE.num(E.ergaenzung_jahre)} Jahre seit der Leistung verstrichen, bleibt sie ganz außer Betracht. Schenkt ein verwitweter Vater mit zwei Kindern seiner neuen Partnerin ${DE.eur(S)} und stirbt er vier volle Jahre später, werden noch ${DE.pct(vierJ.faktor)} angesetzt, also ${DE.eur(vierJ.angerechnet)}. Das enterbte Kind mit einer Pflichtteilsquote von ${br(quote)} erhält daraus ${DE.eur(vierJ.ergaenzung)} zusätzlich zu seinem Pflichtteil aus dem Nachlass. Für Schenkungen an den Ehegatten gilt die Abschmelzung nicht: Die Frist beginnt nicht vor Auflösung der Ehe, zählt also bei einer bis zum Tod bestehenden Ehe voll. Behält sich der Schenker die Nutzung vor, etwa durch Nießbrauch, sehen die Gerichte die Leistung häufig als noch nicht erbracht an.`,
    faqs: [
      { q: 'Zählt bei der Pflichtteilsergänzung das Datum des Schenkungsvertrags oder der Übergabe?', a: `Das Gesetz stellt auf die Leistung des verschenkten Gegenstands ab (§ 2325 Abs. 3 BGB). Bei einer Immobilie ist das nach verbreiteter Rechtsprechung die Eintragung im Grundbuch, nicht der notarielle Vertrag. Bei Geld zählt der Zahlungseingang. Liegen zwischen Vertrag und Umschreibung mehrere Monate, kann das über einen Abschmelzungsschritt von ${DE.pct(E.ergaenzung_abschmelzung_jahr)} entscheiden.` },
      { q: 'Gilt die Zehnjahresfrist der Pflichtteilsergänzung auch bei Schenkungen an den Ehegatten?', a: `Nein. Nach § 2325 Abs. 3 Satz 3 BGB beginnt die Frist bei Schenkungen an den Ehegatten nicht vor Auflösung der Ehe. Hält die Ehe bis zum Tod, zählt die Schenkung deshalb in voller Höhe, auch wenn sie zwanzig Jahre zurückliegt. Bei ${DE.eur(S)} an die Ehefrau und einer Quote von ${br(quote)} ergibt das eine Ergänzung von ${DE.eur(ehefrau.ergaenzung)}. Nach einer Scheidung läuft die Frist ab Rechtskraft.` },
      { q: 'Beginnt die Frist bei einer Schenkung unter Nießbrauchsvorbehalt?', a: 'Nach der Rechtsprechung des Bundesgerichtshofs in der Regel nicht, solange sich der Schenker die Nutzung des Gegenstands im Wesentlichen vorbehält, etwa durch einen umfassenden Nießbrauch an dem verschenkten Haus. Er hat den Genuss dann noch nicht aufgegeben. Bei einem Wohnrecht nur an einem Teil der Immobilie wird im Einzelfall beurteilt, ob die Frist läuft. Eine pauschale Antwort gibt es nicht.' },
      { q: 'Wie wird ein verschenktes Haus bei der Pflichtteilsergänzung bewertet?', a: 'Nach dem Niederstwertprinzip des § 2325 Abs. 2 BGB: Angesetzt wird der Wert zur Zeit des Erbfalls, war er bei der Schenkung niedriger, aber nur dieser niedrigere Wert. Geld und andere verbrauchbare Sachen zählen mit dem Wert zur Zeit der Schenkung. Ein vorbehaltener Nießbrauch kann den Wert der Schenkung mindern. Für Immobilien ist meist ein Gutachten nötig.' },
      { q: 'Von wem kann ich die Pflichtteilsergänzung verlangen, wenn der Nachlass leer ist?', a: 'Zunächst vom Erben. Ist der Erbe zur Ergänzung nicht verpflichtet, etwa weil der Nachlass nicht reicht und er selbst pflichtteilsberechtigt ist, kann der Berechtigte vom Beschenkten die Herausgabe des Geschenks verlangen, soweit der Betrag fehlt (§ 2329 BGB). Der Beschenkte kann die Herausgabe durch Zahlung abwenden. Bei mehreren Beschenkten haftet zuerst der zuletzt Beschenkte.' },
      { q: 'Fallen Geburtstagsgeschenke unter die Pflichtteilsergänzung?', a: 'Übliche Gelegenheitsgeschenke in der Regel nicht. Nach § 2330 BGB sind Schenkungen ausgenommen, mit denen einer sittlichen Pflicht oder einer auf den Anstand zu nehmenden Rücksicht entsprochen wird, also typische Geschenke zu Geburtstagen, Hochzeiten oder Weihnachten in einem Umfang, der zu den Verhältnissen des Schenkers passt. Größere Geldbeträge oder eine Wohnung fallen nicht darunter, auch wenn sie zu einem Fest übergeben werden.' },
    ],
    body: (h) => `<h2>Wozu es die Ergänzung gibt</h2>
<p>Der Pflichtteil wird aus dem Nachlass am Todestag berechnet. Ohne Ergänzung könnte jeder das Recht seiner Kinder aushöhlen, indem er vorher Haus, Depot oder Firma verschenkt. Deshalb fingiert ${h.src('bgb2325', '§ 2325 BGB')}, das verschenkte Vermögen sei noch da, und gibt dem Pflichtteilsberechtigten den Unterschiedsbetrag. Den Anspruch hat, wer nach ${h.src('bgb2303', '§ 2303 BGB')} pflichtteilsberechtigt ist, auch dann, wenn er als Erbe die Hälfte seines gesetzlichen Erbteils erhalten hat (§ 2326 BGB).</p>
<h2>Die Abschmelzung Jahr für Jahr</h2>
<p>Nach § 2325 Abs. 3 BGB zählt eine Schenkung innerhalb des ersten Jahres vor dem Erbfall voll, in jedem weiteren Jahr um ${h.pct(h.P.erbrecht.ergaenzung_abschmelzung_jahr, 0)} weniger. Nach ${h.num(h.P.erbrecht.ergaenzung_jahre)} Jahren seit der Leistung bleibt sie unberücksichtigt. Man spricht von der Abschmelzung oder Pro-rata-Regel: Je näher die Schenkung am Tod liegt, desto stärker wirkt sie sich aus.</p>
<p>Unser Beispiel: Ein verwitweter Vater mit zwei Kindern schenkt seiner neuen Partnerin ${h.eur(S)} und setzt sie im Testament als Alleinerbin ein. Beim Tod sind noch ${h.eur(N)} vorhanden. Ein Kind hätte gesetzlich ${br(kind.quoteJe)} geerbt, sein Pflichtteil beträgt ${br(quote)} des Nachlasses, also ${h.eur(kind.pflichtteilJe)}. Dazu kommt die Ergänzung, abhängig davon, wie lange die Schenkung zurückliegt:</p>
${h.table(['Volle Jahre seit der Schenkung', 'Angesetzt', 'Angerechneter Wert', 'Ergänzung je Kind'], jahre.map((j) => {
  const e = pflichtteilsergaenzung(S, j, quote);
  return [String(j), h.pct(ergaenzungsfaktor(j), 0), h.eur(e.angerechnet), h.eur(e.ergaenzung)];
}), 'Vom Pflichtteilsrechner ermittelt, Pflichtteilsquote je Kind ' + br(quote))}
<p>Stirbt der Vater im ersten Jahr nach der Schenkung, erhält jedes Kind ${h.eur(nullJ.ergaenzung)} zusätzlich, nach ${h.num(h.P.erbrecht.ergaenzung_jahre)} vollen Jahren ${h.eur(zehnJ.ergaenzung)}. Den Betrag für Ihre Zahlen liefert der Mini-Rechner oben oder der ${h.a('pflichtteilsrechner', 'Pflichtteilsrechner')}.</p>
<h2>Ausnahme Ehegatte: die Frist läuft nicht</h2>
<p>Bei Schenkungen an den Ehegatten beginnt die Frist nach dem letzten Satz des § 2325 Abs. 3 BGB nicht vor Auflösung der Ehe. Solange die Ehe bis zum Tod besteht, wird nichts abgeschmolzen: ${h.eur(S)} an die Ehefrau, zwölf Jahre vor dem Tod verschenkt, zählen voll, die Ergänzung je Kind beträgt im Beispiel ${h.eur(ehefrau.ergaenzung)}. Für Kinder aus einer früheren Beziehung ist das oft der entscheidende Punkt. Das Erbrecht des überlebenden Ehegatten selbst erklärt die Seite zum ${h.a('ehegattenerbrecht', 'Ehegattenerbrecht')}.</p>
<h2>Nießbrauch und Wohnrecht</h2>
<p>Das Gesetz spricht von der Leistung des verschenkten Gegenstands. Die Rechtsprechung versteht das so, dass der Schenker den Genuss tatsächlich aufgegeben haben muss. Behält er sich an einem verschenkten Haus einen umfassenden Nießbrauch vor, wohnt also weiter darin oder kassiert die Miete, beginnt die Frist deshalb in der Regel nicht. Bei einem Wohnrecht an einzelnen Räumen sehen die Gerichte das differenzierter und entscheiden nach dem Umfang der vorbehaltenen Nutzung. Wer mit einer Übertragung unter Vorbehalt rechnet, sollte also nicht annehmen, dass die ${h.num(h.P.erbrecht.ergaenzung_jahre)} Jahre schon laufen.</p>
<h2>Bewertung und Anspruchsgegner</h2>
<ul>
<li>Geld und verbrauchbare Sachen zählen mit dem Wert zur Zeit der Schenkung, andere Gegenstände mit dem Wert beim Erbfall, höchstens aber mit dem niedrigeren Wert bei der Schenkung (§ 2325 Abs. 2 BGB).</li>
<li>Hat der Berechtigte selbst ein Geschenk erhalten, wird es dem Nachlass hinzugerechnet und auf seine Ergänzung angerechnet (§ 2327 BGB).</li>
<li>Anstandsschenkungen zu Festen bleiben außer Betracht (§ 2330 BGB).</li>
<li>Kann der Erbe nicht in Anspruch genommen werden, haftet der Beschenkte mit dem Geschenk (§ 2329 BGB).</li>
</ul>
<p>Eine Parallele gibt es im Steuerrecht: Auch die Erbschaftsteuer rechnet Schenkungen derselben Person über ${h.num(h.P.erbst.zusammenrechnung_jahre)} Jahre zusammen (${h.src('erbstg14', '§ 14 ErbStG')}), allerdings ohne Abschmelzung; die beiden Fristen sind voneinander unabhängig. Die Grundlagen des Pflichtteils stehen beim ${h.a('pflichtteil', 'Pflichtteil')}. Diese Seite zur Pflichtteilsergänzung ist allgemeine Information, keine Rechtsberatung zu einer konkreten Schenkung.</p>`,
  },
  en: {
    slug: 'gift-top-up-claim',
    nav: 'Gift top-up claim',
    card: 'How lifetime gifts increase a German compulsory share: the yearly reduction, the spouse exception, usufruct.',
    title: `Gift Top-Up Claim Germany 2026: The ${E.ergaenzung_jahre}-Year Rule Explained`,
    description: `German gift top-up claim 2026 (section 2325 BGB): lifetime gifts count for ${EN.num(E.ergaenzung_jahre)} years, ${EN.pct(E.ergaenzung_abschmelzung_jahr)} less each year. The spouse exception, usufruct, worked example.`,
    h1: 'The gift top-up claim: when the estate was given away in advance',
    intro: 'Giving assets away before death does not simply defeat a German compulsory share. The law adds the gift back to the estate, a little less each year.',
    resume: `If the deceased gave something away to a third party during their lifetime, a person entitled to a compulsory share in Germany can claim a top-up (Pflichtteilsergänzung) under section 2325 of the Civil Code (BGB): the amount by which their compulsory share would rise if the gift were still part of the estate. A gift counts in full within the first year before death and ${EN.pct(E.ergaenzung_abschmelzung_jahr)} less for every further year; once ${EN.num(E.ergaenzung_jahre)} years have passed since it was performed, it is ignored. Suppose a widowed father of two gives his new partner ${EN.eur(S)} and dies four full years later: ${EN.pct(vierJ.faktor)} still counts, which is ${EN.eur(vierJ.angerechnet)}. A disinherited child with a compulsory fraction of ${br(quote)} receives ${EN.eur(vierJ.ergaenzung)} from it, on top of the compulsory share out of the estate itself. Gifts to a spouse are not reduced: the period does not start before the marriage ends, so for a marriage lasting until death the gift counts in full. Where the donor keeps the use of the asset, for example through a usufruct (Nießbrauch), courts often treat the gift as not yet performed.`,
    faqs: [
      { q: 'Does the ten-year period start with the gift contract or with the transfer?', a: `The law refers to performance of the gift (section 2325(3) BGB). For German real estate, case law widely takes this to be registration in the land register (Grundbuch) rather than signing the notarial deed. For money it is receipt of the payment. A delay of several months between contract and registration can cost a full ${EN.pct(E.ergaenzung_abschmelzung_jahr)} step.` },
      { q: 'Do gifts to a spouse fall away after ten years in Germany?', a: `No. Under the last sentence of section 2325(3) BGB the period does not start before the marriage is dissolved. If the couple stays married until death, the gift counts in full however old it is. In this page’s example, ${EN.eur(S)} given to a wife twelve years earlier still produces a top-up of ${EN.eur(ehefrau.ergaenzung)} per child. After a divorce, the period runs from the divorce becoming final.` },
      { q: 'Does the period run if my parent kept a life interest in the house?', a: 'According to case law of the Federal Court of Justice (Bundesgerichtshof), as a rule it does not, as long as the donor essentially kept the use of the asset, for example through a comprehensive usufruct over the house. The donor has then not yet given up enjoyment of it. Where only a right to live in part of the property was reserved, courts look at the individual case. There is no blanket answer.' },
      { q: 'Can I claim the top-up from the person who received the gift?', a: 'Primarily the claim is against the heir. If the heir is not obliged to pay the top-up, typically because the estate is insufficient and the heir is entitled to a compulsory share as well, the claimant can demand the gift itself from the recipient to cover the shortfall (section 2329 BGB). The recipient can avoid handing it over by paying the missing amount. Among several recipients, the most recent is liable first.' },
      { q: 'Do ordinary birthday or wedding presents count towards the top-up claim?', a: 'Usually not. Section 2330 BGB exempts gifts made out of moral duty or customary decency, such as presents for birthdays, weddings or Christmas on a scale matching the donor’s circumstances. A deposit for a child’s flat or a large cash transfer is a different matter, even if handed over at a family celebration. Where the line lies is ultimately for the courts.' },
    ],
    body: (h) => `<h2>Why the top-up exists</h2>
<p>A compulsory share is calculated from what is left on the day of death. Without a correction, anyone could hollow out their children’s rights by giving away the house, the portfolio or the company beforehand. ${h.src('bgb2325', 'Section 2325 BGB')} therefore treats the gift as if it were still in the estate and awards the claimant the difference. The claim belongs to anyone entitled under ${h.src('bgb2303', 'section 2303 BGB')}, even if they inherited half their statutory share as heir (section 2326 BGB).</p>
<h2>The sliding scale</h2>
<p>Section 2325(3) BGB counts a gift in full within the first year before death and ${h.pct(h.P.erbrecht.ergaenzung_abschmelzung_jahr, 0)} less in each further year. After ${h.num(h.P.erbrecht.ergaenzung_jahre)} years from performance the gift no longer counts. German lawyers call this the pro rata rule: the closer the gift was to death, the more of it counts.</p>
<p>The example: a widowed father with two children gives his new partner ${h.eur(S)} and names her sole heir in his will. At his death ${h.eur(N)} remains. Each child would have inherited ${br(kind.quoteJe)} by law, so each compulsory share is ${br(quote)} of the estate, ${h.eur(kind.pflichtteilJe)}. The top-up comes on top, depending on how long ago the gift was made:</p>
${h.table(['Full years since the gift', 'Counted', 'Value counted', 'Top-up per child'], jahre.map((j) => {
  const e = pflichtteilsergaenzung(S, j, quote);
  return [String(j), h.pct(ergaenzungsfaktor(j), 0), h.eur(e.angerechnet), h.eur(e.ergaenzung)];
}), 'Computed by the compulsory share calculator, compulsory fraction per child ' + br(quote))}
<p>If the father dies within the first year after the gift, each child gets ${h.eur(nullJ.ergaenzung)} extra; after ${h.num(h.P.erbrecht.ergaenzung_jahre)} full years, ${h.eur(zehnJ.ergaenzung)}. Use the mini calculator above or the ${h.a('pflichtteilsrechner', 'compulsory share calculator')} for your own figures.</p>
<h2>The spouse exception</h2>
<p>For gifts to a spouse, the last sentence of section 2325(3) BGB says the period does not begin before the marriage is dissolved. A marriage that lasts until death means no reduction at all: ${h.eur(S)} given to the wife twelve years before death counts in full, producing ${h.eur(ehefrau.ergaenzung)} per child in the example. For children from an earlier relationship this is often the decisive point. The survivor’s own position is covered under ${h.a('ehegattenerbrecht', 'spouse’s inheritance')}.</p>
<h2>Usufruct and residence rights</h2>
<p>The statute speaks of the gift being performed. Case law reads this as requiring the donor to have actually given up enjoyment of the asset. A parent who transfers a house but keeps a comprehensive usufruct (Nießbrauch), continuing to live there or to collect the rent, has therefore usually not started the clock. Where only a right to live in some rooms was kept, courts take a more nuanced view based on how much use was reserved. Expat families who transferred German property to children while keeping it as a holiday home should not assume the ${h.num(h.P.erbrecht.ergaenzung_jahre)} years are running.</p>
<h2>Valuation and who pays</h2>
<ul>
<li>Money and consumable items count at their value when given; other assets at their value at death, capped at the lower value at the time of the gift (section 2325(2) BGB).</li>
<li>A gift the claimant received personally is added to the estate and set against their top-up (section 2327 BGB).</li>
<li>Customary presents for celebrations are ignored (section 2330 BGB).</li>
<li>If the heir cannot be made to pay, the recipient is liable up to the value of the gift (section 2329 BGB).</li>
</ul>
<p>Inheritance tax has a separate, similar-looking rule: gifts from the same person are aggregated over ${h.num(h.P.erbst.zusammenrechnung_jahre)} years (${h.src('erbstg14', 'section 14 ErbStG')}), without any sliding scale. The two periods are independent of each other. The basics of the claim itself are on the ${h.a('pflichtteil', 'compulsory share')} page. This explanation of the gift top-up claim is general information, not legal advice on any specific gift.</p>`,
  },
});
