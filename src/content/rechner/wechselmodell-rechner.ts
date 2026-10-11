import { defineGuide } from '../../lib/guide-types';
import { wechselmodell } from '../../lib/engine/unterhalt';
import { P, DE, EN } from '../../lib/fmt';

/** Startwerte des Rechners (WechselRechner): A 3.800 €, B 2.400 €, Kind 8 Jahre, keine Mehrkosten, Kindergeld bei B. */
const start = wechselmodell({ einkommenA: 3800, einkommenB: 2400, alter: 8, kindergeldAn: 'B' });
const kgBeiA = wechselmodell({ einkommenA: 3800, einkommenB: 2400, alter: 8, kindergeldAn: 'A' });
const mitMehr = wechselmodell({ einkommenA: 3800, einkommenB: 2400, alter: 8, mehrbedarf: 200, kindergeldAn: 'B' });
const teen = wechselmodell({ einkommenA: 2500, einkommenB: 3100, alter: 15, kindergeldAn: 'A' });
const SOCKEL = P.leitlinien.sockel_volljaehrig;

export default defineGuide({
  id: 'wechselmodell-rechner',
  group: 'kind',
  order: 46,
  tool: 'wechsel',
  related: ['wechselmodell-unterhalt', 'erweiterter-umgang', 'kindergeld-anrechnung', 'kindesunterhalt-rechner', 'bereinigtes-netto'],
  sources: ['bghWechsel2017', 'olgLeitlinien', 'olgDtPdf', 'bgb1612b'],
  de: {
    slug: 'wechselmodell-rechner',
    nav: 'Wechselmodell-Rechner',
    card: 'Ausgleichszahlung im paritätischen Wechselmodell mit Mehrkosten und Kindergeldverrechnung, Schritt für Schritt.',
    title: 'Wechselmodell-Rechner 2026: Unterhalt und Kindergeld',
    description: `Wechselmodell-Unterhaltsrechner 2026: Bedarf aus beiden Einkommen, Haftung über ${DE.eur(SOCKEL)}, Mehrkosten, Kindergeld ${DE.eur(P.kindergeld.monat)} verrechnet, mit Rechenweg je Schritt.`,
    h1: 'Wechselmodell-Rechner: Ausgleichszahlung zwischen den Eltern',
    intro: 'Für ein Kind, das je etwa zur Hälfte bei beiden Eltern lebt: Bedarf, Haftungsanteile, Unterhaltsspitze und Kindergeld in einer Zahl.',
    resume: `Der Wechselmodell-Rechner ermittelt, welcher Elternteil dem anderen im paritätischen Wechselmodell monatlich wie viel überweist. Er folgt dem Beschluss des Bundesgerichtshofs XII ZB 565/15 und den Nummern 12 und 14 der Leitlinien der Oberlandesgerichte in NRW 2026. Mit den Startwerten, ${DE.eur(3800)} bereinigtem Netto bei Elternteil A und ${DE.eur(2400)} bei B, einem achtjährigen Kind und dem Kindergeld bei B, ergibt sich ein Bedarf von ${DE.eur(start.tabellenbedarf)} nach Gruppe ${start.gruppe + 1} der Düsseldorfer Tabelle 2026. Nach Abzug des halben Kindergeldes bleiben ${DE.eur(start.barbedarf, 2)} Barbedarf. A haftet mit ${DE.pct(start.quoteA, 1)}, B mit ${DE.pct(start.quoteB, 1)} ihres Einkommens über ${DE.eur(SOCKEL)}. Die halbe Differenz, ${DE.eur(start.spitze, 2)}, schuldet A; B gibt ${DE.eur(start.kgWeitergabe, 2)} Kindergeld weiter. Verrechnet zahlt A an B ${DE.eur(start.ausgleich, 2)} im Monat. Bezieht dagegen A das Kindergeld, steigt die Zahlung auf ${DE.eur(kgBeiA.ausgleich, 2)}.`,
    faqs: [
      { q: 'Warum ändert sich das Ergebnis des Wechselmodell-Rechners so stark, je nachdem wer das Kindergeld bezieht?', a: `Weil der Bezieher dem anderen einen Teil weitergeben muss und diese Weitergabe mit der Unterhaltsspitze verrechnet wird. Bezieht der Zahlende selbst das Kindergeld, kommen Spitze und Kindergeldanteil zusammen: Mit den Startwerten sind es ${DE.eur(kgBeiA.ausgleich, 2)} statt ${DE.eur(start.ausgleich, 2)}. In beiden Fällen stehen den Eltern am Ende dieselben Anteile zu.` },
      { q: 'Was trage ich im Wechselmodell-Rechner bei Mehrkosten ein?', a: `Ihre Schätzung der monatlichen Kosten, die nur durch das Wechselmodell entstehen: der Mietanteil für ein zweites Kinderzimmer, Fahrten zwischen den Wohnungen, doppelt gekaufte Kleidung oder Schulsachen. Der Rechner zählt sie zum Bedarf. Mit ${DE.eur(200)} Mehrkosten ergeben die Startwerte ${DE.eur(mitMehr.ausgleich, 2)}. Ob ein Gericht den Betrag anerkennt, prüft es im Einzelfall.` },
      { q: 'Kann der Wechselmodell-Rechner mehrere Kinder berechnen?', a: `Nein, er rechnet für ein Kind unter 18. Bei Geschwistern rechnen Sie jedes Kind einzeln mit seinem Alter und addieren die Ergebnisse; der Rechner kürzt das Einkommen dabei nicht um den Unterhalt des Geschwisterkinds, wie ein Gericht verfahren würde, ist eine Frage des Einzelfalls. Für Kinder ab 18 gilt kein Wechselmodell im Sinne des Betreuungsunterhalts, dort haften beide Eltern ohnehin anteilig.` },
      { q: 'Was passiert im Wechselmodell-Rechner, wenn ein Elternteil unter dem Sockel verdient?', a: `Dann ist seine Haftungsquote null und der andere Elternteil trägt den Barbedarf allein. Zu zahlen ist trotzdem nur die halbe Differenz, weil der Geringverdiener seine Hälfte in Natur leistet. Die Leitlinien erlauben bei Minderjährigen, den Sockel bis zum notwendigen Selbstbehalt zu senken; diese Feinheit bildet der Rechner nicht ab.` },
    ],
    body: (h) => `<h2>Die Eingaben des Rechners</h2>
<ul>
<li><strong>Netto Elternteil A</strong> und <strong>Netto Elternteil B</strong>: jeweils das bereinigte Nettoeinkommen, also nach Steuern, Sozialabgaben, berufsbedingten Kosten und anerkannten Schulden. Wie es ermittelt wird, steht beim ${h.a('bereinigtes-netto', 'bereinigten Netto')}.</li>
<li><strong>Alter des Kindes</strong> in Jahren, bis 17. Es bestimmt die Altersstufe der Tabelle.</li>
<li><strong>Mehrkosten des Wechselmodells</strong> in Euro pro Monat: Ihre Annahme für Wohnung, Fahrten, Kita. Standard ist 0.</li>
<li><strong>Kindergeld erhält</strong>: A oder B, je nachdem, wer es von der Familienkasse bekommt.</li>
</ul>
<h2>Was der Rechner anzeigt</h2>
<p>Oben steht die Ausgleichszahlung pro Monat und wer sie leistet. Darunter folgen die Unterhaltsspitze, also die halbe Differenz der Haftungsanteile, die Kindergeldweitergabe und der Gesamtbedarf des Kindes. Der Rechenweg listet jeden Schritt mit Gruppe, Quote und Betrag. Das Ergebnis lässt sich kopieren, als Link teilen oder drucken; der Link enthält Ihre Eingaben.</p>
<h2>Vier Rechenbeispiele</h2>
${h.table(['Eingaben', 'Barbedarf', 'Spitze', 'Kindergeld weiter', 'Ausgleich'], [
  [`A ${h.eur(3800)}, B ${h.eur(2400)}, 8 J., Kindergeld bei B`, h.eur(start.barbedarf, 2), h.eur(start.spitze, 2), h.eur(start.kgWeitergabe, 2), `${h.eur(start.ausgleich, 2)} von ${start.ausgleichZahlt}`],
  ['dasselbe, Kindergeld bei A', h.eur(kgBeiA.barbedarf, 2), h.eur(kgBeiA.spitze, 2), h.eur(kgBeiA.kgWeitergabe, 2), `${h.eur(kgBeiA.ausgleich, 2)} von ${kgBeiA.ausgleichZahlt}`],
  [`dasselbe wie oben, ${h.eur(200)} Mehrkosten`, h.eur(mitMehr.barbedarf, 2), h.eur(mitMehr.spitze, 2), h.eur(mitMehr.kgWeitergabe, 2), `${h.eur(mitMehr.ausgleich, 2)} von ${mitMehr.ausgleichZahlt}`],
  [`A ${h.eur(2500)}, B ${h.eur(3100)}, 15 J., Kindergeld bei A`, h.eur(teen.barbedarf, 2), h.eur(teen.spitze, 2), h.eur(teen.kgWeitergabe, 2), `${h.eur(teen.ausgleich, 2)} von ${teen.ausgleichZahlt}`],
], 'Vom Rechenkern ermittelt, Düsseldorfer Tabelle und Leitlinien NRW 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>Die letzte Zeile zeigt eine Umkehr: B verdient mehr und schuldet eine Spitze von ${h.eur(teen.spitze, 2)}, A muss aber ${h.eur(teen.kgWeitergabe, 2)} Kindergeld weitergeben. Unter dem Strich zahlt A eine kleine Differenz an B.</p>
<h2>Die Regeln hinter dem Ergebnis</h2>
<p>Der Bedarf richtet sich nach dem zusammengerechneten Einkommen ohne Höhergruppierung (Nummer 12 Absatz 3 der ${h.src('olgLeitlinien', 'Leitlinien in NRW')}), plus Mehrkosten. Das halbe Kindergeld deckt den Barbedarf (${h.src('bgb1612b', '§ 1612b BGB')}). Gehaftet wird nach dem Einkommen über ${h.eur(h.P.leitlinien.sockel_volljaehrig)}. Die Betreuungshälfte des Kindergeldes teilen die Eltern hälftig, die Barhälfte nach Quote (Nummer 14 Absatz 2). Der Zahlungsanspruch richtet sich gegen den besser verdienenden Elternteil, so der ${h.src('bghWechsel2017', 'BGH im Beschluss XII ZB 565/15')}.</p>
<h2>Grenzen des Rechners</h2>
<ul>
<li>Er setzt ein echtes paritätisches Wechselmodell voraus. Bei deutlich ungleicher Betreuung gilt das Residenzmodell mit Abschlägen für ${h.a('erweiterter-umgang', 'erweiterten Umgang')}.</li>
<li>Er rechnet für ein Kind unter 18 und kennt keine Rangfolge mit weiteren Berechtigten.</li>
<li>Kita-Beiträge und anderer Mehrbedarf werden nur erfasst, wenn Sie sie bei den Mehrkosten eintragen.</li>
<li>Den abgesenkten Sockel bei knappen Einkommen und Billigkeitskorrekturen bei großem Einkommensgefälle bildet er nicht ab.</li>
</ul>
<p>Hintergrund und Rechtsprechung stehen auf der Seite zum ${h.a('wechselmodell-unterhalt', 'Unterhalt im Wechselmodell')}; die Tabellenwerte aus der ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')}. Das Ergebnis ist eine allgemeine Berechnung für das Wechselmodell, keine Rechtsberatung.</p>`,
  },
  en: {
    slug: 'shared-care-calculator',
    nav: 'Shared care calculator',
    card: 'The balancing payment under equal shared care in Germany, with extra costs and child benefit, step by step.',
    title: 'Shared Care Calculator Germany 2026: Child Support Balance',
    description: `Shared care (Wechselmodell) child support calculator for Germany 2026: need from both incomes, shares above ${EN.eur(SOCKEL)}, extra costs, ${EN.eur(P.kindergeld.monat)} child benefit offset.`,
    h1: 'Shared care calculator: the balancing payment between parents',
    intro: 'For a child living about half the time with each parent in Germany: need, liability shares, support peak and child benefit in one figure.',
    resume: `This calculator works out which parent pays the other how much each month under equal shared care (paritätisches Wechselmodell) in Germany. It follows Federal Court of Justice decision XII ZB 565/15 and numbers 12 and 14 of the 2026 guidelines of the North Rhine-Westphalia higher regional courts. With the default values, ${EN.eur(3800)} adjusted net income for parent A and ${EN.eur(2400)} for parent B, a child of eight and child benefit (Kindergeld) paid to B, the need is ${EN.eur(start.tabellenbedarf)} under group ${start.gruppe + 1} of the 2026 Düsseldorf Table. After half the child benefit, ${EN.eur(start.barbedarf, 2)} of cash need remains. A carries ${EN.pct(start.quoteA, 1)} and B ${EN.pct(start.quoteB, 1)}, based on income above ${EN.eur(SOCKEL)}. A owes half the difference, ${EN.eur(start.spitze, 2)}; B passes on ${EN.eur(start.kgWeitergabe, 2)} of child benefit. Net, A pays B ${EN.eur(start.ausgleich, 2)} a month. If A received the child benefit instead, the payment would be ${EN.eur(kgBeiA.ausgleich, 2)}.`,
    faqs: [
      { q: 'Why does the shared care result change so much depending on who gets child benefit?', a: `Because the parent receiving it has to pass part of it on, and that is offset against the support peak. If the paying parent also receives the benefit, the peak and the benefit share add up: ${EN.eur(kgBeiA.ausgleich, 2)} instead of ${EN.eur(start.ausgleich, 2)} with the default values. Either way, each parent ends up with the same entitlement; only the transfer differs.` },
      { q: 'What should I enter as extra costs of shared care?', a: `Your estimate of monthly costs that exist only because of shared care: the rent share for a second child’s room, travel between homes, clothes or school things bought twice. The calculator adds them to the need. With ${EN.eur(200)} of extra costs the default case gives ${EN.eur(mitMehr.ausgleich, 2)}. Whether a court accepts the figure depends on the evidence.` },
      { q: 'One parent is paid in another currency: how do I use the shared care calculator?', a: `Convert that parent’s net pay into euros at a realistic rate and deduct the tax and social charges actually paid, plus the usual work costs, before entering it. The calculator then treats both incomes alike. Exchange-rate swings and foreign living costs are matters a German family court would weigh separately.` },
      { q: 'Can the shared care calculator handle siblings or a child over 18?', a: `It works for one child under 18. For siblings, run each child with its own age and add up the results. Children over 18 are no longer looked after in the legal sense, so both parents pay cash in proportion anyway; the adult child support calculator covers that case.` },
    ],
    body: (h) => `<h2>The inputs</h2>
<ul>
<li><strong>Net income parent A</strong> and <strong>parent B</strong>: adjusted net income after tax, social contributions, work costs and accepted debts. See ${h.a('bereinigtes-netto', 'adjusted net income')}.</li>
<li><strong>Child’s age</strong> in years, up to 17, which sets the table’s age band.</li>
<li><strong>Extra costs of shared care</strong> per month: your estimate for housing, travel, daycare. Default 0.</li>
<li><strong>Child benefit paid to</strong>: A or B, whoever receives it from the family benefits office (Familienkasse).</li>
</ul>
<h2>What you see</h2>
<p>At the top: the monthly balancing payment and who makes it. Below: the support peak (half the difference between the two liability shares), the child benefit passed on, and the child’s total need. The step-by-step section shows group, shares and amounts. You can copy the result, share a link that keeps your inputs, or print it.</p>
<h2>Four worked examples</h2>
${h.table(['Inputs', 'Cash need', 'Peak', 'Benefit passed on', 'Net payment'], [
  [`A ${h.eur(3800)}, B ${h.eur(2400)}, aged 8, benefit to B`, h.eur(start.barbedarf, 2), h.eur(start.spitze, 2), h.eur(start.kgWeitergabe, 2), `${h.eur(start.ausgleich, 2)} by ${start.ausgleichZahlt}`],
  ['same, benefit to A', h.eur(kgBeiA.barbedarf, 2), h.eur(kgBeiA.spitze, 2), h.eur(kgBeiA.kgWeitergabe, 2), `${h.eur(kgBeiA.ausgleich, 2)} by ${kgBeiA.ausgleichZahlt}`],
  [`first case, ${h.eur(200)} extra costs`, h.eur(mitMehr.barbedarf, 2), h.eur(mitMehr.spitze, 2), h.eur(mitMehr.kgWeitergabe, 2), `${h.eur(mitMehr.ausgleich, 2)} by ${mitMehr.ausgleichZahlt}`],
  [`A ${h.eur(2500)}, B ${h.eur(3100)}, aged 15, benefit to A`, h.eur(teen.barbedarf, 2), h.eur(teen.spitze, 2), h.eur(teen.kgWeitergabe, 2), `${h.eur(teen.ausgleich, 2)} by ${teen.ausgleichZahlt}`],
], 'Computed by our engine, Düsseldorf Table and NRW guidelines 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>The last line shows a reversal: B earns more and owes a peak of ${h.eur(teen.spitze, 2)}, but A has to pass on ${h.eur(teen.kgWeitergabe, 2)} of child benefit, so A ends up paying B a small difference.</p>
<h2>The rules behind it</h2>
<p>Need follows combined income without moving up a group (number 12 paragraph 3 of the ${h.src('olgLeitlinien', 'NRW guidelines')}), plus extra costs. Half the child benefit covers cash need (${h.src('bgb1612b', 'section 1612b BGB')}). Liability follows income above ${h.eur(h.P.leitlinien.sockel_volljaehrig)}. The care half of child benefit is split equally, the cash half by share (number 14 paragraph 2). The claim lies against the higher earner, as the ${h.src('bghWechsel2017', 'Federal Court of Justice held in XII ZB 565/15')}.</p>
<h2>Limits</h2>
<ul>
<li>It assumes genuinely equal shared care. Clearly unequal care means the ordinary model with reductions for ${h.a('erweiterter-umgang', 'extended contact')}.</li>
<li>One child under 18 only, with no ranking against other dependants.</li>
<li>Nursery fees and other extra need count only if you enter them as extra costs.</li>
<li>It does not apply the lowered base for tight incomes or fairness adjustments for very unequal incomes.</li>
</ul>
<p>Background and case law are on the ${h.a('wechselmodell-unterhalt', 'shared care child support')} page; table values come from the ${h.src('olgDtPdf', '2026 Düsseldorf Table')}. The result is a general shared care calculation, not legal advice.</p>`,
  },
});
