import { defineGuide } from '../../lib/guide-types';
import { rvgGebuehr, scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';
import { r2 } from '../../lib/engine/params';

const R = P.rvg;
/** Anwaltsrechnung für einen Wert, wie sie der Motor bildet: 1,3 + 1,2, Pauschale, Umsatzsteuer. */
const rechnung = (w: number) => {
  const g = rvgGebuehr(w);
  const verfahren = r2(R.vv3100 * g), termin = r2(R.vv3104 * g);
  const auslagen = r2(Math.min(R.vv7002_max, R.vv7002_anteil * (verfahren + termin)));
  const netto = r2(verfahren + termin + auslagen);
  return { w, g, verfahren, termin, auslagen, netto, brutto: r2(netto * (1 + R.ust)) };
};
const tab = [3000, 6000, 9000, 12000, 16000, 25000, 40000, 65000].map(rechnung);
/** Leitbeispiel aus dem Motor: 1.800 € und 1.200 € netto, zwei Anrechte. */
const bsp = scheidungskosten({ netto1: 1800, netto2: 1200, anrechte: 2, anwaelte: 1 });
/** Dasselbe Paar mit Einigung über Zugewinn im Wert von 15.000 € im Verbund. */
const bspEinig = scheidungskosten({ netto1: 1800, netto2: 1200, anrechte: 2, anwaelte: 1, folgesachenWert: 15000, einigungWert: 15000 });
const aussergerichtlich = r2(R.vv1000 * rvgGebuehr(15000));
const anteil = bsp.anwalt.brutto / bsp.gesamt;

export default defineGuide({
  id: 'anwaltskosten-scheidung',
  group: 'scheidung',
  order: 16,
  mini: 'rvg',
  related: ['scheidungskosten', 'gerichtskosten-scheidung', 'verfahrenswert', 'scheidungskosten-rechner', 'verfahrenskostenhilfe'],
  sources: ['rvg13', 'rvgVv', 'rvgTabelle', 'famfg114', 'famfg150'],
  de: {
    slug: 'anwaltskosten-scheidung',
    nav: 'Anwaltskosten',
    card: 'Was der Scheidungsanwalt 2026 nach RVG berechnet: Verfahrens- und Terminsgebühr, Einigung, Auslagen, USt.',
    title: 'Anwaltskosten Scheidung 2026: Gebühren nach dem RVG',
    description: `Anwaltskosten der Scheidung 2026: Verfahrensgebühr ${DE.num(R.vv3100, 1)}, Terminsgebühr ${DE.num(R.vv3104, 1)}, Einigungsgebühr, Pauschale und ${DE.pct(R.ust)} USt, Tabelle nach Wert und ein Beispiel.`,
    h1: 'Anwaltskosten der Scheidung nach dem RVG',
    intro: 'Wie sich die Rechnung des Scheidungsanwalts zusammensetzt und warum sie meist den größten Teil der Scheidungskosten ausmacht.',
    resume: `Ein Scheidungsanwalt berechnet 2026 nach dem Rechtsanwaltsvergütungsgesetz (RVG) eine Verfahrensgebühr von ${DE.num(R.vv3100, 1)} (VV 3100) und eine Terminsgebühr von ${DE.num(R.vv3104, 1)} (VV 3104), jeweils aus der Gebührentabelle zu § 13 RVG. Hinzu kommen die Auslagenpauschale von ${DE.pct(R.vv7002_anteil)} der Gebühren, höchstens ${DE.eur(R.vv7002_max)} (VV 7002), und ${DE.pct(R.ust)} Umsatzsteuer (VV 7008). Verdienen die Ehegatten ${DE.eur(1800)} und ${DE.eur(1200)} netto und sind zwei Rentenanrechte zu teilen, beträgt der Verfahrenswert ${DE.eur(bsp.gesamtWert)}. Die volle Gebühr liegt dann bei ${DE.eur(rvgGebuehr(bsp.gesamtWert), 2)}, die Anwaltsrechnung bei ${DE.eur(bsp.anwalt.brutto, 2)} brutto, das sind ${DE.pct(anteil)} der gesamten Scheidungskosten mit einem Anwalt. Einigen sich die Ehegatten im Verfahren über eine anhängige Folgesache, kommt eine Einigungsgebühr von ${DE.num(R.vv1003, 1)} hinzu (VV 1003); bei einer Einigung über Gegenstände, die nicht bei Gericht anhängig sind, beträgt sie ${DE.num(R.vv1000, 1)} (VV 1000). Jeder Ehegatte zahlt seinen eigenen Anwalt, denn die Kosten werden bei der Scheidung gegeneinander aufgehoben (§ 150 FamFG).`,
    faqs: [
      { q: 'Darf der Scheidungsanwalt weniger als die RVG-Gebühren verlangen?', a: 'Im gerichtlichen Verfahren nicht. Das RVG erlaubt eine niedrigere als die gesetzliche Vergütung nur für außergerichtliche Angelegenheiten. Für den Scheidungsantrag vor dem Familiengericht sind die Gebühren nach Verfahrenswert deshalb die Untergrenze. Angebote mit Festpreisen unter diesem Betrag sollten Sie daraufhin prüfen, was sie tatsächlich abdecken. Eine höhere Vergütung, etwa ein Stundenhonorar, ist dagegen erlaubt, wenn sie in Textform vereinbart ist.' },
      { q: 'Fällt die Terminsgebühr auch bei einer einvernehmlichen Scheidung an?', a: `Ja. Das Familiengericht hört die Ehegatten in einem Termin persönlich an, bevor es die Scheidung ausspricht, auch wenn beide einverstanden sind. Für die Teilnahme verdient der Anwalt die Terminsgebühr von ${DE.num(R.vv3104, 1)}. Sie ist nur einmal geschuldet, auch wenn es mehrere Termine gibt. Im Beispiel mit ${DE.eur(bsp.gesamtWert)} Verfahrenswert macht sie netto ${DE.eur(bsp.anwalt.termin, 2)} aus.` },
      { q: 'Wann kostet eine Einigung beim Scheidungsanwalt 1,0 und wann 1,5?', a: `Der Satz hängt davon ab, ob der Gegenstand bei Gericht anhängig ist. Für eine Einigung über eine Folgesache, die schon im Verfahren läuft, gilt ${DE.num(R.vv1003, 1)} (VV 1003). Für eine Einigung über Dinge, die nicht anhängig sind, etwa in einer außergerichtlichen Scheidungsfolgenvereinbarung, gilt ${DE.num(R.vv1000, 1)} (VV 1000). Bei ${DE.eur(15000)} Wert sind das ${DE.eur(bspEinig.anwalt.einigung, 2)} oder ${DE.eur(aussergerichtlich, 2)} netto.` },
      { q: 'Kann ein Anwalt beide Ehegatten bei der Scheidung vertreten?', a: 'Nein. Ein Anwalt darf nicht für Mandanten mit widerstreitenden Interessen tätig werden, und die Ehegatten haben im Scheidungsverfahren gegenläufige Rollen, auch wenn sie sich einig sind. Möglich ist, dass nur ein Ehegatte einen Anwalt beauftragt und der andere ohne Anwalt zustimmt; das lässt § 114 Abs. 4 FamFG für die Zustimmung zu. Beraten wird dann aber nur der Mandant.' },
      { q: 'Was zahlt die Staatskasse dem Anwalt bei Verfahrenskostenhilfe?', a: 'Ist Verfahrenskostenhilfe bewilligt und der Anwalt beigeordnet, rechnet er mit der Staatskasse ab, und zwar ab einem bestimmten Wert nach einer eigenen, niedrigeren Gebührentabelle (§ 49 RVG). Von Ihnen darf er für das Verfahren keine weitere Vergütung verlangen, solange die Bewilligung besteht. Raten, die das Gericht festsetzt, zahlen Sie an die Staatskasse, nicht an den Anwalt.' },
    ],
    body: (h) => `<h2>Wie der Anwalt abrechnet</h2>
<p>Scheidungsanwälte rechnen in der Regel nach dem Rechtsanwaltsvergütungsgesetz ab. Grundlage ist eine volle Gebühr, die ${h.src('rvg13', '§ 13 RVG')} nach dem Gegenstandswert festlegt; die Beträge stehen in der ${h.src('rvgTabelle', 'Gebührentabelle der Anlage 2')}. Das ${h.src('rvgVv', 'Vergütungsverzeichnis der Anlage 1')} bestimmt, welches Vielfache dieser Gebühr für welche Tätigkeit anfällt. Der Gegenstandswert ist bei der Scheidung der Verfahrenswert, den das Familiengericht festsetzt.</p>
<p>In einer gewöhnlichen Scheidung entstehen vier Positionen:</p>
<ul>
<li>Verfahrensgebühr ${h.num(h.P.rvg.vv3100, 1)} (VV 3100) für das Betreiben des Verfahrens, vom Antrag bis zum Beschluss,</li>
<li>Terminsgebühr ${h.num(h.P.rvg.vv3104, 1)} (VV 3104) für die Wahrnehmung des Anhörungstermins,</li>
<li>Pauschale für Post und Telekommunikation, ${h.pct(h.P.rvg.vv7002_anteil, 0)} der Gebühren, höchstens ${h.eur(h.P.rvg.vv7002_max)} (VV 7002),</li>
<li>Umsatzsteuer von ${h.pct(h.P.rvg.ust, 0)} auf alles (VV 7008).</li>
</ul>
<h2>Anwaltsgebühren nach Verfahrenswert</h2>
${h.table(['Verfahrenswert', '1,0-Gebühr', 'Verfahren 1,3', 'Termin 1,2', 'Pauschale', 'Brutto'], tab.map((t) => [h.eur(t.w), h.eur(t.g, 2), h.eur(t.verfahren, 2), h.eur(t.termin, 2), h.eur(t.auslagen, 2), h.eur(t.brutto, 2)]), 'Ein Anwalt, ohne Einigung; Gebühren nach Anlage 2 zu § 13 RVG, vom Rechner ermittelt', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Pauschale erreicht ihre Obergrenze schon bei kleinen Werten, sie ist in der Tabelle fast immer ${h.eur(h.P.rvg.vv7002_max)}. Alle anderen Positionen wachsen mit dem Wert, aber langsamer als er.</p>
<h2>Das Beispiel Schritt für Schritt</h2>
<p>Ein Paar verdient ${h.eur(1800)} und ${h.eur(1200)} netto, beide haben ein Konto bei der gesetzlichen Rentenversicherung. Der Verfahrenswert beträgt ${h.eur(bsp.eheWert)} für die Ehesache und ${h.eur(bsp.vaWert)} für den Versorgungsausgleich, zusammen ${h.eur(bsp.gesamtWert)}. Daraus:</p>
<ul>
<li>Verfahrensgebühr: ${h.eur(bsp.anwalt.verfahren, 2)},</li>
<li>Terminsgebühr: ${h.eur(bsp.anwalt.termin, 2)},</li>
<li>Pauschale: ${h.eur(bsp.anwalt.auslagen, 2)},</li>
<li>Umsatzsteuer: ${h.eur(bsp.anwalt.ust, 2)},</li>
<li>Rechnung gesamt: ${h.eur(bsp.anwalt.brutto, 2)}.</li>
</ul>
<p>Die Gerichtskosten desselben Verfahrens betragen ${h.eur(bsp.gerichtskosten, 2)}. Der Anwalt ist also der größere Posten, weil die RVG-Tabelle bei gleichem Wert höhere Beträge vorsieht und zweieinhalb Gebühren statt zwei anfallen. Die Gerichtsseite erklären die ${h.a('gerichtskosten-scheidung', 'Gerichtskosten der Scheidung')}.</p>
<h2>Einigungsgebühr: wenn mehr geregelt wird</h2>
<p>Viele Ehegatten regeln im Zuge der Scheidung auch Unterhalt, Zugewinn oder die Wohnung. Läuft eine solche Folgesache im Verbund und einigen sich die Ehegatten darüber, verdient jeder beteiligte Anwalt zusätzlich eine Einigungsgebühr von ${h.num(h.P.rvg.vv1003, 1)} aus dem Wert dieser Folgesache. Mit einer Einigung über einen Zugewinn von ${h.eur(15000)} steigt die Rechnung im Beispiel von ${h.eur(bsp.anwalt.brutto, 2)} auf ${h.eur(bspEinig.anwalt.brutto, 2)}, weil sich auch Verfahrens- und Terminsgebühr nach dem höheren Gesamtwert richten.</p>
<p>Wird eine Einigung über Gegenstände erzielt, die nicht bei Gericht anhängig sind, beträgt der Satz ${h.num(h.P.rvg.vv1000, 1)}. Das betrifft etwa eine Scheidungsfolgenvereinbarung, die vorab mit anwaltlicher Hilfe ausgehandelt wird.</p>
<h2>Vereinbartes Honorar statt RVG</h2>
<p>Anwälte dürfen eine eigene Vergütung vereinbaren, etwa nach Stunden. Die Vereinbarung braucht Textform und muss klar vom übrigen Auftrag getrennt sein. Für das gerichtliche Verfahren darf sie die gesetzlichen Gebühren nicht unterschreiten; darüber hinausgehen darf sie. Wer mit Stundensatz abgerechnet wird, bekommt vom anderen Ehegatten ohnehin nichts erstattet, weil jeder seinen Anwalt selbst trägt (${h.src('famfg150', '§ 150 Abs. 1 FamFG')}). Für eine erste Beratung von Verbrauchern ohne Vereinbarung sieht § 34 RVG eine gesetzliche Obergrenze vor.</p>
<h2>Vorschuss und Fälligkeit</h2>
<p>Die Vergütung wird fällig, wenn der Auftrag erledigt oder die Angelegenheit beendet ist, bei der Scheidung also in der Regel mit dem Beschluss (§ 8 RVG). Vorher darf der Anwalt einen angemessenen Vorschuss verlangen (§ 9 RVG). Viele Kanzleien fordern zu Beginn die Verfahrensgebühr nach dem vorläufigen Wert an und rechnen die Terminsgebühr nach dem Anhörungstermin ab. Setzt das Gericht am Ende einen anderen Verfahrenswert fest, ändert sich auch die Anwaltsrechnung: Ein höherer Wert führt zu einer Nachforderung, ein niedrigerer zu einer Gutschrift. Die endgültige Rechnung muss jede Gebühr mit Nummer des Vergütungsverzeichnisses, Wert und Satz ausweisen, sodass Sie sie mit der Tabelle oben nachrechnen können.</p>
<h2>Muss jeder Ehegatte einen Anwalt haben?</h2>
<p>Für den Scheidungsantrag ja, für die bloße Zustimmung nein (${h.src('famfg114', '§ 114 FamFG')}). Diese Gestaltung halbiert die Anwaltskosten des Paares, hat aber Folgen: Der Ehegatte ohne Anwalt kann im Verfahren keine eigenen Anträge stellen und wird von niemandem beraten. Was sich dadurch insgesamt ändert, rechnet der ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')} vor; wer die Rechnung nicht tragen kann, findet die Voraussetzungen der ${h.a('verfahrenskostenhilfe', 'Verfahrenskostenhilfe')} auf einer eigenen Seite.</p>
<p>Die Beträge dieser Seite beschreiben die gesetzliche Vergütung allgemein und sind keine Rechtsberatung; was Ihr Anwalt konkret berechnet, ergibt sich aus Auftrag, Verfahrenswert und einer etwaigen Vergütungsvereinbarung.</p>`,
  },
  en: {
    slug: 'lawyer-fees-divorce',
    nav: 'Lawyer fees',
    card: 'What a German divorce lawyer charges under the RVG in 2026: procedure and hearing fee, settlement, VAT.',
    title: 'Lawyer Fees for Divorce in Germany 2026: the RVG Rates',
    description: `Lawyer fees for a German divorce in 2026: ${EN.num(R.vv3100, 1)} procedure fee, ${EN.num(R.vv3104, 1)} hearing fee, settlement fee, the flat expenses and ${EN.pct(R.ust)} VAT, with a fee table by value.`,
    h1: 'Lawyer fees for a divorce in Germany',
    intro: 'How a German divorce lawyer’s bill is built and why it is usually the largest part of the cost.',
    resume: `Under the Lawyers’ Fees Act (Rechtsanwaltsvergütungsgesetz, RVG), a German divorce lawyer charges a procedure fee of ${EN.num(R.vv3100, 1)} (item 3100) and a hearing fee of ${EN.num(R.vv3104, 1)} (item 3104) in 2026, both taken from the fee table under section 13 RVG. On top come flat expenses of ${EN.pct(R.vv7002_anteil)} of the fees, capped at ${EN.eur(R.vv7002_max)} (item 7002), and ${EN.pct(R.ust)} VAT (item 7008). If the spouses take home ${EN.eur(1800)} and ${EN.eur(1200)} a month and two pension entitlements are split, the value is ${EN.eur(bsp.gesamtWert)}. One full fee is then ${EN.eur(rvgGebuehr(bsp.gesamtWert), 2)} and the lawyer’s bill ${EN.eur(bsp.anwalt.brutto, 2)} including VAT, ${EN.pct(anteil)} of the total divorce cost with one lawyer. If the spouses settle a pending ancillary matter, a ${EN.num(R.vv1003, 1)} settlement fee is added (item 1003); for a settlement on matters not before the court the rate is ${EN.num(R.vv1000, 1)} (item 1000). Each spouse pays his or her own lawyer, because costs are set off when the divorce is granted (section 150 FamFG).`,
    faqs: [
      { q: 'Can a German divorce lawyer charge less than the RVG fees?', a: 'Not for court proceedings. The RVG only allows fees below the statutory level for out-of-court work, so the value-based fees are the floor for a divorce application before the family court. Fixed-price offers below that level deserve a close look at what they actually include. Higher fees, such as an hourly rate, are allowed if agreed in text form, which an email can satisfy.' },
      { q: 'Is there a hearing fee even in an uncontested divorce?', a: `Yes. The family court hears both spouses in person before granting the divorce, even when they agree. For attending, the lawyer earns the ${EN.num(R.vv3104, 1)} hearing fee, once, however many hearings there are. In our example with a value of ${EN.eur(bsp.gesamtWert)} it comes to ${EN.eur(bsp.anwalt.termin, 2)} before VAT. If you live abroad, ask the court early whether you must attend in person.` },
      { q: 'When does a settlement cost 1.0 and when 1.5 fees?', a: `It depends on whether the matter is pending in court. A settlement on an ancillary matter already in the proceedings carries ${EN.num(R.vv1003, 1)} (item 1003). A settlement on matters not before the court, for instance a separation agreement negotiated beforehand, carries ${EN.num(R.vv1000, 1)} (item 1000). On a value of ${EN.eur(15000)} that is ${EN.eur(bspEinig.anwalt.einigung, 2)} or ${EN.eur(aussergerichtlich, 2)} before VAT.` },
      { q: 'Can one lawyer act for both of us in a German divorce?', a: 'No. A German lawyer may not represent clients with conflicting interests, and in divorce proceedings the spouses have opposite roles even when they agree. What is possible is that only one spouse instructs a lawyer and the other consents without one, which section 114(4) FamFG allows. Only the client is then advised, so the other spouse should not rely on that lawyer for guidance.' },
      { q: 'What does the state pay the lawyer under legal aid?', a: 'If legal aid (Verfahrenskostenhilfe) is granted and a lawyer assigned, the lawyer bills the state, above a certain value under a separate, lower fee table (section 49 RVG). While the grant stands, the lawyer may not charge you anything further for the proceedings. Any instalments the court orders go to the state treasury, not to the lawyer.' },
    ],
    body: (h) => `<h2>How the bill is built</h2>
<p>German divorce lawyers usually bill under the Lawyers’ Fees Act (RVG). The basis is one full fee, set by ${h.src('rvg13', 'section 13 RVG')} according to the value of the matter and listed in the ${h.src('rvgTabelle', 'fee table of Annex 2')}. The ${h.src('rvgVv', 'fee schedule in Annex 1')} says which multiple of that fee applies to which task. In a divorce, the value is the value of the proceedings fixed by the family court (Familiengericht).</p>
<p>An ordinary divorce produces four items:</p>
<ul>
<li>a procedure fee of ${h.num(h.P.rvg.vv3100, 1)} (item 3100) for running the case from application to order,</li>
<li>a hearing fee of ${h.num(h.P.rvg.vv3104, 1)} (item 3104) for attending the hearing,</li>
<li>flat expenses for post and telecoms, ${h.pct(h.P.rvg.vv7002_anteil, 0)} of the fees, capped at ${h.eur(h.P.rvg.vv7002_max)} (item 7002),</li>
<li>${h.pct(h.P.rvg.ust, 0)} VAT on the total (item 7008).</li>
</ul>
<h2>Lawyer fees by value</h2>
${h.table(['Value', '1.0 fee', 'Procedure 1.3', 'Hearing 1.2', 'Expenses', 'Incl. VAT'], tab.map((t) => [h.eur(t.w), h.eur(t.g, 2), h.eur(t.verfahren, 2), h.eur(t.termin, 2), h.eur(t.auslagen, 2), h.eur(t.brutto, 2)]), 'One lawyer, no settlement; fees under Annex 2 to section 13 RVG, computed by the calculator', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The flat expenses hit their cap at small values already, so they are almost always ${h.eur(h.P.rvg.vv7002_max)}. Everything else grows with the value, but more slowly than the value itself.</p>
<h2>The example in detail</h2>
<p>A couple earns ${h.eur(1800)} and ${h.eur(1200)} net; each has a German state pension account. The value is ${h.eur(bsp.eheWert)} for the divorce and ${h.eur(bsp.vaWert)} for pension splitting, ${h.eur(bsp.gesamtWert)} in total. The lawyer’s bill:</p>
<ul>
<li>procedure fee ${h.eur(bsp.anwalt.verfahren, 2)},</li>
<li>hearing fee ${h.eur(bsp.anwalt.termin, 2)},</li>
<li>expenses ${h.eur(bsp.anwalt.auslagen, 2)},</li>
<li>VAT ${h.eur(bsp.anwalt.ust, 2)},</li>
<li>total ${h.eur(bsp.anwalt.brutto, 2)}.</li>
</ul>
<p>The court fees for the same case are ${h.eur(bsp.gerichtskosten, 2)}. The lawyer costs more because the RVG table is higher at every value and two and a half fees apply instead of two. The court side is explained under ${h.a('gerichtskosten-scheidung', 'court fees for divorce')}.</p>
<h2>Settlement fees when more is resolved</h2>
<p>Many couples also settle maintenance, accrued gains or the home as part of the divorce. If such an ancillary matter is pending in the same proceedings and the spouses agree on it, each lawyer involved earns an extra ${h.num(h.P.rvg.vv1003, 1)} fee on its value. With a settlement on ${h.eur(15000)} of accrued gains, the bill in our example rises from ${h.eur(bsp.anwalt.brutto, 2)} to ${h.eur(bspEinig.anwalt.brutto, 2)}, since the procedure and hearing fees also follow the higher total value. For matters not before the court, such as a separation agreement negotiated in advance, the rate is ${h.num(h.P.rvg.vv1000, 1)}.</p>
<h2>Agreed fees instead of the RVG</h2>
<p>Lawyers may agree their own fees, for example by the hour. The agreement must be in text form and set apart from the rest of the engagement. For court proceedings it may not go below the statutory fees, but it may exceed them. Lawyers used to working with international clients often quote hourly rates; ask for an estimate in euros and whether VAT is included. Since each spouse bears his or her own lawyer (${h.src('famfg150', 'section 150(1) FamFG')}), nothing of an hourly fee is recovered from the other side. For a first consultation of a consumer without an agreement, section 34 RVG sets a statutory cap.</p>
<h2>Does each spouse need a lawyer?</h2>
<p>The petitioner does; the spouse who only consents does not (${h.src('famfg114', 'section 114 FamFG')}). That halves the couple’s lawyer costs, but the unrepresented spouse cannot file own applications and is advised by no one. The ${h.a('scheidungskosten-rechner', 'divorce cost calculator')} shows the difference; if the bill is out of reach, see ${h.a('verfahrenskostenhilfe', 'legal aid')}.</p>
<p>The figures on this page describe statutory lawyer fees in general and are not legal advice; your actual bill depends on the engagement, the value fixed by the court and any fee agreement.</p>`,
  },
});
