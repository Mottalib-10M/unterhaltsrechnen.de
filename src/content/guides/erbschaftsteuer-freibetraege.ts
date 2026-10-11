import { defineGuide } from '../../lib/guide-types';
import { erbschaftsteuer, persoenlicherFreibetrag, steuerklasse, type Beziehung } from '../../lib/engine/erbe';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand: Witwe mit 900.000 €, Kind von 8 und von 30 Jahren mit 480.000 €, Enkelin, Nichte, Lebensgefährtin. */
const witwe = erbschaftsteuer({ erwerb: 900000, beziehung: 'ehegatte', erbfall: true });
const kind8 = erbschaftsteuer({ erwerb: 480000, beziehung: 'kind', erbfall: true, alterKind: 8 });
const kind30 = erbschaftsteuer({ erwerb: 480000, beziehung: 'kind', erbfall: true, alterKind: 30 });
const enkelin = erbschaftsteuer({ erwerb: 260000, beziehung: 'enkel', erbfall: true });
const nichte = erbschaftsteuer({ erwerb: 90000, beziehung: 'nichte_neffe', erbfall: true });
const partnerin = erbschaftsteuer({ erwerb: 90000, beziehung: 'sonstige', erbfall: true });
const F = P.erbst.freibetrag;
const E = P.erbst;
const VK = E.versorgung_kind;
const J = E.zusammenrechnung_jahre;

const REIHEN: Array<[Beziehung, string, string]> = [
  ['ehegatte', 'Ehegatte, eingetragener Lebenspartner', 'Spouse, registered partner'],
  ['kind', 'Kind, Stiefkind', 'Child, stepchild'],
  ['enkel_kind_verstorben', 'Enkel, wenn dessen Elternteil verstorben ist', 'Grandchild whose parent has died'],
  ['enkel', 'Enkel', 'Grandchild'],
  ['eltern', 'Eltern, Großeltern', 'Parents, grandparents'],
  ['geschwister', 'Geschwister, Nichten, Neffen, Schwiegerkinder', 'Siblings, nieces, nephews, children-in-law'],
  ['geschieden', 'geschiedener Ehegatte', 'divorced spouse'],
  ['sonstige', 'Lebensgefährte, Freunde, alle anderen', 'unmarried partner, friends, everyone else'],
];
/** Altersstufen des § 17 Abs. 2 aus params: [von, bis, Betrag]. */
const STUFEN = VK.map(([bis, betrag], i) => [i === 0 ? 0 : VK[i - 1][0], bis, betrag] as const);

