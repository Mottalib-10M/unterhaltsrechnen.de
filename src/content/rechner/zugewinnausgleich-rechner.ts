import { defineGuide } from '../../lib/guide-types';
import { zugewinnausgleich } from '../../lib/engine/vermoegen';
import { DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
/** Startwerte des Rechners. */
const start = zugewinnausgleich({ anfangA: 20000, endA: 180000, anfangB: 5000, endB: 45000 });
/** Beide Vermögen wachsen fast gleich: kleine Forderung in Gegenrichtung. */
const knapp = zugewinnausgleich({ anfangA: 30000, endA: 90000, anfangB: 0, endB: 72000 });
/** Negatives Anfangsvermögen und Kappung auf das Endvermögen. */
const gekappt = zugewinnausgleich({ anfangA: -45000, endA: 15000, anfangB: 8000, endB: 8000 });

export default defineGuide({
  id: 'zugewinnausgleich-rechner',
  group: 'scheidung',
  order: 60,
  tool: 'zugewinn',
  related: ['zugewinnausgleich', 'versorgungsausgleich-rechner', 'scheidungskosten-rechner', 'verfahrenswert', 'ehegattenerbrecht'],
  sources: ['bgb1373', 'bgb1374', 'bgb1375', 'bgb1378'],
  de: {
    slug: 'zugewinnausgleich-rechner',
    nav: 'Zugewinnausgleich-Rechner',
    card: 'Vier Vermögenswerte eintragen, Ausgleichsforderung ablesen, mit Kappung nach § 1378 Abs. 2 BGB.',
    title: 'Zugewinnausgleich-Rechner 2026: Forderung in vier Feldern',
    description: 'Zugewinnausgleich-Rechner 2026: Anfangs- und Endvermögen beider Ehegatten eintragen, Zugewinn, Überschuss und Ausgleichsforderung mit Kappung sofort sehen.',
    h1: 'Zugewinnausgleich berechnen mit vier Zahlen',
    intro: 'Der Rechner braucht nur das Anfangs- und das Endvermögen beider Ehegatten, Schulden bereits abgezogen.',
    resume: `Mit den Startwerten des Rechners hat Ehegatte A sein Vermögen in der Ehe von ${DE.eur(20000)} auf ${DE.eur(180000)} gesteigert, Ehegatte B von ${DE.eur(5000)} auf ${DE.eur(45000)}. Das ergibt Zugewinne von ${DE.eur(start.zugewinnA)} und ${DE.eur(start.zugewinnB)}, einen Überschuss von ${DE.eur(start.ueberschuss)} und eine Ausgleichsforderung von ${DE.eur(start.forderung)} zugunsten von ${start.berechtigt}. So rechnet § 1378 Abs. 1 BGB: Der Ehegatte mit dem kleineren Zugewinn bekommt die Hälfte des Unterschieds in Geld. Ein Zugewinn ist nie kleiner als 0 € (§ 1373 BGB), ein Anfangsvermögen darf dagegen negativ sein, wenn jemand mit Schulden in die Ehe gegangen ist. Hat der Pflichtige am Stichtag weniger Vermögen als die rechnerische Forderung, begrenzt der Rechner sie auf dieses Endvermögen und weist darauf hin (§ 1378 Abs. 2 BGB). Erbschaften und Schenkungen während der Ehe tragen Sie beim Anfangsvermögen ein. Die Regeln haben 2026 keine jährlich angepassten Beträge, das Ergebnis hängt allein von Ihren Zahlen ab.`,
    faqs: [
      { q: 'Wo trage ich im Zugewinnausgleich-Rechner eine Erbschaft ein?', a: 'Beim Anfangsvermögen desjenigen, der geerbt hat, mit dem Wert am Tag des Erbfalls und abzüglich der damit übernommenen Schulden (§ 1374 Abs. 2 BGB). Ist das Geerbte am Stichtag noch vorhanden, steht es zusätzlich im Endvermögen. So neutralisiert sich die Erbschaft, nur ein späterer Wertzuwachs wird ausgeglichen. Dasselbe gilt für Schenkungen von Eltern oder Dritten.' },
      { q: 'Warum zeigt der Zugewinnausgleich-Rechner einen Hinweis auf die Kappung?', a: `Weil die rechnerische Forderung höher ist als das Vermögen, das der Pflichtige am Stichtag nach Abzug seiner Schulden hat. Mehr als dieses Endvermögen kann nicht verlangt werden (§ 1378 Abs. 2 BGB). Im dritten Beispiel unten ergäbe die Rechnung ${DE.eur(gekappt.ueberschuss / 2)}, gezahlt werden müssen höchstens ${DE.eur(gekappt.forderung)}.` },
      { q: 'Rechnet der Zugewinnausgleich-Rechner die Inflation heraus?', a: 'Nein. Die Gerichte rechnen das Anfangsvermögen in der Regel mit dem Verbraucherpreisindex auf den Stichtag hoch, damit ein bloßer Kaufkraftverlust nicht als Zugewinn zählt. Diese Hochrechnung enthält der Rechner nicht. Wenn Sie den Index kennen, tragen Sie das bereits hochgerechnete Anfangsvermögen ein; bei kurzen Ehen oder kleinem Anfangsvermögen ändert sich das Ergebnis meist wenig.' },
      { q: 'Welches Datum gilt für das Endvermögen im Zugewinnausgleich-Rechner?', a: 'Der Tag, an dem der Scheidungsantrag dem anderen Ehegatten zugestellt wird (§ 1384 BGB). Kontostände, Depotwerte und Restschulden sollten Sie auf diesen Tag beziehen. Liegt die Zustellung noch in der Zukunft, ist das Ergebnis eine Schätzung, die sich mit jedem Monat verschieben kann, etwa durch Tilgung eines Kredits oder Kursbewegungen.' },
    ],
    body: (h) => `<h2>Die vier Felder</h2>
<ul>
<li><strong>Anfangsvermögen A</strong>: was A am Tag der Heirat besaß, minus Schulden, plus Erbschaften und Schenkungen während der Ehe. Ein negativer Wert wird mit Minuszeichen eingetippt.</li>
<li><strong>Endvermögen A</strong>: das Vermögen von A bei Zustellung des Scheidungsantrags, ebenfalls nach Abzug aller Schulden.</li>
<li><strong>Anfangsvermögen B</strong> und <strong>Endvermögen B</strong>: dieselben Angaben für den anderen Ehegatten.</li>
</ul>
<p>Zu den Vermögenswerten gehören Immobilien zum Verkehrswert, Konten, Depots, Fahrzeuge, Kapitallebensversicherungen und Unternehmensbeteiligungen. Hausrat, der beiden gehört, und Rentenanrechte zählen hier nicht; Renten werden im Versorgungsausgleich geteilt.</p>
<h2>Was das Ergebnis zeigt</h2>
<p>Oben steht die Ausgleichsforderung und, wem sie zusteht. Darunter folgen der Zugewinn von A, der Zugewinn von B und der Überschuss, also die Differenz der beiden Zugewinne. Der Rechenweg nennt die Regel: Zugewinn ist Endvermögen minus Anfangsvermögen, nie unter 0 € (${h.src('bgb1373', '§ 1373 BGB')}), und die Hälfte des Überschusses geht an den Ehegatten mit dem kleineren Zugewinn (${h.src('bgb1378', '§ 1378 BGB')}). Greift die Kappung, erscheint ein eigener Hinweis. Das Ergebnis lässt sich kopieren oder als Link mit Ihren Zahlen teilen.</p>
<h2>Drei Rechnungen zum Nachvollziehen</h2>
${h.table(['Eingaben (A / B)', 'Zugewinn A', 'Zugewinn B', 'Forderung'], [
  [`${h.eur(20000)} → ${h.eur(180000)} / ${h.eur(5000)} → ${h.eur(45000)}`, h.eur(start.zugewinnA), h.eur(start.zugewinnB), `${h.eur(start.forderung)} an ${start.berechtigt}`],
  [`${h.eur(30000)} → ${h.eur(90000)} / ${h.eur(0)} → ${h.eur(72000)}`, h.eur(knapp.zugewinnA), h.eur(knapp.zugewinnB), `${h.eur(knapp.forderung)} an ${knapp.berechtigt}`],
  [`${h.eur(-45000)} → ${h.eur(15000)} / ${h.eur(8000)} → ${h.eur(8000)}`, h.eur(gekappt.zugewinnA), h.eur(gekappt.zugewinnB), `${h.eur(gekappt.forderung)} an ${gekappt.berechtigt}${gekappt.gekappt ? ', gekappt' : ''}`],
], 'Ergebnisse des Rechners, Anfangsvermögen → Endvermögen')}
<p>Die zweite Zeile zeigt, dass nicht der Reichere zahlt, sondern wer mehr hinzugewonnen hat: A besitzt am Ende mehr, B hat aber stärker zugelegt und schuldet deshalb ${h.eur(knapp.forderung)}. In der dritten Zeile hat A Schulden abgebaut und kommt so auf einen hohen Zugewinn, besitzt am Stichtag aber nur ${h.eur(15000)}. Mehr als das kann B nicht verlangen.</p>
<h2>Grenzen des Rechners</h2>
<p>Er prüft nicht, ob Vermögen verschenkt oder verschwendet wurde und dem Endvermögen wieder hinzuzurechnen ist (${h.src('bgb1375', '§ 1375 Abs. 2 BGB')}). Er indexiert das Anfangsvermögen nicht und bewertet keine Immobilie und keine Firma. Er setzt voraus, dass Sie im gesetzlichen Güterstand leben; bei Gütertrennung oder einem abweichenden Ehevertrag passt die Rechnung nicht. Ob Erbschaften richtig im ${h.src('bgb1374', 'Anfangsvermögen nach § 1374 BGB')} stehen, liegt bei Ihren Eingaben.</p>
<p>Der Rechner liefert eine allgemeine Orientierung zum Zugewinnausgleich und ist keine Rechtsberatung. Hintergründe, Stichtage und Sonderfälle erklärt der Ratgeber zum ${h.a('zugewinnausgleich', 'Zugewinnausgleich')}; was ein streitiger Ausgleich kostet, zeigt der ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')}.</p>`,
  },
  en: {
    slug: 'accrued-gains-calculator',
    nav: 'Accrued gains calculator',
    card: 'Enter four asset figures and read off the equalisation claim, including the cap under German law.',
    title: 'Zugewinnausgleich Calculator 2026: Accrued Gains Claim',
    description: 'Accrued gains calculator 2026 for divorce in Germany: enter both spouses’ initial and final assets and see each gain, the difference and the capped claim.',
    h1: 'Calculate the accrued gains claim from four numbers',
    intro: 'All the calculator needs is each spouse’s assets on the wedding day and on the cut-off date, with debts already deducted.',
    resume: `With the calculator’s default figures, spouse A grew their net assets during the marriage from ${EN.eur(20000)} to ${EN.eur(180000)} and spouse B from ${EN.eur(5000)} to ${EN.eur(45000)}. That gives gains of ${EN.eur(start.zugewinnA)} and ${EN.eur(start.zugewinnB)}, a difference of ${EN.eur(start.ueberschuss)} and an equalisation claim (Ausgleichsforderung) of ${EN.eur(start.forderung)} in favour of ${start.berechtigt}. This follows section 1378(1) of the German Civil Code (BGB): the spouse with the smaller gain receives half the difference in money. A gain is never below 0 € (section 1373 BGB), but initial assets may be negative if someone entered the marriage in debt. If the paying spouse owns less on the cut-off date than the calculated claim, the tool caps the claim at those final assets and says so (section 1378(2) BGB). Inheritances and gifts received during the marriage go into initial assets. Nothing in these rules is indexed for 2026, so the result depends only on your figures.`,
    faqs: [
      { q: 'How do I enter assets held outside Germany in the accrued gains calculator?', a: 'Convert them into euros at the value on the relevant date and add them to the spouse who owns them: a flat in your home country, a foreign bank account or shares held through a foreign broker. If German law governs your matrimonial property regime, worldwide assets count. Whether it does is a separate question that the calculator does not check.' },
      { q: 'Why does the calculator say the claim is capped?', a: `Because the calculated claim exceeds what the paying spouse owns, net of debts, on the cut-off date. German law never asks for more than those final assets (section 1378(2) BGB). In the third example below the arithmetic gives ${EN.eur(gekappt.ueberschuss / 2)}, yet at most ${EN.eur(gekappt.forderung)} is payable.` },
      { q: 'Does the accrued gains calculator adjust for inflation?', a: 'No. German courts usually index initial assets by the consumer price index up to the cut-off date, so that a mere loss of purchasing power does not count as gain. The calculator skips this step. If you know the index figures, enter the indexed initial assets; for short marriages or small starting assets the effect is usually modest.' },
      { q: 'Which debts belong in the final assets figure?', a: 'All debts that exist on the cut-off date: the remaining mortgage, car finance, credit cards, tax arrears and personal loans, whether owed in Germany or abroad. Subtract them from the gross value of what the spouse owns. Final assets may be negative; in that case the gain is 0 € and that spouse cannot be asked to pay.' },
    ],
    body: (h) => `<h2>The four fields</h2>
<ul>
<li><strong>Initial assets A</strong> (Anfangsvermögen): what A owned on the wedding day, minus debts, plus inheritances and gifts received during the marriage. Type a negative figure with a minus sign.</li>
<li><strong>Final assets A</strong> (Endvermögen): A’s net assets on the day the divorce petition is served on the other spouse.</li>
<li><strong>Initial assets B</strong> and <strong>final assets B</strong>: the same for the other spouse.</li>
</ul>
<p>Count property at market value, bank and brokerage accounts, vehicles, capital life insurance policies and business stakes. Leave out statutory and company pensions: they are split separately in pension splitting (Versorgungsausgleich).</p>
<h2>Reading the result</h2>
<p>The headline shows the claim and to whom it is owed. Below come gain A, gain B and the difference between them. The calculation note quotes the rule: gain equals final minus initial assets, never below 0 € (${h.src('bgb1373', 'section 1373 BGB')}), and half the difference goes to the spouse with the smaller gain (${h.src('bgb1378', 'section 1378 BGB')}). A separate notice appears when the cap applies. You can copy the result or share a link that keeps your figures.</p>
<h2>Three worked examples</h2>
${h.table(['Inputs (A / B)', 'Gain A', 'Gain B', 'Claim'], [
  [`${h.eur(20000)} → ${h.eur(180000)} / ${h.eur(5000)} → ${h.eur(45000)}`, h.eur(start.zugewinnA), h.eur(start.zugewinnB), `${h.eur(start.forderung)} to ${start.berechtigt}`],
  [`${h.eur(30000)} → ${h.eur(90000)} / ${h.eur(0)} → ${h.eur(72000)}`, h.eur(knapp.zugewinnA), h.eur(knapp.zugewinnB), `${h.eur(knapp.forderung)} to ${knapp.berechtigt}`],
  [`${h.eur(-45000)} → ${h.eur(15000)} / ${h.eur(8000)} → ${h.eur(8000)}`, h.eur(gekappt.zugewinnA), h.eur(gekappt.zugewinnB), `${h.eur(gekappt.forderung)} to ${gekappt.berechtigt}${gekappt.gekappt ? ', capped' : ''}`],
], 'Calculator results, initial → final assets')}
<p>The second row is the one that surprises people: A ends up wealthier, but B grew faster and therefore owes A ${h.eur(knapp.forderung)}. In the third row A paid off ${h.eur(45000)} of debt, which counts as gain, yet owns only ${h.eur(15000)} at the end, so that is the most B can receive.</p>
<h2>What the calculator leaves out</h2>
<p>It does not add back assets given away, squandered or hidden before the divorce (${h.src('bgb1375', 'section 1375(2) BGB')}). It does not index initial assets, value a house or a company, or check whether you agreed separation of property (Gütertrennung) in a marriage contract. It assumes German matrimonial property law applies, which is not automatic for couples who married abroad. Correct treatment of inheritances under ${h.src('bgb1374', 'section 1374 BGB')} depends on what you enter.</p>
<p>The calculator offers general orientation on accrued gains and is not legal advice. The background, dates and special cases are explained in the guide to ${h.a('zugewinnausgleich', 'accrued gains equalisation')}; the cost of a contested claim shows up in the ${h.a('scheidungskosten-rechner', 'divorce cost calculator')}.</p>`,
  },
});
