import { defineGuide } from '../../lib/guide-types';
import { unterhaltsvorschuss, uvgVoll } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
const U = P.uvg;
const KG = P.kindergeld.monat;
const A = P.dt.altersstufen;
const voll = [uvgVoll(0), uvgVoll(1), uvgVoll(2)];
/** Zehnjähriger, Vater zahlt 200 €. */
const zehn = unterhaltsvorschuss({ alter: 10, unterhaltErhalten: 200 });
/** Sechzehnjährige, Zusatzbedingung erfüllt, keine Zahlung. */
const sechzehn = unterhaltsvorschuss({ alter: 16, ab12Voraussetzung: true });
/** Dieselbe Jugendliche ohne erfüllte Zusatzbedingung. */
const sechzehnNein = unterhaltsvorschuss({ alter: 16, ab12Voraussetzung: false });
/** Vierjährige, Mutter zahlt mehr als den Vorschuss: kein Anspruch. */
const genug = unterhaltsvorschuss({ alter: 4, unterhaltErhalten: 250 });
/** Neunzehnjähriger. */
const volljaehrig = unterhaltsvorschuss({ alter: 19 });

export default defineGuide({
  id: 'unterhaltsvorschuss-rechner',
  group: 'kind',
  order: 31,
  tool: 'uvg',
  related: ['unterhaltsvorschuss', 'mindestunterhalt', 'kindesunterhalt-rechner', 'kindergeld-anrechnung', 'volljaehrigenunterhalt-rechner'],
  sources: ['uvg1', 'uvg2', 'estg66', 'bgb1612a'],
  de: {
    slug: 'unterhaltsvorschuss-rechner',
    nav: 'Unterhaltsvorschuss-Rechner',
    card: 'Alter, gezahlter Unterhalt, Waisenbezüge: der Monatsbetrag nach §§ 1 und 2 UVG mit Rechenweg.',
    title: 'Unterhaltsvorschuss-Rechner 2026: Ihr Betrag pro Monat',
    description: `Unterhaltsvorschuss-Rechner 2026: Alter des Kindes, Teilzahlungen und Waisenbezüge eingeben, Betrag bis ${DE.eur(voll[2])} sehen, mit Prüfung der Regel ab ${U.alter_grenze_ohne_bedingung} Jahren.`,
    h1: 'Unterhaltsvorschuss berechnen',
    intro: 'Drei Zahlen genügen: das Alter des Kindes, was vom anderen Elternteil ankommt und ob Waisenbezüge fließen.',
    resume: `Der Rechner bestimmt den Unterhaltsvorschuss 2026 in drei Schritten nach § 2 UVG. Er sucht zum Alter des Kindes den Mindestunterhalt der Altersstufe, zieht das volle Kindergeld für ein erstes Kind von ${DE.eur(KG)} ab und rechnet dann tatsächlich gezahlten Unterhalt sowie Waisenbezüge an. Ohne Zahlungen ergibt das ${DE.eur(voll[0])}, ${DE.eur(voll[1])} oder ${DE.eur(voll[2])} im Monat. Ein Zehnjähriger, dessen Vater ${DE.eur(200)} überweist, erhält noch ${DE.eur(zehn.leistung, 2)}. Zwischen ${U.alter_grenze_ohne_bedingung} und ${U.alter_grenze} Jahren erscheint eine zusätzliche Frage: Bezieht das Kind keine Leistungen des Jobcenters, oder hat der betreuende Elternteil mindestens ${DE.eur(U.mindesteinkommen_elternteil_ab12)} Einkommen ohne Kindergeld? Wer hier mit Nein antwortet, sieht ${DE.eur(sechzehnNein.leistung)}, weil § 1 Abs. 1a UVG dann keinen Anspruch gibt. Ab dem ${U.alter_grenze}. Geburtstag zeigt der Rechner ebenfalls ${DE.eur(volljaehrig.leistung)}. Das Ergebnis ist der Betrag, den die Unterhaltsvorschussstelle des Jugendamts nach Aktenlage voraussichtlich bewilligt, nicht der Bescheid selbst.`,
    faqs: [
      { q: 'Warum zeigt der Unterhaltsvorschuss-Rechner 0 € trotz ausbleibender Zahlungen?', a: `Meist aus einem von drei Gründen: Das Kind ist ${U.alter_grenze} oder älter, es ist zwischen ${U.alter_grenze_ohne_bedingung} und ${U.alter_grenze - 1} und die Frage nach Jobcenter-Leistungen oder Mindesteinkommen ist mit Nein beantwortet, oder die eingetragenen Zahlungen und Waisenbezüge erreichen bereits den Vorschuss. Die Zeile unter dem Ergebnis nennt jeweils den Grund. Liegt keiner davon vor, prüfen Sie die Eingaben.` },
      { q: 'Was trage ich bei „Unterhalt, der ankommt“ ein, wenn der andere Elternteil unregelmäßig zahlt?', a: 'Den Betrag, der im jeweiligen Monat tatsächlich eingeht. Die Unterhaltsvorschussstelle rechnet monatsweise an, was in demselben Monat gezahlt wurde (§ 2 Abs. 3 UVG). Schwankt die Zahlung, ergibt sich jeden Monat ein anderer Vorschuss. Für eine Planung können Sie einen typischen Monat eintragen und die Rechnung für einen Monat ohne Zahlung wiederholen.' },
      { q: 'Berücksichtigt der Unterhaltsvorschuss-Rechner das Einkommen meines Kindes in der Ausbildung?', a: 'Nein. Für Jugendliche, die keine allgemeinbildende Schule mehr besuchen, rechnet § 2 Abs. 4 UVG eigene Einkünfte aus Arbeit und Vermögen zur Hälfte an, bei Auszubildenden nach Abzug einer Pauschale. Diese Stufe bildet der Rechner nicht ab. Bei einem Kind mit Ausbildungsvergütung fällt der bewilligte Vorschuss deshalb niedriger aus als angezeigt oder entfällt ganz.' },
      { q: 'Spielt mein eigenes Gehalt für den Unterhaltsvorschuss eine Rolle?', a: `Bis zum ${U.alter_grenze_ohne_bedingung}. Geburtstag nicht: Ein Elternteil mit hohem Einkommen erhält denselben Betrag wie einer ohne. Danach zählt Ihr Einkommen nur als mögliche Eintrittskarte, denn ab ${DE.eur(U.mindesteinkommen_elternteil_ab12)} ohne Kindergeld ist die Zusatzbedingung des § 1 Abs. 1a UVG erfüllt. Die Höhe des Vorschusses steigt mit Ihrem Gehalt aber nicht.` },
    ],
    body: (h) => `<h2>Die Eingaben</h2>
<ul>
<li><strong>Alter des Kindes</strong>: in vollen Jahren. Der Rechner ordnet es einer der drei Altersstufen des Mindestunterhalts zu (${A[0][0]} bis ${A[0][1]}, ${A[1][0]} bis ${A[1][1]}, ${A[2][0]} bis ${A[2][1]} Jahre). Eingaben ab ${U.alter_grenze} führen zu keinem Anspruch.</li>
<li><strong>Unterhalt, der ankommt</strong>: was der andere Elternteil im Monat tatsächlich zahlt, nicht was er schuldet.</li>
<li><strong>Waisenbezüge</strong>: Waisenrente oder vergleichbare Leistungen nach dem Tod des anderen Elternteils oder eines Stiefelternteils.</li>
<li><strong>Zusatzfrage ab ${U.alter_grenze_ohne_bedingung}</strong>: Sie erscheint nur für Jugendliche von ${U.alter_grenze_ohne_bedingung} bis ${U.alter_grenze - 1} Jahren. „Ja“ bedeutet: Das Kind bezieht keine Leistungen nach dem SGB II, oder der Elternteil hat mindestens ${h.eur(U.mindesteinkommen_elternteil_ab12)} Einkommen ohne Kindergeld.</li>
</ul>
<p>Rechts erscheint der Monatsbetrag, darunter der Grund, falls kein Anspruch besteht. Die Liste zeigt die volle Leistung aller drei Altersstufen und hebt die Stufe Ihres Kindes hervor. Der Rechenweg führt Mindestunterhalt, Kindergeldabzug und Anrechnung nach ${h.src('uvg2', '§ 2 UVG')} einzeln auf. Ihre Eingaben stehen in der Adresszeile; der Link lässt sich speichern oder weitergeben.</p>
<h2>Fünf Fälle, durch den Rechner geschickt</h2>
${h.table(['Fall', 'Eingaben', 'Vorschuss'], [
  ['Junge, 10 Jahre', `Vater zahlt ${h.eur(200)}`, h.eur(zehn.leistung, 2)],
  ['Mädchen, 16 Jahre', 'keine Zahlung, Zusatzfrage Ja', h.eur(sechzehn.leistung, 2)],
  ['Mädchen, 16 Jahre', 'keine Zahlung, Zusatzfrage Nein', h.eur(sechzehnNein.leistung, 2)],
  ['Mädchen, 4 Jahre', `Mutter zahlt ${h.eur(250)}`, h.eur(genug.leistung, 2)],
  ['junger Mann, 19 Jahre', 'keine Zahlung', h.eur(volljaehrig.leistung, 2)],
], 'Ergebnisse des Rechners, Werte 2026', ['l', 'l', 'r'])}
<p>Der vierte Fall überrascht viele: Zahlt der andere Elternteil ${h.eur(250)} für ein Kleinkind, liegt das über dem Vorschuss von ${h.eur(voll[0])}, und die Vorschussstelle leistet nichts. Ob diese ${h.eur(250)} dem Kind nach dem Einkommen des Zahlenden genügen, ist eine andere Frage; sie beantwortet der ${h.a('kindesunterhalt-rechner', 'Kindesunterhalt-Rechner')}.</p>
<h2>Was der Rechner nicht prüft</h2>
<p>Er unterstellt, dass die Grundvoraussetzungen des ${h.src('uvg1', '§ 1 UVG')} vorliegen: Das Kind lebt in Deutschland bei einem alleinstehenden oder dauernd getrennt lebenden Elternteil, die Eltern wohnen nicht zusammen, und der betreuende Elternteil wirkt bei der Feststellung von Vaterschaft und Aufenthalt mit. Er rechnet volle Monate; beginnt oder endet der Anspruch mitten im Monat, zahlt die Stelle anteilig. Eigenes Einkommen von Jugendlichen, die nicht mehr zur Schule gehen, bleibt außen vor. Auch die Rundung auf volle Euro und die Regel, dass sehr kleine Beträge nicht ausgezahlt werden (§ 9 Abs. 3 UVG), wendet erst die Behörde an.</p>
<p>Die Berechnung ist eine allgemeine Information auf Grundlage des Unterhaltsvorschussgesetzes und keine Rechtsberatung; verbindlich ist allein der Bescheid. Voraussetzungen, Antrag und Rückgriff erklärt die Seite zum ${h.a('unterhaltsvorschuss', 'Unterhaltsvorschuss')}, die zugrunde liegenden Beträge die Seite zum ${h.a('mindestunterhalt', 'Mindestunterhalt')}.</p>`,
  },
  en: {
    slug: 'maintenance-advance-calculator',
    nav: 'Maintenance advance calculator',
    card: 'Age, support received, orphan’s benefits: the monthly amount under sections 1 and 2 UVG, step by step.',
    title: 'Maintenance Advance Calculator Germany 2026: UVG Rates',
    description: `Maintenance advance calculator for Germany 2026: enter the child’s age, partial support and orphan’s benefits, see up to ${EN.eur(voll[2])} a month and the rule from age ${U.alter_grenze_ohne_bedingung}.`,
    h1: 'Calculate the German maintenance advance',
    intro: 'Three inputs are enough: your child’s age, what the other parent actually pays and any orphan’s pension.',
    resume: `This calculator works out the 2026 maintenance advance (Unterhaltsvorschuss) in the three steps of section 2 of the Maintenance Advance Act (UVG). It takes the statutory minimum support for your child’s age band, deducts the full child benefit (Kindergeld) for a first child, ${EN.eur(KG)}, and then subtracts any support and orphan’s benefits that actually arrive. With no payments that gives ${EN.eur(voll[0])}, ${EN.eur(voll[1])} or ${EN.eur(voll[2])} a month. A ten-year-old whose father transfers ${EN.eur(200)} still receives ${EN.eur(zehn.leistung, 2)}. For teenagers from ${U.alter_grenze_ohne_bedingung} to ${U.alter_grenze - 1} an extra question appears: is the child free of job-centre benefits, or does the resident parent earn at least ${EN.eur(U.mindesteinkommen_elternteil_ab12)} excluding child benefit? Answering no returns ${EN.eur(sechzehnNein.leistung)}, because section 1(1a) UVG then grants nothing. From the ${U.alter_grenze}th birthday the result is also ${EN.eur(volljaehrig.leistung)}. The figure is what the maintenance advance office at the youth welfare office (Jugendamt) would probably grant on the facts entered, not the official decision.`,
    faqs: [
      { q: 'Why does the maintenance advance calculator show €0 although nothing is paid?', a: `Usually for one of three reasons: the child is ${U.alter_grenze} or older; the child is between ${U.alter_grenze_ohne_bedingung} and ${U.alter_grenze - 1} and you answered no to the job-centre or minimum-income question; or the support and orphan’s benefits you entered already reach the advance. The line under the result names the reason. If none applies, check your inputs.` },
      { q: 'I earn a good expat salary. Does that reduce the maintenance advance?', a: `Not before the child’s ${U.alter_grenze_ohne_bedingung}th birthday: the advance ignores the resident parent’s income, so a high earner receives the same amount. Afterwards your income only matters as a way in, since earning at least ${EN.eur(U.mindesteinkommen_elternteil_ab12)} a month, child benefit excluded, satisfies section 1(1a) UVG. A higher salary never raises the advance itself.` },
      { q: 'The other parent pays in a foreign currency. What do I enter?', a: 'Enter the euro value of what reaches your account in the month, after any bank charges, as the office counts the support received in the same month (section 2(3) UVG). If the amount varies with the exchange rate, run the calculator for a typical month and for a weak one. The office will ask for bank statements showing the incoming payments.' },
      { q: 'Does the calculator handle a teenager who earns money from an apprenticeship?', a: 'No. For young people who have left general school, section 2(4) UVG counts half of their own earnings and investment income, with a flat deduction for trainees. The calculator does not apply this step, so for an apprentice with a training wage (Ausbildungsvergütung) the advance actually granted will be lower than shown, or nil.' },
    ],
    body: (h) => `<h2>The inputs</h2>
<ul>
<li><strong>Child’s age</strong> in whole years. The tool places the child in one of the three bands of minimum support (${A[0][0]} to ${A[0][1]}, ${A[1][0]} to ${A[1][1]}, ${A[2][0]} to ${A[2][1]}). From ${U.alter_grenze} there is no entitlement.</li>
<li><strong>Maintenance actually received</strong>: what the other parent really pays in the month, not what a court order or agreement says.</li>
<li><strong>Orphan’s benefits</strong>: an orphan’s pension or similar payments after the death of the other parent or a step-parent.</li>
<li><strong>Extra question from ${U.alter_grenze_ohne_bedingung}</strong>: shown only for ages ${U.alter_grenze_ohne_bedingung} to ${U.alter_grenze - 1}. “Yes” means the child receives no benefits under Social Code II, or the resident parent has income of at least ${h.eur(U.mindesteinkommen_elternteil_ab12)} without child benefit.</li>
</ul>
<p>The result panel shows the monthly amount with, where relevant, the reason there is no claim. Below it a list gives the full advance for all three age bands, with your child’s band highlighted. The breakdown lists minimum support, the child-benefit deduction and the offset under ${h.src('uvg2', 'section 2 UVG')}. Your inputs are stored in the page address, so the link can be saved or sent to someone helping you.</p>
<h2>Five cases run through the tool</h2>
${h.table(['Case', 'Inputs', 'Advance'], [
  ['boy, 10', `father pays ${h.eur(200)}`, h.eur(zehn.leistung, 2)],
  ['girl, 16', 'nothing paid, extra question yes', h.eur(sechzehn.leistung, 2)],
  ['girl, 16', 'nothing paid, extra question no', h.eur(sechzehnNein.leistung, 2)],
  ['girl, 4', `mother pays ${h.eur(250)}`, h.eur(genug.leistung, 2)],
  ['young man, 19', 'nothing paid', h.eur(volljaehrig.leistung, 2)],
], 'Results from the calculator, 2026 values', ['l', 'l', 'r'])}
<p>The fourth line surprises many parents. If the other parent pays ${h.eur(250)} for a toddler, that is above the ${h.eur(voll[0])} advance and the office pays nothing. Whether ${h.eur(250)} is enough given the payer’s income is a separate question, answered by the ${h.a('kindesunterhalt-rechner', 'child support calculator')}.</p>
<h2>What the calculator does not check</h2>
<p>It assumes the basic conditions of ${h.src('uvg1', 'section 1 UVG')} are met: the child lives in Germany with a single or permanently separated parent, the parents do not live together, and the resident parent cooperates in establishing paternity and the other parent’s whereabouts. Non-EU nationals also need a qualifying residence title, which the tool cannot assess. It works in whole months; if entitlement starts or ends mid-month the office pays pro rata. A school-leaver’s own income is left out, and the rounding to whole euros and the rule that very small amounts are not paid out (section 9(3) UVG) are applied by the office.</p>
<p>The result is general information based on the Maintenance Advance Act, not legal advice; only the official decision (Bescheid) is binding. Conditions, application and recovery are explained on the ${h.a('unterhaltsvorschuss', 'maintenance advance')} page, the underlying figures on the ${h.a('mindestunterhalt', 'minimum child support')} page.</p>`,
  },
});
