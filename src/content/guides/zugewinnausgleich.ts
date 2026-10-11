import { defineGuide } from '../../lib/guide-types';
import { zugewinnausgleich } from '../../lib/engine/vermoegen';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
/** Grundfall: A baut während der Ehe deutlich mehr Vermögen auf als B. */
const grund = zugewinnausgleich({ anfangA: 15000, endA: 135000, anfangB: 10000, endB: 40000 });
/** B erbt während der Ehe 60.000 € (§ 1374 Abs. 2 BGB): mit und ohne Hinzurechnung zum Anfangsvermögen. */
const erbe = zugewinnausgleich({ anfangA: 5000, endA: 75000, anfangB: 60000, endB: 95000 });
const ohneErbe = zugewinnausgleich({ anfangA: 5000, endA: 75000, anfangB: 0, endB: 95000 });
/** A startet mit 20.000 € Schulden (§ 1374 Abs. 3 BGB). */
const schulden = zugewinnausgleich({ anfangA: -20000, endA: 30000, anfangB: 0, endB: 10000 });
/** Kappung: A hat Schulden abgebaut, besitzt am Stichtag aber nur 20.000 € (§ 1378 Abs. 2 BGB). */
const kapp = zugewinnausgleich({ anfangA: -60000, endA: 20000, anfangB: 0, endB: 0 });
const viertel = P.erbrecht.zugewinn_viertel;

