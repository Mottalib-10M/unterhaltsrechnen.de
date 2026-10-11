/** Unterhalt bei 5.000 € netto: zwei minderjährige Kinder und ein studierendes Kind, Vorwegabzug und Haftungsquote. */
import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, gruppeVon, gruppeVonBis } from '../../lib/engine/dt';
import { volljaehrigenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

const N = 5000;
const M = 1900; // Netto der Mutter im Beispiel
const g = gruppeVon(N);
const [von, bis] = gruppeVonBis(g);
const minder = kindesunterhalt(N, [{ alter: 8 }, { alter: 13 }]);
const einKind = kindesunterhalt(N, [{ alter: 13 }]);
const student = volljaehrigenunterhalt({ einkommenA: N - minder.summe, einkommenB: M, eigenerHaushalt: true });
const studentBafoeg = volljaehrigenunterhalt({ einkommenA: N - minder.summe, einkommenB: M, eigenerHaushalt: true, eigenesEinkommen: 250 });
const ohneAbzug = volljaehrigenunterhalt({ einkommenA: N, einkommenB: M, eigenerHaushalt: true });
const vaterGesamt = minder.summe + student.anteilA;
const SB = P.selbstbehalt;

export default defineGuide({
  id: 'unterhalt-5000-netto',
  group: 'betrag',
  order: 40,
  mini: 'kuBetrag',
  miniDefaults: { n: 5000 },
  miniHref: 'volljaehrigenunterhalt-rechner',
  related: ['studentenunterhalt', 'volljaehrigenunterhalt-rechner', 'zahlbetragstabelle', 'unterhalt-3500-netto', 'unterhalt-hohes-einkommen'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1606', 'bgb1609'],
  de: {
    slug: 'unterhalt-bei-5000-euro-netto',
    nav: 'Unterhalt bei 5.000 € netto',
    card: 'Zwei Schulkinder und ein Kind im Studium: wer zuerst bedient wird und wie beide Eltern sich das Studium teilen.',
    title: 'Unterhalt bei 5.000 € netto 2026: Schulkinder und Studium',
    description: `Unterhalt bei 5.000 € netto 2026: Gruppe ${g + 1}, zwei Minderjährige ${DE.eur(minder.summe)}, dazu ein Kind im Studium mit Bedarf ${DE.eur(P.dt.student_bedarf)}, das beide Eltern anteilig tragen müssen.`,
    h1: 'Unterhalt bei 5.000 € netto mit minderjährigen und studierenden Kindern',
    intro: 'Hier geht es um eine Familie mit drei Kindern, von denen eines schon ausgezogen ist und studiert.',
    resume: `Ein Vater mit ${DE.eur(N)} bereinigtem Netto liegt in Gruppe ${g + 1} der Düsseldorfer Tabelle 2026 (${DE.eur(von)} bis ${DE.eur(bis)}). Für zwei Kinder von acht und dreizehn Jahren, die bei der Mutter leben, zahlt er ${DE.eur(minder.kinder[0].zahlbetrag, 2)} und ${DE.eur(minder.kinder[1].zahlbetrag, 2)}, zusammen ${DE.eur(minder.summe, 2)}. Die älteste Tochter, 19 Jahre, studiert und wohnt allein. Ihr Bedarf beträgt in der Regel ${DE.eur(P.dt.student_bedarf)}; nach Abzug des vollen Kindergelds von ${DE.eur(P.kindergeld.monat)} fehlen ${DE.eur(student.restbedarf)}. Diesen Rest tragen beide Eltern nach ihrem Einkommen über ${DE.eur(SB.angemessen)}, und zwar erst nach Abzug dessen, was der Vater für die minderjährigen Geschwister zahlt. Mit ${DE.eur(M)} Netto der Mutter übernimmt der Vater ${DE.eur(student.anteilA, 2)} und die Mutter ${DE.eur(student.anteilB, 2)}. Insgesamt zahlt der Vater ${DE.eur(vaterGesamt, 2)} im Monat Kindesunterhalt.`,
    faqs: [
      { q: 'Warum zahlt die Mutter für das studierende Kind mit, obwohl sie die Jüngeren betreut?', a: `Weil die Betreuung nur gegenüber minderjährigen Kindern als gleichwertiger Unterhalt gilt (§ 1606 Abs. 3 BGB). Für ein volljähriges Kind schulden beide Eltern Barunterhalt im Verhältnis ihrer Einkommen über dem angemessenen Selbstbehalt von ${DE.eur(SB.angemessen)}. Bei ${DE.eur(M)} Netto bleibt ihr Anteil im Beispiel klein: ${DE.eur(student.anteilB, 2)} im Monat.` },
      { q: 'Wie viel Unterhalt zahlt ein Vater mit 5.000 € netto für ein einzelnes Kind von 13 Jahren?', a: `Nach der Tabelle 2026 ${DE.eur(einKind.summe, 2)} im Monat, der Zahlbetrag der Gruppe ${einKind.gruppe + 1} in der dritten Altersstufe nach Abzug des halben Kindergelds. Ihm bleiben ${DE.eur(einKind.verbleibt, 2)}. Bei nur einem Kind kann das Gericht außerdem eine Gruppe höher gehen, weil die Tabelle auf zwei Berechtigte zugeschnitten ist.` },
      { q: 'Wird BAföG des Kindes vom Unterhalt abgezogen?', a: `Ja, Einkommen des Kindes mindert seinen Bedarf, BAföG einschließlich des Darlehensanteils nach den Leitlinien der Oberlandesgerichte in NRW voll. Erhält die Studentin im Beispiel ${DE.eur(250)} im Monat, fehlen nur noch ${DE.eur(studentBafoeg.restbedarf)}; der Vater zahlt dann ${DE.eur(studentBafoeg.anteilA, 2)}, die Mutter ${DE.eur(studentBafoeg.anteilB, 2)}.` },
      { q: 'Macht es einen Unterschied, dass die minderjährigen Geschwister vorher abgezogen werden?', a: `Einen spürbaren. Ohne diesen Vorwegabzug hätte der Vater einen höheren Anteil am Studium: ${DE.eur(ohneAbzug.anteilA, 2)} statt ${DE.eur(student.anteilA, 2)}. Die Leitlinien schreiben vor, die Einkommen beider Eltern zuerst um den Unterhalt an vorrangig Berechtigte zu kürzen, also um den Unterhalt der Minderjährigen.` },
    ],
    body: (h) => `<h2>Drei Kinder, zwei Ränge</h2>
<p>Das Gesetz reiht die Kinder nicht nach Alter, sondern nach Schutzbedürfnis. Minderjährige Kinder stehen im ersten Rang, ebenso Volljährige unter 21 Jahren, die noch zur Schule gehen und bei einem Elternteil wohnen. Ein studierendes Kind mit eigener Wohnung steht dagegen im vierten Rang, hinter einem unterhaltsberechtigten Ehegatten (§ 1609 BGB). Das bedeutet nicht, dass es leer ausgeht. Es bedeutet, dass zuerst die Jüngeren voll bedient werden und die Studentin aus dem rechnet, was danach übrig ist.</p>
<h2>Schritt 1: die minderjährigen Geschwister</h2>
${h.table(['Kind', 'Gruppe', 'Bedarf', 'minus halbes Kindergeld', 'Zahlbetrag'], minder.kinder.map((k) => [`${k.alter} Jahre`, String(minder.gruppe + 1), h.eur(k.bedarf), h.eur(k.kindergeld, 2), h.eur(k.zahlbetrag, 2)]), `Vater mit ${h.eur(N)} bereinigtem Netto, vom Rechner ermittelt`, ['l', 'r', 'r', 'r', 'r'])}
<p>Nach diesen ${h.eur(minder.summe, 2)} bleiben dem Vater ${h.eur(minder.verbleibt, 2)}, deutlich mehr als der Bedarfskontrollbetrag seiner Gruppe von ${h.eur(minder.bkbWert)}. Eine Herabstufung findet nicht statt.</p>
<h2>Schritt 2: das Studium, geteilt nach Einkommen</h2>
<p>Für die Studentin mit eigener Wohnung setzen die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} in der Regel ${h.eur(h.P.dt.student_bedarf)} an, davon bis zu ${h.eur(h.P.dt.student_warmmiete)} für die Warmmiete. Kranken- und Pflegeversicherung sowie Studiengebühren kommen gegebenenfalls hinzu. Abgezogen wird das volle Kindergeld, das an die Tochter weiterzugeben ist.</p>
${h.table(['', 'Vater', 'Mutter'], [
  ['Bereinigtes Netto', h.eur(N), h.eur(M)],
  ['minus Unterhalt der Minderjährigen', `− ${h.eur(minder.summe, 2)}`, '−'],
  [`minus Sockelbetrag (${h.eur(student.sockel)})`, h.eur(student.haftungA, 2), h.eur(student.haftungB, 2)],
  ['Haftungsquote', h.pct(student.quoteA, 1), h.pct(student.quoteB, 1)],
  [`Anteil an ${h.eur(student.restbedarf)}`, h.eur(student.anteilA, 2), h.eur(student.anteilB, 2)],
], 'Haftungsanteile nach Abschnitt 13 der Leitlinien NRW, vom Rechner ermittelt', ['l', 'r', 'r'])}
<p>Der Sockelbetrag entspricht dem angemessenen Selbstbehalt gegenüber volljährigen Kindern. Nur was darüber liegt, zählt für die Quote. Deshalb trägt die Mutter mit ihrem niedrigeren Einkommen nur einen kleinen Teil, obwohl sie fast zwei Fünftel des Vatereinkommens verdient.</p>
<h2>Was der Vater am Ende zahlt und behält</h2>
<p>Zusammen überweist er ${h.eur(vaterGesamt, 2)} im Monat: ${h.eur(minder.summe, 2)} an die Mutter für die beiden Jüngeren und ${h.eur(student.anteilA, 2)} direkt an die Tochter. Ihm bleiben ${h.eur(N - vaterGesamt, 2)}. Gegenüber dem volljährigen Kind muss ihm mindestens der angemessene Selbstbehalt von ${h.eur(SB.angemessen)} bleiben, was hier weit überschritten ist.</p>
<h2>Was sich in dieser Konstellation häufig ändert</h2>
<ul>
<li><strong>Die Tochter zieht zurück nach Hause</strong>: Dann bemisst sich ihr Bedarf nach der vierten Altersstufe und dem zusammengerechneten Einkommen beider Eltern.</li>
<li><strong>Das mittlere Kind wird 18</strong> und geht noch zur Schule: Es bleibt bis 21 im ersten Rang, beide Eltern haften aber schon anteilig.</li>
<li><strong>Die Mutter verdient mehr</strong>: Ihr Anteil am Studium wächst, der des Vaters sinkt.</li>
</ul>
<p>Die Rechnung folgt der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und § 1606 BGB. Sie ist eine allgemeine Beispielrechnung; ob Fahrtkosten, Altersvorsorge oder ein Studienwechsel den Anspruch verändern, beurteilt im Streit das Familiengericht. Eigene Zahlen rechnet der ${h.a('volljaehrigenunterhalt-rechner', 'Volljährigenunterhalt-Rechner')}.</p>`,
  },
  en: {
    slug: 'child-support-on-5000-net',
    nav: 'Support on €5,000 net',
    card: 'Two school-age children and one at university: who is served first and how both parents share the student’s costs.',
    title: 'Child Support on €5,000 Net 2026: Minors and a Student',
    description: `Child support on €5,000 net in Germany 2026: group ${g + 1}, ${EN.eur(minder.summe)} for two minors, plus a student child with a ${EN.eur(P.dt.student_bedarf)} monthly need that both parents share by income.`,
    h1: 'Support on €5,000 net with minor children and a student',
    intro: 'A family with three children, one of whom has moved out to study: how German courts split the bill.',
    resume: `A father with ${EN.eur(N)} adjusted net income is in group ${g + 1} of the 2026 Düsseldorf Table (${EN.eur(von)} to ${EN.eur(bis)}). For two children aged eight and thirteen living with their mother he pays ${EN.eur(minder.kinder[0].zahlbetrag, 2)} and ${EN.eur(minder.kinder[1].zahlbetrag, 2)}, ${EN.eur(minder.summe, 2)} together. The eldest daughter, 19, studies and has her own flat. Her standard need is ${EN.eur(P.dt.student_bedarf)}; after deducting the full child benefit (Kindergeld) of ${EN.eur(P.kindergeld.monat)}, ${EN.eur(student.restbedarf)} is missing. Both parents cover that gap according to their income above ${EN.eur(SB.angemessen)}, and only after deducting what the father pays for the younger siblings. With the mother earning ${EN.eur(M)} net, the father pays ${EN.eur(student.anteilA, 2)} and the mother ${EN.eur(student.anteilB, 2)}. In total the father pays ${EN.eur(vaterGesamt, 2)} a month in child support, part of it to the mother and part directly to his daughter.`,
    faqs: [
      { q: 'Why does the mother contribute to the student when she looks after the younger two?', a: `Because care only counts as equivalent to cash support towards minor children (section 1606(3) of the Civil Code, BGB). For an adult child both parents owe cash in proportion to their income above the ${EN.eur(SB.angemessen)} reasonable self-retention. On ${EN.eur(M)} net her share stays small in the example: ${EN.eur(student.anteilB, 2)} a month.` },
      { q: 'How much does a father on €5,000 net pay for one child of 13?', a: `Under the 2026 table ${EN.eur(einKind.summe, 2)} a month, the group ${einKind.gruppe + 1} amount for the 12 to 17 band after half the child benefit. He keeps ${EN.eur(einKind.verbleibt, 2)}. With only one child the court may also move one group up, because the table assumes two dependants.` },
      { q: 'My child studies in Germany on BAföG. Is it deducted?', a: `Yes. The child’s own income reduces the need, and under the NRW court guidelines BAföG counts in full, including the loan part. If the student in the example receives ${EN.eur(250)} a month, only ${EN.eur(studentBafoeg.restbedarf)} is missing; the father then pays ${EN.eur(studentBafoeg.anteilA, 2)} and the mother ${EN.eur(studentBafoeg.anteilB, 2)}. A student abroad may have a different need, which courts assess case by case.` },
      { q: 'Does deducting the minor siblings first really matter?', a: `Noticeably. Without that prior deduction the father would carry more of the student’s costs: ${EN.eur(ohneAbzug.anteilA, 2)} instead of ${EN.eur(student.anteilA, 2)}. The guidelines require both parents’ incomes to be reduced first by support owed to higher-ranking dependants, which here means the two minor siblings.` },
    ],
    body: (h) => `<h2>Three children, two ranks</h2>
<p>German law ranks children by how much protection they need, not by age. Minor children come first, as do adults under 21 who are still at school and live with a parent. A student with their own flat ranks fourth, behind a spouse who is owed maintenance (section 1609 BGB). That does not leave her empty-handed. It means the younger ones are served in full first, and the student’s claim is worked out from what remains.</p>
<h2>Step 1: the minor siblings</h2>
${h.table(['Child', 'Group', 'Need', 'minus half child benefit', 'Payable'], minder.kinder.map((k) => [`aged ${k.alter}`, String(minder.gruppe + 1), h.eur(k.bedarf), h.eur(k.kindergeld, 2), h.eur(k.zahlbetrag, 2)]), `Father on ${h.eur(N)} adjusted net, computed by the calculator`, ['l', 'r', 'r', 'r', 'r'])}
<p>After these ${h.eur(minder.summe, 2)} the father keeps ${h.eur(minder.verbleibt, 2)}, well above his group’s needs-control amount of ${h.eur(minder.bkbWert)}. No lower group applies.</p>
<h2>Step 2: the student, shared by income</h2>
<p>For a student living away from home the ${h.src('olgLeitlinien', 'NRW court guidelines')} normally set ${h.eur(h.P.dt.student_bedarf)}, including up to ${h.eur(h.P.dt.student_warmmiete)} for rent with heating. Health and long-term care insurance and any tuition fees may come on top. The full child benefit, which must be passed on to the daughter, is deducted.</p>
${h.table(['', 'Father', 'Mother'], [
  ['Adjusted net income', h.eur(N), h.eur(M)],
  ['minus support for the minors', `− ${h.eur(minder.summe, 2)}`, '−'],
  [`minus base amount (${h.eur(student.sockel)})`, h.eur(student.haftungA, 2), h.eur(student.haftungB, 2)],
  ['Share of liability', h.pct(student.quoteA, 1), h.pct(student.quoteB, 1)],
  [`Share of ${h.eur(student.restbedarf)}`, h.eur(student.anteilA, 2), h.eur(student.anteilB, 2)],
], 'Liability shares under section 13 of the NRW guidelines, computed by the calculator', ['l', 'r', 'r'])}
<p>The base amount equals the reasonable self-retention towards adult children. Only income above it counts for the split, which is why the mother carries a small part even though she earns almost two fifths of the father’s income.</p>
<h2>What the father pays and keeps</h2>
<p>He transfers ${h.eur(vaterGesamt, 2)} a month: ${h.eur(minder.summe, 2)} to the mother for the younger two and ${h.eur(student.anteilA, 2)} directly to the student. He keeps ${h.eur(N - vaterGesamt, 2)}, far above the ${h.eur(SB.angemessen)} he must retain towards an adult child.</p>
<h2>Changes that often follow</h2>
<ul>
<li><strong>The student moves back home</strong>: her need then follows the fourth age band on both parents’ combined income.</li>
<li><strong>The middle child turns 18</strong> while still at school: she stays in the first rank until 21, but both parents already share liability.</li>
<li><strong>The mother earns more</strong>: her share of the student’s costs grows and his shrinks.</li>
<li><strong>The student goes on an exchange year abroad</strong>: costs abroad can raise the need, which the parents and, if necessary, the court must agree.</li>
</ul>
<p>The figures follow the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and section 1606 BGB. They are a general worked example; whether commuting costs, pension savings or a change of degree alter the claim is decided by the family court in a dispute. Try your own figures in the ${h.a('volljaehrigenunterhalt-rechner', 'adult child support calculator')}.</p>`,
  },
});
