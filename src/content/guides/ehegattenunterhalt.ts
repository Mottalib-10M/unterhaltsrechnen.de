import { defineGuide } from '../../lib/guide-types';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Aufstockung (4.100 € gegen 1.300 €), Alleinverdiener, knappes Einkommen, Rentner. */
const aufstock = ehegattenunterhalt({ pflichtigErwerb: 4100, berechtigtErwerb: 1300 });
const allein = ehegattenunterhalt({ pflichtigErwerb: 4100, berechtigtErwerb: 0 });
const knapp = ehegattenunterhalt({ pflichtigErwerb: 2100, berechtigtErwerb: 0 });
const rentner = ehegattenunterhalt({ pflichtigErwerb: 2600, berechtigtErwerb: 400, pflichtigErwerbstaetig: false });
const E = P.ehegatte;
const S = P.selbstbehalt;

export default defineGuide({
  id: 'ehegattenunterhalt',
  group: 'ehe',
  order: 12,
  mini: 'quote45',
  related: ['ehegattenunterhalt-rechner', 'trennungsunterhalt', 'betreuungsunterhalt', 'selbstbehalt', 'bereinigtes-netto', 'unterhaltsverfahren-kosten'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1570', 'bgb1578b', 'bgb1609'],
  de: {
    slug: 'ehegattenunterhalt',
    nav: 'Ehegattenunterhalt',
    card: 'Nachehelicher Unterhalt: wann er geschuldet ist, die 45-Prozent-Quote, Selbstbehalt und Befristung.',
    title: 'Ehegattenunterhalt 2026: Quote, Selbstbehalt, Befristung',
    description: `Ehegattenunterhalt 2026 nach der Scheidung: Anspruchsgründe der §§ 1570 ff. BGB, Quote ${DE.pct(E.quote_erwerb)}, Selbstbehalt ${DE.eur(S.ehegatte_erwerbstaetig)}, Befristung nach § 1578b BGB erklärt.`,
    h1: 'Ehegattenunterhalt nach der Scheidung',
    intro: 'Nach der Scheidung sorgt grundsätzlich jeder für sich selbst. Unterhalt gibt es nur, wenn einer der gesetzlichen Gründe vorliegt.',
    resume: `Nachehelicher Ehegattenunterhalt ist die Ausnahme, nicht die Regel: Nach § 1569 BGB muss jeder geschiedene Ehegatte zunächst selbst für sich sorgen, und nur wer einen der Gründe der §§ 1570 bis 1576 BGB erfüllt (Kinderbetreuung, Alter, Krankheit, Erwerbslosigkeit, Aufstockung, Ausbildung, Billigkeit), kann Unterhalt verlangen. Die Höhe folgt 2026 der Anmerkung B der Düsseldorfer Tabelle: ${DE.pct(E.quote_erwerb)} der Differenz der bereinigten Erwerbseinkommen, bei sonstigen Einkünften wie Mieten die Hälfte, gegenüber einem Rentner ${DE.pct(E.quote_nicht_erwerbstaetig)}. Verdient der Pflichtige ${DE.eur(4100)} und die geschiedene Frau ${DE.eur(1300)}, ergibt das ${DE.eur(aufstock.unterhalt)} im Monat. Dem Zahlenden müssen mindestens ${DE.eur(S.ehegatte_erwerbstaetig)} bleiben, wenn er arbeitet, sonst ${DE.eur(S.ehegatte_nicht_erwerbstaetig)}. Kindesunterhalt geht vor und wird vorher abgezogen. Das Familiengericht kann den Anspruch nach § 1578b BGB herabsetzen oder befristen, wenn ein unbefristeter Unterhalt unbillig wäre und keine ehebedingten Nachteile bestehen; Wiederheirat des Berechtigten beendet ihn ganz.`,
    faqs: [
      { q: 'Wie lange muss man Ehegattenunterhalt nach der Scheidung zahlen?', a: 'Eine feste Frist nennt das Gesetz nicht. Das Familiengericht prüft nach § 1578b BGB, ob der Unterhalt herabgesetzt oder zeitlich begrenzt wird. Entscheidend sind ehebedingte Nachteile, etwa ein Berufsverzicht wegen der Kinder, und die Dauer der Ehe bis zur Zustellung des Scheidungsantrags. Ohne solche Nachteile wird häufig eine Übergangszeit gewährt, deren Länge sich am Einzelfall orientiert. Der Anspruch endet außerdem mit Wiederheirat oder Tod des Berechtigten (§ 1586 BGB).' },
      { q: 'Wie viel Ehegattenunterhalt bekommt eine Hausfrau ohne eigenes Einkommen?', a: `Rechnerisch ${DE.pct(E.quote_erwerb)} des bereinigten Erwerbseinkommens des anderen, nach Abzug des Kindesunterhalts. Bei ${DE.eur(4100)} netto sind das ${DE.eur(allein.unterhalt)}. Allerdings muss nach der Scheidung jeder eine angemessene Erwerbstätigkeit aufnehmen, soweit kein Grund wie Kinderbetreuung, Alter oder Krankheit entgegensteht (§ 1574 BGB). Wer arbeiten könnte und es nicht tut, muss sich oft ein erzielbares Einkommen anrechnen lassen.` },
      { q: 'Warum beträgt die Unterhaltsquote für Ehegatten nur 45 und nicht 50 Prozent?', a: `Weil dem erwerbstätigen Ehegatten ein Anreiz zum Arbeiten bleiben soll. Die Leitlinien der Oberlandesgerichte in NRW ziehen dafür vorab ${DE.pct(E.erwerbsanreiz)} des bereinigten Erwerbseinkommens ab und teilen den Rest; im Ergebnis stehen jedem ${DE.pct(1 - E.quote_erwerb)} des eigenen und ${DE.pct(E.quote_erwerb)} des fremden Arbeitseinkommens zu. Für Mieten, Zinsen oder Renten gilt dieser Bonus nicht, sie werden hälftig geteilt.` },
      { q: 'Verliert man den Anspruch auf Ehegattenunterhalt bei einem neuen Partner?', a: 'Eine Wiederheirat beendet den Anspruch kraft Gesetzes. Ein bloßes Zusammenleben nicht automatisch, doch eine verfestigte Lebensgemeinschaft ist nach § 1579 Nummer 2 BGB ein Grund, den Unterhalt zu versagen, herabzusetzen oder zu begrenzen. Wann eine Beziehung als verfestigt gilt, beurteilen die Gerichte nach den Umständen, häufig nach Dauer, gemeinsamer Wohnung und Auftreten nach außen. Die Belange gemeinsamer Kinder bleiben dabei zu wahren.' },
      { q: 'Kann man auf nachehelichen Unterhalt im Voraus verzichten?', a: 'Ja, anders als beim Trennungsunterhalt. Nach § 1585c BGB dürfen Ehegatten den Unterhalt für die Zeit nach der Scheidung regeln, auch ganz ausschließen. Wird die Vereinbarung vor Rechtskraft der Scheidung geschlossen, muss sie notariell beurkundet oder im Scheidungsverfahren gerichtlich protokolliert werden. Ein Verzicht, der einen Ehegatten einseitig und erheblich benachteiligt, kann von den Gerichten auf Wirksamkeit und Ausübung überprüft werden.' },
      { q: 'Wer hat beim Ehegattenunterhalt Vorrang, die Kinder oder die Ex-Frau?', a: `Minderjährige Kinder stehen nach § 1609 BGB an erster Stelle. Ihr Zahlbetrag wird vom Einkommen abgezogen, bevor die Quote für den Ehegatten berechnet wird. Danach folgen Elternteile, die ein Kind betreuen, und Ehegatten aus langer Ehe; Ehegatten aus kürzerer Ehe ohne Kinderbetreuung stehen im dritten Rang. Reicht das Geld nicht, gehen die Nachrangigen ganz oder teilweise leer aus, während dem Zahlenden sein Selbstbehalt von ${DE.eur(S.ehegatte_erwerbstaetig)} bleibt.` },
    ],
    body: (h) => `<h2>Eigenverantwortung zuerst</h2>
<p>Mit der Scheidung endet die gegenseitige Unterhaltspflicht der Ehe nicht vollständig, sie verändert ihren Charakter. § 1569 BGB stellt den Grundsatz an den Anfang: Jeder Ehegatte hat nach der Scheidung selbst für seinen Unterhalt zu sorgen. Nur wer das aus einem gesetzlich anerkannten Grund nicht kann, hat einen Anspruch gegen den anderen.</p>
<p>Diese Reihenfolge hat praktische Folgen. Der Berechtigte muss darlegen, warum er nicht oder nicht ausreichend selbst verdienen kann. Wer nach der Trennung keine Arbeit sucht, obwohl er könnte, riskiert, dass das Gericht ihm ein fiktives Einkommen anrechnet. Während der Trennungszeit gelten mildere Regeln; sie stehen auf der Seite zum ${h.a('trennungsunterhalt', 'Trennungsunterhalt')}.</p>
<h2>Die sieben Anspruchsgründe</h2>
<p>Das Gesetz zählt die Gründe abschließend auf. Sie können nacheinander greifen, man spricht dann von einer Unterhaltskette.</p>
<ul>
<li><strong>Betreuung eines gemeinsamen Kindes</strong> (§ 1570 BGB): mindestens drei Jahre nach der Geburt, länger aus Billigkeit. Einzelheiten beim ${h.a('betreuungsunterhalt', 'Betreuungsunterhalt')}.</li>
<li><strong>Alter</strong> (§ 1571 BGB): wenn bei der Scheidung oder später wegen des Alters keine Erwerbstätigkeit mehr erwartet werden kann.</li>
<li><strong>Krankheit oder Gebrechen</strong> (§ 1572 BGB): solange gesundheitliche Gründe eine Arbeit ausschließen.</li>
<li><strong>Erwerbslosigkeit</strong> (§ 1573 Absatz 1 BGB): solange trotz Bemühungen keine angemessene Stelle zu finden ist.</li>
<li><strong>Aufstockung</strong> (§ 1573 Absatz 2 BGB): das eigene Einkommen reicht nicht an den ehelichen Lebensstandard heran. In der Praxis der häufigste Fall.</li>
<li><strong>Ausbildung, Fortbildung, Umschulung</strong> (§ 1575 BGB): für eine wegen der Ehe abgebrochene oder nicht begonnene Ausbildung.</li>
<li><strong>Billigkeit</strong> (§ 1576 BGB): bei sonstigen schwerwiegenden Gründen, wenn eine Versagung grob unbillig wäre.</li>
</ul>
<p>Was eine angemessene Erwerbstätigkeit ist, regelt § 1574 BGB: eine Arbeit, die Ausbildung, Fähigkeiten, früherem Beruf, Alter und Gesundheit entspricht. Die Dauer der Ehe und der Kinderbetreuung fließen in diese Beurteilung ein.</p>
<h2>So wird die Höhe berechnet</h2>
<p>Das Maß des Unterhalts richtet sich nach den ehelichen Lebensverhältnissen (§ 1578 BGB). Die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} übersetzt das in Anmerkung B in eine Quote: ${h.pct(h.P.ehegatte.quote_erwerb)} der Differenz der bereinigten Erwerbseinkommen beider Ehegatten, für sonstige Einkünfte (Mieten, Zinsen, Renten) der Halbteilungsgrundsatz. Ist der Pflichtige nicht erwerbstätig, etwa als Rentner, gilt ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)}.</p>
<p>Die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} gehen rechnerisch einen Umweg und kommen zum selben Ergebnis: Vom Arbeitseinkommen wird vorab ein Erwerbsanreiz von ${h.pct(h.P.ehegatte.erwerbsanreiz)} abgezogen, der Rest wird halbiert. Ausgangspunkt ist immer das ${h.a('bereinigtes-netto', 'bereinigte Nettoeinkommen')}, vermindert um den Zahlbetrag des Kindesunterhalts.</p>
${h.table(['Fall', 'Pflichtiger', 'Berechtigte', 'Quote', 'Unterhalt'], [
  ['Aufstockung, beide arbeiten', h.eur(4100), h.eur(1300), h.pct(h.P.ehegatte.quote_erwerb), h.eur(aufstock.unterhalt)],
  ['Alleinverdiener', h.eur(4100), h.eur(0), h.pct(h.P.ehegatte.quote_erwerb), h.eur(allein.unterhalt)],
  ['knappes Einkommen', h.eur(2100), h.eur(0), h.pct(h.P.ehegatte.quote_erwerb), `${h.eur(knapp.unterhalt)} (Selbstbehalt)`],
  ['Pflichtiger in Rente', h.eur(2600), h.eur(400), h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig), h.eur(rentner.unterhalt)],
], 'Vom Rechner ermittelt, ohne Kindesunterhalt und ohne Vorsorgeunterhalt', ['l', 'r', 'r', 'r', 'r'])}
<p>In der dritten Zeile ergäbe die Quote ${h.eur(knapp.quote)}. Der Zahlende behielte dann aber weniger als seinen Selbstbehalt, deshalb ist nur ${h.eur(knapp.unterhalt)} durchsetzbar. Bei sehr hohen Einkommen, einem Familieneinkommen über ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)}, vermuten die Gerichte, dass ein Teil gespart wurde; dann kann der Bedarf konkret nach den tatsächlichen Ausgaben der Ehe dargelegt werden.</p>
<h2>Selbstbehalt und Mindestbedarf</h2>
<p>Gegenüber dem geschiedenen Ehegatten muss dem Pflichtigen der eheangemessene ${h.a('selbstbehalt', 'Selbstbehalt')} bleiben: ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} bei Erwerbstätigkeit, ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)} ohne. Darin stecken bis zu ${h.eur(h.P.selbstbehalt.ehegatte_warmmiete)} Warmmiete; liegen die angemessenen Wohnkosten höher, soll der Betrag steigen.</p>
<p>Auf der anderen Seite steht ein Existenzminimum des Berechtigten, das die Tabelle in der Regel mit ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_erwerbstaetig)} bei Erwerbstätigkeit und ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_nicht_erwerbstaetig)} ohne ansetzt. Zum Unterhalt gehören außerdem die Kosten der Kranken- und Pflegeversicherung und bei den Ansprüchen aus §§ 1570 bis 1573 und 1576 BGB ein Altersvorsorgeunterhalt, der in einem zweistufigen Verfahren berechnet wird und den reinen Quotenbetrag mindert.</p>
<h2>Herabsetzung und Befristung nach § 1578b BGB</h2>
<p>${h.src('bgb1578b', '§ 1578b BGB')} erlaubt es, den Unterhalt auf den angemessenen Lebensbedarf herabzusetzen, zeitlich zu begrenzen oder beides zu verbinden. Nach den Leitlinien ist das die Ausnahme, nicht die Regel. Das Gericht prüft es, wenn der Pflichtige dazu vorträgt; er trägt auch die Beweislast.</p>
<p>Im Mittelpunkt stehen ehebedingte Nachteile: Hat die Berechtigte wegen der Kinder oder der Haushaltsführung beruflich zurückgesteckt und verdient deshalb heute weniger, steht das einer Begrenzung regelmäßig entgegen. Fehlen solche Nachteile, wägt das Gericht ab, besonders nach der Ehedauer bis zur Zustellung des Scheidungsantrags. Der angemessene Lebensbedarf, auf den herabgesetzt wird, kann sich an ${h.eur(h.P.selbstbehalt.angemessen)} orientieren und darf ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_nicht_erwerbstaetig)} nicht unterschreiten. Unterhalt wegen Kinderbetreuung nach ${h.src('bgb1570', '§ 1570 BGB')} wird nicht nach § 1578b befristet, kann aber herabgesetzt werden.</p>
<h2>Rang, Ende und Vereinbarungen</h2>
<p>Reicht das Einkommen nicht für alle, entscheidet die Rangfolge des ${h.src('bgb1609', '§ 1609 BGB')}. Minderjährige Kinder kommen zuerst, danach kinderbetreuende Elternteile und Ehegatten aus langer Ehe, erst dann übrige geschiedene Ehegatten. Eine Wiederheirat des Berechtigten beendet den Anspruch (§ 1586 BGB); eine verfestigte neue Lebensgemeinschaft kann ihn nach § 1579 BGB beschränken oder ganz entfallen lassen.</p>
<p>Ehegatten können den nachehelichen Unterhalt vertraglich regeln. Vor Rechtskraft der Scheidung braucht eine solche Vereinbarung die notarielle Form oder ein gerichtliches Protokoll (§ 1585c BGB). Den eigenen Fall durchrechnen lässt sich mit dem ${h.a('ehegattenunterhalt-rechner', 'Ehegattenunterhalt-Rechner')}; was ein gerichtliches Verfahren kostet, steht bei den ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')}.</p>
<p>Diese Seite gibt eine allgemeine Information über den Ehegattenunterhalt nach deutschem Recht, Stand 2026, und keine Rechtsberatung; ob und wie lange im Einzelfall Unterhalt geschuldet ist, entscheidet das Familiengericht.</p>`,
  },
  en: {
    slug: 'spousal-maintenance',
    nav: 'Spousal maintenance',
    card: 'Maintenance after a German divorce: when it is owed, the 45 percent rule, self-retention and time limits.',
    title: 'Spousal Maintenance Germany 2026: After Divorce, 45% Rule',
    description: `Spousal maintenance in Germany 2026 after divorce: the legal grounds, the ${EN.pct(E.quote_erwerb)} quota, ${EN.eur(S.ehegatte_erwerbstaetig)} self-retention, time limits under section 1578b of the Civil Code.`,
    h1: 'Spousal maintenance after a German divorce',
    intro: 'German law expects each former spouse to support themselves after divorce. Maintenance is the exception and needs a specific legal ground.',
    resume: `In Germany, post-divorce spousal maintenance (nachehelicher Ehegattenunterhalt) is owed only if the claimant cannot support themselves for one of the reasons listed in sections 1570 to 1576 of the Civil Code (BGB): caring for a joint child, age, illness, unemployment, an income gap compared with the marriage (top-up maintenance), retraining, or fairness. The starting rule in section 1569 BGB is self-reliance. When a claim exists, the 2026 Düsseldorf Table sets the amount at ${EN.pct(E.quote_erwerb)} of the difference between both spouses’ adjusted earned incomes, half of other income such as rent, and ${EN.pct(E.quote_nicht_erwerbstaetig)} if the payer is retired. With ${EN.eur(4100)} against ${EN.eur(1300)}, that is ${EN.eur(aufstock.unterhalt)} a month. The payer always keeps a self-retention (Selbstbehalt) of ${EN.eur(S.ehegatte_erwerbstaetig)} when working, ${EN.eur(S.ehegatte_nicht_erwerbstaetig)} when not. Child support is deducted first because children rank higher. The family court (Familiengericht) can reduce or time-limit the claim under section 1578b BGB, and remarriage of the recipient ends it.`,
    faqs: [
      { q: 'Does a German divorce automatically give the lower earner maintenance?', a: 'No. Unlike some legal systems, German law starts from self-reliance after divorce (section 1569 BGB). The lower earner must show one of the statutory grounds, such as looking after a young child, age, illness, failing to find suitable work, or a remaining gap to the marital standard of living. Without such a ground there is no claim, however long the marriage lasted.' },
      { q: 'How is spousal maintenance worked out if my ex-spouse earns nothing?', a: `The court takes ${EN.pct(E.quote_erwerb)} of your adjusted net earnings after child support. On ${EN.eur(4100)} that gives ${EN.eur(allein.unterhalt)} a month, provided you keep at least ${EN.eur(S.ehegatte_erwerbstaetig)}. However, the recipient is expected to take up suitable work after divorce unless childcare, age or health prevents it, and a court may treat achievable earnings as if they were earned.` },
      { q: 'My salary is paid by a company abroad. Does that change spousal maintenance in Germany?', a: 'The method stays the same: the court looks at the net income actually available after the taxes and social contributions you really pay, converted into euros and spread over twelve months. Bonuses, housing allowances or a company car can count as income. Whether German law governs a marriage with links to several countries is a separate conflict-of-laws question that this page does not answer.' },
      { q: 'Can a German court put an end date on spousal maintenance?', a: 'Yes. Section 1578b BGB lets the court reduce the amount, limit it in time, or both, where unlimited maintenance would be unfair. It weighs career disadvantages caused by the marriage, especially time spent raising children, and the length of the marriage up to service of the divorce petition. The payer has to raise and prove the grounds. Maintenance for childcare under section 1570 BGB is not time-limited this way.' },
      { q: 'What happens to spousal maintenance if my former partner remarries or moves in with someone?', a: 'Remarriage, or entering a registered partnership, ends the claim by law (section 1586 BGB); arrears already due remain payable. Living with a new partner does not end it automatically, but a settled, long-term relationship is a ground for refusing, reducing or limiting maintenance under section 1579 BGB. Courts look at the facts, for example how long the couple have lived together.' },
    ],
    body: (h) => `<h2>The German starting point: self-reliance</h2>
<p>Many people arriving from common-law countries expect a divorce court to share income for years. German law is stricter. Section 1569 of the Civil Code (BGB) says that after divorce each spouse must provide for themselves. Only a person who cannot do so for a reason recognised by statute has a maintenance claim against the other.</p>
<p>The burden is therefore on the claimant to explain why they cannot earn enough. During the separation year, before the divorce is final, the rules are more generous; they are covered on the page on ${h.a('trennungsunterhalt', 'separation maintenance')}.</p>
<h2>The statutory grounds</h2>
<ul>
<li><strong>Caring for a joint child</strong> (section 1570): at least three years after birth, longer where fair. See ${h.a('betreuungsunterhalt', 'childcare maintenance')}.</li>
<li><strong>Age</strong> (section 1571): no work can be expected because of age at divorce or later.</li>
<li><strong>Illness or disability</strong> (section 1572).</li>
<li><strong>Unemployment</strong> (section 1573(1)): no suitable job can be found despite real efforts.</li>
<li><strong>Top-up maintenance</strong> (Aufstockungsunterhalt, section 1573(2)): the claimant works but earns less than the marital standard. This is the most common case.</li>
<li><strong>Training</strong> (section 1575): finishing education given up because of the marriage.</li>
<li><strong>Fairness</strong> (section 1576): other serious reasons where refusal would be grossly unfair.</li>
</ul>
<p>“Suitable work” under section 1574 means work matching training, skills, previous jobs, age and health. A spouse who gave up a career in Germany to follow a partner posted abroad may argue that the marriage itself shaped what is suitable now.</p>
<h2>The 45 percent rule in practice</h2>
<p>The amount follows the marital living standard (section 1578 BGB). Note B of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} turns this into a formula: ${h.pct(h.P.ehegatte.quote_erwerb)} of the gap between both adjusted earned incomes, half of other income such as rent or interest, and ${h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig)} where the payer no longer works. The ${h.src('olgLeitlinien', 'NRW court guidelines')} reach the same figure by first allowing the earner a work incentive of ${h.pct(h.P.ehegatte.erwerbsanreiz)} and then halving. Income means ${h.a('bereinigtes-netto', 'adjusted net income')} after child support.</p>
${h.table(['Situation', 'Payer', 'Recipient', 'Rate', 'Maintenance'], [
  ['both work, top-up', h.eur(4100), h.eur(1300), h.pct(h.P.ehegatte.quote_erwerb), h.eur(aufstock.unterhalt)],
  ['single earner', h.eur(4100), h.eur(0), h.pct(h.P.ehegatte.quote_erwerb), h.eur(allein.unterhalt)],
  ['low income', h.eur(2100), h.eur(0), h.pct(h.P.ehegatte.quote_erwerb), `${h.eur(knapp.unterhalt)} (capped)`],
  ['payer retired', h.eur(2600), h.eur(400), h.pct(h.P.ehegatte.quote_nicht_erwerbstaetig), h.eur(rentner.unterhalt)],
], 'Computed by the site’s engine, no child support, no pension-contribution maintenance', ['l', 'r', 'r', 'r', 'r'])}
<p>In the low-income case the formula would give ${h.eur(knapp.quote)}, but the payer may not fall below the self-retention, so only ${h.eur(knapp.unterhalt)} can be claimed. Where joint family income exceeds ${h.eur(h.P.ehegatte.konkreter_bedarf_ab_familieneinkommen)} a month, courts assume part was saved and the claimant can set out actual marital spending instead.</p>
<h2>What the payer keeps, what the recipient needs</h2>
<p>Against a former spouse the payer keeps ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} when working and ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)} otherwise, including up to ${h.eur(h.P.selbstbehalt.ehegatte_warmmiete)} for rent with heating; see ${h.a('selbstbehalt', 'self-retention')}. The table treats ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_nicht_erwerbstaetig)} (non-working) or ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_erwerbstaetig)} (working) as the usual subsistence minimum of the recipient. Health and care insurance costs belong to the claim, and for most grounds so does a pension-contribution element (Altersvorsorgeunterhalt), which lowers the cash amount in a two-step calculation.</p>
<h2>Reduction and time limits</h2>
<p>Under ${h.src('bgb1578b', 'section 1578b BGB')} the court may cut maintenance to an “appropriate” level, set an end date, or combine both. The NRW guidelines stress that this is an exception, raised and proven by the payer. Career disadvantages caused by the marriage usually block a limit. Without them, the length of the marriage until service of the petition weighs heavily. The reduced level can follow the ${h.eur(h.P.selbstbehalt.angemessen)} reference amount but not drop below ${h.eur(h.P.selbstbehalt.existenzminimum_ehegatte_nicht_erwerbstaetig)}. Childcare maintenance under ${h.src('bgb1570', 'section 1570')} cannot be time-limited this way.</p>
<h2>Ranking, end of the claim, agreements</h2>
<p>If money is short, ${h.src('bgb1609', 'section 1609 BGB')} sets the order: minor children first, then parents caring for a child and spouses from long marriages, then other former spouses. Remarriage ends the claim (section 1586); a settled new relationship can reduce or exclude it (section 1579). Spouses may agree on post-divorce maintenance, including a waiver; before the divorce is final, the agreement must be notarised or recorded by the court (section 1585c). The ${h.a('ehegattenunterhalt-rechner', 'spousal maintenance calculator')} applies the formula to your figures, and the ${h.a('unterhaltsverfahren-kosten', 'cost of maintenance proceedings')} page shows what a court case costs.</p>
<p>This page is general information on spousal maintenance under German law as of 2026, not legal advice; whether and for how long maintenance is owed is for the family court to decide.</p>`,
  },
});
