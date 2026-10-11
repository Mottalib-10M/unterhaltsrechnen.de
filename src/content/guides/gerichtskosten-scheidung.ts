import { defineGuide } from '../../lib/guide-types';
import { famgkgGebuehr, scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

const F = P.famgkg;
/** Tabelle nach Anlage 2 FamGKG, aus dem Motor (der Motor wird gegen Anlage 2 getestet). */
const werte = [3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000, 100000];
const zeilen = werte.map((w) => { const g = famgkgGebuehr(w); return { w, g, voll: F.kv1110_satz * g, rueck: F.kv1111_satz * g }; });
/** Leitbeispiel: 2.200 € und 1.600 € netto, zwei Anrechte. */
const bsp = scheidungskosten({ netto1: 2200, netto2: 1600, anrechte: 2, anwaelte: 1 });
const bspRueck = F.kv1111_satz * bsp.gerichtsgebuehr;
/** Gleiches Paar mit Unterhaltsfolgesache im Wert von 7.200 €. */
const bspFolge = scheidungskosten({ netto1: 2200, netto2: 1600, anrechte: 2, anwaelte: 1, folgesachenWert: 7200 });
const minG = famgkgGebuehr(F.ehe_mindestwert);

export default defineGuide({
  id: 'gerichtskosten-scheidung',
  group: 'scheidung',
  order: 14,
  mini: 'famgkg',
  related: ['scheidungskosten', 'verfahrenswert', 'anwaltskosten-scheidung', 'scheidungskosten-rechner', 'verfahrenskostenhilfe', 'unterhaltsverfahren-kosten'],
  sources: ['famgkg28', 'famgkgKv', 'famgkgTabelle', 'famfg150', 'famgkg43'],
  de: {
    slug: 'gerichtskosten-scheidung',
    nav: 'Gerichtskosten',
    card: 'Gebühren des Familiengerichts nach FamGKG 2026: Tabelle nach Verfahrenswert, Vorschuss, Ermäßigung.',
    title: 'Gerichtskosten Scheidung 2026: Tabelle nach FamGKG',
    description: `Gerichtskosten der Scheidung 2026: ${DE.num(F.kv1110_satz, 1)} Gebühren nach KV 1110 FamGKG, Tabelle von ${DE.eur(F.ehe_mindestwert)} bis ${DE.eur(100000)} Verfahrenswert, Vorschuss und Ermäßigung bei Rücknahme.`,
    h1: 'Gerichtskosten der Scheidung nach dem FamGKG',
    intro: 'Was das Familiengericht für eine Scheidung berechnet, wann der Vorschuss fällig wird und wer am Ende welchen Teil trägt.',
    resume: `Für ein Scheidungsverfahren erhebt das Familiengericht 2026 ${DE.num(F.kv1110_satz, 1)} Gebühren nach Nummer 1110 des Kostenverzeichnisses zum FamGKG; die Höhe einer Gebühr ergibt sich aus der Tabelle der Anlage 2 zu § 28 FamGKG. Beim Mindestverfahrenswert von ${DE.eur(F.ehe_mindestwert)} kostet eine Gebühr ${DE.eur(minG, 2)}, die Scheidung also ${DE.eur(F.kv1110_satz * minG, 2)}. Verdienen die Ehegatten ${DE.eur(2200)} und ${DE.eur(1600)} netto und sind zwei Rentenanrechte auszugleichen, liegt der Verfahrenswert bei ${DE.eur(bsp.gesamtWert)} und die Gerichtskosten bei ${DE.eur(bsp.gerichtskosten, 2)}. Wird der Scheidungsantrag vor der mündlichen Verhandlung zurückgenommen, ermäßigt sich der Satz auf ${DE.num(F.kv1111_satz, 1)} (Nummer 1111), im Beispiel auf ${DE.eur(bspRueck, 2)}. Der Antragsteller muss die Gebühr vorschießen: Nach § 14 FamGKG soll der Antrag erst nach Zahlung zugestellt werden. Wird die Ehe geschieden, werden die Kosten gegeneinander aufgehoben (§ 150 FamFG), sodass jeder Ehegatte am Ende die Hälfte der Gerichtskosten trägt, im Beispiel ${DE.eur(bsp.gerichtskosten / 2, 2)}.`,
    faqs: [
      { q: 'Wann muss der Gerichtskostenvorschuss für die Scheidung bezahlt werden?', a: 'Nach Eingang des Scheidungsantrags fordert die Gerichtskasse den Vorschuss beim Antragsteller an, berechnet nach einem vorläufig festgesetzten Verfahrenswert. § 14 Abs. 1 FamGKG sieht vor, dass der Antrag in Ehesachen erst nach Zahlung der Verfahrensgebühr zugestellt wird. Bis dahin ruht das Verfahren praktisch. Ist Verfahrenskostenhilfe bewilligt, entfällt der Vorschuss nach § 15 FamGKG; deshalb reichen viele Antragsteller den Hilfeantrag zusammen mit dem Scheidungsantrag ein.' },
      { q: 'Bekommt der Antragsteller die Hälfte der Gerichtskosten zurück?', a: `In der Regel ja, aber nicht von der Staatskasse, sondern vom anderen Ehegatten. Bei Kostenaufhebung nach § 150 Abs. 1 FamFG trägt jeder die Hälfte der Gerichtskosten. Hat der Antragsteller den gesamten Vorschuss von zum Beispiel ${DE.eur(bsp.gerichtskosten, 2)} bezahlt, kann er die Hälfte im Kostenfestsetzungsverfahren vom anderen Ehegatten verlangen. Viele Paare regeln das schon vorher untereinander.` },
      { q: 'Wann sinken die Gerichtskosten der Scheidung auf 0,5 Gebühren?', a: `Nummer 1111 des Kostenverzeichnisses ermäßigt den Satz von ${DE.num(F.kv1110_satz, 1)} auf ${DE.num(F.kv1111_satz, 1)}, wenn das Verfahren ohne streitige Endentscheidung endet: vor allem durch Rücknahme des Antrags vor der mündlichen Verhandlung, durch gerichtlichen Vergleich in einer Folgesache oder durch Erledigung. Für den Scheidungsbeschluss selbst gilt die Ermäßigung nicht, auch wenn er ohne Begründung ergeht. Eine einvernehmliche Scheidung kostet also die vollen Gebühren.` },
      { q: 'Kosten Folgesachen im Scheidungsverbund extra Gerichtsgebühren?', a: `Nicht als eigene Gebühr. Die Werte aller Folgesachen werden zum Scheidungswert addiert, und auf die Summe fallen einmal ${DE.num(F.kv1110_satz, 1)} Gebühren an. Mit einer Unterhaltsfolgesache von ${DE.eur(7200)} steigen die Gerichtskosten im Beispiel von ${DE.eur(bsp.gerichtskosten, 2)} auf ${DE.eur(bspFolge.gerichtskosten, 2)}. Ein eigenständiges Unterhaltsverfahren außerhalb des Verbunds kostet dagegen ${DE.num(F.kv1220_satz, 1)} Gebühren auf seinen eigenen Wert.` },
      { q: 'Was kommt zu den Gerichtsgebühren der Scheidung noch hinzu?', a: 'Auslagen des Gerichts, die das Kostenverzeichnis gesondert regelt: etwa Kosten für Zustellungen in größerer Zahl, für Sachverständige, Dolmetscher oder Übersetzungen. In einer einfachen Scheidung fallen sie kaum ins Gewicht. Bei Auslandsbezug oder einem Gutachten zum Kindeswohl können sie spürbar werden. Für Auslagen gilt die gleiche Kostenaufhebung wie für die Gebühren.' },
    ],
    body: (h) => `<h2>Wie das Gericht seine Gebühr berechnet</h2>
<p>Familiengerichte rechnen nach dem Gesetz über Gerichtskosten in Familiensachen (FamGKG). Die Gebühr hängt vom Verfahrenswert ab: ${h.src('famgkg28', '§ 28 FamGKG')} legt die Höhe einer vollen Gebühr fest, die Werte stehen in der ${h.src('famgkgTabelle', 'Gebührentabelle der Anlage 2')}. Wie oft diese Gebühr anfällt, sagt das ${h.src('famgkgKv', 'Kostenverzeichnis der Anlage 1')}: für ein Scheidungsverfahren im ersten Rechtszug nach Nummer 1110 der Satz ${h.num(h.P.famgkg.kv1110_satz, 1)}.</p>
<p>Die Gebühr deckt das gesamte Verfahren ab, den Antrag, die Anhörung der Ehegatten, den Versorgungsausgleich und alle Folgesachen im Verbund. Mehrere Termine oder ein langer Streit erhöhen sie nicht, nur ein höherer Wert.</p>
<h2>Gebührentabelle nach Verfahrenswert</h2>
${h.table(['Verfahrenswert', '1,0-Gebühr', 'Scheidung (2,0)', 'nach Rücknahme (0,5)', 'je Ehegatte'], zeilen.map((z) => [h.eur(z.w), h.eur(z.g, 2), h.eur(z.voll, 2), h.eur(z.rueck, 2), h.eur(z.voll / 2, 2)]), 'Gebühren nach Anlage 2 zu § 28 FamGKG, vom Rechner ermittelt', ['l', 'r', 'r', 'r', 'r'])}
<p>Die Tabelle steigt in Stufen. Zwischen zwei Tabellenwerten gilt die Gebühr der nächsthöheren Stufe; ein Wert von ${h.eur(10500)} kostet also so viel wie ${h.eur(13000)}. Je höher der Wert, desto breiter die Stufen und desto flacher der Anstieg.</p>
<h2>Ein Beispiel von Anfang bis Ende</h2>
<p>Ein Ehepaar verdient ${h.eur(2200)} und ${h.eur(1600)} netto. Jeder hat ein Konto bei der gesetzlichen Rentenversicherung, es sind also zwei Anrechte auszugleichen.</p>
<ul>
<li>Ehesache: drei Monatsnetto, ${h.eur(bsp.eheWert)} (${h.src('famgkg43', '§ 43 FamGKG')}).</li>
<li>Versorgungsausgleich: ${h.eur(bsp.vaWert)}.</li>
<li>Verfahrenswert gesamt: ${h.eur(bsp.gesamtWert)}, eine Gebühr ${h.eur(bsp.gerichtsgebuehr, 2)}.</li>
<li>Gerichtskosten: ${h.num(h.P.famgkg.kv1110_satz, 1)} × ${h.eur(bsp.gerichtsgebuehr, 2)} = ${h.eur(bsp.gerichtskosten, 2)}.</li>
</ul>
<p>Den Betrag zahlt zunächst allein, wer den Antrag stellt. Nach der Scheidung trägt jeder Ehegatte ${h.eur(bsp.gerichtskosten / 2, 2)}; den Ausgleich holt sich der Antragsteller beim anderen Ehegatten.</p>
<h2>Vorschuss: ohne Zahlung keine Zustellung</h2>
<p>In Ehesachen wird die Gebühr mit Einreichung des Antrags fällig. Nach § 14 Abs. 1 FamGKG soll das Gericht den Scheidungsantrag erst zustellen, wenn die Verfahrensgebühr bezahlt ist. Die Gerichtskasse schickt dazu eine Kostenrechnung nach einem vorläufigen Wert. Stellt sich am Ende ein anderer Wert heraus, wird nachgefordert oder erstattet.</p>
<p>Die Pflicht zum Vorschuss entfällt, soweit Verfahrenskostenhilfe bewilligt ist (§ 15 FamGKG). Dieselbe Vorschrift lässt eine Zustellung ohne Vorschuss auch zu, wenn die sofortige Zahlung wegen der Vermögenslage glaubhaft Schwierigkeiten bereiten würde. Ob die Hilfe mit oder ohne Raten kommt, erklärt die Seite zur ${h.a('verfahrenskostenhilfe', 'Verfahrenskostenhilfe')}.</p>
<h2>Ermäßigung auf 0,5</h2>
<p>Nummer 1111 des Kostenverzeichnisses senkt den Satz auf ${h.num(h.P.famgkg.kv1111_satz, 1)}, wenn das Verfahren ohne streitige Endentscheidung endet. Die wichtigsten Fälle:</p>
<ul>
<li>Rücknahme des Scheidungsantrags vor der mündlichen Verhandlung, etwa nach einer Versöhnung,</li>
<li>gerichtlicher Vergleich über eine Folgesache,</li>
<li>Erledigung der Hauptsache ohne Kostenentscheidung des Gerichts.</li>
</ul>
<p>Die Ermäßigung gilt nicht für einen Scheidungsbeschluss, auch wenn er ohne Begründung ergeht. Wer sich einvernehmlich scheiden lässt, zahlt deshalb die vollen ${h.num(h.P.famgkg.kv1110_satz, 1)} Gebühren. Im Beispiel spart eine rechtzeitige Rücknahme ${h.eur(bsp.gerichtskosten - bspRueck, 2)}.</p>
<h2>Folgesachen: ein Wert, eine Gebühr</h2>
<p>Im Scheidungsverbund entstehen keine getrennten Gerichtsgebühren je Folgesache. Das Gericht addiert die Werte und berechnet die ${h.num(h.P.famgkg.kv1110_satz, 1)} Gebühren einmal auf die Summe. Nimmt das Paar aus dem Beispiel eine Unterhaltsfolgesache im Wert von ${h.eur(7200)} hinzu, steigt der Verfahrenswert auf ${h.eur(bspFolge.gesamtWert)} und die Gerichtskosten auf ${h.eur(bspFolge.gerichtskosten, 2)}, also um ${h.eur(bspFolge.gerichtskosten - bsp.gerichtskosten, 2)}. Wegen der flacher werdenden Tabelle ist das deutlich weniger, als ein eigenständiges Unterhaltsverfahren kosten würde: Dort fallen nach dem Kostenverzeichnis ${h.num(h.P.famgkg.kv1220_satz, 1)} Gebühren allein auf den Unterhaltswert an. Mehr dazu steht bei den ${h.a('unterhaltsverfahren-kosten', 'Kosten eines Unterhaltsverfahrens')}.</p>
<p>Für die Planung bedeutet das: Wer Unterhalt oder Zugewinn ohnehin gerichtlich klären lassen will, zahlt im Verbund weniger Gerichtsgebühren als in einem späteren eigenen Verfahren. Ob sich der Verbund lohnt, hängt aber auch von Dauer und Anwaltskosten ab, die mit dem höheren Wert ebenfalls steigen.</p>
<h2>Wer die Gerichtskosten am Ende trägt</h2>
<p>Spricht das Gericht die Scheidung aus, sind die Kosten gegeneinander aufzuheben (${h.src('famfg150', '§ 150 Abs. 1 FamFG')}). Für die Gerichtskosten heißt das: halbe-halbe. Weist das Gericht den Antrag ab oder wird er zurückgenommen, trägt der Antragsteller allein. Das Gericht darf aus Billigkeitsgründen anders verteilen und soll eine Kostenvereinbarung der Ehegatten berücksichtigen.</p>
<p>Die Gerichtskosten sind der kleinere Teil der Rechnung. Was die Anwälte berechnen, steht bei den ${h.a('anwaltskosten-scheidung', 'Anwaltskosten der Scheidung')}, beide zusammen im ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')}. Wie der Wert entsteht, zeigt die Seite zum ${h.a('verfahrenswert', 'Verfahrenswert')}.</p>
<p>Diese Übersicht über die Gerichtskosten der Scheidung ist eine allgemeine Information, keine Rechtsberatung; maßgeblich ist die Kostenrechnung Ihres Familiengerichts.</p>`,
  },
  en: {
    slug: 'court-fees-divorce',
    nav: 'Court fees',
    card: 'German family court fees for divorce in 2026: table by value, advance payment, reduced rate.',
    title: 'Court Fees for Divorce in Germany 2026: FamGKG Table',
    description: `Court fees for a German divorce in 2026: ${EN.num(F.kv1110_satz, 1)} fees under FamGKG item 1110, table from ${EN.eur(F.ehe_mindestwert)} to ${EN.eur(100000)} value, advance payment and reduction on withdrawal.`,
    h1: 'Court fees for a divorce in Germany',
    intro: 'What the family court charges for a divorce, when the advance is due and who bears which share at the end.',
    resume: `For divorce proceedings, a German family court (Familiengericht) charges ${EN.num(F.kv1110_satz, 1)} fees in 2026 under item 1110 of the fee schedule to the Family Court Fees Act (FamGKG); the amount of one fee comes from the table in Annex 2 to section 28 FamGKG. At the minimum value of ${EN.eur(F.ehe_mindestwert)} one fee is ${EN.eur(minG, 2)}, so the divorce costs ${EN.eur(F.kv1110_satz * minG, 2)} in court fees. Where the spouses earn ${EN.eur(2200)} and ${EN.eur(1600)} net and two pension entitlements are split, the value is ${EN.eur(bsp.gesamtWert)} and the court fees are ${EN.eur(bsp.gerichtskosten, 2)}. If the application is withdrawn before the hearing, the rate drops to ${EN.num(F.kv1111_satz, 1)} (item 1111), here ${EN.eur(bspRueck, 2)}. The petitioner must pay in advance: under section 14 FamGKG the application should only be served once the fee is paid. When the divorce is granted, costs are set off (section 150 FamFG), so in the end each spouse bears half of the court fees, ${EN.eur(bsp.gerichtskosten / 2, 2)} in the example.`,
    faqs: [
      { q: 'How do I pay the German court fee advance from a foreign bank account?', a: 'The court cashier’s office (Gerichtskasse) sends a fee invoice with its bank details and a reference number, and the fee can be transferred from abroad like any euro payment. Use the reference exactly as shown, because the court only serves the divorce application once the payment has been matched. Bank charges for the transfer are your own cost and are not part of the court fee.' },
      { q: 'Does the petitioner get half the court fees back?', a: `Usually yes, but from the other spouse, not from the state. With costs set off under section 150(1) FamFG each spouse bears half the court fees. If the petitioner paid the whole advance of, say, ${EN.eur(bsp.gerichtskosten, 2)}, he or she can claim half from the other spouse in the cost assessment procedure. Many couples settle this between themselves beforehand.` },
      { q: 'When are German divorce court fees reduced to 0.5?', a: `Item 1111 of the schedule cuts the rate from ${EN.num(F.kv1110_satz, 1)} to ${EN.num(F.kv1111_satz, 1)} if the case ends without a contested final decision, mainly when the application is withdrawn before the hearing, when an ancillary matter is settled in court, or when the matter is otherwise disposed of. The reduction does not apply to the divorce order itself, even if it is given without reasons, so an amicable divorce still costs the full rate.` },
      { q: 'Do ancillary matters in the divorce cost extra court fees?', a: `Not as separate fees. Their values are added to the divorce value and the ${EN.num(F.kv1110_satz, 1)} rate is charged once on the total. A maintenance claim worth ${EN.eur(7200)} raises the court fees in our example from ${EN.eur(bsp.gerichtskosten, 2)} to ${EN.eur(bspFolge.gerichtskosten, 2)}. A stand-alone maintenance case outside the divorce costs ${EN.num(F.kv1220_satz, 1)} fees on its own value instead.` },
      { q: 'Are there court costs on top of the divorce fee?', a: 'Yes, the court’s expenses, which the fee schedule lists separately: for example larger numbers of formal deliveries, expert reports, interpreters or translations. In a simple divorce they hardly matter. With a spouse abroad or a child-welfare report they can become noticeable. Expenses are shared in the same way as the fees once costs are set off.' },
    ],
    body: (h) => `<h2>How the court works out its fee</h2>
<p>German family courts charge under the Family Court Fees Act (FamGKG). The fee depends on the value of the proceedings: ${h.src('famgkg28', 'section 28 FamGKG')} defines one full fee and the amounts are listed in the ${h.src('famgkgTabelle', 'fee table of Annex 2')}. How many fees are due is set by the ${h.src('famgkgKv', 'fee schedule in Annex 1')}: for first-instance divorce proceedings, item 1110 sets a rate of ${h.num(h.P.famgkg.kv1110_satz, 1)}.</p>
<p>That fee covers the whole case: the application, the hearing of both spouses, pension splitting and every ancillary matter decided alongside. Extra hearings or a long dispute do not raise it; only a higher value does.</p>
<h2>Fee table by value</h2>
${h.table(['Value', '1.0 fee', 'Divorce (2.0)', 'After withdrawal (0.5)', 'Per spouse'], zeilen.map((z) => [h.eur(z.w), h.eur(z.g, 2), h.eur(z.voll, 2), h.eur(z.rueck, 2), h.eur(z.voll / 2, 2)]), 'Fees under Annex 2 to section 28 FamGKG, computed by the calculator', ['l', 'r', 'r', 'r', 'r'])}
<p>The table rises in steps. Between two listed values the fee of the next higher step applies, so a value of ${h.eur(10500)} costs the same as ${h.eur(13000)}. The higher the value, the wider the steps and the flatter the curve.</p>
<h2>A worked example</h2>
<p>A couple earns ${h.eur(2200)} and ${h.eur(1600)} net a month. Each has a German state pension account, so two entitlements are split.</p>
<ul>
<li>Divorce: three months’ net income, ${h.eur(bsp.eheWert)} (${h.src('famgkg43', 'section 43 FamGKG')}).</li>
<li>Pension splitting: ${h.eur(bsp.vaWert)}.</li>
<li>Total value ${h.eur(bsp.gesamtWert)}, one fee ${h.eur(bsp.gerichtsgebuehr, 2)}.</li>
<li>Court fees: ${h.num(h.P.famgkg.kv1110_satz, 1)} × ${h.eur(bsp.gerichtsgebuehr, 2)} = ${h.eur(bsp.gerichtskosten, 2)}.</li>
</ul>
<p>The spouse who files pays the full amount first. After the divorce each bears ${h.eur(bsp.gerichtskosten / 2, 2)}, and the petitioner recovers the difference from the other spouse.</p>
<h2>The advance: no payment, no service</h2>
<p>In divorce cases the fee falls due when the application is filed. Section 14(1) FamGKG says the court should serve the application on the other spouse only after the procedure fee has been paid, so the case effectively waits for your transfer. The invoice is based on a provisional value; if the final value differs, the court charges the balance or refunds it.</p>
<p>No advance is required once legal aid (Verfahrenskostenhilfe) has been granted (section 15 FamGKG), which is why many petitioners file the aid application together with the divorce application. Whether aid comes with or without instalments is explained under ${h.a('verfahrenskostenhilfe', 'legal aid')}.</p>
<h2>The reduced rate of 0.5</h2>
<p>Item 1111 lowers the rate to ${h.num(h.P.famgkg.kv1111_satz, 1)} when the case ends without a contested final decision. The main cases:</p>
<ul>
<li>the divorce application is withdrawn before the hearing, for example after a reconciliation,</li>
<li>an ancillary matter is settled by court settlement,</li>
<li>the matter is disposed of without a cost decision by the court.</li>
</ul>
<p>It does not apply to a divorce order, even one without reasons, so an amicable divorce pays the full ${h.num(h.P.famgkg.kv1110_satz, 1)} rate. In the example a timely withdrawal saves ${h.eur(bsp.gerichtskosten - bspRueck, 2)}.</p>
<h2>Who bears the court fees in the end</h2>
<p>If the divorce is granted, costs are set off (${h.src('famfg150', 'section 150(1) FamFG')}), which for court fees means half each. If the application is dismissed or withdrawn, the petitioner pays alone. The court may split differently on grounds of fairness and should follow any cost agreement the spouses made.</p>
<p>Court fees are the smaller part of the total. What lawyers charge is explained under ${h.a('anwaltskosten-scheidung', 'lawyer fees for divorce')}; both together appear in the ${h.a('scheidungskosten-rechner', 'divorce cost calculator')}, and the ${h.a('verfahrenswert', 'value of proceedings')} page shows how the value is built.</p>
<p>This overview of German divorce court fees is general information, not legal advice; the fee invoice of your family court is what counts.</p>`,
  },
});
