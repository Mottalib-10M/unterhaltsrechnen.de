import { defineGuide } from '../../lib/guide-types';
import { steuerNachTarif, erbschaftsteuer, type Klasse } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

const E = P.erbst;
const KL: Klasse[] = ['I', 'II', 'III'];
const G = E.stufen_bis;
const R = E.rundung;

/** Härteausgleich am Beispiel aus dem Motor: 310.000 € steuerpflichtig in Klasse I, knapp über der zweiten Stufengrenze. */
const BSP = 310000;
const haerte = steuerNachTarif(BSP, 'I');
const ohneHaerte = BSP * haerte.satz;
const stufeVorher = G[1] * E.saetze.I[1];
/** Zweites Beispiel: Klasse II knapp über der ersten Grenze. */
const BSP2 = 80000;
const haerte2 = steuerNachTarif(BSP2, 'II');

/** Bis zu welchem Betrag der Härteausgleich über einer Grenze wirkt: der Motor wird in 100-Euro-Schritten befragt. */
function haerteBis(grenzeIdx: number, k: Klasse): number | null {
  const g = G[grenzeIdx];
  if (!steuerNachTarif(g + R, k).haerteausgleich) return null;
  let s = g + R;
  while (steuerNachTarif(s + R, k).haerteausgleich) s += R;
  return s;
}

/** Derselbe Erwerb von 450.000 € bei Kind, Neffe und Lebensgefährte, mit Freibeträgen und Pauschale. */
const ERW = 450000;
const sohn = erbschaftsteuer({ erwerb: ERW, beziehung: 'kind', erbfall: true, alterKind: 40 });
const neffe = erbschaftsteuer({ erwerb: ERW, beziehung: 'nichte_neffe', erbfall: true });
const freund = erbschaftsteuer({ erwerb: ERW, beziehung: 'sonstige', erbfall: true });

