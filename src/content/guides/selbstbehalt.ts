import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt } from '../../lib/engine/dt';
import { elternunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Alle Selbstbehalte 2026 aus params (DT Anm. A VII, B II, D I bis IV), Beispiele aus dem Motor. */
const S = P.selbstbehalt;
const genug = kindesunterhalt(2300, [{ alter: 6 }]);
const knapp = kindesunterhalt(1600, [{ alter: 14 }]);
const krank = kindesunterhalt(1600, [{ alter: 14 }], { erwerbstaetig: false });
const tochter = elternunterhalt({ nettoBereinigt: 4200, jahresbrutto: 110000, luecke: 1400 });
const ehegatteFrei = 2000 - S.ehegatte_erwerbstaetig;
const volljFrei = 2300 - S.angemessen;
/** Warmmiete über dem Ansatz: 700 € (freie Eingabe) gegen den Wohnanteil des notwendigen Selbstbehalts. */
const miete = 700;
const mehrMiete = miete - S.notwendig_warmmiete;

export default defineGuide({
  id: 'selbstbehalt',
  group: 'kind',
  order: 20,
  mini: 'selbstbehalt',
  related: ['mangelfall', 'bedarfskontrollbetrag', 'elternunterhalt', 'ehegattenunterhalt', 'studentenunterhalt', 'kindesunterhalt-rechner'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1603', 'sgb12_94', 'bgb1615l'],
  de: {
    slug: 'selbstbehalt',
    nav: 'Selbstbehalt 2026',
    card: 'Was Ihnen beim Unterhalt bleiben muss: alle Selbstbehalte 2026 mit Warmmiete, für Kinder, Ehegatten und Eltern.',
    title: 'Selbstbehalt Unterhalt 2026: alle Beträge mit Warmmiete',
    description: `Selbstbehalt beim Unterhalt 2026: ${DE.eur(S.notwendig_erwerbstaetig)} gegenüber Kindern, ${DE.eur(S.angemessen)} gegenüber Volljährigen, ${DE.eur(S.ehegatte_erwerbstaetig)} beim Ehegatten, ${DE.eur(S.eltern)} bei Eltern, je mit Warmmiete.`,
    h1: 'Selbstbehalt 2026: wie viel Ihnen beim Unterhalt bleiben muss',
    intro: 'Der Selbstbehalt ist das, was ein Unterhaltspflichtiger für sich behalten darf. Seine Höhe hängt davon ab, wem Unterhalt geschuldet wird.',
    resume: `Der Selbstbehalt ist der Teil des bereinigten Nettoeinkommens, den ein Unterhaltspflichtiger für sich behalten darf; was darüber liegt, steht für Unterhalt zur Verfügung. Nach der Düsseldorfer Tabelle 2026 beträgt er gegenüber minderjährigen Kindern und volljährigen Schülern unter 21 im Elternhaushalt ${DE.eur(S.notwendig_erwerbstaetig)} für Erwerbstätige und ${DE.eur(S.notwendig_nicht_erwerbstaetig)} für Nichterwerbstätige, darin ${DE.eur(S.notwendig_warmmiete)} Warmmiete. Gegenüber anderen volljährigen Kindern gilt der angemessene Selbstbehalt von ${DE.eur(S.angemessen)} mit ${DE.eur(S.angemessen_warmmiete)} Warmmiete. Gegenüber dem getrennt lebenden oder geschiedenen Ehegatten sind es ${DE.eur(S.ehegatte_erwerbstaetig)} oder ${DE.eur(S.ehegatte_nicht_erwerbstaetig)}, darin ${DE.eur(S.ehegatte_warmmiete)} Warmmiete. Beim Elternunterhalt bleiben mindestens ${DE.eur(S.eltern)} einschließlich ${DE.eur(S.eltern_warmmiete)} Warmmiete und zusätzlich ${DE.pct(S.eltern_anrechnungsfrei_anteil)} des Mehreinkommens. Liegt die tatsächliche, angemessene Warmmiete höher, soll der Selbstbehalt steigen. Ein Vater mit ${DE.eur(1600)} Netto und einem 14-jährigen Kind zahlt deshalb nur ${DE.eur(knapp.summe, 2)}, weil ihm ${DE.eur(S.notwendig_erwerbstaetig)} bleiben.`,
    faqs: [
      { q: 'Wie hoch ist der Selbstbehalt gegenüber minderjährigen Kindern 2026?', a: `${DE.eur(S.notwendig_erwerbstaetig)} im Monat, wenn Sie erwerbstätig sind, und ${DE.eur(S.notwendig_nicht_erwerbstaetig)}, wenn nicht, etwa bei Arbeitslosigkeit oder Rente. Das ist der notwendige Selbstbehalt nach § 1603 Abs. 2 BGB. Er gilt ebenso gegenüber volljährigen Kindern unter 21, die bei einem Elternteil wohnen und eine allgemeinbildende Schule besuchen. Darin sind ${DE.eur(S.notwendig_warmmiete)} für Miete mit Nebenkosten und Heizung enthalten.` },
      { q: 'Wird der Selbstbehalt bei hoher Miete erhöht?', a: `Ja, das sehen die Tabelle und die Leitlinien vor: Übersteigt Ihre Warmmiete den im Selbstbehalt enthaltenen Anteil und ist sie nicht unangemessen, soll der Selbstbehalt erhöht werden. Wer etwa ${DE.eur(miete)} warm zahlt, liegt ${DE.eur(mehrMiete)} über dem Ansatz beim notwendigen Selbstbehalt. Umgekehrt wird der Selbstbehalt nach den Leitlinien in NRW nicht gesenkt, nur weil Ihre Miete niedriger ist.` },
      { q: 'Sinkt der Selbstbehalt, wenn ich mit einer neuen Partnerin zusammenlebe?', a: `Das ist möglich. Die Leitlinien in NRW erlauben eine Kürzung wegen der Ersparnis eines gemeinsamen Haushalts mit einem leistungsfähigen Partner, jedoch höchstens bis zum sozialrechtlichen Existenzminimum. Wie stark gekürzt wird, entscheidet das Familiengericht. Zuerst wird außerdem geprüft, ob Ihr Selbstbehalt bereits durch einen Anspruch auf Familienunterhalt gegen einen neuen Ehegatten gedeckt ist.` },
      { q: 'Welcher Selbstbehalt gilt beim Unterhalt für ein studierendes Kind?', a: `Der angemessene Selbstbehalt von ${DE.eur(S.angemessen)}, darin ${DE.eur(S.angemessen_warmmiete)} Warmmiete. Studierende sind nicht privilegiert, deshalb gilt nicht der niedrigere notwendige Selbstbehalt. Beide Eltern haften anteilig nach ihrem Einkommen oberhalb dieses Betrags. Ein Elternteil mit ${DE.eur(2300)} Netto hätte also ${DE.eur(volljFrei)} für den Unterhalt aller nachrangigen volljährigen Kinder zur Verfügung.` },
      { q: 'Welcher Selbstbehalt gilt beim Elternunterhalt für pflegebedürftige Eltern?', a: `Mindestens ${DE.eur(S.eltern)}, darin ${DE.eur(S.eltern_warmmiete)} Warmmiete, und zusätzlich bleiben ${DE.pct(S.eltern_anrechnungsfrei_anteil)} des darüber liegenden Einkommens frei. Das Sozialamt kann Kinder aber nur in Anspruch nehmen, wenn ihr Jahreseinkommen ${DE.eur(P.elternunterhalt.jahreseinkommensgrenze)} übersteigt (§ 94 SGB XII). Ein mit Ihnen lebender Ehegatte wird mit mindestens ${DE.eur(S.eltern_ehegatte_mindest)} berücksichtigt.` },
      { q: 'Gibt es beim Selbstbehalt für Erwerbstätige einen Unterschied wegen eines Minijobs?', a: `Maßgeblich ist, ob Sie erwerbstätig sind. Die höheren Beträge sollen Aufwand und Anreiz der Arbeit abbilden. Ob schon eine geringfügige Beschäftigung den vollen Erwerbstätigen-Selbstbehalt rechtfertigt, ist eine Frage des Einzelfalls, die das Familiengericht nach Umfang und Aufwand der Tätigkeit beurteilt. Die Tabelle selbst nennt nur die beiden Beträge ${DE.eur(S.notwendig_erwerbstaetig)} und ${DE.eur(S.notwendig_nicht_erwerbstaetig)}.` },
    ],
    body: (h) => `<h2>Alle Selbstbehalte 2026 auf einen Blick</h2>
${h.table(['Unterhalt für', 'erwerbstätig', 'nicht erwerbstätig', 'darin Warmmiete'], [
  ['minderjährige Kinder, Schüler unter 21 im Elternhaushalt', h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig), h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.notwendig_warmmiete)],
  ['andere volljährige Kinder (Studium, Ausbildung)', h.eur(h.P.selbstbehalt.angemessen), h.eur(h.P.selbstbehalt.angemessen), h.eur(h.P.selbstbehalt.angemessen_warmmiete)],
  ['getrennt lebender oder geschiedener Ehegatte', h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_warmmiete)],
  ['nicht verheirateter Elternteil nach § 1615l BGB', h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_warmmiete)],
  [`Eltern (plus ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil)} des Mehreinkommens)`, h.eur(h.P.selbstbehalt.eltern), h.eur(h.P.selbstbehalt.eltern), h.eur(h.P.selbstbehalt.eltern_warmmiete)],
  [`Enkel (plus ${h.pct(h.P.selbstbehalt.enkel_anrechnungsfrei_anteil)} des Mehreinkommens)`, h.eur(h.P.selbstbehalt.enkel), h.eur(h.P.selbstbehalt.enkel), h.eur(h.P.selbstbehalt.eltern_warmmiete)],
], 'Monatliche Beträge nach der Düsseldorfer Tabelle 2026 und den Leitlinien NRW', ['l', 'r', 'r', 'r'])}
<p>Die Reihenfolge folgt einer einfachen Logik: Je enger und schutzbedürftiger die Beziehung, desto weniger darf der Pflichtige für sich behalten. Gegenüber kleinen Kindern muss er am meisten einsetzen, gegenüber den eigenen Eltern am wenigsten.</p>
<h2>Notwendig, angemessen, eheangemessen: die drei Begriffe</h2>
<p>Die Leitlinien der Oberlandesgerichte in NRW unterscheiden drei Arten des Eigenbedarfs. Der <strong>notwendige Selbstbehalt</strong> folgt aus der gesteigerten Unterhaltspflicht des § 1603 Abs. 2 BGB gegenüber minderjährigen und privilegierten volljährigen Kindern. Der <strong>angemessene Selbstbehalt</strong> nach § 1603 Abs. 1 BGB gilt gegenüber allen anderen Verwandten, also Studierenden, Eltern und Enkeln. Der <strong>eheangemessene Selbstbehalt</strong> schützt gegenüber dem Ehegatten und liegt dazwischen.</p>
<h2>Beispiel Kindesunterhalt: wann der Selbstbehalt greift</h2>
${h.table(['Fall', 'Netto', 'Unterhalt', 'Ihnen bleiben'], [
  ['Vater, erwerbstätig, ein Kind 6 Jahre', h.eur(2300), h.eur(genug.summe, 2), h.eur(genug.verbleibt, 2)],
  ['Vater, erwerbstätig, ein Kind 14 Jahre', h.eur(1600), h.eur(knapp.summe, 2), h.eur(knapp.verbleibt, 2)],
  ['dasselbe, Vater krankgeschrieben ohne Arbeit', h.eur(1600), h.eur(krank.summe, 2), h.eur(krank.verbleibt, 2)],
], 'Vom Rechenkern ermittelt, Düsseldorfer Tabelle 2026', ['l', 'r', 'r', 'r'])}
<p>Im ersten Fall bleibt mehr als genug; der Selbstbehalt spielt keine Rolle. Im zweiten Fall verlangte die Tabelle eigentlich mehr, doch der Vater behält genau ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)}, und nur der Rest geht an das Kind. Mit mehreren Kindern wird dieser Rest anteilig verteilt, siehe ${h.a('mangelfall', 'Mangelfall')}. Im dritten Fall ist der Selbstbehalt niedriger, deshalb steht etwas weniger für ihn und etwas mehr für das Kind zur Verfügung.</p>
<h2>Warmmiete: Anpassung nach oben, nicht nach unten</h2>
<p>In jedem Selbstbehalt steckt ein Wohnanteil für Miete einschließlich umlagefähiger Nebenkosten und Heizung. Übersteigt die tatsächliche Warmmiete diesen Anteil und ist sie nicht unangemessen, soll der Selbstbehalt erhöht werden. Bei einer Warmmiete von ${h.eur(miete)} liegt ein Vater gegenüber seinem minderjährigen Kind ${h.eur(mehrMiete)} über dem Ansatz von ${h.eur(h.P.selbstbehalt.notwendig_warmmiete)}. Ob und wie weit das Gericht erhöht, hängt vom örtlichen Mietniveau und davon ab, ob eine günstigere Wohnung zumutbar wäre.</p>
<p>Die ${h.src('olgLeitlinien', 'Leitlinien in NRW')} schließen eine Herabsetzung allein wegen niedrigerer Wohnkosten ausdrücklich aus, auch gegenüber minderjährigen Kindern. Wer eine Wohnung mit anderen teilt, muss aber seinen eigenen Wohnkostenanteil darlegen; Kinder werden dabei vorab mit einem Teil ihres Tabellenbedarfs berücksichtigt.</p>
<h2>Selbstbehalt gegenüber dem Ehegatten und nach § 1615l BGB</h2>
<p>Wer Trennungs- oder nachehelichen Unterhalt zahlt, behält ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} als Erwerbstätiger und ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)} sonst. Dieselben Beträge gelten gegenüber einer Mutter oder einem Vater, die nicht verheiratet waren und wegen der Betreuung eines gemeinsamen Kindes Unterhalt nach ${h.src('bgb1615l', '§ 1615l BGB')} verlangen. Bei ${h.eur(2000)} Netto, nachdem der Kindesunterhalt bereits abgezogen ist, sind für den Ehegatten höchstens ${h.eur(ehegatteFrei)} verfügbar. Mehr dazu auf der Seite zum ${h.a('ehegattenunterhalt', 'Ehegattenunterhalt')}.</p>
<h2>Selbstbehalt beim Elternunterhalt und gegenüber Enkeln</h2>
<p>Gegenüber den eigenen Eltern ist der Schutz am stärksten: mindestens ${h.eur(h.P.selbstbehalt.eltern)}, dazu bleiben ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil)} des Einkommens darüber frei. Eine Tochter mit ${h.eur(4200)} bereinigtem Netto behält so ${h.eur(tochter.selbstbehalt)}; für die Pflegekosten der Mutter wären höchstens ${h.eur(tochter.leistungsfaehig)} im Monat einsetzbar. Das Sozialamt kann sie aber nur heranziehen, wenn ihr Jahreseinkommen über ${h.eur(h.P.elternunterhalt.jahreseinkommensgrenze)} liegt, so ${h.src('sgb12_94', '§ 94 Abs. 1a SGB XII')}. Großeltern behalten gegenüber Enkeln ebenfalls mindestens ${h.eur(h.P.selbstbehalt.enkel)}, aber nur die Hälfte des Mehreinkommens bleibt frei. Einzelheiten beim ${h.a('elternunterhalt', 'Elternunterhalt')}.</p>
<h2>Was nicht zum Selbstbehalt gehört</h2>
<ul>
<li>Der Selbstbehalt wird vom <strong>bereinigten</strong> Netto aus geprüft; berufsbedingte Kosten und anerkannte Schulden sind schon abgezogen.</li>
<li>Kindergeld erhöht nicht das Einkommen des Zahlenden.</li>
<li>Der Selbstbehalt ist kein Freibetrag bei der Pfändung; dort gelten die eigenen Grenzen der Zivilprozessordnung.</li>
</ul>
<p>Alle Beträge stammen aus der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}; die Pflicht, gegenüber Kindern alle verfügbaren Mittel einzusetzen, aus ${h.src('bgb1603', '§ 1603 BGB')}. Diese Übersicht ist eine allgemeine Information über die Selbstbehalte, keine Rechtsberatung für Ihren Einzelfall.</p>`,
  },
  en: {
    slug: 'self-retention',
    nav: 'Self-retention 2026',
    card: 'What you must be left with when paying maintenance in Germany: every 2026 self-retention amount, rent included.',
    title: 'Self-Retention Germany 2026: Selbstbehalt Amounts Explained',
    description: `German self-retention (Selbstbehalt) 2026: ${EN.eur(S.notwendig_erwerbstaetig)} towards children, ${EN.eur(S.angemessen)} adult children, ${EN.eur(S.ehegatte_erwerbstaetig)} spouses, ${EN.eur(S.eltern)} own parents, warm rent always included.`,
    h1: 'Self-retention in 2026: what you keep when paying maintenance in Germany',
    intro: 'The self-retention is the part of your income a court leaves you. How much it is depends on who you owe maintenance to.',
    resume: `The self-retention (Selbstbehalt) is the part of adjusted net income a person paying maintenance in Germany is allowed to keep; anything above it is available for support. Under the 2026 Düsseldorf Table it is ${EN.eur(S.notwendig_erwerbstaetig)} for a working parent and ${EN.eur(S.notwendig_nicht_erwerbstaetig)} for one not working towards minor children and school pupils under 21 living with a parent, including ${EN.eur(S.notwendig_warmmiete)} for warm rent (rent with heating and service charges). Towards other adult children, such as students, the reasonable self-retention of ${EN.eur(S.angemessen)} applies, with ${EN.eur(S.angemessen_warmmiete)} warm rent. Towards a separated or divorced spouse it is ${EN.eur(S.ehegatte_erwerbstaetig)} if working or ${EN.eur(S.ehegatte_nicht_erwerbstaetig)} if not, with ${EN.eur(S.ehegatte_warmmiete)} warm rent. For support of one’s own parents at least ${EN.eur(S.eltern)} stays protected, including ${EN.eur(S.eltern_warmmiete)} warm rent, plus ${EN.pct(S.eltern_anrechnungsfrei_anteil)} of any income above it. If your reasonable warm rent is higher, the amount should go up. A father on ${EN.eur(1600)} with one child of 14 therefore pays only ${EN.eur(knapp.summe, 2)}.`,
    faqs: [
      { q: 'What self-retention applies towards children under 18 in Germany in 2026?', a: `${EN.eur(S.notwendig_erwerbstaetig)} a month if you work and ${EN.eur(S.notwendig_nicht_erwerbstaetig)} if you do not, for instance when unemployed or retired. This is the minimum self-retention under section 1603(2) of the Civil Code (BGB). It also applies towards adult children under 21 at a general school who live with a parent. ${EN.eur(S.notwendig_warmmiete)} of it is meant for rent including heating and service charges.` },
      { q: 'My rent in Munich is far higher than the housing share: does that count?', a: `It can. Both the table and the NRW guidelines say the self-retention should be raised when your warm rent exceeds the housing share and is not unreasonable. Paying ${EN.eur(miete)} warm, you are ${EN.eur(mehrMiete)} above the share in the minimum self-retention. The court looks at local rent levels and whether cheaper housing could be expected. A lower rent never reduces the figure.` },
      { q: 'Does living with a new partner reduce my self-retention?', a: `It may. The NRW guidelines allow a reduction for the savings of sharing a household with a partner who has income, but never below the subsistence minimum under social welfare rules. The family court (Familiengericht) decides how much. If you have remarried, the court first checks whether your new spouse’s duty of family support already covers part of your own needs.` },
      { q: 'Which self-retention protects me against a university student’s claim?', a: `The reasonable self-retention of ${EN.eur(S.angemessen)}, including ${EN.eur(S.angemessen_warmmiete)} warm rent. Students do not enjoy the privileged rank of school pupils, so the lower floor does not apply. Both parents pay in proportion to their income above that amount. A parent on ${EN.eur(2300)} net would have ${EN.eur(volljFrei)} available for all lower-ranking adult children.` },
      { q: 'How much do I keep if the welfare office claims support for my parent’s care home?', a: `At least ${EN.eur(S.eltern)}, including ${EN.eur(S.eltern_warmmiete)} warm rent, plus ${EN.pct(S.eltern_anrechnungsfrei_anteil)} of your income above it. The social welfare office can only turn to you if your annual income exceeds ${EN.eur(P.elternunterhalt.jahreseinkommensgrenze)} (section 94 of Social Code XII). A spouse living with you is counted with at least ${EN.eur(S.eltern_ehegatte_mindest)}.` },
      { q: 'I am an expat and my income is paid abroad: do German self-retention amounts still apply?', a: `When a German court decides, it starts from the German figures in the Düsseldorf Table. Where you actually live in a country with very different living costs, a court may adjust them, but there is no fixed conversion rule in the table. Your foreign net income is converted into euros and adjusted for German purposes before the self-retention is applied.` },
    ],
    body: (h) => `<h2>Every 2026 self-retention at a glance</h2>
${h.table(['Support owed to', 'working', 'not working', 'warm rent included'], [
  ['minor children; pupils under 21 living with a parent', h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig), h.eur(h.P.selbstbehalt.notwendig_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.notwendig_warmmiete)],
  ['other adult children (university, training)', h.eur(h.P.selbstbehalt.angemessen), h.eur(h.P.selbstbehalt.angemessen), h.eur(h.P.selbstbehalt.angemessen_warmmiete)],
  ['separated or divorced spouse', h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_warmmiete)],
  ['unmarried parent, section 1615l BGB', h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig), h.eur(h.P.selbstbehalt.ehegatte_warmmiete)],
  [`own parents (plus ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil)} of higher income)`, h.eur(h.P.selbstbehalt.eltern), h.eur(h.P.selbstbehalt.eltern), h.eur(h.P.selbstbehalt.eltern_warmmiete)],
  [`grandchildren (plus ${h.pct(h.P.selbstbehalt.enkel_anrechnungsfrei_anteil)} of higher income)`, h.eur(h.P.selbstbehalt.enkel), h.eur(h.P.selbstbehalt.enkel), h.eur(h.P.selbstbehalt.eltern_warmmiete)],
], 'Monthly amounts, Düsseldorf Table 2026 and NRW guidelines', ['l', 'r', 'r', 'r'])}
<p>The logic is simple: the closer and more dependent the person you owe support to, the less you keep. Young children can ask for the most; your own parents for the least.</p>
<h2>Three kinds of self-retention</h2>
<p>The guidelines of the NRW higher regional courts distinguish three. The <strong>minimum</strong> self-retention (notwendiger Selbstbehalt) comes from the heightened duty towards minors and privileged adult children in section 1603(2) BGB. The <strong>reasonable</strong> self-retention (angemessener Selbstbehalt) under section 1603(1) BGB protects you against all other relatives: students, parents, grandchildren. The <strong>spousal</strong> self-retention (eheangemessener Selbstbehalt) lies between the two.</p>
<h2>Child support: when the floor bites</h2>
${h.table(['Situation', 'Net', 'Support', 'You keep'], [
  ['working father, one child aged 6', h.eur(2300), h.eur(genug.summe, 2), h.eur(genug.verbleibt, 2)],
  ['working father, one child aged 14', h.eur(1600), h.eur(knapp.summe, 2), h.eur(knapp.verbleibt, 2)],
  ['same, father off sick and not working', h.eur(1600), h.eur(krank.summe, 2), h.eur(krank.verbleibt, 2)],
], 'Computed by the engine, Düsseldorf Table 2026', ['l', 'r', 'r', 'r'])}
<p>In the first case plenty remains and the floor plays no part. In the second, the table would ask for more, but the father keeps exactly ${h.eur(h.P.selbstbehalt.notwendig_erwerbstaetig)} and the child gets the rest; with several children the rest is shared, see ${h.a('mangelfall', 'shortfall case')}. In the third, the lower floor leaves a little more for the child.</p>
<h2>Warm rent: adjusted upwards only</h2>
<p>Each self-retention contains a housing share for rent including service charges and heating. When your actual warm rent is higher and not unreasonable, the self-retention should be increased. On ${h.eur(miete)} warm rent, a father paying for a minor child is ${h.eur(mehrMiete)} above the ${h.eur(h.P.selbstbehalt.notwendig_warmmiete)} share. Whether and how far a court raises the amount depends on local rents and on whether cheaper housing would be reasonable.</p>
<p>The ${h.src('olgLeitlinien', 'NRW guidelines')} rule out a cut merely because your rent is lower, even towards minors. If you share a flat, you must show your own share of the housing cost; children are counted first with part of their table need.</p>
<h2>Towards a spouse or an unmarried co-parent</h2>
<p>When paying separation or post-divorce maintenance you keep ${h.eur(h.P.selbstbehalt.ehegatte_erwerbstaetig)} if working and ${h.eur(h.P.selbstbehalt.ehegatte_nicht_erwerbstaetig)} otherwise. The same figures protect you against a parent you were never married to who claims support for looking after your child under ${h.src('bgb1615l', 'section 1615l BGB')}. With ${h.eur(2000)} left after child support, at most ${h.eur(ehegatteFrei)} is available for the spouse. More under ${h.a('ehegattenunterhalt', 'spousal maintenance')}.</p>
<h2>Support for parents and grandchildren</h2>
<p>Protection is strongest against claims for your own parents: at least ${h.eur(h.P.selbstbehalt.eltern)}, plus ${h.pct(h.P.selbstbehalt.eltern_anrechnungsfrei_anteil)} of income above that. A daughter on ${h.eur(4200)} adjusted net keeps ${h.eur(tochter.selbstbehalt)}, leaving at most ${h.eur(tochter.leistungsfaehig)} a month for her mother’s care costs. The welfare office can only claim if her annual income is above ${h.eur(h.P.elternunterhalt.jahreseinkommensgrenze)}, under ${h.src('sgb12_94', 'section 94(1a) of Social Code XII')}. Grandparents also keep at least ${h.eur(h.P.selbstbehalt.enkel)}, but only half of the income above it stays free. Details under ${h.a('elternunterhalt', 'parental maintenance')}.</p>
<h2>What the self-retention is not</h2>
<ul>
<li>It is checked against <strong>adjusted</strong> net income, after work costs and accepted debts.</li>
<li>Child benefit (Kindergeld) does not count as the paying parent’s income.</li>
<li>It is not the garnishment allowance; wage garnishment follows its own limits in the Code of Civil Procedure.</li>
</ul>
<p>All amounts come from the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}; the duty to use every available means for children comes from ${h.src('bgb1603', 'section 1603 BGB')}. This overview is general information on self-retention amounts, not legal advice on your own case.</p>`,
  },
});
