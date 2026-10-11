import { defineGuide } from '../../lib/guide-types';
import { kindesunterhalt, gruppeVon } from '../../lib/engine/dt';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Bereinigung nach Nummer 10 der Leitlinien NRW 2026, Werte aus params.leitlinien.
 * Annahmen der Beispiele (keine Rechtswerte): 220 Arbeitstage im Jahr wie im Mini-Rechner, Grenze der vollen
 * Kilometerpauschale nach dem 30. Entfernungskilometer (Nummer 10 Abs. 2 Leitlinien: Kürzung ab dem 31.).
 */
const LL = P.leitlinien;
const TAGE = 220;
const KM_VOLL = 30;
const fahrt = (km: number) => r2((Math.min(km, KM_VOLL) * LL.kfz_km + Math.max(0, km - KM_VOLL) * LL.kfz_km_ab_31) * 2 * (TAGE / 12));
const NETTO = 3100;
const faelle = [
  { de: 'Lohn laut Abrechnung', en: 'Net pay per payslip', ab: 0 },
  { de: '25 km mit dem Auto', en: '25 km by car', ab: fahrt(25) },
  { de: '45 km mit dem Auto', en: '45 km by car', ab: fahrt(45) },
  { de: '25 km und 300 € Kreditrate', en: '25 km plus €300 loan instalment', ab: fahrt(25) + 300 },
].map((f) => { const b = r2(NETTO - f.ab); const r = kindesunterhalt(b, [{ alter: 10 }]); return { ...f, b, g: r.gruppe + 1, z: r.summe }; });
const BRUTTO = 4600;
const avKind = r2(BRUTTO * LL.altersvorsorge_sekundaer_kind_ehegatte);
const avEltern = r2(BRUTTO * LL.altersvorsorge_sekundaer_eltern);
const fiktiv = 2000;