export default defineGuide({
  id: 'erbschaftsteuer-steuersaetze',
  group: 'erbe',
  order: 44,
  mini: 'tarif',
  related: ['erbschaftsteuer-rechner', 'erbschaftsteuer-freibetraege', 'gesetzliche-erbfolge', 'erbfolge-ohne-kinder', 'pflichtteil'],
  sources: ['erbstg19', 'erbstg15', 'erbstg10', 'erbstg16'],
  de: {
    slug: 'erbschaftsteuer-steuersaetze',
    nav: "Steuersätze",
    card: `Von ${DE.pct(E.saetze.I[0])} bis ${DE.pct(E.saetze.III[6])}: der Tarif nach § 19 ErbStG, die Stufen und der Härteausgleich an Stufengrenzen.`,
    title: 'Erbschaftsteuer Steuersätze 2026: Tarif und Härteausgleich',
    description: `Erbschaftsteuer-Steuersätze 2026 nach § 19 ErbStG: Klasse I ${DE.pct(E.saetze.I[0])} bis ${DE.pct(E.saetze.I[6])}, Klasse II ab ${DE.pct(E.saetze.II[0])}, Klasse III ${DE.pct(E.saetze.III[0])} oder ${DE.pct(E.saetze.III[6])}, Stufen und Härteausgleich erklärt.`,
    h1: 'Steuersätze der Erbschaftsteuer: Stufen, Klassen, Härteausgleich',
    intro: 'Der Steuersatz gilt für den ganzen steuerpflichtigen Erwerb, nicht nur für den Teil über einer Grenze. Was das bedeutet und wie der Härteausgleich Sprünge glättet.',
    resume: `Die Erbschaftsteuer kennt sieben Wertstufen und drei Steuerklassen (§ 19 Abs. 1 ErbStG). In Steuerklasse I (Ehegatte, Kinder, Enkel) steigt der Satz von ${DE.pct(E.saetze.I[0])} bis ${DE.eur(G[0])} über ${DE.pct(E.saetze.I[1])} bis ${DE.eur(G[1])} und ${DE.pct(E.saetze.I[2])} bis ${DE.eur(G[2])} bis auf ${DE.pct(E.saetze.I[6])} über ${DE.eur(G[5])}. Klasse II (Geschwister, Nichten, Neffen) beginnt bei ${DE.pct(E.saetze.II[0])} und endet bei ${DE.pct(E.saetze.II[6])}, Klasse III (Lebensgefährten, Freunde) zahlt ${DE.pct(E.saetze.III[0])} bis ${DE.eur(G[3])} und darüber ${DE.pct(E.saetze.III[6])}. Anders als bei der Einkommensteuer gilt der erreichte Satz für den gesamten Betrag; damit ein Euro über der Grenze nicht unverhältnismäßig teuer wird, begrenzt der Härteausgleich nach § 19 Abs. 3 die Mehrsteuer auf die Hälfte des Betrags über der Grenze (bei Sätzen über ${DE.pct(E.saetze.III[0])}: drei Viertel). Ein Kind mit ${DE.eur(BSP)} steuerpflichtigem Erwerb zahlt so ${DE.eur(haerte.steuer)} statt ${DE.eur(ohneHaerte)}. Steuerpflichtig ist der Erwerb nach Freibeträgen, abgerundet auf volle ${DE.eur(R)}.`,
    faqs: [
      { q: 'Gilt der höhere Erbschaftsteuersatz nur für den Betrag über der Stufengrenze?', a: `Nein, und das unterscheidet die Erbschaftsteuer von der Einkommensteuer. Wer in Klasse I ${DE.eur(BSP)} steuerpflichtig erwirbt, liegt in der Stufe bis ${DE.eur(G[2])} mit ${DE.pct(E.saetze.I[2])}, und dieser Satz gilt rechnerisch für den ganzen Betrag. Nur der Härteausgleich nach § 19 Abs. 3 ErbStG verhindert, dass dadurch ein Sprung entsteht: Er deckelt die Mehrsteuer gegenüber der Grenze.` },
      { q: `Bis zu welchem Betrag wirkt der Härteausgleich über ${DE.eur(G[1])} in Steuerklasse I?`, a: `Nach der Rechnung unseres Motors bis ${DE.eur(haerteBis(1, 'I') ?? 0)} steuerpflichtigem Erwerb. Bis dahin ist die Steuer aus ${DE.pct(E.saetze.I[1])} auf ${DE.eur(G[1])} plus die Hälfte des Mehrbetrags niedriger als ${DE.pct(E.saetze.I[2])} auf alles. Darüber gilt der volle Satz, weil er dann die günstigere der beiden Rechnungen ist. Die Grenze verschiebt sich mit jeder Stufe und Klasse.` },
      { q: `Warum zahlt Steuerklasse III bis ${DE.eur(G[3])} immer denselben Satz?`, a: `Weil § 19 Abs. 1 ErbStG für Klasse III in den ersten vier Stufen einheitlich ${DE.pct(E.saetze.III[0])} vorsieht und erst darüber ${DE.pct(E.saetze.III[4])}. Für Lebensgefährten und Freunde gibt es also bis ${DE.eur(G[3])} keine Progression und keinen Härteausgleich. Erst beim Sprung auf ${DE.pct(E.saetze.III[4])} greift er mit drei Vierteln des Mehrbetrags.` },
      { q: 'Wird der Erbschaftsteuersatz auf den Wert vor oder nach den Freibeträgen angewandt?', a: `Nach. Erst werden Hausrat-Freibetrag, Erbfallkostenpauschale von ${DE.eur(E.erbfallkosten_pauschale)}, persönlicher Freibetrag und gegebenenfalls Versorgungsfreibetrag abgezogen, dann wird auf volle ${DE.eur(R)} abgerundet (§ 10 Abs. 1 ErbStG). Erst dieser Betrag bestimmt die Stufe. Ein Kind, das ${DE.eur(ERW)} erbt, zahlt deshalb nur ${DE.pct(sohn.satz)} auf ${DE.eur(sohn.steuerpflichtig)}.` },
      { q: 'Gilt für die Schenkungsteuer derselbe Tarif wie für die Erbschaftsteuer?', a: `Ja. § 19 ErbStG gilt für Erwerbe von Todes wegen und für Schenkungen gleichermaßen, mit denselben Stufen und Sätzen. Unterschiede gibt es nur davor: Eltern fallen bei einer Schenkung ihres Kindes in Klasse II statt I, der Versorgungsfreibetrag und die Erbfallkostenpauschale entfallen. Frühere Schenkungen derselben Person innerhalb von ${E.zusammenrechnung_jahre} Jahren werden mitgerechnet.` },
      { q: 'Kann eine frühere Schenkung den Erbschaftsteuersatz für das Erbe erhöhen?', a: `Ja. Nach § 14 ErbStG werden alle Erwerbe von derselben Person innerhalb von ${E.zusammenrechnung_jahre} Jahren zusammengerechnet, und die Stufe richtet sich nach der Summe. Die Steuer, die auf die frühere Schenkung entfiel oder rechnerisch entfallen wäre, wird abgezogen. Wer schon zu Lebzeiten viel erhalten hat, kann deshalb mit dem Erbe in eine höhere Stufe rutschen, obwohl das Erbe allein darunter läge.` },
    ],
    body: (h) => {
      const zeilen = G.map((g, i) => [`bis ${h.eur(g)}`, ...KL.map((k) => h.pct(h.P.erbst.saetze[k][i], 0))]);
      zeilen.push([`über ${h.eur(G[G.length - 1])}`, ...KL.map((k) => h.pct(h.P.erbst.saetze[k][G.length], 0))]);
      const probe = [G[0], G[1], G[2], G[3]];
      const grenzen: Array<[number, Klasse]> = [[0, 'I'], [1, 'I'], [2, 'I'], [0, 'II'], [1, 'II'], [2, 'II'], [3, 'III']];
      return `<h2>Der Tarif nach § 19 Abs. 1 ErbStG</h2>
<p>Der Steuersatz hängt von zwei Dingen ab: von der Steuerklasse des Erwerbers nach § 15 ErbStG und vom Wert des steuerpflichtigen Erwerbs. Die Tabelle zeigt alle Kombinationen, wie sie im Gesetz stehen.</p>
${h.table(['Steuerpflichtiger Erwerb', 'Klasse I', 'Klasse II', 'Klasse III'], zeilen, 'Steuersätze 2026 nach § 19 Abs. 1 ErbStG', ['l', 'r', 'r', 'r'])}
<p>Klasse I umfasst Ehegatten und eingetragene Lebenspartner, Kinder, Stiefkinder, Enkel und, bei einem Erbe, auch Eltern und Großeltern. Klasse II betrifft Geschwister, Nichten und Neffen, Stiefeltern, Schwiegerkinder, Schwiegereltern und den geschiedenen Ehegatten. In Klasse III landen alle übrigen, insbesondere unverheiratete Paare.</p>
<h2>Ein Satz für den ganzen Betrag</h2>
<p>Bei der Einkommensteuer steigt der Satz gleitend, und jeder Euro wird mit dem Satz seiner Zone belastet. Die Erbschaftsteuer arbeitet anders: Der Satz der erreichten Stufe gilt für den gesamten steuerpflichtigen Erwerb. Liegen Sie in Klasse I mit ${h.eur(G[2])} genau auf der Grenze, zahlen Sie ${h.pct(h.P.erbst.saetze.I[2], 0)} auf alles, nicht ${h.pct(h.P.erbst.saetze.I[0], 0)} auf die ersten ${h.eur(G[0])}.</p>
${h.table(['Steuerpflichtiger Erwerb', 'Klasse I', 'Klasse II', 'Klasse III'], probe.map((s) => [h.eur(s), ...KL.map((k) => h.eur(steuerNachTarif(s, k).steuer))]), 'Steuer genau auf den Stufengrenzen, vom Rechner ermittelt', ['l', 'r', 'r', 'r'])}
<p>Ohne Korrektur würde ein Euro über der Grenze die Steuer auf einen Schlag um mehrere Tausend Euro erhöhen. Diesen Sprung fängt der Härteausgleich ab.</p>
<h2>Der Härteausgleich nach § 19 Abs. 3</h2>
<p>Das Gesetz begrenzt den Unterschied zur Steuer, die genau auf der vorherigen Grenze anfiele. Die Mehrsteuer darf höchstens die Hälfte des Betrags über der Grenze ausmachen, wenn der neue Satz bis ${h.pct(h.P.erbst.saetze.III[0], 0)} reicht, und höchstens drei Viertel, wenn er darüber liegt. Die Finanzverwaltung vergleicht also zwei Rechnungen und nimmt die niedrigere.</p>
<p>Ein Beispiel aus Klasse I mit ${h.eur(BSP)} steuerpflichtigem Erwerb:</p>
<ul>
<li>Volle Rechnung: ${h.pct(haerte.satz, 0)} auf ${h.eur(BSP)} ergibt ${h.eur(ohneHaerte)}.</li>
<li>Steuer auf der Grenze: ${h.pct(h.P.erbst.saetze.I[1], 0)} auf ${h.eur(G[1])} ergibt ${h.eur(stufeVorher)}.</li>
<li>Zuschlag: die Hälfte der ${h.eur(BSP - G[1])} über der Grenze, also ${h.eur((BSP - G[1]) * h.P.erbst.haerte_bis_30)}.</li>
<li>Festgesetzt werden ${h.eur(haerte.steuer)}, das sind ${h.eur(ohneHaerte - haerte.steuer)} weniger.</li>
</ul>
<p>In Klasse II wirkt derselbe Mechanismus schon knapp über ${h.eur(G[0])}: Bei ${h.eur(BSP2)} steuerpflichtig werden ${h.eur(haerte2.steuer)} statt ${h.eur(BSP2 * haerte2.satz)} fällig. Die folgende Tabelle zeigt, wie weit der Ausgleich über jede Grenze hinausreicht. Darüber ist der volle Satz wieder günstiger als die Hilfsrechnung.</p>
${h.table(['Grenze', 'Klasse', 'neuer Satz', 'Härteausgleich bis'], grenzen.map(([i, k]) => [h.eur(G[i]), k, h.pct(h.P.erbst.saetze[k][i + 1], 0), h.eur(haerteBis(i, k) ?? G[i])]), 'Vom Rechner in Schritten von 100 € ermittelt', ['l', 'l', 'r', 'r'])}
<h2>Gleicher Erwerb, drei Klassen</h2>
<p>Wie stark die Steuerklasse wirkt, zeigt ein Erwerb von ${h.eur(ERW)}. Ein Sohn zieht ${h.eur(sohn.freibetrag)} Freibetrag und die Pauschale von ${h.eur(sohn.kosten)} ab und zahlt ${h.pct(sohn.satz, 0)} auf ${h.eur(sohn.steuerpflichtig)}, insgesamt ${h.eur(sohn.steuer)}. Ein Neffe versteuert ${h.eur(neffe.steuerpflichtig)} mit ${h.pct(neffe.satz, 0)}, das sind ${h.eur(neffe.steuer)}. Ein Freund des Verstorbenen hat denselben Freibetrag wie der Neffe, zahlt aber ${h.pct(freund.satz, 0)} und damit ${h.eur(freund.steuer)}. Mit Freibeträgen und Abzügen im Einzelnen befasst sich die Seite zu den ${h.a('erbschaftsteuer-freibetraege', 'Freibeträgen')}.</p>
<h2>Steuersatz und tatsächliche Belastung</h2>
<p>Der Satz aus der Tabelle ist nicht die Quote, die vom Erbe tatsächlich abgeht. Weil Freibeträge und Pauschale vorher abgezogen werden, liegt die Belastung des gesamten Erwerbs deutlich darunter: beim Sohn bei ${h.pct(sohn.effektiv)}, beim Neffen bei ${h.pct(neffe.effektiv)}, beim Freund bei ${h.pct(freund.effektiv)} der ${h.eur(ERW)}. Je größer der Nachlass, desto näher rückt die Belastung an den Tarifsatz heran, weil die festen Freibeträge immer weniger ins Gewicht fallen. Für die Planung einer Schenkung ist deshalb meist die tatsächliche Belastung aussagekräftiger als der Satz allein.</p>
<h2>Rundung, Doppelbesteuerung und Grenzen dieser Seite</h2>
<p>Der steuerpflichtige Erwerb wird nach ${h.src('erbstg10', '§ 10 Abs. 1 ErbStG')} auf volle ${h.eur(R)} nach unten abgerundet, die Steuer selbst rechnet der Motor auf volle Euro ab. Nimmt ein Doppelbesteuerungsabkommen Teile des Vermögens von der deutschen Steuer aus, gilt nach § 19 Abs. 2 für den Rest der Satz, der auf den gesamten Erwerb anzuwenden wäre (Progressionsvorbehalt). Sonderregeln für Betriebsvermögen und Unternehmensnachfolge sind hier nicht berücksichtigt.</p>
<p>Grundlage sind ${h.src('erbstg19', '§ 19 ErbStG')} und ${h.src('erbstg15', '§ 15 ErbStG')}. Die Seite ist eine allgemeine Information zum Erbschaftsteuertarif, keine Rechtsberatung und keine Steuerberatung; die Steuer für Ihren Fall setzt das Finanzamt fest. Den gesamten Weg vom Nachlass zur Steuer geht der ${h.a('erbschaftsteuer-rechner', 'Erbschaftsteuer-Rechner')}.</p>`;
    },
  },
  en: {
    slug: 'inheritance-tax-rates',
    nav: "Tax rates",
    card: `From ${EN.pct(E.saetze.I[0])} to ${EN.pct(E.saetze.III[6])}: the German rate table, its seven bands and the hardship relief at each threshold.`,
    title: 'Inheritance Tax Rates Germany 2026: Bands and Relief',
    description: `German inheritance tax rates 2026 under section 19 ErbStG: class I ${EN.pct(E.saetze.I[0])} to ${EN.pct(E.saetze.I[6])}, class II from ${EN.pct(E.saetze.II[0])}, class III ${EN.pct(E.saetze.III[0])} or ${EN.pct(E.saetze.III[6])}, plus threshold relief explained.`,
    h1: 'German inheritance tax rates: bands, classes and hardship relief',
    intro: 'In Germany the rate you reach applies to the whole taxable amount, not just the slice above a threshold. Here is how that works and how the relief smooths the jumps.',
    resume: `German inheritance and gift tax uses seven value bands and three tax classes (section 19(1) of the Inheritance Tax Act, ErbStG). In class I (spouse, children, grandchildren) the rate rises from ${EN.pct(E.saetze.I[0])} up to ${EN.eur(G[0])}, to ${EN.pct(E.saetze.I[1])} up to ${EN.eur(G[1])}, ${EN.pct(E.saetze.I[2])} up to ${EN.eur(G[2])}, and finally ${EN.pct(E.saetze.I[6])} above ${EN.eur(G[5])}. Class II (siblings, nieces, nephews, in-laws) runs from ${EN.pct(E.saetze.II[0])} to ${EN.pct(E.saetze.II[6])}; class III (unmarried partners, friends) pays a flat ${EN.pct(E.saetze.III[0])} up to ${EN.eur(G[3])} and ${EN.pct(E.saetze.III[6])} beyond. Unlike income tax brackets, the rate reached applies to the entire taxable amount. To stop one extra euro from costing thousands, hardship relief (Härteausgleich, section 19(3)) caps the extra tax at half of the excess over the threshold, or three quarters for rates above ${EN.pct(E.saetze.III[0])}. A child taxed on ${EN.eur(BSP)} pays ${EN.eur(haerte.steuer)} instead of ${EN.eur(ohneHaerte)}. The taxable amount is what remains after allowances, rounded down to the nearest ${EN.eur(R)}.`,
    faqs: [
      { q: 'Is German inheritance tax charged in marginal brackets like income tax?', a: `No. In Germany the band you reach sets one rate for the whole taxable amount. A child taxed on ${EN.eur(G[2])} pays ${EN.pct(E.saetze.I[2])} on all of it, ${EN.eur(steuerNachTarif(G[2], 'I').steuer)}. Only the hardship relief in section 19(3) ErbStG prevents a cliff edge just above each threshold, by limiting the extra tax to a share of the amount over it.` },
      { q: 'Which German tax class am I in as a stepchild, niece or partner?', a: `Stepchildren are in class I, like biological and adopted children. Nieces and nephews, siblings, step-parents, children-in-law, parents-in-law and a divorced spouse are in class II. An unmarried partner, a friend and purpose grants (Zweckzuwendungen) fall into class III. Classes are set by section 15 ErbStG and do not depend on nationality or where you live.` },
      { q: `How much does the hardship relief save just above ${EN.eur(G[0])} in class II?`, a: `On ${EN.eur(BSP2)} taxable, class II would owe ${EN.pct(haerte2.satz)} on everything, ${EN.eur(BSP2 * haerte2.satz)}. With relief the tax is ${EN.pct(E.saetze.II[0])} on ${EN.eur(G[0])} plus half of the ${EN.eur(BSP2 - G[0])} above it: ${EN.eur(haerte2.steuer)}. The relief keeps working up to ${EN.eur(haerteBis(0, 'II') ?? 0)} by our engine’s calculation, after which the full rate is the cheaper result.` },
      { q: 'Does a foreign estate change the German rate I pay?', a: `It can. Where a double taxation treaty takes part of the assets out of German tax, section 19(2) ErbStG still applies the rate that the whole acquisition would reach (progression proviso). The exempt assets are not taxed in Germany, but they can push the remaining German part into a higher band. Whether a treaty exists and how it divides the assets depends on the countries involved.` },
      { q: 'Can an earlier gift push my German inheritance into a higher band?', a: `Yes. Section 14 ErbStG adds together everything received from the same person within ${E.zusammenrechnung_jahre} years, and the band is set by the total. The tax that was, or notionally would have been, due on the earlier gift is then credited. A large lifetime gift from a parent can therefore lift the later inheritance into a higher rate even if the inheritance alone would sit lower.` },
    ],
    body: (h) => {
      const rows = G.map((g, i) => [`up to ${h.eur(g)}`, ...KL.map((k) => h.pct(h.P.erbst.saetze[k][i], 0))]);
      rows.push([`over ${h.eur(G[G.length - 1])}`, ...KL.map((k) => h.pct(h.P.erbst.saetze[k][G.length], 0))]);
      const grenzen: Array<[number, Klasse]> = [[0, 'I'], [1, 'I'], [2, 'I'], [0, 'II'], [1, 'II'], [2, 'II'], [3, 'III']];
      const mehr = [G[0] + 5000, G[1] + 20000, G[2] + 50000];
      return `<h2>The rate table in section 19(1)</h2>
<p>Two things set your rate: the tax class (Steuerklasse) given by your relationship to the deceased or donor under section 15, and the taxable value of what you receive. The statute prints them as one grid.</p>
${h.table(['Taxable amount', 'Class I', 'Class II', 'Class III'], rows, 'German inheritance and gift tax rates 2026, section 19(1) ErbStG', ['l', 'r', 'r', 'r'])}
<p>Class I covers spouses and registered partners, children, stepchildren, grandchildren and, on a death, parents and grandparents. Class II covers siblings, nieces and nephews, step-parents, children-in-law, parents-in-law and former spouses. Everyone else, including unmarried couples, is class III.</p>
<h2>One rate on everything</h2>
<p>If you are used to income tax brackets, this is the surprise: Germany applies the rate of the band you land in to the whole taxable acquisition. There is no 0 % slice at the bottom; the tax-free part is handled earlier by the allowances (Freibeträge). The table below shows what that means a little above each of the first three thresholds, before and after relief.</p>
${h.table(['Taxable amount', 'Class I, full rate', 'Class I, actual tax', 'Class II, actual tax'], mehr.map((s) => [h.eur(s), h.eur(s * steuerNachTarif(s, 'I').satz), h.eur(steuerNachTarif(s, 'I').steuer), h.eur(steuerNachTarif(s, 'II').steuer)]), 'Computed by the calculator', ['l', 'r', 'r', 'r'])}
<h2>How the hardship relief is calculated</h2>
<p>Section 19(3) compares the tax with the tax due exactly at the previous threshold. The difference may not exceed half of the amount above the threshold where the new rate is up to ${h.pct(h.P.erbst.saetze.III[0], 0)}, or three quarters where it is higher. The tax office (Finanzamt) applies whichever result is lower; you do not have to claim it.</p>
<ul>
<li>Class I, ${h.eur(BSP)} taxable: the full rate of ${h.pct(haerte.satz, 0)} would give ${h.eur(ohneHaerte)}.</li>
<li>At the threshold, ${h.pct(h.P.erbst.saetze.I[1], 0)} of ${h.eur(G[1])} is ${h.eur(stufeVorher)}.</li>
<li>Half of the ${h.eur(BSP - G[1])} excess adds ${h.eur((BSP - G[1]) * h.P.erbst.haerte_bis_30)}.</li>
<li>Tax due: ${h.eur(haerte.steuer)}, a saving of ${h.eur(ohneHaerte - haerte.steuer)}.</li>
</ul>
${h.table(['Threshold', 'Class', 'Next rate', 'Relief applies up to'], grenzen.map(([i, k]) => [h.eur(G[i]), k, h.pct(h.P.erbst.saetze[k][i + 1], 0), h.eur(haerteBis(i, k) ?? G[i])]), 'Found by the engine in €100 steps', ['l', 'l', 'r', 'r'])}
<p>In class III there is no relief until ${h.eur(G[3])}, because the rate stays at ${h.pct(h.P.erbst.saetze.III[0], 0)} through the first four bands. When it jumps to ${h.pct(h.P.erbst.saetze.III[4], 0)}, the three-quarter cap applies and keeps working over a wide range.</p>
<h2>The same ${h.eur(ERW)}, three heirs</h2>
<p>A son deducts his ${h.eur(sohn.freibetrag)} allowance and the ${h.eur(sohn.kosten)} flat estate-cost deduction and pays ${h.pct(sohn.satz, 0)} on ${h.eur(sohn.steuerpflichtig)}: ${h.eur(sohn.steuer)}. A nephew is taxed on ${h.eur(neffe.steuerpflichtig)} at ${h.pct(neffe.satz, 0)}, ${h.eur(neffe.steuer)}. A close friend has the same allowance as the nephew but pays ${h.pct(freund.satz, 0)}, ${h.eur(freund.steuer)}. For expats with an unmarried partner, this gap is often the most important number in the whole German system; the ${h.a('erbschaftsteuer-freibetraege', 'allowances page')} sets out what each relationship is worth.</p>
<h2>Headline rate versus what you actually lose</h2>
<p>The band rate is not the share of your inheritance that goes to the tax office. Because allowances and the flat deduction come off first, the real burden on the full ${h.eur(ERW)} is lower: ${h.pct(sohn.effektiv)} for the son, ${h.pct(neffe.effektiv)} for the nephew and ${h.pct(freund.effektiv)} for the friend. The larger the estate, the closer the burden moves towards the band rate, since the fixed allowances matter less and less. When comparing Germany with a home country that taxes estates differently, this effective figure is usually the fairer yardstick.</p>
<h2>Rounding, treaties and what is left out</h2>
<p>The taxable amount is rounded down to the nearest ${h.eur(R)} under ${h.src('erbstg10', 'section 10(1) ErbStG')}; the engine then rounds the tax down to whole euros. Business assets and company succession, which have their own rules, are not covered here.</p>
<p>Rates follow ${h.src('erbstg19', 'section 19 ErbStG')} and classes ${h.src('erbstg15', 'section 15')}. This page is general information on the German rate table, not legal or tax advice; the Finanzamt assesses the actual tax. To run the whole chain from estate to tax, use the ${h.a('erbschaftsteuer-rechner', 'inheritance tax calculator')}.</p>`;
    },
  },
});
