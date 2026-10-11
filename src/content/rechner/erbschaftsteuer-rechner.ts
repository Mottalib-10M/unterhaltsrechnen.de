import { defineGuide } from '../../lib/guide-types';
import { erbschaftsteuer } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand: die Startwerte des Rechners (Kind, 35 Jahre, 650.000 €) und Abwandlungen. */
const start = erbschaftsteuer({ erwerb: 650000, beziehung: 'kind', erbfall: true, alterKind: 35 });
const jung = erbschaftsteuer({ erwerb: 650000, beziehung: 'kind', erbfall: true, alterKind: 12 });
const mitHausrat = erbschaftsteuer({ erwerb: 650000, beziehung: 'kind', erbfall: true, alterKind: 35, hausrat: 30000 });
const schenkung = erbschaftsteuer({ erwerb: 650000, beziehung: 'kind', erbfall: false });
const mitVor = erbschaftsteuer({ erwerb: 650000, beziehung: 'kind', erbfall: true, alterKind: 35, vorerwerbe: 150000 });
const E = P.erbst;

export default defineGuide({
  id: 'erbschaftsteuer-rechner',
  group: 'erbe',
  order: 50,
  tool: 'erbst',
  related: ['erbschaftsteuer-freibetraege', 'erbschaftsteuer-steuersaetze', 'erbrechner', 'pflichtteilsrechner', 'gesetzliche-erbfolge'],
  sources: ['erbstg15', 'erbstg16', 'erbstg17', 'erbstg19', 'erbstg10', 'erbstg13', 'erbstg14'],
  de: {
    slug: 'erbschaftsteuer-rechner',
    nav: "Erbschaftsteuer-Rechner",
    card: 'Erbschaft- oder Schenkungsteuer 2026 für zwölf Verwandtschaftsgrade, mit Versorgungsfreibetrag, Hausrat und Vorschenkungen.',
    title: 'Erbschaftsteuer-Rechner 2026: Freibetrag, Klasse, Steuer',
    description: `Erbschaftsteuer-Rechner 2026: Steuerklasse, Freibetrag bis ${DE.eur(E.freibetrag.ehegatte)}, Versorgungsfreibetrag, Hausrat, Pauschale ${DE.eur(E.erbfallkosten_pauschale)} und Härteausgleich, auch Schenkung.`,
    h1: 'Erbschaftsteuer berechnen: vom Erbteil zur Steuer',
    intro: 'Geben Sie Wert und Verwandtschaft ein; der Rechner zieht Freibeträge und Pauschale ab und wendet den Tarif mit Härteausgleich an.',
    resume: `Erbt ein ${35}-jähriges Kind ${DE.eur(650000)}, zieht der Rechner zuerst die Erbfallkostenpauschale von ${DE.eur(start.kosten)} (§ 10 Abs. 5 ErbStG) und den Freibetrag von ${DE.eur(start.freibetrag)} (§ 16) ab. Steuerpflichtig bleiben ${DE.eur(start.steuerpflichtig)}, auf volle ${DE.eur(E.rundung)} abgerundet; dafür gilt in Steuerklasse I ein Satz von ${DE.pct(start.satz)} (§ 19), die Erbschaftsteuer beträgt ${DE.eur(start.steuer)}. Wäre das Kind ${12} Jahre alt, käme ein Versorgungsfreibetrag von ${DE.eur(jung.versorgung)} hinzu (§ 17), und die Steuer sänke auf ${DE.eur(jung.steuer)}. Derselbe Betrag als Schenkung zu Lebzeiten kostet ${DE.eur(schenkung.steuer)}, weil die Pauschale entfällt. Der Rechner kennt zwölf Verwandtschaftsgrade von Ehegatte bis Lebensgefährte, berücksichtigt Hausrat in den Grenzen des § 13 und steuerfreie Vorschenkungen der letzten ${E.zusammenrechnung_jahre} Jahre. Er zeigt den Rechenweg mit jeder Vorschrift.`,
    faqs: [
      { q: 'Welchen Wert trage ich im Erbschaftsteuer-Rechner als Erwerb ein?', a: `Den Steuerwert Ihres Anteils nach Abzug der Schulden des Erblassers, die auf Sie entfallen. Bei Geld und Konten ist das der Kontostand am Todestag. Für Immobilien setzt das Finanzamt einen eigenen Steuerwert an, der vom Marktpreis abweichen kann. Die Erbfallkostenpauschale von ${DE.eur(E.erbfallkosten_pauschale)} zieht der Rechner selbst ab; höhere nachgewiesene Bestattungskosten kann er nicht aufnehmen.` },
      { q: 'Was bedeutet im Rechner das Feld steuerfreie Vorschenkungen?', a: `Dort tragen Sie ein, was Sie von derselben Person in den letzten ${E.zusammenrechnung_jahre} Jahren schon erhalten haben, ohne dass Steuer anfiel. Der Rechner addiert es zum Erwerb (§ 14 ErbStG), sodass der Freibetrag nur einmal wirkt. Mit ${DE.eur(150000)} Vorschenkung steigt die Steuer im Beispiel auf ${DE.eur(mitVor.steuer)}. Wurde auf frühere Schenkungen bereits Steuer gezahlt, ist das Ergebnis zu hoch.` },
      { q: 'Berücksichtigt der Erbschaftsteuer-Rechner das Familienheim?', a: `Nein. Die Befreiung für die selbst bewohnte Wohnung des Erblassers nach § 13 Abs. 1 Nr. 4b und 4c ErbStG hängt von Bedingungen ab, die nur im Einzelfall feststehen, etwa dem unverzüglichen Einzug und der späteren Selbstnutzung. Ziehen Sie den Wert eines solchen Hauses vom Erwerb ab, wenn Sie die Befreiung für gesichert halten, und rechnen Sie zum Vergleich auch ohne.` },
      { q: 'Warum zeigt der Rechner einen Steuersatz, aber eine niedrigere Belastung?', a: `Der Satz nach § 19 ErbStG gilt für den steuerpflichtigen Teil nach allen Freibeträgen. Die Zeile Belastung des Erwerbs setzt die Steuer dagegen ins Verhältnis zum ganzen Wert. Im Startbeispiel stehen ${DE.pct(start.satz)} Satz einer Belastung von ${DE.pct(start.effektiv, 1)} gegenüber. Greift der Härteausgleich, liegt die Steuer zusätzlich unter Satz mal Betrag; der Rechenweg nennt das ausdrücklich.` },
    ],
    body: (h) => `<h2>Die Felder des Rechners</h2>
<ul>
<li><strong>Wert des Erwerbs:</strong> der Steuerwert dessen, was Sie erhalten, nach Schulden. Bei mehreren Erben ist es Ihr eigener Anteil, nicht der ganze Nachlass; jeder Erbe wird getrennt besteuert.</li>
<li><strong>Verhältnis zum Erblasser:</strong> zwölf Möglichkeiten von Ehegatte oder eingetragenem Lebenspartner über Kind, Enkel, Eltern, Geschwister, Nichte und Neffe, Stief- und Schwiegerverwandte bis zu anderen Personen wie dem Lebensgefährten. Daraus folgen Steuerklasse und Freibetrag.</li>
<li><strong>Anlass:</strong> Erbe oder Schenkung. Bei der Schenkung entfallen Versorgungsfreibetrag und Erbfallkostenpauschale, und Eltern rutschen in Klasse II.</li>
<li><strong>Alter des Kindes:</strong> erscheint nur bei einem Kind und einem Erbfall und steuert den Versorgungsfreibetrag von ${h.eur(h.P.erbst.versorgung_kind[0][1])} bis ${h.eur(h.P.erbst.versorgung_kind[h.P.erbst.versorgung_kind.length - 1][1])}.</li>
<li><strong>Davon Hausrat:</strong> Möbel, Wäsche und Kleidung. Steuerfrei bis ${h.eur(h.P.erbst.hausrat_stk1)} in Klasse I und ${h.eur(h.P.erbst.hausrat_stk23)} sonst; mehr rechnet der Rechner nicht heraus.</li>
<li><strong>Steuerfreie Vorschenkungen:</strong> Zuwendungen derselben Person aus den letzten ${h.num(h.P.erbst.zusammenrechnung_jahre)} Jahren.</li>
<li><strong>Ihr Anteil am Nachlass:</strong> nur im Erbfall. Die Pauschale für Bestattung und Nachlasskosten gilt nach § 10 Abs. 5 ErbStG insgesamt einmal je Erbfall; Miterben teilen sie nach ihrer Quote.</li>
</ul>
<p>Das Ergebnis zeigt die Steuer, die Steuerklasse mit Satz, den Freibetrag, gegebenenfalls den Versorgungsfreibetrag, den steuerpflichtigen Betrag und die Belastung des Erwerbs. Darunter steht der Rechenweg mit den Paragrafen.</p>
<h2>Fünf Varianten desselben Erbes</h2>
${h.table(['Fall', 'Steuerpflichtig', 'Satz', 'Steuer'], [
  ['Kind, 35 Jahre, Startwerte', h.eur(start.steuerpflichtig), h.pct(start.satz, 0), h.eur(start.steuer)],
  ['Kind, 12 Jahre', h.eur(jung.steuerpflichtig), h.pct(jung.satz, 0), h.eur(jung.steuer)],
  [`Kind, 35 Jahre, ${h.eur(30000)} Hausrat`, h.eur(mitHausrat.steuerpflichtig), h.pct(mitHausrat.satz, 0), h.eur(mitHausrat.steuer)],
  [`Kind, 35 Jahre, ${h.eur(150000)} Vorschenkung`, h.eur(mitVor.steuerpflichtig), h.pct(mitVor.satz, 0), h.eur(mitVor.steuer)],
  ['Schenkung zu Lebzeiten', h.eur(schenkung.steuerpflichtig), h.pct(schenkung.satz, 0), h.eur(schenkung.steuer)],
], `Jeweils ${h.eur(650000)} Erwerb, vom Rechner ermittelt`, ['l', 'r', 'r', 'r'])}
<p>Der Hausrat senkt die Steuer um ${h.eur(start.steuer - mitHausrat.steuer)}, weil er vor dem Freibetrag abgezogen wird. Die Vorschenkung schiebt den Erwerb dagegen in die nächste Stufe mit ${h.pct(mitVor.satz, 0)}. Die Steuersätze und den Härteausgleich erklärt die Seite zu den ${h.a('erbschaftsteuer-steuersaetze', 'Steuersätzen')}, alle Abzüge die Seite zu den ${h.a('erbschaftsteuer-freibetraege', 'Freibeträgen')}.</p>
<h2>Was der Rechner nicht abbildet</h2>
<p>Er kürzt den Versorgungsfreibetrag nicht um steuerfreie Hinterbliebenenrenten, kennt weder die Befreiung des Familienheims noch die Regeln für Betriebsvermögen und vermietete Wohnungen, und er rechnet Vorschenkungen als unversteuert. Andere bewegliche Gegenstände wie ein Auto, die in Klasse I gesondert bis ${h.eur(h.P.erbst.bewegliche_stk1)} frei sind, fragt er nicht ab. Wie viel Sie überhaupt erben, ermittelt der ${h.a('erbrechner', 'Erbrechner')}.</p>
<p>Die Berechnung folgt ${h.src('erbstg15', '§ 15')}, ${h.src('erbstg16', '§ 16')}, ${h.src('erbstg17', '§ 17')} und ${h.src('erbstg19', '§ 19 ErbStG')}. Sie ist eine allgemeine Schätzung der Erbschaftsteuer, keine Rechtsberatung und keine Steuerberatung; verbindlich ist allein der Bescheid des Finanzamts.</p>`,
  },
  en: {
    slug: 'inheritance-tax-calculator',
    nav: "Inheritance tax calculator",
    card: 'German inheritance or gift tax for 2026 across twelve relationships, with pension allowance, household goods and earlier gifts.',
    title: 'Inheritance Tax Calculator Germany 2026: Allowance and Tax',
    description: `German inheritance tax calculator 2026: tax class, allowances up to ${EN.eur(E.freibetrag.ehegatte)}, pension allowance, household goods, ${EN.eur(E.erbfallkosten_pauschale)} flat deduction and gift tax.`,
    h1: 'Calculate German inheritance tax on your share',
    intro: 'Enter what you receive and how you were related; the tool deducts the allowances and applies the German rate table with hardship relief.',
    resume: `If a ${35}-year-old child inherits ${EN.eur(650000)} in Germany, the calculator first deducts the flat estate-cost allowance of ${EN.eur(start.kosten)} (section 10(5) of the Inheritance Tax Act, ErbStG) and the personal allowance (Freibetrag) of ${EN.eur(start.freibetrag)} (section 16). That leaves ${EN.eur(start.steuerpflichtig)} taxable, rounded down to the nearest ${EN.eur(E.rundung)}, taxed in class I at ${EN.pct(start.satz)} (section 19): ${EN.eur(start.steuer)} of inheritance tax (Erbschaftsteuer). A child aged ${12} would also get a pension allowance (Versorgungsfreibetrag) of ${EN.eur(jung.versorgung)} under section 17, cutting the tax to ${EN.eur(jung.steuer)}. The same sum given as a lifetime gift costs ${EN.eur(schenkung.steuer)}, because the flat estate-cost allowance does not apply. The tool covers twelve relationships from spouse to unmarried partner, household goods within the section 13 limits and untaxed gifts from the same person in the last ${E.zusammenrechnung_jahre} years, and lists every step with its legal basis.`,
    faqs: [
      { q: 'What value should I enter for an inheritance with assets abroad?', a: `Enter the value of your own share after the debts that fall on it, in euros. If you or the deceased lived in Germany, assets abroad generally count too (section 2 ErbStG). Any tax the other country charges on them is not taken into account by the calculator. German tax-office valuations of property can differ from market prices.` },
      { q: 'Can I use the calculator for gift tax (Schenkungsteuer) in Germany?', a: `Yes. Switch the occasion to gift. The same tax classes and rates apply, but the pension allowance and the ${EN.eur(E.erbfallkosten_pauschale)} estate-cost allowance drop out, and parents receiving from a child move to class II. On ${EN.eur(650000)} from a parent the gift tax is ${EN.eur(schenkung.steuer)}, against ${EN.eur(start.steuer)} as an inheritance.` },
      { q: 'Why does an earlier gift raise the German inheritance tax result?', a: `Germany adds together everything from the same giver within ${E.zusammenrechnung_jahre} years (section 14 ErbStG), so the allowance works only once. Entering ${EN.eur(150000)} of earlier untaxed gifts lifts the tax in our example from ${EN.eur(start.steuer)} to ${EN.eur(mitVor.steuer)} and the rate to ${EN.pct(mitVor.satz)}. If tax was already paid on those gifts, the real figure is lower.` },
      { q: 'Does the calculator include the family home exemption?', a: `No. The exemption for the home the deceased lived in, under section 13(1) nos. 4b and 4c ErbStG, depends on the spouse or child moving in without delay and living there for years afterwards. If you expect it to apply, deduct the home’s value from the amount entered and compare both results; the tax office decides whether the conditions are met.` },
    ],
    body: (h) => `<h2>What the calculator asks</h2>
<ul>
<li><strong>Value received:</strong> the tax value of your share after debts. With several heirs, enter your share only; each heir is taxed separately in Germany.</li>
<li><strong>Relationship to the deceased:</strong> twelve choices, from spouse or registered partner, child, grandchild and parent to sibling, niece or nephew, step- and in-law relatives and others such as an unmarried partner. This sets the tax class (Steuerklasse) and allowance.</li>
<li><strong>Occasion:</strong> death or gift. On a gift, the pension allowance and the flat estate-cost allowance fall away.</li>
<li><strong>Child’s age:</strong> shown only for a child on a death; it sets the pension allowance between ${h.eur(h.P.erbst.versorgung_kind[h.P.erbst.versorgung_kind.length - 1][1])} and ${h.eur(h.P.erbst.versorgung_kind[0][1])}.</li>
<li><strong>Of which household goods:</strong> furniture, linen and clothing, exempt up to ${h.eur(h.P.erbst.hausrat_stk1)} in class I and ${h.eur(h.P.erbst.hausrat_stk23)} otherwise.</li>
<li><strong>Untaxed prior gifts:</strong> anything from the same person in the last ${h.num(h.P.erbst.zusammenrechnung_jahre)} years.</li>
<li><strong>Your share of the estate:</strong> on death only. The flat allowance for funeral and estate costs applies once per estate under section 10(5) ErbStG, so co-heirs split it by their shares.</li>
</ul>
<p>The result shows the tax, the class and rate, the allowance and any pension allowance, the taxable amount and the effective burden on what you received, followed by each step with its section of the Act.</p>
<h2>One inheritance, five outcomes</h2>
${h.table(['Case', 'Taxable', 'Rate', 'Tax'], [
  ['child aged 35, default values', h.eur(start.steuerpflichtig), h.pct(start.satz, 0), h.eur(start.steuer)],
  ['child aged 12', h.eur(jung.steuerpflichtig), h.pct(jung.satz, 0), h.eur(jung.steuer)],
  [`child aged 35, ${h.eur(30000)} household goods`, h.eur(mitHausrat.steuerpflichtig), h.pct(mitHausrat.satz, 0), h.eur(mitHausrat.steuer)],
  [`child aged 35, ${h.eur(150000)} earlier gift`, h.eur(mitVor.steuerpflichtig), h.pct(mitVor.satz, 0), h.eur(mitVor.steuer)],
  ['lifetime gift', h.eur(schenkung.steuerpflichtig), h.pct(schenkung.satz, 0), h.eur(schenkung.steuer)],
], `${h.eur(650000)} received in each case, computed by the calculator`, ['l', 'r', 'r', 'r'])}
<p>The earlier gift is the costly line: it adds to the taxable amount and moves it into the ${h.pct(mitVor.satz, 0)} band. How bands and hardship relief work is on the ${h.a('erbschaftsteuer-steuersaetze', 'tax rates')} page; every deduction is on the ${h.a('erbschaftsteuer-freibetraege', 'allowances')} page.</p>
<h2>Limits</h2>
<p>The tool does not reduce the pension allowance for tax-free survivor’s pensions, does not apply the family home exemption or the rules for business assets and rented homes, and treats earlier gifts as untaxed. It ignores any foreign inheritance tax, which matters if a relative abroad leaves you assets that their country also taxes. To find out first how large your share is, use the ${h.a('erbrechner', 'inheritance calculator')}.</p>
<p>The calculation follows ${h.src('erbstg15', 'section 15')}, ${h.src('erbstg16', 'section 16')}, ${h.src('erbstg17', 'section 17')} and ${h.src('erbstg19', 'section 19 ErbStG')}. It is a general estimate of German inheritance tax, not legal or tax advice; only the tax office’s assessment notice (Steuerbescheid) is binding.</p>`,
  },
});
