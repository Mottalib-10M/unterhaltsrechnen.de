/** Unterhalt bei Einkommen über der letzten Tabellengruppe: Kinder und Ehegatte, Quote oder konkreter Bedarf. */
import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, zahlbetrag } from '../../lib/engine/dt';
import { ehegattenunterhalt } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

const D = P.dt;
const TOP = D.gruppen_bis[D.gruppen_bis.length - 1];
const LAST = D.gruppen_bis.length - 1;
const N = 14000;
const kinder = kindesunterhalt(N, [{ alter: 4 }, { alter: 10 }]);
const kinderTop = kindesunterhalt(TOP, [{ alter: 4 }, { alter: 10 }]);
const ehe = ehegattenunterhalt({ pflichtigErwerb: N, berechtigtErwerb: 0, kindesunterhalt: kinder.summe });
const GRENZE = P.ehegatte.konkreter_bedarf_ab_familieneinkommen;

export default defineGuide({
  id: 'unterhalt-hohes-einkommen',
  group: 'betrag',
  order: 50,
  mini: 'kuBetrag',
  miniDefaults: { n: 12000 },
  miniHref: 'kindesunterhalt-rechner',
  related: ['zahlbetragstabelle', 'ehegattenunterhalt', 'trennungsunterhalt', 'unterhalt-5000-netto', 'kindesunterhalt'],
  sources: ['olgDtPdf', 'olgLeitlinien', 'bgb1610'],
  de: {
    slug: 'unterhalt-hohes-einkommen',
    nav: 'Unterhalt über 11.200 €',
    card: 'Wenn das Einkommen über der Tabelle liegt: was für Kinder gilt und wann der Ehegatte konkret rechnen muss.',
    title: 'Unterhalt bei hohem Einkommen 2026: über 11.200 € netto',
    description: `Unterhalt bei hohem Einkommen 2026: Die Düsseldorfer Tabelle endet bei ${DE.eur(TOP)} netto. Was Kinder darüber erhalten, wann Ehegatten ihren Bedarf belegen.`,
    h1: 'Unterhalt, wenn das Einkommen über der Düsseldorfer Tabelle liegt',
    intro: 'Die Tabelle hört bei einem bestimmten Netto auf. Der Unterhalt hört dort nicht auf, er wird nur anders begründet.',
    resume: `Die Düsseldorfer Tabelle 2026 hat fünfzehn Einkommensgruppen, die letzte reicht bis ${DE.eur(TOP)} bereinigtes Netto. Für diese Gruppe nennt sie Bedarfsbeträge von ${DE.eur(D.bedarf[LAST][0])}, ${DE.eur(D.bedarf[LAST][1])}, ${DE.eur(D.bedarf[LAST][2])} und ${DE.eur(D.bedarf[LAST][3])} je nach Alter; nach Abzug des Kindergeldanteils werden daraus Zahlbeträge zwischen ${DE.eur(zahlbetrag(LAST, 0), 2)} und ${DE.eur(zahlbetrag(LAST, 2), 2)} für Minderjährige. Verdient ein Elternteil mehr, steigen die Beträge nicht automatisch weiter. Ein Kind, das mehr verlangt, muss in der Regel darlegen, wofür es den höheren Bedarf hat, etwa Privatschule, Reitunterricht oder Auslandsaufenthalte. Beim Ehegatten gilt eine ähnliche Schwelle: Nach den Leitlinien der Oberlandesgerichte in NRW wird bis zu einem bereinigten Familieneinkommen von ${DE.eur(GRENZE)} vermutet, dass alles verbraucht wurde, und nach der Quote gerechnet. Darüber kann der Berechtigte seinen Bedarf konkret belegen oder beweisen, dass auch das höhere Einkommen tatsächlich ausgegeben wurde.`,
    faqs: [
      { q: 'Wie viel Kindesunterhalt zahlt jemand mit 14.000 € netto für zwei Kinder?', a: `Nach den Beträgen der letzten Tabellengruppe ${DE.eur(kinder.summe, 2)} im Monat für Kinder von vier und zehn Jahren, genauso viel wie bei ${DE.eur(TOP)}. Wer mehr fordert, muss den höheren Bedarf der Kinder darlegen. Gerichte prüfen dann Ausgaben, die die Kinder während des Zusammenlebens tatsächlich hatten, und nicht das Einkommen des Zahlenden als solches.` },
      { q: 'Was bedeutet konkrete Bedarfsbemessung beim Ehegattenunterhalt?', a: `Statt der Quote von 45 Prozent der Einkommensdifferenz listet der berechtigte Ehegatte auf, was er für seinen Lebensstandard braucht: Wohnung, Auto, Urlaube, Kleidung, Hobbys, Versicherungen. Eigene Einkünfte werden davon abgezogen. Nach den Leitlinien NRW ist der konkret ermittelte Bedarf zugleich durch den nach der Quote errechneten Betrag nach oben begrenzt.` },
      { q: 'Muss ich bei hohem Einkommen Auskunft über mein Vermögen geben?', a: `Über das Einkommen in der Regel ja, denn ohne Auskunft lässt sich nicht prüfen, ob die Quote oder der konkrete Bedarf gilt. Manche Unterhaltspflichtige erklären stattdessen, unbegrenzt leistungsfähig zu sein; dann muss der Berechtigte seinen Bedarf konkret belegen. Welche Erklärung im Einzelfall genügt, entscheidet das Familiengericht.` },
      { q: 'Gilt für volljährige Kinder bei hohem Einkommen der Regelbedarf für Studierende?', a: `Für ein studierendes Kind mit eigener Wohnung nennt die Tabelle in der Regel ${DE.eur(D.student_bedarf)}, erlaubt aber ausdrücklich eine Abweichung nach oben mit Rücksicht auf die Lebensstellung der Eltern. Bei sehr gut verdienenden Eltern wird ein höherer Betrag deshalb häufiger anerkannt, wenn das Kind ihn begründet.` },
    ],
    body: (h) => `<h2>Wo die Tabelle aufhört</h2>
<p>Die letzte Zeile der Tabelle umfasst Nettoeinkommen bis ${h.eur(TOP)}. Ihr Bedarf beträgt ${h.pct(D.prozent[LAST] / 100, 0)} des Mindestunterhalts, also das Doppelte der ersten Gruppe. Eine sechzehnte Gruppe gibt es nicht, und die Tabelle rechnet auch nicht linear weiter. Das ist Absicht: Kinder sollen am Lebensstandard ihrer Eltern teilhaben, aber Unterhalt ist kein Anteil am Vermögenszuwachs.</p>
${h.table(['Altersstufe', 'Bedarf letzte Gruppe', 'Zahlbetrag'], [0, 1, 2, 3].map((s) => [['0 bis 5', '6 bis 11', '12 bis 17', 'ab 18'][s], h.eur(D.bedarf[LAST][s]), h.eur(zahlbetrag(LAST, s as 0 | 1 | 2 | 3), 2)]), `Gruppe ${LAST + 1}, bis ${h.eur(TOP)} netto, nach Abzug des Kindergeldanteils`, ['l', 'r', 'r'])}
<h2>Kinder: mehr gibt es nur mit Begründung</h2>
<p>Ein Vater mit ${h.eur(N)} Netto und zwei Kindern von vier und zehn Jahren zahlt nach den Beträgen der letzten Gruppe ${h.eur(kinder.summe, 2)}, genau wie einer mit ${h.eur(TOP)} (${h.eur(kinderTop.summe, 2)}). Der Bedarf eines Kindes richtet sich nach § 1610 BGB nach seiner Lebensstellung, die es von den Eltern ableitet. Wer für ein Kind mehr verlangt, muss deshalb zeigen, welche Ausgaben sein Leben bisher geprägt haben. Typische Posten sind:</p>
<ul>
<li>Schulgeld einer Privatschule oder eines Internats,</li>
<li>Instrumental-, Sport- oder Reitunterricht über Jahre,</li>
<li>Urlaubs- und Sprachreisen, die zum Familienalltag gehörten,</li>
<li>eine größere Wohnung, deren Anteil auf das Kind entfällt.</li>
</ul>
<p>Mehrbedarf wie Kita-Gebühren oder Nachhilfe kann daneben gesondert verlangt werden; ihn tragen beide Eltern im Verhältnis ihrer Einkommen.</p>
<h2>Ehegatte: Quote bis zur Schwelle, darüber Nachweis</h2>
<p>Für Ehegatten- und Trennungsunterhalt gibt es eine eigene Schwelle. Die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW')} vermuten bis zu einem bereinigten Familieneinkommen von ${h.eur(GRENZE)}, dass die Familie alles ausgegeben hat. Dann gilt die Quote. Liegt das Einkommen darüber, wird vermutet, dass ein Teil gespart wurde. Der berechtigte Ehegatte hat dann zwei Wege: Er belegt seinen Bedarf Posten für Posten, oder er rechnet weiter mit der Quote und beweist, dass das gesamte Einkommen tatsächlich verbraucht wurde.</p>
<p>Im Beispiel bleiben dem Vater nach dem Kindesunterhalt ${h.eur(ehe.basisPflichtig, 2)}. Die Quote ergäbe für eine Ehefrau ohne eigenes Einkommen ${h.eur(ehe.quote, 2)}. Weil das Familieneinkommen über ${h.eur(GRENZE)} liegt, ist diese Zahl aber nur die Obergrenze: Belegt sie einen konkreten Bedarf von weniger, gilt der niedrigere Betrag.</p>
<h2>Wie eine konkrete Bedarfsaufstellung aussieht</h2>
<p>Eine Aufstellung beginnt mit den festen Kosten des bisherigen Lebens: Miete oder Nutzungswert einer gleichwertigen Wohnung, Nebenkosten, Haushaltshilfe. Dann folgen Mobilität, Kleidung, Gesundheit und Freizeit, jeweils mit Belegen aus der Zeit vor der Trennung. Zuletzt die Vorsorge, denn auch Kranken- und Altersvorsorge des Berechtigten gehören zum Bedarf. Von der Summe zieht das Gericht eigene Einkünfte des Berechtigten ab, nach den Leitlinien ohne den Erwerbsanreiz. Ergibt die Liste im Beispiel mehr als die ${h.eur(ehe.quote, 2)} der Quote, bleibt es bei der Quote; ergibt sie weniger, gilt die Liste.</p>
<p>Wichtig ist der Maßstab: Es zählt der Lebensstandard, den die Familie tatsächlich gepflegt hat, nicht der, den sie sich hätte leisten können. Wer sparsam gelebt hat, kann nach der Trennung keinen Luxus verlangen. Wer dagegen jedes Jahr Fernreisen unternommen hat, kann diese Ausgaben belegen und in die Rechnung aufnehmen.</p>
<h2>Was in solchen Verfahren meist streitig ist</h2>
<p>Bei hohen Einkommen verlagert sich der Streit vom Rechnen zum Belegen. Kontoauszüge, Kreditkartenabrechnungen und Belege über frühere Urlaube werden wichtig. Je weiter die Trennung zurückliegt, desto schwerer lässt sich der frühere Lebensstandard belegen; Unterlagen aus den letzten gemeinsamen Jahren sind deshalb besonders wertvoll. Auch Zahlungen, die ein Elternteil freiwillig für die Kinder leistet, etwa Schulgeld direkt an die Schule, werden in solchen Verfahren genau aufgeschlüsselt. Selbständige und Gesellschafter müssen ihr Einkommen über mehrere Jahre darlegen, oft mit Bilanzen und Steuerbescheiden. Wer im Ausland Einkünfte erzielt oder Vermögen hält, muss auch diese offenlegen. Dauer und Kosten eines solchen Verfahrens sind schwer vorherzusagen.</p>
<p>Diese Seite gibt die Regeln der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und der Leitlinien wieder. Sie ist allgemeine Information; wie hoch ein konkreter Bedarf im Einzelfall anerkannt wird, entscheidet allein das Familiengericht.</p>`,
  },
  en: {
    slug: 'child-support-high-income',
    nav: 'Support above €11,200',
    card: 'When income is above the table: what children receive and when a spouse has to prove actual needs.',
    title: 'Child Support on a High Income 2026: Above the Table',
    description: `Maintenance on a high income in Germany 2026: the Düsseldorf Table stops at ${EN.eur(TOP)} net. What children get beyond it and when a spouse must show actual needs.`,
    h1: 'Maintenance when income is above the Düsseldorf Table',
    intro: 'The table stops at a certain net income. Maintenance does not stop there; it is just justified differently.',
    resume: `The 2026 Düsseldorf Table has fifteen income groups; the last one runs up to ${EN.eur(TOP)} adjusted net. For that group it sets needs of ${EN.eur(D.bedarf[LAST][0])}, ${EN.eur(D.bedarf[LAST][1])}, ${EN.eur(D.bedarf[LAST][2])} and ${EN.eur(D.bedarf[LAST][3])} depending on age; after the child-benefit share, minors receive between ${EN.eur(zahlbetrag(LAST, 0), 2)} and ${EN.eur(zahlbetrag(LAST, 2), 2)}. If a parent earns more, the amounts do not simply keep rising. A child claiming more usually has to show what the higher need is for, such as private school, riding lessons or time abroad. Spouses face a similar threshold: under the NRW court guidelines, adjusted family income up to ${EN.eur(GRENZE)} is presumed to have been spent in full, and the 45 percent quota applies. Above it, the spouse claiming maintenance either itemises actual needs or proves that the higher income really was spent on living costs.`,
    faqs: [
      { q: 'How much child support does someone on €14,000 net pay for two children?', a: `Using the last group’s amounts, ${EN.eur(kinder.summe, 2)} a month for children aged four and ten, the same as at ${EN.eur(TOP)}. Anyone asking for more has to show the children’s higher need. Courts then look at what the children actually spent while the family lived together, not at the payer’s income as such.` },
      { q: 'What does an itemised claim (konkrete Bedarfsbemessung) mean for a spouse?', a: `Instead of 45 percent of the income difference, the spouse lists what their standard of living requires: housing, car, holidays, clothing, hobbies, insurance. Their own income is deducted. Under the NRW guidelines, the itemised need is also capped at the amount the quota method would produce.` },
      { q: 'I am a well-paid expat. Must I disclose my full income in a German maintenance case?', a: `Usually yes, including foreign salary, bonuses and share awards, because without it no one can tell whether the quota or an itemised claim applies. Some payers instead declare that they can pay any reasonable amount; the other side must then itemise. What is enough in a given case is up to the family court (Familiengericht).` },
      { q: 'Does the standard student amount still apply to children of high earners?', a: `For a student with their own flat the table normally sets ${EN.eur(D.student_bedarf)}, but it expressly allows more in view of the parents’ position in life. Courts therefore accept a higher amount more often for children of high earners, provided the child explains why.` },
    ],
    body: (h) => `<h2>Where the table ends</h2>
<p>The last row of the table covers net incomes up to ${h.eur(TOP)}. Its need is ${h.pct(D.prozent[LAST] / 100, 0)} of the statutory minimum, twice the first group. There is no sixteenth group, and the table does not extend itself in a straight line. That is deliberate: children share in their parents’ standard of living, but maintenance is not a share of growing wealth.</p>
${h.table(['Age band', 'Need, last group', 'Payable'], [0, 1, 2, 3].map((s) => [['0 to 5', '6 to 11', '12 to 17', '18 and over'][s], h.eur(D.bedarf[LAST][s]), h.eur(zahlbetrag(LAST, s as 0 | 1 | 2 | 3), 2)]), `Group ${LAST + 1}, up to ${h.eur(TOP)} net, after the child-benefit share`, ['l', 'r', 'r'])}
<h2>Children: more only with reasons</h2>
<p>A father on ${h.eur(N)} net with two children aged four and ten pays ${h.eur(kinder.summe, 2)} under the last group’s amounts, exactly like one on ${h.eur(TOP)} (${h.eur(kinderTop.summe, 2)}). Under section 1610 of the Civil Code (BGB) a child’s need follows the position in life derived from the parents. A claim for more must therefore show which expenses shaped the child’s life so far. Typical items:</p>
<ul>
<li>fees for a private or international school,</li>
<li>years of music, sports or riding lessons,</li>
<li>holidays and language trips that were part of family life,</li>
<li>a larger home, part of which is attributable to the child.</li>
</ul>
<p>Extra need such as nursery fees or tutoring can be claimed on top; both parents share it according to their incomes. International school fees are a frequent item in expat families and are argued case by case.</p>
<h2>Spouses: quota up to the threshold, proof above it</h2>
<p>Spousal and separation maintenance have their own threshold. The ${h.src('olgLeitlinien', 'NRW court guidelines')} presume that a family with adjusted income up to ${h.eur(GRENZE)} spent all of it, so the quota applies. Above that, part of the income is presumed to have been saved. The spouse claiming maintenance then has two routes: itemise the need line by line, or keep using the quota and prove that the whole income was actually spent.</p>
<p>In the example the father has ${h.eur(ehe.basisPflichtig, 2)} left after child support. The quota would give a wife without income ${h.eur(ehe.quote, 2)}. Because family income is above ${h.eur(GRENZE)}, that figure is only a ceiling: if she shows a lower itemised need, the lower amount applies.</p>
<h2>What an itemised claim looks like</h2>
<p>An itemised claim starts with the fixed costs of the life the couple led: rent or the value of comparable housing, running costs, household help. Then mobility, clothing, health and leisure, each backed by records from before the separation. Finally provision for the future, since the claimant’s health insurance and pension provision also count as need. The court deducts the claimant’s own income, under the guidelines without the work incentive. If the list in the example comes to more than the ${h.eur(ehe.quote, 2)} quota figure, the quota caps it; if it comes to less, the list applies.</p>
<p>The yardstick matters: what counts is the standard of living the family actually kept, not the one it could have afforded. A couple who lived frugally cannot claim luxury after separating. A family that travelled long-haul every year can document those trips and include them. For expat households, employer-paid housing or school fees that ended with the assignment raise the question of which standard was really sustained.</p>
<h2>What these cases are usually about</h2>
<p>With high incomes the dispute moves from arithmetic to evidence. Bank statements, credit card bills and records of past holidays matter. Self-employed people and company owners must show income over several years, often with balance sheets and tax assessments. Income or assets abroad must be disclosed too. How long such proceedings take and what they cost is hard to predict.</p>
<p>This page summarises the rules of the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the guidelines. It is general information; how much itemised need is accepted in a given case is for the family court alone to decide.</p>`,
  },
});