export default defineGuide({
  id: 'erbschaftsteuer-freibetraege',
  group: 'erbe',
  order: 40,
  mini: 'freibetrag',
  related: ['erbschaftsteuer-rechner', 'erbschaftsteuer-steuersaetze', 'gesetzliche-erbfolge', 'ehegattenerbrecht', 'pflichtteil', 'pflichtteilsergaenzung'],
  sources: ['erbstg16', 'erbstg17', 'erbstg15', 'erbstg13', 'erbstg14', 'erbstg10'],
  de: {
    slug: 'erbschaftsteuer-freibetraege',
    nav: "Freibeträge",
    card: `Ehegatte ${DE.eur(F.ehegatte)}, Kind ${DE.eur(F.kind)}, Enkel ${DE.eur(F.enkel)}: alle Freibeträge, Versorgungsfreibetrag und Pauschalen.`,
    title: 'Erbschaftsteuer Freibeträge 2026: Tabelle für alle Erben',
    description: `Erbschaftsteuer-Freibeträge 2026: Ehegatte ${DE.eur(F.ehegatte)}, Kind ${DE.eur(F.kind)}, Enkel ${DE.eur(F.enkel)}, Geschwister ${DE.eur(F.stk2)}, dazu der Versorgungsfreibetrag und Hausrat.`,
    h1: 'Freibeträge bei der Erbschaftsteuer: wer wie viel steuerfrei erbt',
    intro: 'Wie viel steuerfrei bleibt, hängt fast nur vom Verwandtschaftsgrad ab. Die Übersicht zeigt jeden Freibetrag und rechnet ihn an Beispielen durch.',
    resume: `Nach § 16 ErbStG erbt der Ehegatte oder eingetragene Lebenspartner ${DE.eur(F.ehegatte)} steuerfrei, jedes Kind und Stiefkind ${DE.eur(F.kind)}, ein Enkel ${DE.eur(F.enkel)} (oder ${DE.eur(F.enkel_kind_verstorben)}, wenn sein Elternteil schon verstorben ist), Eltern und Großeltern im Erbfall ${DE.eur(F.eltern_erbfall)}. Geschwister, Nichten, Neffen und Schwiegerkinder (Steuerklasse II) sowie Lebensgefährten und Freunde (Steuerklasse III) haben nur ${DE.eur(F.stk2)}. Im Todesfall kommt für den Ehegatten ein Versorgungsfreibetrag von ${DE.eur(E.versorgung_ehegatte)} hinzu (§ 17 ErbStG), für Kinder je nach Alter ${DE.eur(VK[0][1])} bis ${DE.eur(VK[VK.length - 1][1])}; beide werden um steuerfreie Hinterbliebenenrenten gekürzt. Zusätzlich bleiben Hausrat bis ${DE.eur(E.hausrat_stk1)} in Steuerklasse I steuerfrei, und ohne Belege werden ${DE.eur(E.erbfallkosten_pauschale)} Erbfallkosten abgezogen. Eine Witwe, die ${DE.eur(900000)} erbt, versteuert so nur ${DE.eur(witwe.steuerpflichtig)} und zahlt ${DE.eur(witwe.steuer)}. Alle Freibeträge gelten je Person, die gibt, und leben nach ${J} Jahren wieder auf (§ 14 ErbStG).`,
    faqs: [
      { q: 'Wie hoch ist der Erbschaftsteuer-Freibetrag eines Enkels, dessen Vater oder Mutter schon tot ist?', a: `Dann rückt das Enkelkind steuerlich an die Stelle seines verstorbenen Elternteils und erhält wie ein Kind ${DE.eur(F.enkel_kind_verstorben)} (§ 16 Abs. 1 Nr. 2 ErbStG). Lebt der Elternteil noch, sind es ${DE.eur(F.enkel)}. Den Versorgungsfreibetrag nach § 17 gibt es für Enkel allerdings nicht, er steht nur Kindern und Stiefkindern des Verstorbenen zu.` },
      { q: 'Bekommt eine unverheiratete Lebensgefährtin denselben Freibetrag wie eine Ehefrau?', a: `Nein. Ohne Heirat oder eingetragene Lebenspartnerschaft gehört sie in Steuerklasse III und hat nur ${DE.eur(F.stk3)} Freibetrag statt ${DE.eur(F.ehegatte)}, ohne Versorgungsfreibetrag. Erbt sie ${DE.eur(90000)}, zahlt sie nach Abzug der Erbfallkostenpauschale ${DE.eur(partnerin.steuer)}; eine Ehefrau zahlte auf denselben Betrag nichts. Auch eine lange gemeinsame Haushaltsführung ändert die Steuerklasse nicht.` },
      { q: 'Warum ist der Versorgungsfreibetrag eines Kindes bei 27 Jahren zu Ende?', a: `§ 17 Abs. 2 ErbStG staffelt ihn nach dem Alter beim Tod des Elternteils: ${DE.eur(VK[0][1])} bis ${VK[0][0]} Jahre, danach in Stufen weniger, zuletzt ${DE.eur(VK[VK.length - 1][1])} bis zur Vollendung des ${VK[VK.length - 1][0]}. Lebensjahres. Er soll den Unterhalt ersetzen, den das Kind bis zum Ende der Ausbildung typischerweise noch gebraucht hätte. Eine Waisenrente, die nicht der Erbschaftsteuer unterliegt, mindert ihn um ihren Kapitalwert.` },
      { q: 'Wie oft kann man den Freibetrag für ein Kind durch Schenkungen nutzen?', a: `Alle ${J} Jahre neu. Innerhalb von ${J} Jahren werden alle Zuwendungen derselben Person an denselben Empfänger zusammengerechnet (§ 14 ErbStG), der Freibetrag von ${DE.eur(F.kind)} steht für diesen Zeitraum also nur einmal zur Verfügung. Mutter und Vater sind aber zwei Schenker: Jedes Kind kann von jedem Elternteil ${DE.eur(F.kind)} erhalten.` },
      { q: 'Gilt der Hausrat-Freibetrag auch für Schmuck und Bargeld?', a: `Nein. Steuerfrei sind nach § 13 Abs. 1 Nr. 1 ErbStG Möbel, Wäsche, Kleidung und Haushaltsgegenstände, in Steuerklasse I bis ${DE.eur(E.hausrat_stk1)}, dazu andere bewegliche Gegenstände wie Auto oder Bilder bis ${DE.eur(E.bewegliche_stk1)}. In den Klassen II und III gilt für beides zusammen ${DE.eur(E.hausrat_stk23)}. Bargeld, Wertpapiere, Münzen, Edelmetalle, Edelsteine und Perlen sind ausdrücklich ausgenommen.` },
    ],
    body: (h) => `<h2>Die persönlichen Freibeträge nach § 16 ErbStG</h2>
<p>Die Erbschaftsteuer greift erst, wenn ein Erwerb den persönlichen Freibetrag übersteigt. Wie hoch er ist, bestimmt die Beziehung zum Verstorbenen, nicht die Größe des Nachlasses. Die Steuerklasse folgt aus § 15 ErbStG: Klasse I für die engste Familie, Klasse II für Geschwister und Verschwägerte, Klasse III für alle anderen.</p>
${h.table(['Beziehung zum Erblasser', 'Steuerklasse', 'Freibetrag Erbe', 'Freibetrag Schenkung'], REIHEN.map(([b, de]) => [de, steuerklasse(b, true), h.eur(persoenlicherFreibetrag(b, true)), h.eur(persoenlicherFreibetrag(b, false))]), 'Freibeträge 2026 nach §§ 15 und 16 ErbStG, aus den Rechenwerten der Seite', ['l', 'l', 'r', 'r'])}
<p>Nur bei Eltern und Großeltern unterscheiden sich Erbe und Schenkung: Erben sie von ihrem Kind, zählen sie zur Klasse I mit ${h.eur(h.P.erbst.freibetrag.eltern_erbfall)}; beschenkt das Kind sie zu Lebzeiten, fallen sie in Klasse II mit ${h.eur(h.P.erbst.freibetrag.stk2)}. Stiefkinder stehen leiblichen und adoptierten Kindern gleich. Schwiegerkinder dagegen bleiben in Klasse II, auch nach Jahrzehnten in der Familie.</p>
<h2>Versorgungsfreibetrag für Witwe, Witwer und Kinder</h2>
<p>Neben dem persönlichen Freibetrag gewährt § 17 ErbStG im Todesfall einen besonderen Versorgungsfreibetrag. Der überlebende Ehegatte oder eingetragene Lebenspartner erhält ${h.eur(h.P.erbst.versorgung_ehegatte)}. Bei Kindern hängt er vom Alter am Todestag ab:</p>
${h.table(['Alter des Kindes beim Erbfall', 'Versorgungsfreibetrag'], STUFEN.map(([von, bis, b], i) => [i === 0 ? `bis ${bis} Jahre` : i === STUFEN.length - 1 ? `über ${von} Jahre bis zum ${bis}. Geburtstag` : `über ${von} bis ${bis} Jahre`, h.eur(b)]), 'Stufen nach § 17 Abs. 2 ErbStG', ['l', 'r'])}
<p>Bezieht der Hinterbliebene aus dem Todesfall Versorgungsbezüge, die selbst nicht erbschaftsteuerpflichtig sind, etwa eine gesetzliche Witwen- oder Waisenrente, wird der Freibetrag um deren Kapitalwert gekürzt. Bei einer hohen Hinterbliebenenrente kann er dadurch ganz entfallen. Der ${h.a('erbschaftsteuer-rechner', 'Erbschaftsteuer-Rechner')} setzt ihn ungekürzt an; das Ergebnis ist dann eine Untergrenze der Steuer.</p>
<h2>Was die Freibeträge in Euro bedeuten</h2>
${h.table(['Erbe', 'Erwerb', 'Freibeträge', 'Steuerpflichtig', 'Steuer'], [
  ['Witwe', h.eur(900000), h.eur(witwe.freibetrag + witwe.versorgung), h.eur(witwe.steuerpflichtig), h.eur(witwe.steuer)],
  ['Kind, 8 Jahre', h.eur(480000), h.eur(kind8.freibetrag + kind8.versorgung), h.eur(kind8.steuerpflichtig), h.eur(kind8.steuer)],
  ['Kind, 30 Jahre', h.eur(480000), h.eur(kind30.freibetrag + kind30.versorgung), h.eur(kind30.steuerpflichtig), h.eur(kind30.steuer)],
  ['Enkelin', h.eur(260000), h.eur(enkelin.freibetrag), h.eur(enkelin.steuerpflichtig), h.eur(enkelin.steuer)],
  ['Nichte', h.eur(90000), h.eur(nichte.freibetrag), h.eur(nichte.steuerpflichtig), h.eur(nichte.steuer)],
  ['Lebensgefährtin', h.eur(90000), h.eur(partnerin.freibetrag), h.eur(partnerin.steuerpflichtig), h.eur(partnerin.steuer)],
], `Vom Rechner ermittelt, jeweils mit ${h.eur(h.P.erbst.erbfallkosten_pauschale)} Erbfallkostenpauschale, ohne Hausrat und ohne Kürzung durch Renten`, ['l', 'r', 'r', 'r', 'r'])}
<p>Die beiden Kinder erben denselben Betrag, das jüngere zahlt aber ${h.eur(kind30.steuer - kind8.steuer)} weniger, allein wegen des Versorgungsfreibetrags. Nichte und Lebensgefährtin haben denselben Freibetrag; der Unterschied von ${h.eur(partnerin.steuer - nichte.steuer)} kommt aus dem höheren Steuersatz der Klasse III, den die Seite zu den ${h.a('erbschaftsteuer-steuersaetze', 'Steuersätzen')} erklärt.</p>
<h2>Hausrat und Erbfallkostenpauschale</h2>
<p>Zwei Abzüge kommen vor dem persönlichen Freibetrag. Nach ${h.src('erbstg13', '§ 13 Abs. 1 Nr. 1 ErbStG')} bleiben Hausrat, Wäsche und Kleidung in Steuerklasse I bis ${h.eur(h.P.erbst.hausrat_stk1)} steuerfrei, andere bewegliche Gegenstände wie ein Auto bis weitere ${h.eur(h.P.erbst.bewegliche_stk1)}. In den Klassen II und III gibt es für beides zusammen ${h.eur(h.P.erbst.hausrat_stk23)}. Geld, Wertpapiere, Münzen, Edelmetalle, Edelsteine und Perlen zählen nie dazu.</p>
<p>Für Bestattung, Grabstein, übliche Grabpflege und die Kosten der Nachlassabwicklung zieht das Finanzamt nach ${h.src('erbstg10', '§ 10 Abs. 5 Nr. 3 ErbStG')} pauschal ${h.eur(h.P.erbst.erbfallkosten_pauschale)} ab, ohne einen einzigen Beleg. Wer höhere Kosten nachweist, kann diese ansetzen. Die Kosten der laufenden Verwaltung des Nachlasses sind nicht abziehbar, und bei einer Schenkung gibt es die Pauschale nicht.</p>
<h2>Das selbst genutzte Familienheim</h2>
<p>Unabhängig von allen Freibeträgen kann das Familienheim steuerfrei bleiben. § 13 Abs. 1 Nr. 4b und 4c ErbStG befreien die Wohnung, in der der Verstorbene selbst gewohnt hat, wenn der Ehegatte oder ein Kind sie unverzüglich selbst bezieht. Für Kinder gilt eine Obergrenze bei der Wohnfläche, und wer innerhalb der gesetzlichen Frist auszieht, verliert die Befreiung rückwirkend, außer zwingende Gründe hindern ihn. Diese Befreiung bildet der Rechner nicht ab; die genauen Voraussetzungen prüft das Finanzamt im Einzelfall.</p>
<h2>Zehn-Jahres-Frist und Steuerpflicht</h2>
<p>Ein Freibetrag gilt nicht einmal im Leben, sondern je Schenker oder Erblasser und je ${h.num(h.P.erbst.zusammenrechnung_jahre)} Jahre. ${h.src('erbstg14', '§ 14 ErbStG')} rechnet alle Erwerbe von derselben Person innerhalb dieser Zeit zusammen; eine Schenkung acht Jahre vor dem Tod verbraucht also einen Teil des Freibetrags für das Erbe. Liegt sie länger zurück, steht der volle Betrag wieder zur Verfügung.</p>
<p>Die vollen Freibeträge setzen voraus, dass Erblasser oder Erbe im Inland ansässig ist (unbeschränkte Steuerpflicht). Erben im Ausland Lebende nur deutsches Inlandsvermögen von einem ebenfalls im Ausland Lebenden, mindert § 16 Abs. 2 den Freibetrag anteilig. Die Zahlen auf dieser Seite folgen ${h.src('erbstg16', '§ 16 ErbStG')}, ${h.src('erbstg17', '§ 17 ErbStG')} und ${h.src('erbstg15', '§ 15 ErbStG')}. Sie sind eine allgemeine Information zu den Freibeträgen, keine Rechtsberatung und keine Steuerberatung für Ihren Erbfall; wer wie viel erbt, zeigt die Seite zur ${h.a('gesetzliche-erbfolge', 'gesetzlichen Erbfolge')}.</p>`,
  },
  en: {
    slug: 'inheritance-tax-allowances',
    nav: "Tax-free allowances",
    card: `Spouse ${EN.eur(F.ehegatte)}, child ${EN.eur(F.kind)}, grandchild ${EN.eur(F.enkel)}: every German allowance, the pension allowance and flat deductions.`,
    title: 'Inheritance Tax Allowances Germany 2026: Who Pays What',
    description: `German inheritance tax allowances 2026: spouse ${EN.eur(F.ehegatte)}, child ${EN.eur(F.kind)}, grandchild ${EN.eur(F.enkel)}, sibling or partner ${EN.eur(F.stk2)}, plus the extra pension allowance.`,
    h1: 'German inheritance tax allowances: how much each heir receives tax-free',
    intro: 'In Germany the tax-free amount depends almost entirely on how closely you were related to the person who died. Here is each allowance, with worked figures.',
    resume: `Under section 16 of the German Inheritance and Gift Tax Act (Erbschaftsteuergesetz, ErbStG), a spouse or registered partner inherits ${EN.eur(F.ehegatte)} tax-free, each child or stepchild ${EN.eur(F.kind)}, a grandchild ${EN.eur(F.enkel)} (${EN.eur(F.enkel_kind_verstorben)} if the grandchild’s own parent has already died) and parents or grandparents inheriting ${EN.eur(F.eltern_erbfall)}. Siblings, nieces, nephews and children-in-law (tax class II) and unmarried partners or friends (tax class III) get only ${EN.eur(F.stk2)}. On a death, a surviving spouse also receives a pension allowance (Versorgungsfreibetrag) of ${EN.eur(E.versorgung_ehegatte)}, and children between ${EN.eur(VK[VK.length - 1][1])} and ${EN.eur(VK[0][1])} depending on age, both reduced by any tax-free survivor’s pension. Household goods up to ${EN.eur(E.hausrat_stk1)} are exempt in class I and ${EN.eur(E.erbfallkosten_pauschale)} of estate costs come off without receipts. A widow inheriting ${EN.eur(900000)} is therefore taxed on ${EN.eur(witwe.steuerpflichtig)} only and pays ${EN.eur(witwe.steuer)}. Allowances apply per giver and renew after ${J} years.`,
    faqs: [
      { q: 'Does my unmarried partner get the German spousal allowance?', a: `No. Without marriage or a registered partnership (eingetragene Lebenspartnerschaft), a partner falls into tax class III with ${EN.eur(F.stk3)} instead of ${EN.eur(F.ehegatte)}, and receives no pension allowance. On a ${EN.eur(90000)} inheritance that means ${EN.eur(partnerin.steuer)} of tax, while a spouse would pay nothing. Years of living together, however many, do not change the class.` },
      { q: 'Do German allowances apply if the heir lives outside Germany?', a: `Full allowances apply where the deceased or the heir is resident in Germany (unlimited tax liability under section 2 ErbStG), and German nationals keep that status for a limited period after moving abroad. If neither is resident, only German assets such as property are taxed, and section 16(2) cuts the allowance in proportion. Treaties and the other country’s own tax also matter, so the result can differ.` },
      { q: 'How does the age-based allowance for a child work in Germany?', a: `A child who loses a parent gets an extra pension allowance under section 17(2) ErbStG: ${EN.eur(VK[0][1])} up to age ${VK[0][0]}, then less in steps, ending with ${EN.eur(VK[VK.length - 1][1])} until the ${VK[VK.length - 1][0]}th birthday. In our example an 8-year-old pays ${EN.eur(kind30.steuer - kind8.steuer)} less than a 30-year-old on the same ${EN.eur(480000)}. A tax-free orphan’s pension reduces it by its capital value.` },
      { q: 'Can parents give the child allowance twice, once each?', a: `Yes. The ${EN.eur(F.kind)} applies per child and per giver, so a child can receive that much from the mother and the same again from the father. Each allowance renews after ${J} years: gifts and inheritances from the same person within that window are added together (section 14 ErbStG), so a gift eight years before death uses up part of the allowance for the estate.` },
      { q: 'Are the car and furniture covered by a separate exemption?', a: `Yes, before the personal allowance. In class I, household goods, linen and clothing are exempt up to ${EN.eur(E.hausrat_stk1)} and other movable items such as a car or paintings up to ${EN.eur(E.bewegliche_stk1)} (section 13(1) no. 1). Classes II and III share one ${EN.eur(E.hausrat_stk23)} limit. Cash, securities, coins, precious metals, gemstones and pearls never qualify.` },
    ],
    body: (h) => `<h2>Personal allowances under section 16</h2>
<p>German inheritance tax (Erbschaftsteuer) is charged only on what exceeds the heir’s personal allowance (Freibetrag). The allowance follows the relationship to the deceased (Erblasser), not the size of the estate. Section 15 ErbStG sorts heirs into three tax classes (Steuerklassen): class I for close family, class II for siblings and in-laws, class III for everyone else. Each heir is assessed separately on what they personally receive.</p>
${h.table(['Relationship to the deceased', 'Tax class', 'Allowance on death', 'Allowance on gift'], REIHEN.map(([b, , en]) => [en, steuerklasse(b, true), h.eur(persoenlicherFreibetrag(b, true)), h.eur(persoenlicherFreibetrag(b, false))]), '2026 allowances under sections 15 and 16 ErbStG, from the site’s parameter file', ['l', 'l', 'r', 'r'])}
<p>Parents are the one case where death and gift differ: inheriting from their child they sit in class I with ${h.eur(h.P.erbst.freibetrag.eltern_erbfall)}, but a lifetime gift from the child puts them in class II with ${h.eur(h.P.erbst.freibetrag.stk2)}. Stepchildren count like children. Children-in-law stay in class II however close the family is.</p>
<h2>The extra pension allowance on a death</h2>
<p>Section 17 ErbStG adds a special pension allowance (besonderer Versorgungsfreibetrag) for a surviving spouse or registered partner, ${h.eur(h.P.erbst.versorgung_ehegatte)}, and for the deceased’s children by age on the date of death:</p>
${h.table(['Child’s age at the death', 'Pension allowance'], STUFEN.map(([von, bis, b], i) => [i === 0 ? `up to ${bis}` : i === STUFEN.length - 1 ? `over ${von}, until the ${bis}th birthday` : `over ${von} to ${bis}`, h.eur(b)]), 'Steps of section 17(2) ErbStG', ['l', 'r'])}
<p>The allowance is reduced by the capital value of survivor’s benefits that are not themselves subject to inheritance tax, typically a statutory widow’s or orphan’s pension from the German pension insurance. With a large pension it can disappear completely. Our ${h.a('erbschaftsteuer-rechner', 'inheritance tax calculator')} uses the full amount, so treat its result as the lowest likely tax.</p>
<h2>Six heirs, six tax bills</h2>
${h.table(['Heir', 'Received', 'Allowances', 'Taxable', 'Tax'], [
  ['widow', h.eur(900000), h.eur(witwe.freibetrag + witwe.versorgung), h.eur(witwe.steuerpflichtig), h.eur(witwe.steuer)],
  ['child aged 8', h.eur(480000), h.eur(kind8.freibetrag + kind8.versorgung), h.eur(kind8.steuerpflichtig), h.eur(kind8.steuer)],
  ['child aged 30', h.eur(480000), h.eur(kind30.freibetrag + kind30.versorgung), h.eur(kind30.steuerpflichtig), h.eur(kind30.steuer)],
  ['granddaughter', h.eur(260000), h.eur(enkelin.freibetrag), h.eur(enkelin.steuerpflichtig), h.eur(enkelin.steuer)],
  ['niece', h.eur(90000), h.eur(nichte.freibetrag), h.eur(nichte.steuerpflichtig), h.eur(nichte.steuer)],
  ['unmarried partner', h.eur(90000), h.eur(partnerin.freibetrag), h.eur(partnerin.steuerpflichtig), h.eur(partnerin.steuer)],
], `Computed by the calculator, each with the ${h.eur(h.P.erbst.erbfallkosten_pauschale)} flat estate-cost deduction, no household goods, no pension reduction`, ['l', 'r', 'r', 'r', 'r'])}
<p>The niece and the partner have the same allowance, yet the partner pays ${h.eur(partnerin.steuer - nichte.steuer)} more because class III starts at a higher rate. How the rates climb is on the ${h.a('erbschaftsteuer-steuersaetze', 'tax rates')} page.</p>
<h2>Household goods and the flat estate-cost deduction</h2>
<p>Two items come off before the allowance. Under ${h.src('erbstg13', 'section 13(1) no. 1 ErbStG')}, class I heirs receive furniture, linen and clothing tax-free up to ${h.eur(h.P.erbst.hausrat_stk1)} and other movable items such as a car up to a further ${h.eur(h.P.erbst.bewegliche_stk1)}; classes II and III share ${h.eur(h.P.erbst.hausrat_stk23)}. Money, securities and jewellery stones are excluded.</p>
<p>For the funeral, a headstone, normal grave upkeep and the cost of winding up the estate, the tax office (Finanzamt) deducts a flat ${h.eur(h.P.erbst.erbfallkosten_pauschale)} without receipts under ${h.src('erbstg10', 'section 10(5) no. 3 ErbStG')}. Higher costs can be claimed with proof. Ongoing management costs of the estate are not deductible, and there is no flat deduction on a gift.</p>
<h2>The family home</h2>
<p>Separately from the allowances, section 13(1) nos. 4b and 4c can exempt the home the deceased lived in, if the spouse or a child moves in without delay and keeps living there. For children the exempt living area is capped, and moving out within the statutory period removes the exemption retroactively unless compelling reasons force it. The home must lie in Germany, the EU or the EEA. The calculator does not model this relief.</p>
<h2>Residence, the ten-year window and a note for expats</h2>
<p>${h.src('erbstg14', 'Section 14 ErbStG')} adds up everything received from the same person within ${h.num(h.P.erbst.zusammenrechnung_jahre)} years, so allowances can be reused only after that period. If you live in Germany, your worldwide inheritance is generally within German tax, even assets left by a relative abroad; the other country may tax the same assets too, so check both sides. Where neither side is resident, Germany taxes German assets only, with a reduced allowance.</p>
<p>Figures follow ${h.src('erbstg16', 'section 16')}, ${h.src('erbstg17', 'section 17')} and ${h.src('erbstg15', 'section 15 ErbStG')}. This page gives general information on German tax-free allowances, not legal or tax advice on your inheritance; who inherits in the first place is explained under ${h.a('gesetzliche-erbfolge', 'statutory succession')}.</p>`,
  },
});