export default defineGuide({
  id: 'bereinigtes-netto',
  group: 'kind',
  order: 26,
  mini: 'bereinigung',
  related: ['kindesunterhalt', 'zahlbetragstabelle', 'selbstbehalt', 'unterhaltsrechner', 'ehegattenunterhalt', 'mindestunterhalt'],
  sources: ['olgLeitlinien', 'olgDtPdf', 'bgb1603'],
  de: {
    slug: 'bereinigtes-nettoeinkommen',
    nav: 'Bereinigtes Netto',
    card: 'Vom Gehaltszettel zur Einkommensgruppe: Fahrtkosten, Schulden, Altersvorsorge und Wohnvorteil nach den Leitlinien NRW.',
    title: 'Bereinigtes Nettoeinkommen 2026: was beim Unterhalt zählt',
    description: `Bereinigtes Nettoeinkommen 2026 nach den Leitlinien NRW: Fahrtkosten ${DE.eur(LL.kfz_km, 2)} je km, Schuldenraten, Altersvorsorge ${DE.pct(LL.altersvorsorge_sekundaer_kind_ehegatte)}, Wohnvorteil, mit Rechenbeispielen.`,
    h1: 'Bereinigtes Nettoeinkommen: vom Lohn zum Unterhaltseinkommen',
    intro: 'Die Düsseldorfer Tabelle fragt nicht nach dem Nettolohn, sondern nach dem bereinigten Netto. Der Unterschied entscheidet oft über eine ganze Einkommensgruppe.',
    resume: `Das bereinigte Nettoeinkommen ist das Einkommen, mit dem Familiengerichte Unterhalt berechnen. Nach den Leitlinien der Oberlandesgerichte in NRW 2026 beginnt man beim durchschnittlichen Jahresbrutto einschließlich Urlaubs- und Weihnachtsgeld, zieht Steuern und Sozialabgaben ab und teilt durch zwölf. Davon gehen notwendige berufsbedingte Kosten ab, die konkret nachzuweisen sind; eine Pauschale von ${DE.pct(LL.pauschale_berufsbedingt_fiktiv)} gibt es in der Regel nur bei fiktivem Einkommen. Für den Arbeitsweg mit dem Auto werden ${DE.eur(LL.kfz_km, 2)} je gefahrenem Kilometer angesetzt, für Mehrkilometer ab dem 31. Entfernungskilometer meist nur ${DE.eur(LL.kfz_km_ab_31, 2)}. Zusätzliche private Altersvorsorge ist beim Kindesunterhalt mit bis zu ${DE.pct(LL.altersvorsorge_sekundaer_kind_ehegatte)} des Bruttos abziehbar, aber nur, wenn der Mindestunterhalt gedeckt ist. Schulden zählen nach Abwägung; gegenüber minderjährigen Kindern sind sie regelmäßig nur voll abziehbar, wenn der Mindestunterhalt gesichert bleibt. Mietfreies Wohnen im Eigentum wird als Wohnvorteil hinzugerechnet. Ein Arbeitnehmer mit ${DE.eur(NETTO)} Netto und ${DE.num(25)} km Arbeitsweg kommt so auf etwa ${DE.eur(faelle[1].b)}, eine Einkommensgruppe tiefer.`,
    faqs: [
      { q: 'Werden Weihnachtsgeld und Urlaubsgeld beim bereinigten Netto mitgerechnet?', a: `Ja. Ausgangspunkt ist das durchschnittliche Jahreseinkommen einschließlich Urlaubs- und Weihnachtsgeld, Sachbezügen und Gewinnbeteiligungen (Nummer 1 der Leitlinien NRW). Diese Zahlungen werden auf zwölf Monate verteilt. Wer nur den Novemberlohn oder nur einen Monat ohne Sonderzahlung vorlegt, gibt deshalb ein falsches Bild; Gerichte verlangen meist die Abrechnungen eines ganzen Jahres.` },
      { q: 'Kann ich beim bereinigten Netto pauschal 5 Prozent Berufskosten abziehen?', a: `In den Leitlinien NRW grundsätzlich nicht. Die Pauschale von ${DE.pct(LL.pauschale_berufsbedingt_fiktiv)} des Nettoeinkommens wird in der Regel nur gewährt, wenn ein fiktives Einkommen zugerechnet wird. Bei tatsächlichem Lohn müssen Sie Ihre Kosten einzeln darlegen, etwa Fahrtkosten, Gewerkschaftsbeitrag oder Arbeitskleidung. Andere Oberlandesgerichte handhaben die Pauschale teilweise großzügiger.` },
      { q: 'Welche Autokosten sind beim bereinigten Netto abziehbar?', a: `Nur die Kilometerpauschale von ${DE.eur(LL.kfz_km, 2)} je gefahrenem Kilometer, ab dem 31. Entfernungskilometer in der Regel ${DE.eur(LL.kfz_km_ab_31, 2)}. Daneben sind Kreditraten, Reparaturen, Steuer und Versicherung des Autos regelmäßig nicht zusätzlich abziehbar. Ist der Weg mit Bus und Bahn zumutbar, zählen bei engen Verhältnissen meist nur deren Kosten.` },
      { q: 'Mindern Kreditraten das bereinigte Nettoeinkommen?', a: `Es kommt auf Art, Grund und Zeitpunkt der Schuld an (Nummer 10 Absatz 4 der Leitlinien). Gemeinsame Kredite aus der Ehe werden meist berücksichtigt, neue Konsumkredite nach der Trennung eher nicht. Gegenüber minderjährigen Kindern gilt ein strenger Maßstab: Voll abziehbar sind Raten regelmäßig nur, wenn der Mindestunterhalt gesichert bleibt.` },
      { q: 'Wird eine Steuererstattung zum bereinigten Netto hinzugerechnet?', a: `Ja, in der Regel in dem Jahr, in dem sie ausgezahlt wird (In-Prinzip, Nummer 1 Absatz 7 der Leitlinien). Eine Erstattung von ${DE.eur(1200)} erhöht das Monatseinkommen also um ${DE.eur(100)}. Steuervorteile müssen Sie außerdem wahrnehmen; ob dazu schon im laufenden Jahr ein Freibetrag eingetragen werden muss, hängt nach den Leitlinien vom Einzelfall ab.` },
      { q: 'Wie wirkt mietfreies Wohnen im eigenen Haus auf das bereinigte Netto?', a: `Es erhöht das Einkommen um den Wohnvorteil. Grundsätzlich zählt die erzielbare Miete; solange Aufgeben oder Vermieten nicht zumutbar ist, etwa im Trennungsjahr, nur die angemessene ersparte Miete. Zinsen und in der Regel Tilgung bis zur Höhe des Wohnwerts sowie nicht umlagefähige Kosten werden abgezogen. Beim Elternunterhalt zählt stets der angemessene Wert.` },
    ],
    body: (h) => `<h2>Vom Brutto zum Netto</h2>
<p>Die ${h.src('olgLeitlinien', 'Leitlinien der Oberlandesgerichte in NRW 2026')} beginnen beim Jahresbruttoeinkommen. Dazu gehören neben dem Grundgehalt Urlaubs- und Weihnachtsgeld, Prämien, Sachbezüge und Gewinnbeteiligungen. Einmalzahlungen wie eine Abfindung werden auf mehrere Jahre verteilt. Überstunden zählen in der Regel voll, wenn sie berufsüblich sind oder der Mindestunterhalt sonst nicht gedeckt wäre.</p>
<p>Ein Firmenwagen oder eine verbilligte Dienstwohnung wird als geldwerter Vorteil hinzugerechnet, soweit er eigene Ausgaben erspart; der steuerliche Wert dient als Anhaltspunkt. Kindergeld gehört dagegen nie zum Einkommen der Eltern. Von diesem Brutto gehen Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialabgaben ab, das Ergebnis wird durch zwölf geteilt. Steuererstattungen zählen im Jahr der Auszahlung.</p>
<h2>Was vom Netto abgezogen wird</h2>
<p>Erst jetzt beginnt die eigentliche Bereinigung nach Nummer 10 der Leitlinien. Die wichtigsten Posten:</p>
<ul>
<li>Berufsbedingte Aufwendungen, die sich klar von privaten Kosten abgrenzen lassen, sind konkret nachzuweisen. Eine Pauschale von ${h.pct(h.P.leitlinien.pauschale_berufsbedingt_fiktiv, 0)} des Nettos gibt es in der Regel nur bei fiktivem Einkommen.</li>
<li>Fahrtkosten: bei engen Verhältnissen meist nur Bus und Bahn; mit dem Auto ${h.eur(h.P.leitlinien.kfz_km, 2)} je gefahrenem Kilometer, ab dem 31. Entfernungskilometer in der Regel ${h.eur(h.P.leitlinien.kfz_km_ab_31, 2)}. Weitere Autokosten kommen nicht hinzu.</li>
<li>Zusätzliche Altersvorsorge über die gesetzliche Rente hinaus: beim Kindes- und Ehegattenunterhalt bis ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_kind_ehegatte, 0)}, beim Eltern- und Enkelunterhalt bis ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_eltern, 0)} des Bruttos, jeweils nur bei tatsächlicher Zahlung.</li>
<li>Kranken- und Pflegeversicherung des Kindes, wenn es nicht familienversichert ist.</li>
<li>Kinderbetreuungskosten, die durch die eigene Berufstätigkeit entstehen.</li>
<li>Schulden nach Abwägung, Unterhalt an vorrangig Berechtigte mit dem Zahlbetrag und erhebliche Umgangskosten.</li>
</ul>
<p>Vermögenswirksame Leistungen mindern das Einkommen dagegen nicht. Wer Steuervorteile nicht nutzt, muss sich so behandeln lassen, als hätte er sie genutzt.</p>
<h2>Ein Lohn, vier Ergebnisse</h2>
<p>Wie stark die Bereinigung wirkt, zeigt ein Arbeitnehmer mit ${h.eur(NETTO)} Nettolohn und einem zehnjährigen Kind. Für die Fahrtkosten nehmen wir wie der Mini-Rechner oben ${h.num(TAGE)} Arbeitstage im Jahr an:</p>
${h.table(['Fall', 'Abzug', 'Bereinigtes Netto', 'Gruppe', 'Zahlbetrag'], faelle.map((f) => [f.de, h.eur(f.ab, 2), h.eur(f.b, 2), String(f.g), h.eur(f.z, 2)]), 'Ein Kind von 10 Jahren, Zahlbetrag vom Motor nach Düsseldorfer Tabelle 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>Schon ${h.num(25)} Kilometer Arbeitsweg kosten nach den Leitlinien ${h.eur(fahrt(25), 2)} im Monat und senken das Einkommen unter die Grenze von ${h.eur(h.P.dt.gruppen_bis[gruppeVon(NETTO) - 1])}. Ob das Gericht die Fahrt mit dem Auto anerkennt, hängt davon ab, ob öffentliche Verkehrsmittel zumutbar sind.</p>
<h2>Altersvorsorge und Schulden</h2>
<p>Für die zusätzliche Altersvorsorge rechnen die Leitlinien mit dem Brutto. Bei ${h.eur(BRUTTO)} brutto sind das beim Kindesunterhalt höchstens ${h.eur(avKind)} im Monat, beim Elternunterhalt höchstens ${h.eur(avEltern)}. Gegenüber minderjährigen Kindern gilt das nur, wenn der Mindestunterhalt gedeckt ist; sonst geht das Kind vor.</p>
<p>Schulden werden nach Art, Grund und Zeitpunkt beurteilt. Kredite aus der Zeit des Zusammenlebens erkennen Gerichte beim Ehegattenunterhalt meist an. Gegenüber minderjährigen Kindern ist der Maßstab streng, weil § 1603 Abs. 2 BGB eine gesteigerte Pflicht begründet (${h.src('bgb1603', 'Leistungsfähigkeit')}): Unter Umständen ist sogar ein Insolvenzverfahren zumutbar, um wieder Unterhalt zahlen zu können. Ein weiteres Anwachsen der Schulden soll jedenfalls vermieden werden.</p>
<h2>Der Wohnvorteil</h2>
<p>Wer im eigenen Haus oder in der eigenen Wohnung lebt, spart Miete. Nach Nummer 5 der Leitlinien wird dieser Vorteil wie Einkommen behandelt. Angesetzt wird grundsätzlich die erzielbare Marktmiete; ist es nicht zumutbar, das Objekt zu vermieten oder zu verkaufen, nur die angemessene ersparte Miete. Davon gehen Zinsen, in der Regel Tilgung bis zur Höhe des Wohnwerts, notwendige Instandhaltung und nicht umlagefähige Nebenkosten ab. Beim Kindesunterhalt gilt im Rahmen der gesteigerten Pflicht ein strengerer Maßstab für Finanzierungslasten.</p>
<h2>Fiktives Einkommen</h2>
<p>Wer weniger verdient, als er könnte, wird nach Nummer 9 der Leitlinien so behandelt, als erzielte er das erreichbare Einkommen. Bei einem fiktiven Netto von ${h.eur(fiktiv)} zieht das Gericht in der Regel die Pauschale von ${h.pct(h.P.leitlinien.pauschale_berufsbedingt_fiktiv, 0)} ab, also ${h.eur(fiktiv * h.P.leitlinien.pauschale_berufsbedingt_fiktiv)}; gerechnet wird dann mit ${h.eur(fiktiv * (1 - h.P.leitlinien.pauschale_berufsbedingt_fiktiv))}. Mit diesem Wert geht es weiter in die ${h.src('olgDtPdf', 'Düsseldorfer Tabelle 2026')} und zum ${h.a('kindesunterhalt', 'Kindesunterhalt')}; was dem Zahlenden mindestens bleibt, steht unter ${h.a('selbstbehalt', 'Selbstbehalt')}.</p>
<p>Die Erläuterung zum bereinigten Nettoeinkommen folgt den Leitlinien NRW und ist allgemeine Information, keine Rechtsberatung; andere Oberlandesgerichte haben eigene Leitlinien, und welche Abzüge anerkannt werden, entscheidet im Streitfall das Familiengericht.</p>`,
  },
  en: {
    slug: 'adjusted-net-income',
    nav: 'Adjusted net income',
    card: 'From payslip to income group: commuting, debts, pension saving and housing benefit under the NRW court guidelines.',
    title: 'Adjusted Net Income for German Maintenance 2026: The Rules',
    description: `Adjusted net income for German maintenance in 2026 (NRW guidelines): car commuting at ${EN.eur(LL.kfz_km, 2)} per km, debts, ${EN.pct(LL.altersvorsorge_sekundaer_kind_ehegatte)} pension saving, housing benefit, with examples.`,
    h1: 'Adjusted net income: from salary to maintenance income',
    intro: 'The Düsseldorf Table does not ask for your take-home pay but for your adjusted net income. The difference often moves you a whole income group.',
    resume: `Adjusted net income (bereinigtes Nettoeinkommen) is the figure German family courts use to calculate maintenance. Under the 2026 guidelines of the NRW higher regional courts it starts from average annual gross pay including holiday pay and Christmas bonus, minus income tax and social contributions, divided by twelve. Necessary work-related costs come off next and must normally be shown item by item; a flat ${EN.pct(LL.pauschale_berufsbedingt_fiktiv)} allowance is generally given only where income is notional. Commuting by car counts at ${EN.eur(LL.kfz_km, 2)} per kilometre driven, usually reduced to ${EN.eur(LL.kfz_km_ab_31, 2)} for the extra distance beyond the 30th kilometre of the one-way trip. Extra private pension saving of up to ${EN.pct(LL.altersvorsorge_sekundaer_kind_ehegatte)} of gross pay is deductible against child support, but only once the statutory minimum is covered. Debts are weighed case by case and, towards minors, generally count in full only if the minimum stays secured. Living rent-free in one’s own home is added as a housing benefit. An employee on ${EN.eur(NETTO)} net with a ${EN.num(25)} km commute ends up at about ${EN.eur(faelle[1].b)}, one income group lower.`,
    faqs: [
      { q: 'Are bonuses and 13th-month pay included in adjusted net income?', a: `Yes. The starting point is average annual income including holiday pay, Christmas bonus, benefits in kind and profit shares (point 1 of the NRW guidelines), spread over twelve months. Showing only a month without bonus gives a false picture, so courts usually ask for twelve months of payslips. Expats should include allowances such as relocation or housing payments where they save private costs.` },
      { q: 'Can I deduct a flat 5 per cent for work expenses from my net income?', a: `Under the NRW guidelines generally not. The flat ${EN.pct(LL.pauschale_berufsbedingt_fiktiv)} allowance is normally granted only where the court assumes a notional income. With actual earnings you must list your costs, such as commuting, union fees or work clothing. Other higher regional courts are in part more generous with the flat rate.` },
      { q: 'Which car costs reduce adjusted net income in Germany?', a: `Only the mileage rate of ${EN.eur(LL.kfz_km, 2)} per kilometre driven, usually ${EN.eur(LL.kfz_km_ab_31, 2)} for the distance beyond the 30th kilometre one way. Loan instalments, repairs, vehicle tax and insurance are generally not deductible on top. Where public transport is reasonable and money is tight, courts often allow only the bus or train fare.` },
      { q: 'Do loan repayments lower my adjusted net income?', a: `It depends on the kind of debt, why it arose and when (point 10 of the guidelines). Joint loans from the marriage are usually taken into account, new consumer loans after separation less often. Towards minor children the standard is strict: repayments normally count in full only if the minimum child support stays covered.` },
      { q: 'My employer pays part of my salary abroad: does it count?', a: `Yes. All income counts wherever it is paid, including foreign salary parts, allowances and benefits in kind that save you private costs. Courts convert it into euros and deduct the tax and contributions you actually pay, in Germany or abroad. Be ready to document both payrolls and tax assessments, since the other side can demand full disclosure.` },
      { q: 'How does living in my own home change adjusted net income?', a: `The saved rent is added as a housing benefit (Wohnvorteil). In principle the achievable market rent counts; while selling or letting is not reasonable, for instance during the separation year, only an appropriate saved rent. Interest, usually repayments up to the housing value, and non-recoverable costs are deducted. In parental maintenance cases the appropriate value always applies.` },
    ],
    body: (h) => `<h2>From gross to net</h2>
<p>The ${h.src('olgLeitlinien', '2026 guidelines of the NRW higher regional courts')} start with annual gross income: basic salary plus holiday pay, Christmas bonus, premiums, benefits in kind and profit shares. One-off payments such as a severance package are spread over several years. Overtime usually counts in full where it is normal in the job or needed to cover the children’s minimum.</p>
<p>A company car or a cheap employer flat is added as a benefit in kind where it saves private spending; the taxable value serves as a guide. Child benefit never counts as parental income. From this gross figure come income tax, solidarity surcharge, church tax and social contributions; the result is divided by twelve. Tax refunds count in the year they are paid out.</p>
<h2>What is deducted from net pay</h2>
<p>Only now does the actual adjustment under point 10 of the guidelines begin. The main items:</p>
<ul>
<li>Work-related costs that are clearly separate from private spending, shown in detail. A flat ${h.pct(h.P.leitlinien.pauschale_berufsbedingt_fiktiv, 0)} of net income is normally allowed only for notional income.</li>
<li>Commuting: where money is tight, often only public transport; by car ${h.eur(h.P.leitlinien.kfz_km, 2)} per kilometre driven, usually ${h.eur(h.P.leitlinien.kfz_km_ab_31, 2)} beyond the 30th kilometre one way. No other car costs on top.</li>
<li>Extra pension saving beyond the statutory scheme: up to ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_kind_ehegatte, 0)} of gross pay against child and spousal support, up to ${h.pct(h.P.leitlinien.altersvorsorge_sekundaer_eltern, 0)} in parental and grandchild cases, and only if actually paid.</li>
<li>Health and care insurance for the child, if the child is not covered by statutory family insurance. Expat families with private insurance should note this.</li>
<li>Childcare costs caused by the parent’s own work.</li>
<li>Debts after weighing the interests, support paid to higher-ranking dependants, and substantial contact costs.</li>
</ul>
<p>Employer savings schemes do not reduce income. Anyone who fails to claim available tax advantages is treated as if they had.</p>
<h2>One salary, four results</h2>
<p>An employee with ${h.eur(NETTO)} take-home pay and a ten-year-old child shows how much the adjustment matters. For commuting we assume, like the mini calculator above, ${h.num(TAGE)} working days a year:</p>
${h.table(['Case', 'Deduction', 'Adjusted net', 'Group', 'Payable'], faelle.map((f) => [f.en, h.eur(f.ab, 2), h.eur(f.b, 2), String(f.g), h.eur(f.z, 2)]), 'One child aged 10, amount payable computed by the engine under the 2026 Düsseldorf Table', ['l', 'r', 'r', 'r', 'r'])}
<p>A ${h.num(25)} km commute alone costs ${h.eur(fahrt(25), 2)} a month under the guidelines and pushes income below the ${h.eur(h.P.dt.gruppen_bis[gruppeVon(NETTO) - 1])} line. Whether the court accepts the car depends on whether public transport would be reasonable.</p>
<h2>Pension saving and debts</h2>
<p>Extra pension saving is measured against gross pay. On ${h.eur(BRUTTO)} gross, that allows at most ${h.eur(avKind)} a month against child support and ${h.eur(avEltern)} against parental support. Towards minors it applies only once the minimum is covered; otherwise the child comes first.</p>
<p>Debts are judged by type, reason and timing. Loans taken out during the relationship are usually recognised for spousal maintenance. Towards minors the standard is strict, because section 1603(2) BGB imposes a heightened duty (${h.src('bgb1603', 'ability to pay')}): personal insolvency proceedings may even be expected so that support can be paid again. Debts should at least not keep growing.</p>
<h2>The housing benefit</h2>
<p>Living in one’s own house or flat saves rent, and point 5 of the guidelines treats that saving as income. In principle the achievable market rent applies; where letting or selling is not reasonable, only an appropriate saved rent. Interest, usually repayments up to the housing value, necessary maintenance and non-recoverable service charges are deducted. Towards minors a stricter view is taken of financing costs.</p>
<h2>Notional income</h2>
<p>A parent who earns less than he or she could is treated, under point 9, as earning the achievable amount. With a notional net income of ${h.eur(fiktiv)}, courts usually deduct the flat ${h.pct(h.P.leitlinien.pauschale_berufsbedingt_fiktiv, 0)}, that is ${h.eur(fiktiv * h.P.leitlinien.pauschale_berufsbedingt_fiktiv)}, and work with ${h.eur(fiktiv * (1 - h.P.leitlinien.pauschale_berufsbedingt_fiktiv))}. That figure then goes into the ${h.src('olgDtPdf', '2026 Düsseldorf Table')} and the ${h.a('kindesunterhalt', 'child support')} calculation; the amount the payer always keeps is under ${h.a('selbstbehalt', 'self-retention')}.</p>
<p>This explanation of adjusted net income follows the NRW guidelines and is general information, not legal advice; other higher regional courts publish their own guidelines, and the family court decides which deductions are accepted in a dispute.</p>`,
  },
});
