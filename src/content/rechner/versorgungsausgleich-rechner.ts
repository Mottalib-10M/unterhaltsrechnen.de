import { defineGuide } from '../../lib/guide-types';
import { versorgungsausgleich } from '../../lib/engine/vermoegen';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor, nie von Hand. */
/** Startwerte des Rechners. */
const start = versorgungsausgleich({ renteA: 420, renteB: 180, kapitalA: 24000, kapitalB: 0 });
/** Ähnliche Renten, kleine Betriebsrente: beides geringfügig. */
const nah = versorgungsausgleich({ renteA: 150, renteB: 120, kapitalA: 8000, kapitalB: 0 });
/** Zwei gleichartige Kapitalanrechte mit kleinem Unterschied. */
const kapital = versorgungsausgleich({ renteA: 260, renteB: 95, kapitalA: 30000, kapitalB: 26000 });
const V = P.versorgungsausgleich;

export default defineGuide({
  id: 'versorgungsausgleich-rechner',
  group: 'scheidung',
  order: 70,
  tool: 'va',
  related: ['versorgungsausgleich', 'zugewinnausgleich-rechner', 'scheidungskosten-rechner', 'verfahrenswert'],
  sources: ['versausglg1', 'versausglg18', 'svbezgrv2026'],
  de: {
    slug: 'versorgungsausgleich-rechner',
    nav: 'Versorgungsausgleich-Rechner',
    card: 'Ehezeitanteile eintragen, Ausgleichswerte und Bagatellgrenze 2026 für Rente und Kapital ablesen.',
    title: 'Versorgungsausgleich-Rechner 2026: Ausgleichswert prüfen',
    description: `Versorgungsausgleich-Rechner 2026: Ehezeitanteile von Rente und Betriebsrente eintragen, Ausgleichswerte und Bagatellgrenze von ${DE.eur(V.bezugsgroesse_monat * V.bagatelle_rente_anteil, 2)} sofort ablesen.`,
    h1: 'Versorgungsausgleich berechnen: Ausgleichswerte und Bagatellgrenze',
    intro: 'Sie tragen die Ehezeitanteile aus den Auskünften der Versorgungsträger ein, der Rechner halbiert sie und vergleicht.',
    resume: `Mit den Startwerten hat Ehegatte A in der Ehezeit ${DE.eur(420)} Monatsrente erworben, Ehegatte B ${DE.eur(180)}; dazu besitzt A eine Betriebsrente mit einem Kapitalwert von ${DE.eur(24000)}. Der Rechner halbiert jeden Ehezeitanteil, wie es § 1 VersAusglG verlangt: Die Ausgleichswerte der Renten betragen ${DE.eur(start.ausgleichRenteA, 2)} und ${DE.eur(start.ausgleichRenteB, 2)}, per Saldo gehen ${DE.eur(start.differenzRente, 2)} Monatsrente an B. Aus der Betriebsrente stehen B ${DE.eur(start.ausgleichKapitalA)} Kapitalwert zu. Danach prüft der Rechner die Geringfügigkeit nach § 18 VersAusglG mit der Bezugsgröße 2026 von ${DE.eur(V.bezugsgroesse_monat)}: Eine Differenz bis ${DE.eur(start.grenzeRente, 2)} Monatsrente oder bis ${DE.eur(start.grenzeKapital)} Kapitalwert soll das Familiengericht nicht ausgleichen. Im Startbeispiel liegen beide Werte darüber, es wird also geteilt. Bei ähnlich hohen Renten von ${DE.eur(150)} und ${DE.eur(120)} und einer kleinen Betriebsrente von ${DE.eur(8000)} wären dagegen beide Ausgleichswerte geringfügig. Verbindlich sind am Ende die Werte, die die Versorgungsträger dem Gericht melden.`,
    faqs: [
      { q: 'Woher bekomme ich den Ehezeitanteil für den Versorgungsausgleich-Rechner?', a: 'Im Scheidungsverfahren fordert das Familiengericht von jedem Versorgungsträger eine Auskunft an, die den Ehezeitanteil und einen Vorschlag für den Ausgleichswert enthält (§ 5 VersAusglG). Vorher hilft die Renteninformation der Deutschen Rentenversicherung: Die in den Ehejahren erworbene Rente lässt sich aus dem Versicherungsverlauf grob abschätzen. Für Betriebsrenten nennt der Arbeitgeber oder die Pensionskasse den Kapitalwert.' },
      { q: 'Warum zeigt der Versorgungsausgleich-Rechner nur eine Differenz?', a: 'Weil gleichartige Anrechte beim selben Träger gegeneinander verrechnet werden (§ 10 Abs. 2 VersAusglG). Haben beide Ehegatten eine gesetzliche Rente, gibt jeder rechtlich die Hälfte ab, übertragen wird aber nur der Unterschied. Der Rechner behandelt die beiden Rentenfelder und die beiden Kapitalfelder jeweils als gleichartig; bei verschiedenen Trägern wird in Wirklichkeit jedes Anrecht einzeln geteilt.' },
      { q: 'Ist das Ergebnis geringfügig, entfällt der Versorgungsausgleich dann sicher?', a: `Nicht sicher. § 18 VersAusglG sagt, das Gericht soll geringe Werte nicht ausgleichen, und lässt damit Raum für Ausnahmen. Mehrere kleine Anrechte, die zusammen über ${DE.eur(start.grenzeKapital)} Kapitalwert liegen, oder sehr einseitige Verhältnisse führen in der Praxis häufig doch zur Teilung. Der Rechner zeigt, ob die Grenze rechnerisch eingehalten ist, nicht wie Ihr Gericht entscheidet.` },
      { q: 'Kann ich Anrechte aus dem Ausland in den Versorgungsausgleich-Rechner eintragen?', a: 'Rechnen können Sie damit, das Ergebnis passt aber nicht zur Scheidung selbst: Anrechte bei ausländischen Trägern werden bei der Scheidung nicht geteilt (§ 19 VersAusglG), sondern später über Ausgleichsansprüche zwischen den geschiedenen Ehegatten. Tragen Sie deshalb für die Scheidung nur Anrechte bei deutschen Trägern ein und betrachten Sie ausländische gesondert.' },
    ],
    body: (h) => `<h2>Die vier Eingabefelder</h2>
<ul>
<li><strong>Ehezeitanteil Rente A</strong>: die monatliche Rente, die A in der Ehezeit erworben hat, mit Cent. Meist ist das die gesetzliche Rente; auch Beamtenpensionen und Versorgungswerke werden als Rentenbetrag angegeben.</li>
<li><strong>Ehezeitanteil Rente B</strong>: dasselbe für den anderen Ehegatten.</li>
<li><strong>Kapitalwert A (Betriebsrente)</strong>: der Ehezeitanteil einer Betriebsrente oder eines privaten Vertrags, den der Träger als Kapitalwert ausweist, in vollen Euro.</li>
<li><strong>Kapitalwert B</strong>: dasselbe für B, häufig 0 €.</li>
</ul>
<p>Die Ehezeit reicht vom ersten Tag des Hochzeitsmonats bis zum letzten Tag vor dem Monat, in dem der Scheidungsantrag zugestellt wird. Nur Anrechte aus dieser Zeit gehören in die Felder, nicht die gesamte spätere Rente.</p>
<h2>Was der Rechner ausgibt</h2>
<p>Oben steht die Differenz der Rentenausgleichswerte und ob sie geringfügig ist oder geteilt wird, zugunsten des Ehegatten mit weniger Anrechten. Darunter folgen die vier Ausgleichswerte, also jeweils die Hälfte Ihrer Eingaben (${h.src('versausglg1', '§ 1 VersAusglG')}), und die Bagatellgrenze für Kapitalwerte. Der Rechenweg nennt die Grenzen: ${h.pct(h.P.versorgungsausgleich.bagatelle_rente_anteil, 0)} der ${h.src('svbezgrv2026', 'Bezugsgröße 2026')} für Renten, also ${h.eur(start.grenzeRente, 2)}, und ${h.pct(h.P.versorgungsausgleich.bagatelle_kapital_anteil, 0)} für Kapitalwerte, also ${h.eur(start.grenzeKapital)} (${h.src('versausglg18', '§ 18 VersAusglG')}).</p>
<h2>Drei Konstellationen</h2>
${h.table(['Eingaben', 'Differenz Rente', 'Differenz Kapital', 'Bewertung'], [
  [`${h.eur(420)} / ${h.eur(180)}, Kapital ${h.eur(24000)} / ${h.eur(0)}`, h.eur(start.differenzRente, 2), h.eur(start.differenzKapital), `Rente ${start.geringRente ? 'gering' : 'geteilt'}, Kapital ${start.geringKapital ? 'gering' : 'geteilt'}`],
  [`${h.eur(150)} / ${h.eur(120)}, Kapital ${h.eur(8000)} / ${h.eur(0)}`, h.eur(nah.differenzRente, 2), h.eur(nah.differenzKapital), `Rente ${nah.geringRente ? 'gering' : 'geteilt'}, Kapital ${nah.geringKapital ? 'gering' : 'geteilt'}`],
  [`${h.eur(260)} / ${h.eur(95)}, Kapital ${h.eur(30000)} / ${h.eur(26000)}`, h.eur(kapital.differenzRente, 2), h.eur(kapital.differenzKapital), `Rente ${kapital.geringRente ? 'gering' : 'geteilt'}, Kapital ${kapital.geringKapital ? 'gering' : 'geteilt'}`],
], 'Ergebnisse des Rechners, Ehezeitanteile A / B')}
<p>Die dritte Zeile zeigt den Unterschied zwischen Höhe und Differenz: Beide Betriebsrenten sind beträchtlich, ihre Ausgleichswerte liegen aber nur ${h.eur(kapital.differenzKapital)} auseinander. Sind sie gleichartig, soll das Gericht sie nicht teilen, die gesetzlichen Renten dagegen schon.</p>
<h2>Grenzen des Rechners</h2>
<p>Er rechnet keine Entgeltpunkte um und ermittelt keinen Ehezeitanteil selbst. Er kennt nur ein Rentenanrecht und ein Kapitalanrecht je Ehegatten und unterstellt, dass sie jeweils gleichartig sind. Kurze Ehen, Vereinbarungen, Härtefälle und ausländische Anrechte bewertet er nicht. Was der Versorgungsausgleich zum Verfahrenswert beiträgt, zeigt der ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')}.</p>
<p>Der Rechner gibt eine allgemeine Orientierung zum Versorgungsausgleich und ist keine Rechtsberatung. Die Regeln im Zusammenhang erklärt der Ratgeber zum ${h.a('versorgungsausgleich', 'Versorgungsausgleich')}.</p>`,
  },
  en: {
    slug: 'pension-splitting-calculator',
    nav: 'Pension splitting calculator',
    card: 'Enter the marriage-period pension shares and see the equalisation values and 2026 de minimis limits.',
    title: 'Versorgungsausgleich Calculator 2026: Pension Splitting',
    description: `Pension splitting calculator for German divorces 2026: enter marriage-period pensions and company pension values, see the split and the ${EN.eur(V.bezugsgroesse_monat * V.bagatelle_rente_anteil, 2)} de minimis test.`,
    h1: 'Calculate German pension splitting and the de minimis test',
    intro: 'Enter the marriage-period shares from your pension providers’ statements; the tool halves them and compares the results.',
    resume: `With the default figures, spouse A built up a monthly pension of ${EN.eur(420)} during the marriage and spouse B ${EN.eur(180)}; A also has a company pension with a capital value of ${EN.eur(24000)}. The calculator halves each marriage-period share, as section 1 of the German Pension Equalisation Act (VersAusglG) requires. The pension equalisation values are ${EN.eur(start.ausgleichRenteA, 2)} and ${EN.eur(start.ausgleichRenteB, 2)}, so on balance ${EN.eur(start.differenzRente, 2)} of monthly pension goes to B, plus ${EN.eur(start.ausgleichKapitalA)} of capital value from the company pension. It then applies the de minimis test of section 18 VersAusglG with the 2026 monthly reference value (Bezugsgröße) of ${EN.eur(V.bezugsgroesse_monat)}: the family court should not split a difference up to ${EN.eur(start.grenzeRente, 2)} of monthly pension or ${EN.eur(start.grenzeKapital)} of capital value. In the default case both figures are above the limit, so both are split. With similar pensions of ${EN.eur(150)} and ${EN.eur(120)} and a small company pension worth ${EN.eur(8000)}, both would be minor. The binding numbers are those the providers report to the court.`,
    faqs: [
      { q: 'Where do I find the marriage-period share for the pension splitting calculator?', a: 'During the divorce the family court asks every pension provider for a statement showing the marriage-period share and a proposed equalisation value (section 5 VersAusglG). Before that, your annual statement from the Deutsche Rentenversicherung and your insurance record give a rough idea of what you earned in the marriage years. Employers or pension funds state the capital value of company pensions.' },
      { q: 'Why does the pension splitting calculator show only a difference?', a: 'Because rights of the same kind with the same provider are netted (section 10(2) VersAusglG). If both spouses have German statutory pensions, each legally gives up half, but only the difference is transferred. The calculator treats the two pension fields and the two capital fields as matching pairs; with different providers each right is in reality split on its own.' },
      { q: 'Can I enter my pension from my home country in the calculator?', a: 'You can do the arithmetic, but the result does not reflect the divorce itself. Rights held with foreign providers are not split at the German divorce (section 19 VersAusglG); they are settled later through claims between the former spouses. For the divorce estimate, enter only rights with German providers and look at foreign ones separately.' },
      { q: 'Does a minor result mean my pension will definitely not be split?', a: `No. Section 18 VersAusglG says the court should not split minor values, which leaves room for exceptions. Several small rights adding up to more than ${EN.eur(start.grenzeKapital)} of capital value, or a very lopsided situation, often lead to splitting anyway. The tool tells you whether the limit is met on paper, not what your judge will decide.` },
    ],
    body: (h) => `<h2>The four input fields</h2>
<ul>
<li><strong>Marriage-period pension A</strong> (Ehezeitanteil): the monthly pension A earned during the marriage, in euros and cents. Usually the German statutory pension; civil-service and professional schemes are also stated as a monthly amount.</li>
<li><strong>Marriage-period pension B</strong>: the same for the other spouse.</li>
<li><strong>Capital value A (company pension)</strong>: the marriage-period share of a company or private pension that the provider expresses as a capital value, in whole euros.</li>
<li><strong>Capital value B</strong>: the same for B, often 0 €.</li>
</ul>
<p>The marriage period runs from the first day of the month of the wedding to the last day of the month before the divorce petition is served. Enter only what was earned in that window, not your whole projected pension.</p>
<h2>What the result shows</h2>
<p>The headline gives the difference between the two pension equalisation values and says whether it is minor or will be split in favour of the spouse with less. Below are the four equalisation values, each half of your input (${h.src('versausglg1', 'section 1 VersAusglG')}), and the capital limit. The calculation note states the thresholds: ${h.pct(h.P.versorgungsausgleich.bagatelle_rente_anteil, 0)} of the ${h.src('svbezgrv2026', '2026 reference value')} for pensions, that is ${h.eur(start.grenzeRente, 2)}, and ${h.pct(h.P.versorgungsausgleich.bagatelle_kapital_anteil, 0)} for capital values, that is ${h.eur(start.grenzeKapital)} (${h.src('versausglg18', 'section 18 VersAusglG')}).</p>
<h2>Three couples run through the tool</h2>
${h.table(['Inputs', 'Pension difference', 'Capital difference', 'Assessment'], [
  [`${h.eur(420)} / ${h.eur(180)}, capital ${h.eur(24000)} / ${h.eur(0)}`, h.eur(start.differenzRente, 2), h.eur(start.differenzKapital), `pension ${start.geringRente ? 'minor' : 'split'}, capital ${start.geringKapital ? 'minor' : 'split'}`],
  [`${h.eur(150)} / ${h.eur(120)}, capital ${h.eur(8000)} / ${h.eur(0)}`, h.eur(nah.differenzRente, 2), h.eur(nah.differenzKapital), `pension ${nah.geringRente ? 'minor' : 'split'}, capital ${nah.geringKapital ? 'minor' : 'split'}`],
  [`${h.eur(260)} / ${h.eur(95)}, capital ${h.eur(30000)} / ${h.eur(26000)}`, h.eur(kapital.differenzRente, 2), h.eur(kapital.differenzKapital), `pension ${kapital.geringRente ? 'minor' : 'split'}, capital ${kapital.geringKapital ? 'minor' : 'split'}`],
], 'Calculator results, marriage-period shares A / B')}
<p>In the third row both company pensions are sizeable, yet their equalisation values are only ${h.eur(kapital.differenzKapital)} apart. If they are of the same kind, the court should leave them alone while still splitting the statutory pensions.</p>
<h2>Limits of the tool</h2>
<p>It does not convert German pension points (Entgeltpunkte) or work out a marriage-period share for you. It handles one pension and one capital right per spouse and assumes each pair is of the same kind. It ignores short marriages, opt-out agreements, hardship and foreign pensions. To see what pension splitting adds to the value of the proceedings, use the ${h.a('scheidungskosten-rechner', 'divorce cost calculator')}.</p>
<p>The calculator gives general orientation on pension splitting and is not legal advice. The rules in context are explained in the guide to ${h.a('versorgungsausgleich', 'pension splitting')}.</p>`,
  },
});