export default defineGuide({
  id: 'zugewinnausgleich',
  group: 'scheidung',
  order: 58,
  mini: 'zugewinnSchnell',
  related: ['zugewinnausgleich-rechner', 'versorgungsausgleich', 'scheidungskosten', 'verfahrenswert', 'ehegattenerbrecht', 'trennungsunterhalt'],
  sources: ['bgb1373', 'bgb1374', 'bgb1375', 'bgb1378', 'bgb1371'],
  de: {
    slug: 'zugewinnausgleich',
    nav: 'Zugewinnausgleich',
    card: 'Anfangs- und Endvermögen, Erbschaften, Schulden und Kappung: wie der Zugewinn bei Scheidung geteilt wird.',
    title: 'Zugewinnausgleich 2026: Berechnung, Erbschaft, Stichtag',
    description: `Zugewinnausgleich 2026 nach §§ 1373 bis 1378 BGB: Anfangs- und Endvermögen, Erbschaft und Schenkung, Schulden, Stichtag und Kappung mit fünf Beispielen.`,
    h1: 'Zugewinnausgleich: was bei der Scheidung geteilt wird',
    intro: 'Geteilt wird nicht das Vermögen, sondern nur der Zuwachs während der Ehe, und auch der nur über eine Geldforderung.',
    resume: `Beim Zugewinnausgleich bekommt der Ehegatte, dessen Vermögen in der Ehe weniger gewachsen ist, die Hälfte der Differenz als Geldforderung (§ 1378 Abs. 1 BGB). Zugewinn ist das Endvermögen am Stichtag minus das Anfangsvermögen bei der Heirat, jeweils nach Abzug der Schulden (§ 1373 BGB). Wächst das Vermögen des einen von ${DE.eur(15000)} auf ${DE.eur(135000)} und das des anderen von ${DE.eur(10000)} auf ${DE.eur(40000)}, beträgt der Überschuss ${DE.eur(grund.ueberschuss)} und die Ausgleichsforderung ${DE.eur(grund.forderung)}. Erbschaften und Schenkungen während der Ehe zählen zum Anfangsvermögen und bleiben so außen vor (§ 1374 Abs. 2 BGB). Stichtag für das Endvermögen ist bei einer Scheidung die Zustellung des Scheidungsantrags (§ 1384 BGB), nicht der Auszug und nicht das Urteil. Die Forderung ist auf das Vermögen begrenzt, das der Pflichtige an diesem Tag noch hat (§ 1378 Abs. 2 BGB). Wer per Ehevertrag Gütertrennung vereinbart hat, schuldet keinen Zugewinnausgleich. Die Beträge dieser Seite gelten 2026 unverändert, denn der Zugewinnausgleich kennt keine jährlich angepassten Grenzwerte.`,
    faqs: [
      { q: 'Wird beim Zugewinnausgleich das Haus automatisch halbiert?', a: 'Nein. Jeder Ehegatte bleibt Eigentümer dessen, was ihm gehört (§ 1363 Abs. 2 BGB). Das Haus geht mit seinem Verkehrswert am Stichtag, abzüglich der noch offenen Kreditschuld, in das Endvermögen des Eigentümers ein. Gehört es beiden je zur Hälfte, steht jede Hälfte in einem Endvermögen. Am Ende entsteht nur eine Geldforderung; ob das Haus verkauft, übernommen oder geteilt wird, ist eine eigene Frage.' },
      { q: 'Zählt eine Erbschaft während der Ehe zum Zugewinn?', a: `In der Regel nicht. Was ein Ehegatte nach der Heirat erbt, geschenkt bekommt oder als Ausstattung erhält, wird seinem Anfangsvermögen hinzugerechnet (§ 1374 Abs. 2 BGB) und gleicht sich so aus. Steigt das geerbte Haus danach im Wert, ist dieser Wertzuwachs allerdings Zugewinn. Im Beispiel dieser Seite verschiebt eine Erbschaft von ${DE.eur(60000)} die Richtung des Ausgleichs vollständig.` },
      { q: 'Welcher Tag gilt für das Endvermögen beim Zugewinnausgleich?', a: 'Bei einer Scheidung der Tag, an dem der Scheidungsantrag dem anderen Ehegatten zugestellt wird, also die Rechtshängigkeit (§ 1384 BGB). Was danach verdient, ausgegeben oder geerbt wird, verändert die Berechnung nicht mehr. Der Tag der Trennung spielt trotzdem eine Rolle: Über das Vermögen zu diesem Zeitpunkt kann jeder Ehegatte Auskunft verlangen (§ 1379 BGB).' },
      { q: 'Was passiert, wenn ein Ehegatte vor der Scheidung Geld verschenkt oder verschleudert?', a: 'Dann wird der Betrag seinem Endvermögen wieder hinzugerechnet (§ 1375 Abs. 2 BGB). Das gilt für Schenkungen ohne sittliche Pflicht, für Verschwendung und für Handlungen in der Absicht, den anderen zu benachteiligen. Ist das Endvermögen kleiner als das in der Auskunft zum Trennungszeitpunkt genannte Vermögen, muss der Ehegatte erklären und beweisen, warum. Länger als zehn Jahre zurückliegende Vorgänge bleiben unberücksichtigt.' },
      { q: 'Kann man den Zugewinnausgleich durch Ehevertrag ausschließen?', a: 'Ja. Schließen die Ehegatten die Zugewinngemeinschaft aus, gilt Gütertrennung (§ 1414 BGB). Der Ehevertrag muss bei gleichzeitiger Anwesenheit beider vor einem Notar geschlossen werden (§ 1410 BGB). Möglich sind auch Teillösungen, etwa ein Betrieb, der aus der Berechnung herausgenommen wird. Ob ein Vertrag einseitig benachteiligt und deshalb nicht hält, prüfen die Familiengerichte im Einzelfall.' },
      { q: 'Was bringt die Zugewinngemeinschaft, wenn ein Ehegatte stirbt?', a: `Dann wird in der Regel nicht gerechnet: Der gesetzliche Erbteil des überlebenden Ehegatten erhöht sich pauschal um ${DE.pct(viertel, 0)} der Erbschaft (§ 1371 Abs. 1 BGB), gleich ob tatsächlich ein Zugewinn entstanden ist. Schlägt der Ehegatte das Erbe aus oder wird er enterbt, kann er stattdessen den rechnerischen Zugewinnausgleich und den kleinen Pflichtteil verlangen.` },
    ],
    body: (h) => `<h2>Der Grundsatz: geteilt wird der Zuwachs</h2>
<p>Ohne Ehevertrag leben Ehegatten in Deutschland im Güterstand der Zugewinngemeinschaft. Der Name führt in die Irre: Während der Ehe gibt es kein gemeinsames Vermögen, jeder verwaltet seines selbst. Erst wenn die Ehe endet, wird verglichen, wie stark jedes der beiden Vermögen gewachsen ist (${h.src('bgb1373', '§ 1373 BGB')}).</p>
<p>Wer mehr hinzugewonnen hat, gibt die Hälfte des Unterschieds ab, und zwar als Geldforderung (${h.src('bgb1378', '§ 1378 Abs. 1 BGB')}). Gegenstände wechseln nicht den Eigentümer. Wer das Auto, das Depot oder die Wohnung hat, behält sie und zahlt gegebenenfalls aus.</p>
<h2>Die Rechnung in vier Schritten</h2>
<ul>
<li><strong>Anfangsvermögen</strong>: alles, was einem Ehegatten am Tag der Heirat gehörte, minus seine Schulden (${h.src('bgb1374', '§ 1374 BGB')}). Schulden dürfen das Anfangsvermögen auch unter die Nulllinie drücken.</li>
<li><strong>Hinzurechnungen</strong>: Erbschaften, Schenkungen und vorweggenommene Erbfolge während der Ehe kommen zum Anfangsvermögen dazu, bewertet zum Zeitpunkt des Erwerbs.</li>
<li><strong>Endvermögen</strong>: alles am Stichtag, minus die Schulden (${h.src('bgb1375', '§ 1375 BGB')}), plus Beträge, die in den letzten zehn Jahren verschenkt oder verschwendet wurden.</li>
<li><strong>Ausgleich</strong>: Endvermögen minus Anfangsvermögen ergibt den Zugewinn, nie weniger als 0 €. Die Hälfte der Differenz beider Zugewinne steht dem Ehegatten mit dem kleineren Zugewinn zu.</li>
</ul>
<h2>Fünf Ehen, fünf Ergebnisse</h2>
${h.table(['Fall', 'Zugewinn A', 'Zugewinn B', 'Forderung', 'berechtigt'], [
  ['Grundfall', h.eur(grund.zugewinnA), h.eur(grund.zugewinnB), h.eur(grund.forderung), grund.berechtigt ?? '–'],
  [`B erbt ${h.eur(60000)}, privilegiert`, h.eur(erbe.zugewinnA), h.eur(erbe.zugewinnB), h.eur(erbe.forderung), erbe.berechtigt ?? '–'],
  ['dieselbe Erbschaft, ohne Hinzurechnung', h.eur(ohneErbe.zugewinnA), h.eur(ohneErbe.zugewinnB), h.eur(ohneErbe.forderung), ohneErbe.berechtigt ?? '–'],
  [`A startet mit ${h.eur(20000)} Schulden`, h.eur(schulden.zugewinnA), h.eur(schulden.zugewinnB), h.eur(schulden.forderung), schulden.berechtigt ?? '–'],
  ['A besitzt am Stichtag nur ' + h.eur(20000), h.eur(kapp.zugewinnA), h.eur(kapp.zugewinnB), h.eur(kapp.forderung) + (kapp.gekappt ? ', gekappt' : ''), kapp.berechtigt ?? '–'],
], 'Berechnet mit dem Zugewinnausgleich-Rechner dieser Seite, ohne Indexierung des Anfangsvermögens')}
<p>Die zweite und dritte Zeile zeigen, wie viel an der richtigen Einordnung einer Erbschaft hängt. Wird das Erbe von B korrekt dem Anfangsvermögen zugeschlagen, erhält B ${h.eur(erbe.forderung)}. Würde man es übersehen, sähe es aus, als müsste B an A ${h.eur(ohneErbe.forderung)} zahlen.</p>
<h2>Schulden zu Beginn und die Kappungsgrenze</h2>
<p>Wer mit einem Studienkredit oder einem Minus auf dem Konto in die Ehe geht und diese Schulden in der Ehe tilgt, erzielt einen Zugewinn, auch wenn am Ende wenig auf dem Konto liegt. In der vierten Zeile hat A sich von minus ${h.eur(20000)} auf plus ${h.eur(30000)} verbessert: ein Zugewinn von ${h.eur(schulden.zugewinnA)}.</p>
<p>Die Forderung kann aber nie höher sein als das, was der Pflichtige am Stichtag nach Abzug seiner Schulden tatsächlich besitzt (§ 1378 Abs. 2 BGB). In der letzten Zeile ergäbe die Rechnung ${h.eur(kapp.ueberschuss / 2)}, A hat aber nur ${h.eur(20000)}. Die Forderung wird deshalb auf ${h.eur(kapp.forderung)} begrenzt. Hat der Pflichtige Vermögen beiseitegeschafft, erhöht sich die Grenze um diesen Betrag.</p>
<h2>Stichtage und Bewertung</h2>
<p>Für das Endvermögen zählt bei der Scheidung der Tag, an dem der Scheidungsantrag zugestellt wird (§ 1384 BGB). Das Anfangsvermögen wird zum Tag der Heirat bewertet, eine Erbschaft zum Tag des Erbfalls (§ 1376 BGB). Ein Haus wird mit dem Verkehrswert angesetzt, eine Firmenbeteiligung mit ihrem Unternehmenswert; darüber wird in der Praxis oft mit Gutachten gestritten.</p>
<p>Ein Euro von vor zwanzig Jahren ist heute weniger wert. Nach ständiger Rechtsprechung des Bundesgerichtshofs wird das Anfangsvermögen deshalb mit dem Verbraucherpreisindex auf den Stichtag hochgerechnet, damit ein rein inflationsbedingter Wertzuwachs nicht als Zugewinn erscheint. Die Gerichte verwenden dafür die Indexwerte des Statistischen Bundesamts. Der Rechner auf dieser Seite enthält diese Hochrechnung nicht; Sie können ein bereits indexiertes Anfangsvermögen eintragen.</p>
<h2>Auskunft und Verfahren</h2>
<p>Ist der Scheidungsantrag gestellt, kann jeder Ehegatte vom anderen Auskunft über sein Vermögen verlangen, und zwar zum Tag der Trennung, zum Anfangs- und zum Endvermögen, auf Anforderung mit Belegen (§ 1379 BGB). Der Zugewinnausgleich kann im Scheidungsverbund mit entschieden oder getrennt geltend gemacht werden. Er erhöht dann den ${h.a('verfahrenswert', 'Verfahrenswert')} und damit die ${h.a('scheidungskosten', 'Scheidungskosten')}.</p>
<p>Einigen sich die Ehegatten während des Scheidungsverfahrens über den Ausgleich, muss die Vereinbarung notariell beurkundet oder vor dem Familiengericht protokolliert werden (§ 1378 Abs. 3 BGB). Altersvorsorge gehört übrigens nicht hierher: Renten und Betriebsrenten werden im ${h.a('versorgungsausgleich', 'Versorgungsausgleich')} geteilt.</p>
<h2>Gütertrennung, Ehevertrag und Tod</h2>
<p>Mit einem notariellen Ehevertrag können Ehegatten den Zugewinnausgleich ausschließen; dann gilt Gütertrennung (§ 1414 BGB). Endet eine Zugewinngemeinschaft durch Tod, wird meist nicht gerechnet: Der Erbteil des überlebenden Ehegatten steigt pauschal um ${h.pct(viertel, 0)} (${h.src('bgb1371', '§ 1371 BGB')}). Mehr dazu beim ${h.a('ehegattenerbrecht', 'Erbrecht des Ehegatten')}.</p>
<p>Diese Seite ist eine allgemeine Information zum Zugewinnausgleich und keine Rechtsberatung. Mit dem ${h.a('zugewinnausgleich-rechner', 'Zugewinnausgleich-Rechner')} rechnen Sie Ihre eigenen Zahlen durch; die Bewertung einzelner Vermögenswerte entscheidet im Streitfall das Familiengericht.</p>`,
  },
  en: {
    slug: 'accrued-gains-equalisation',
    nav: 'Accrued gains',
    card: 'Initial and final assets, inheritances, debts and the cap: how German law shares what a marriage built up.',
    title: 'Zugewinnausgleich 2026: Accrued Gains on Divorce Germany',
    description: `Zugewinnausgleich 2026 in English: German accrued gains equalisation on divorce, initial and final assets, inheritances, debts, cut-off date and the cap.`,
    h1: 'Accrued gains equalisation: what German divorce law shares',
    intro: 'German law does not split your property on divorce. It compares how much each spouse’s wealth grew and settles the difference in money.',
    resume: `Under German law the spouse whose wealth grew less during the marriage receives half of the difference as a money claim: the accrued gains equalisation (Zugewinnausgleich, section 1378(1) of the Civil Code, BGB). Each spouse’s gain is final assets on the cut-off date minus initial assets on the wedding day, both net of debts (section 1373 BGB). If one spouse went from ${EN.eur(15000)} to ${EN.eur(135000)} and the other from ${EN.eur(10000)} to ${EN.eur(40000)}, the difference is ${EN.eur(grund.ueberschuss)} and the claim ${EN.eur(grund.forderung)}. Inheritances and gifts received during the marriage are added to initial assets, so they are not shared (section 1374(2) BGB). On divorce, final assets are measured on the day the divorce petition is served on the other spouse (section 1384 BGB). The claim can never exceed what the paying spouse still owns on that day (section 1378(2) BGB). Couples who agreed separation of property (Gütertrennung) in a notarised marriage contract owe nothing. No threshold changes in 2026: the rules have no yearly indexed amounts.`,
    faqs: [
      { q: 'Does German accrued gains equalisation apply if we married abroad?', a: 'Not automatically. German community of accrued gains (Zugewinngemeinschaft) only applies if German law governs your matrimonial property regime. Which law applies depends on conflict-of-law rules that look at factors such as nationality, where you first lived together and any written choice of law. A German family court decides this first; the calculation on this page assumes German law applies.' },
      { q: 'Is an inheritance from my parents shared on divorce in Germany?', a: `Usually not. Whatever a spouse inherits or receives as a gift after the wedding is added to their initial assets (section 1374(2) BGB), which neutralises it. Any growth in value after you received it, such as an inherited flat rising in price, does count as gain. In the example on this page, ignoring an inheritance of ${EN.eur(60000)} would reverse who pays whom.` },
      { q: 'Which date fixes the final assets in a German divorce?', a: 'The day the divorce petition is served on the other spouse, when the case becomes pending (Rechtshängigkeit, section 1384 BGB). Neither the day you moved out nor the date of the final decree counts. Money earned or spent after service no longer changes the result, although each spouse may also ask for disclosure of assets as at the date of separation (section 1379 BGB).' },
      { q: 'Do debts from before the wedding reduce the accrued gains claim?', a: `They lower the initial assets, which may even be negative (section 1374(3) BGB). Paying off a student loan or overdraft during the marriage therefore creates gain. A spouse who started at minus ${EN.eur(20000)} and ends at ${EN.eur(30000)} has gained ${EN.eur(schulden.zugewinnA)}, even though the account balance looks modest.` },
      { q: 'Can a marriage contract in Germany exclude the equalisation?', a: 'Yes. If spouses exclude the statutory regime, separation of property (Gütertrennung) applies (section 1414 BGB). The contract must be signed before a German notary with both spouses present at the same time (section 1410 BGB). Partial solutions, such as leaving a business out of the calculation, are common. Courts can set aside contracts that are grossly one-sided.' },
      { q: 'What happens to accrued gains if a spouse dies instead?', a: `In most cases nobody calculates anything: the surviving spouse’s statutory share of the estate rises by a flat ${EN.pct(viertel, 0)} of the estate (section 1371(1) BGB), whether or not any gain was made. A spouse who disclaims the inheritance or was cut out of the will can claim the calculated equalisation plus a reduced compulsory share instead.` },
    ],
    body: (h) => `<h2>What is actually shared</h2>
<p>Many expats assume a German divorce splits everything down the middle. It does not. Unless you signed a marriage contract (Ehevertrag), you live in the community of accrued gains (Zugewinngemeinschaft), which keeps both estates separate throughout the marriage. Each spouse owns, and owes, what is in their own name.</p>
<p>Only at the end does the law look at growth. Whoever gained more pays the other half of the difference in cash (${h.src('bgb1378', 'section 1378 BGB')}). The house, the car and the brokerage account stay with their owner; what moves is a money claim.</p>
<h2>How the calculation works</h2>
<ul>
<li><strong>Initial assets</strong> (Anfangsvermögen): everything you owned on the wedding day, minus your debts (${h.src('bgb1374', 'section 1374 BGB')}). The figure can be negative.</li>
<li><strong>Privileged acquisitions</strong>: inheritances, gifts and advances on an inheritance received after the wedding are added to initial assets at their value when received.</li>
<li><strong>Final assets</strong> (Endvermögen): everything on the cut-off date, minus debts (${h.src('bgb1375', 'section 1375 BGB')}), plus anything given away without moral obligation, squandered or moved to harm the other spouse in the last ten years.</li>
<li><strong>Gain</strong> (${h.src('bgb1373', 'section 1373 BGB')}): final minus initial assets, never below 0 €. Half the difference between the two gains goes to the spouse with the smaller one.</li>
</ul>
<h2>Five couples compared</h2>
${h.table(['Couple', 'Gain A', 'Gain B', 'Claim', 'Owed to'], [
  ['standard case', h.eur(grund.zugewinnA), h.eur(grund.zugewinnB), h.eur(grund.forderung), grund.berechtigt ?? '–'],
  [`B inherits ${h.eur(60000)}, added to initial assets`, h.eur(erbe.zugewinnA), h.eur(erbe.zugewinnB), h.eur(erbe.forderung), erbe.berechtigt ?? '–'],
  ['same inheritance overlooked', h.eur(ohneErbe.zugewinnA), h.eur(ohneErbe.zugewinnB), h.eur(ohneErbe.forderung), ohneErbe.berechtigt ?? '–'],
  [`A starts with ${h.eur(20000)} of debt`, h.eur(schulden.zugewinnA), h.eur(schulden.zugewinnB), h.eur(schulden.forderung), schulden.berechtigt ?? '–'],
  [`A owns only ${h.eur(20000)} on the cut-off date`, h.eur(kapp.zugewinnA), h.eur(kapp.zugewinnB), h.eur(kapp.forderung) + (kapp.gekappt ? ', capped' : ''), kapp.berechtigt ?? '–'],
], 'Computed with the accrued gains calculator on this site, without indexing initial assets')}
<p>Rows two and three show why paperwork matters. Correctly treated, B’s inheritance leaves B with a claim of ${h.eur(erbe.forderung)}. Forget to add it to initial assets and B suddenly appears to owe A ${h.eur(ohneErbe.forderung)}.</p>
<h2>The cap on the claim</h2>
<p>A spouse who cleared large debts during the marriage may have a big gain on paper and little cash. The law protects them: the claim cannot exceed the net assets they hold on the cut-off date (section 1378(2) BGB). In the last row the arithmetic gives ${h.eur(kapp.ueberschuss / 2)}, but A owns only ${h.eur(20000)}, so the claim stops at ${h.eur(kapp.forderung)}. Assets moved aside to dodge the claim raise the cap again.</p>
<h2>Dates, valuation and inflation</h2>
<p>Final assets are valued on the day the divorce petition is served (section 1384 BGB), initial assets on the wedding day, an inheritance on the day it was received (section 1376 BGB). Property is taken at market value, a shareholding at the value of the business. Valuation disputes often require an expert report.</p>
<p>Inflation is handled by case law rather than statute: the Federal Court of Justice (Bundesgerichtshof) consistently adjusts initial assets by the consumer price index, so that growth caused purely by inflation is not treated as gain. The calculator here leaves that step out; you can enter an already indexed figure.</p>
<h2>Expat situations</h2>
<p>For couples with an international background, the first question is whether German matrimonial property law applies at all. If you married abroad, this depends on conflict-of-law rules, not on where you live today, and a choice of law or a foreign marriage contract may change the answer. Assets held abroad, such as a flat in your home country or a foreign pension fund outside the pension rules, still count in the German calculation if German law applies. Statutory and company pensions are split separately in ${h.a('versorgungsausgleich', 'pension splitting')}.</p>
<h2>Disclosure, agreements and costs</h2>
<p>Once divorce is filed, each spouse can demand a sworn list of the other’s assets as at separation, the wedding day and the cut-off date, with supporting documents (section 1379 BGB). An agreement on the equalisation made during the divorce must be notarised or recorded by the family court (Familiengericht). A disputed claim raises the ${h.a('verfahrenswert', 'value of the proceedings')} and with it the ${h.a('scheidungskosten', 'cost of divorce')}. On death, the rules work differently (${h.src('bgb1371', 'section 1371 BGB')}); see ${h.a('ehegattenerbrecht', 'spouse’s inheritance rights')}.</p>
<p>This page is general information on accrued gains equalisation, not legal advice on your situation. To run your own figures, use the ${h.a('zugewinnausgleich-rechner', 'accrued gains calculator')}.</p>`,
  },
});
