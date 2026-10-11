import { defineGuide } from '../../lib/guide-types';
import { scheidungskosten } from '../../lib/engine/kosten';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Paar mit 3.500 € und 1.500 € netto; Wirkung der Anrechte, eines Kinderabzugs und des Sorgerechts. */
const vw = (anrechte: number, extra: { abzugMonat?: number; kindschaftssachen?: number; vermoegenszuschlag?: number } = {}) =>
  scheidungskosten({ netto1: 3500, netto2: 1500, anrechte, anwaelte: 1, ...extra });
const ohne = vw(0);
const vier = vw(4);
const anrReihe = [0, 1, 2, 3, 4, 6].map((n) => [n, vw(n)] as const);
/** Angenommener Kinderabzug von 250 € im Monat: Gerichtspraxis, frei gewählt. */
const kinderAbzug = vw(4, { abzugMonat: 250 });
const mitSorge = vw(4, { kindschaftssachen: 1 });
/** Sehr kleine Einkommen: der Mindestwert greift. */
const klein = scheidungskosten({ netto1: 600, netto2: 350, anrechte: 2, anwaelte: 1 });
const F = P.famgkg;

export default defineGuide({
  id: 'verfahrenswert',
  group: 'scheidung',
  order: 12,
  mini: 'verfahrenswert',
  related: ['scheidungskosten', 'scheidungskosten-rechner', 'gerichtskosten-scheidung', 'anwaltskosten-scheidung', 'versorgungsausgleich'],
  sources: ['famgkg43', 'famgkg44', 'famgkg50', 'famgkg28'],
  de: {
    slug: 'verfahrenswert-scheidung',
    nav: 'Verfahrenswert',
    card: 'Wie das Familiengericht den Wert der Scheidung bildet: drei Monatsnetto, Anrechte, Kinder, Vermögen.',
    title: 'Verfahrenswert Scheidung 2026: so rechnet das Gericht',
    description: `Verfahrenswert der Scheidung 2026: ${DE.num(F.ehe_monate_netto)} Monatsnetto beider Ehegatten, mindestens ${DE.eur(F.ehe_mindestwert)}, ${DE.pct(F.va_prozent_je_anrecht)} je Rentenanrecht, Zuschläge für Sorgerecht und Vermögen im Verbund.`,
    h1: 'Verfahrenswert der Scheidung 2026',
    intro: 'Eine einzige Zahl entscheidet über Gerichts- und Anwaltskosten. So setzt das Familiengericht sie zusammen.',
    resume: `Der Verfahrenswert einer Scheidung ist 2026 das in ${DE.num(F.ehe_monate_netto)} Monaten erzielte Nettoeinkommen beider Ehegatten (§ 43 Abs. 2 FamGKG), mindestens ${DE.eur(F.ehe_mindestwert)} und höchstens ${DE.eur(F.ehe_hoechstwert)}. Verdient ein Ehegatte ${DE.eur(3500)} und der andere ${DE.eur(1500)} netto, beträgt der Wert der Ehesache ${DE.eur(ohne.eheWert)}. Für den Versorgungsausgleich kommen nach § 50 FamGKG ${DE.pct(F.va_prozent_je_anrecht)} dieses Dreimonatsnettos für jedes auszugleichende Anrecht hinzu, insgesamt mindestens ${DE.eur(F.va_mindestwert)}: Bei vier Anrechten sind das ${DE.eur(vier.vaWert)}, der Gesamtwert steigt auf ${DE.eur(vier.gesamtWert)}. Ein Verfahren über Sorge- oder Umgangsrecht im Verbund erhöht den Wert um ${DE.pct(F.kindschaft_zuschlag)} des Ehewerts, höchstens ${DE.eur(F.kindschaft_zuschlag_max)} (§ 44 Abs. 2 FamGKG). Viele Gerichte ziehen außerdem für unterhaltsberechtigte Kinder einen Betrag vom Einkommen ab oder schlagen für Vermögen etwas auf; Höhe und Methode sind Gerichtspraxis und unterscheiden sich von Bezirk zu Bezirk. Aus dem Gesamtwert lesen Gericht und Anwalt ihre Gebühren in den Tabellen von FamGKG und RVG ab.`,
    faqs: [
      { q: 'Welches Nettoeinkommen zählt für den Verfahrenswert der Scheidung?', a: 'Das Einkommen beider Ehegatten nach Steuern und Sozialabgaben in den drei Monaten vor Einreichung des Scheidungsantrags. Viele Gerichte rechnen Sonderzahlungen anteilig mit ein, Sozialleistungen wie Bürgergeld dagegen unterschiedlich; hier gibt es keine einheitliche Linie. Das Gericht stützt sich auf die Angaben im Antrag und fragt bei Lücken nach. Falsche oder fehlende Angaben können eine spätere Korrektur des Werts auslösen.' },
      { q: 'Wie wirkt ein Kind auf den Verfahrenswert der Scheidung?', a: `Gesetzlich gar nicht, solange es nur um die Scheidung geht. In der Praxis ziehen viele Familiengerichte für jedes unterhaltsberechtigte Kind einen Pauschalbetrag vom Monatsnetto ab, bevor sie mit ${DE.num(F.ehe_monate_netto)} multiplizieren. Bei einem angenommenen Abzug von ${DE.eur(250)} im Monat sinkt der Ehewert im Beispiel von ${DE.eur(vier.eheWert)} auf ${DE.eur(kinderAbzug.eheWert)}. Wird zusätzlich über Sorge oder Umgang gestritten, steigt der Wert wieder um den Zuschlag nach § 44 FamGKG.` },
      { q: 'Erhöht ein Haus oder Erspartes den Verfahrenswert der Scheidung?', a: 'Das kann es. § 43 Abs. 1 FamGKG verlangt, alle Umstände zu berücksichtigen, ausdrücklich auch die Vermögensverhältnisse. Viele Gerichte setzen einen Prozentsatz des Nettovermögens nach Abzug von Schulden und Freibeträgen an; Prozentsatz und Freibeträge unterscheiden sich je nach Oberlandesgerichtsbezirk. Ein selbst bewohntes Haus mit hoher Restschuld fällt deshalb oft wenig ins Gewicht. Im Scheidungskosten-Rechner geben Sie dafür einen eigenen Zuschlag ein.' },
      { q: 'Was zählt als Anrecht im Versorgungsausgleich?', a: `Jede Versorgung, die in der Ehezeit aufgebaut wurde und geteilt wird: das Konto bei der gesetzlichen Rentenversicherung, eine Beamtenversorgung, eine Betriebsrente, ein Riester-, Rürup- oder anderer Rentenvertrag. Jedes Anrecht jedes Ehegatten zählt einzeln mit ${DE.pct(F.va_prozent_je_anrecht)} des Dreimonatsnettos. Wird ein Anrecht wegen Geringfügigkeit nicht ausgeglichen, rechnen Gerichte es unterschiedlich; ist der Versorgungsausgleich ganz ausgeschlossen, entfällt der Wert.` },
      { q: 'Kann man gegen den festgesetzten Verfahrenswert vorgehen?', a: 'Ja. Das Gericht setzt den Wert zu Beginn vorläufig und am Ende des Verfahrens endgültig durch Beschluss fest (§ 55 FamGKG). Gegen die endgültige Festsetzung ist die Beschwerde nach § 59 FamGKG möglich, wenn die gesetzliche Mindestbeschwer überschritten ist oder das Gericht sie wegen grundsätzlicher Bedeutung zulässt, und nur innerhalb der Fristen. Auch die Anwälte können die Festsetzung beantragen und anfechten.' },
    ],
    body: (h) => `<h2>Wozu der Verfahrenswert dient</h2>
<p>Gerichtsgebühren und gesetzliche Anwaltsgebühren hängen in Familiensachen nicht vom Aufwand ab, sondern von einem Wert. Bei der Scheidung heißt er Verfahrenswert. Er wird in der Tabelle zu ${h.src('famgkg28', '§ 28 FamGKG')} für das Gericht und in der Tabelle zu § 13 RVG für den Anwalt nachgeschlagen. Wer den Wert kennt, kennt damit beide Rechnungen.</p>
<p>Der Wert setzt sich aus Bausteinen zusammen: der Ehesache selbst, dem Versorgungsausgleich, gegebenenfalls Kindschaftssachen und weiteren Folgesachen. Im Scheidungsverbund werden alle Werte addiert (${h.src('famgkg44', '§ 44 Abs. 1 FamGKG')}), und auf die Summe wird eine einzige Gebühr berechnet.</p>
<h2>Baustein eins: die Ehesache</h2>
<p>Nach ${h.src('famgkg43', '§ 43 FamGKG')} bestimmt das Gericht den Wert nach Ermessen, unter Berücksichtigung aller Umstände, besonders von Umfang und Bedeutung der Sache und von Vermögen und Einkommen der Ehegatten. Für das Einkommen gibt Absatz 2 eine feste Größe vor: das in drei Monaten erzielte Nettoeinkommen beider Ehegatten. Der Wert darf ${h.eur(h.P.famgkg.ehe_mindestwert)} nicht unter- und ${h.eur(h.P.famgkg.ehe_hoechstwert)} nicht überschreiten.</p>
<ul>
<li>Bei ${h.eur(3500)} und ${h.eur(1500)} netto im Monat: ${h.num(h.P.famgkg.ehe_monate_netto)} × ${h.eur(5000)} = ${h.eur(ohne.eheWert)}.</li>
<li>Bei ${h.eur(600)} und ${h.eur(350)} netto ergäbe die Rechnung weniger als den Mindestwert, das Gericht setzt ${h.eur(klein.eheWert)} an.</li>
<li>Den Höchstwert erreichen nur sehr hohe Einkommen oder Vermögen.</li>
</ul>
<h2>Baustein zwei: der Versorgungsausgleich</h2>
<p>Bei jeder Scheidung teilt das Gericht die in der Ehe erworbenen Rentenanrechte, ohne dass jemand es beantragen muss. ${h.src('famgkg50', '§ 50 Abs. 1 FamGKG')} setzt dafür für jedes Anrecht ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} des Dreimonatsnettos an, insgesamt mindestens ${h.eur(h.P.famgkg.va_mindestwert)}. Gezählt wird jedes Anrecht beider Ehegatten.</p>
${h.table(['Anrechte', 'Versorgungsausgleich', 'Gesamtwert'], anrReihe.map(([n, r]) => [String(n), h.eur(r.vaWert), h.eur(r.gesamtWert)]), 'Netto 3.500 € und 1.500 €, ohne weitere Folgesachen; vom Rechner ermittelt', ['l', 'r', 'r'])}
<p>Vier Anrechte sind keine Seltenheit: gesetzliche Rente und Betriebsrente bei beiden Ehegatten. Schon dann legt der Versorgungsausgleich ${h.pct(vier.vaWert / vier.eheWert, 0)} auf den Wert der Ehesache drauf. Hält das Gericht den so errechneten Wert im Einzelfall für unbillig, darf es nach § 50 Abs. 3 FamGKG einen höheren oder niedrigeren Wert festsetzen.</p>
<h2>Baustein drei: Kinder und andere Folgesachen</h2>
<p>Wird im Verbund auch über elterliche Sorge, Umgang oder Herausgabe eines Kindes entschieden, erhöht sich der Wert für jede dieser Kindschaftssachen um ${h.pct(h.P.famgkg.kindschaft_zuschlag, 0)} des Ehewerts, höchstens um ${h.eur(h.P.famgkg.kindschaft_zuschlag_max)}. Eine Kindschaftssache bleibt ein Gegenstand, auch wenn sie mehrere Kinder betrifft. Im Beispiel mit vier Anrechten steigt der Gesamtwert durch ein Sorgerechtsverfahren von ${h.eur(vier.gesamtWert)} auf ${h.eur(mitSorge.gesamtWert)}.</p>
<p>Unterhalt, Zugewinnausgleich, Ehewohnung und Haushaltsgegenstände bringen ihre eigenen Werte nach eigenen Vorschriften mit, beim Unterhalt etwa den Jahresbetrag der verlangten Zahlungen. Sie werden zum Scheidungswert addiert, wenn sie im Verbund laufen.</p>
<h2>Was nicht im Gesetz steht: Abzüge und Zuschläge der Gerichte</h2>
<p>Zwei Korrekturen sind verbreitet, aber nicht einheitlich geregelt. Erstens ziehen viele Gerichte für jedes unterhaltsberechtigte Kind einen festen Betrag vom Monatsnetto ab. Mit einem angenommenen Abzug von ${h.eur(250)} im Monat sinkt der Ehewert im Beispiel von ${h.eur(vier.eheWert)} auf ${h.eur(kinderAbzug.eheWert)}. Zweitens rechnen viele Gerichte einen Teil des Vermögens hinzu, nach Abzug von Schulden und persönlichen Freibeträgen. Prozentsatz und Freibeträge unterscheiden sich zwischen den Oberlandesgerichtsbezirken, manche Gerichte verzichten bei geringem Vermögen ganz darauf.</p>
<p>Für die Ehegatten heißt das: Zwei Paare mit gleichem Einkommen können in verschiedenen Städten unterschiedliche Werte und damit unterschiedliche Kosten haben. Wer wissen will, wie das eigene Familiengericht verfährt, findet Hinweise oft in veröffentlichten Beschlüssen des zuständigen Oberlandesgerichts. Wichtig ist auch der Zeitpunkt: Maßgeblich sind die Verhältnisse bei Einreichung des Antrags, eine spätere Gehaltserhöhung ändert den Wert nicht mehr.</p>
<p>Der ${h.a('scheidungskosten-rechner', 'Scheidungskosten-Rechner')} hat für beides eigene Felder, die ausdrücklich als Ihre Annahme gekennzeichnet sind.</p>
<h2>Wann der Wert feststeht</h2>
<p>Mit dem Scheidungsantrag setzt das Gericht einen vorläufigen Wert fest, nach dem der Gerichtskostenvorschuss berechnet wird. Am Ende des Verfahrens folgt der endgültige Beschluss (§ 55 FamGKG), der auch für die Anwaltsrechnung maßgeblich ist. Weicht er ab, wird nachgefordert oder erstattet. Was die einzelnen Werte in Euro bedeuten, zeigen die Seiten zu den ${h.a('gerichtskosten-scheidung', 'Gerichtskosten')} und den ${h.a('anwaltskosten-scheidung', 'Anwaltskosten')}; den Überblick gibt die Seite ${h.a('scheidungskosten', 'Scheidungskosten')}.</p>
<p>Diese Darstellung des Verfahrenswerts ist eine allgemeine Information und keine Rechtsberatung; den Wert im konkreten Verfahren bestimmt das Familiengericht.</p>`,
  },
  en: {
    slug: 'value-of-divorce-proceedings',
    nav: 'Value of proceedings',
    card: 'How the family court sets the value of a divorce: three months’ net pay, pensions, children, assets.',
    title: 'Value of Divorce Proceedings Germany 2026: Verfahrenswert',
    description: `Value of divorce proceedings in Germany 2026: ${EN.num(F.ehe_monate_netto)} months’ net income of both spouses, at least ${EN.eur(F.ehe_mindestwert)}, ${EN.pct(F.va_prozent_je_anrecht)} per pension right, and extra for custody and assets.`,
    h1: 'The value of divorce proceedings in Germany, 2026',
    intro: 'One figure drives both the court fees and the lawyers’ fees. Here is how a German family court arrives at it.',
    resume: `In 2026 the value of German divorce proceedings (Verfahrenswert) is the net income both spouses earn in ${EN.num(F.ehe_monate_netto)} months (section 43(2) of the Family Court Fees Act, FamGKG), never less than ${EN.eur(F.ehe_mindestwert)} and never more than ${EN.eur(F.ehe_hoechstwert)}. If one spouse takes home ${EN.eur(3500)} and the other ${EN.eur(1500)} a month, the divorce itself is worth ${EN.eur(ohne.eheWert)}. Pension splitting (Versorgungsausgleich) adds ${EN.pct(F.va_prozent_je_anrecht)} of that three-month income for every entitlement divided, at least ${EN.eur(F.va_mindestwert)} overall (section 50 FamGKG): with four entitlements that is ${EN.eur(vier.vaWert)}, and the total rises to ${EN.eur(vier.gesamtWert)}. A custody or contact case decided in the same proceedings adds ${EN.pct(F.kindschaft_zuschlag)} of the divorce value, at most ${EN.eur(F.kindschaft_zuschlag_max)} (section 44(2) FamGKG). Many courts also deduct an amount for dependent children or add one for assets; the method and the amounts are court practice and differ between regions. Court and lawyer then read their fees off the FamGKG and RVG tables.`,
    faqs: [
      { q: 'Is foreign income included in the value of a German divorce?', a: 'The statute speaks of the net income the spouses earn in three months, without limiting it to German income. A salary paid abroad is therefore normally converted into euros and counted after the tax actually paid. How a court handles a spouse who lives abroad and gives no information varies; it may estimate. Documents in another language may need a translation, which is a separate cost.' },
      { q: 'Do children lower the value of the divorce?', a: `Not by statute. In practice many family courts deduct a flat amount per dependent child from monthly net income before multiplying by ${EN.num(F.ehe_monate_netto)}. Assuming ${EN.eur(250)} a month, the divorce value in our example falls from ${EN.eur(vier.eheWert)} to ${EN.eur(kinderAbzug.eheWert)}. A custody or contact dispute in the same proceedings pushes the value back up through the section 44 surcharge.` },
      { q: 'Does owning a flat or savings raise the value of the divorce?', a: 'It can. Section 43(1) FamGKG requires the court to weigh all circumstances, explicitly including the spouses’ assets. Many courts add a percentage of net wealth after debts and personal allowances, but the percentage and the allowances differ between higher regional court districts. A home with a large outstanding mortgage therefore often adds little. In the divorce cost calculator you can enter your own surcharge for this.' },
      { q: 'Which pensions count as entitlements for the divorce value?', a: `Every pension built up during the marriage that the court divides: the German state pension account, a civil-service pension, a company pension, a Riester, Rürup or other pension contract. Each entitlement of each spouse counts separately at ${EN.pct(F.va_prozent_je_anrecht)} of the three-month income. Small entitlements that are not split are treated differently by different courts; if pension splitting is excluded altogether, this part of the value disappears.` },
      { q: 'Can the value set by the court be challenged?', a: 'Yes. The court sets a provisional value when the application comes in and a final value by order at the end (section 55 FamGKG). The final value can be challenged by complaint (Beschwerde) under section 59 FamGKG if the statutory minimum amount in dispute is exceeded or the court admits it, and only within the deadlines. Lawyers may also apply for and challenge the setting of the value.' },
    ],
    body: (h) => `<h2>Why one number matters so much</h2>
<p>In German family cases, neither court fees nor statutory lawyer fees depend on hours worked. They depend on a value. In a divorce this is the value of the proceedings (Verfahrenswert). The court looks it up in the table under ${h.src('famgkg28', 'section 28 FamGKG')}, the lawyer in the table under section 13 of the Lawyers’ Fees Act (RVG). Know the value and you know both bills.</p>
<p>The value is assembled from blocks: the divorce itself, pension splitting, possibly children’s matters and other ancillary matters. In combined divorce proceedings (Scheidungsverbund) all values are added up (${h.src('famgkg44', 'section 44(1) FamGKG')}) and a single fee is charged on the total.</p>
<h2>Block one: the divorce</h2>
<p>Under ${h.src('famgkg43', 'section 43 FamGKG')} the court sets the value at its discretion, weighing all circumstances, in particular the scope and importance of the case and the spouses’ assets and income. For income, subsection 2 gives a fixed yardstick: the net income both spouses earn in three months. The result may not fall below ${h.eur(h.P.famgkg.ehe_mindestwert)} or exceed ${h.eur(h.P.famgkg.ehe_hoechstwert)}.</p>
<ul>
<li>On ${h.eur(3500)} and ${h.eur(1500)} a month: ${h.num(h.P.famgkg.ehe_monate_netto)} × ${h.eur(5000)} = ${h.eur(ohne.eheWert)}.</li>
<li>On ${h.eur(600)} and ${h.eur(350)} the arithmetic would fall short of the floor, so the court uses ${h.eur(klein.eheWert)}.</li>
<li>Only very high incomes or fortunes ever reach the ceiling.</li>
</ul>
<h2>Block two: pension splitting</h2>
<p>In every German divorce the court divides the pension rights both spouses built up during the marriage, without anyone having to ask. ${h.src('famgkg50', 'Section 50(1) FamGKG')} values this at ${h.pct(h.P.famgkg.va_prozent_je_anrecht, 0)} of the three-month income per entitlement, with an overall minimum of ${h.eur(h.P.famgkg.va_mindestwert)}.</p>
${h.table(['Entitlements', 'Pension splitting', 'Total value'], anrReihe.map(([n, r]) => [String(n), h.eur(r.vaWert), h.eur(r.gesamtWert)]), 'Net incomes €3,500 and €1,500, no other matters; computed by the calculator', ['l', 'r', 'r'])}
<p>Four entitlements are common: a state pension and a company pension for each spouse. At that point pension splitting already adds ${h.pct(vier.vaWert / vier.eheWert, 0)} on top of the divorce value. If the result seems unfair in a particular case, section 50(3) FamGKG lets the court set a higher or lower value.</p>
<p>For expats: pension rights with a foreign scheme are often not divided in the German divorce itself but left for a later settlement. How courts value them for fee purposes varies, so the table above counts only entitlements the court actually splits.</p>
<h2>Block three: children and other matters</h2>
<p>If parental custody, contact or the return of a child is decided in the same proceedings, each such children’s matter (Kindschaftssache) adds ${h.pct(h.P.famgkg.kindschaft_zuschlag, 0)} of the divorce value, capped at ${h.eur(h.P.famgkg.kindschaft_zuschlag_max)}. One matter stays one matter even if it concerns several children. With four entitlements, a custody case lifts the total in our example from ${h.eur(vier.gesamtWert)} to ${h.eur(mitSorge.gesamtWert)}.</p>
<p>Maintenance, the division of accrued gains, the marital home and household goods carry their own values under their own rules and are added on when they run in the same proceedings.</p>
<h2>Court practice: deductions and surcharges</h2>
<p>Two adjustments are widespread but not uniform. Many courts deduct a fixed monthly amount per dependent child; with an assumed ${h.eur(250)} the divorce value here drops from ${h.eur(vier.eheWert)} to ${h.eur(kinderAbzug.eheWert)}. Many also add part of the couple’s net wealth after debts and allowances, with percentages that differ between districts. The ${h.a('scheidungskosten-rechner', 'divorce cost calculator')} has fields for both, labelled as your assumption.</p>
<p>In practice two couples with identical pay can face different values, and so different bills, depending on the city where they divorce. Published decisions of the competent higher regional court (Oberlandesgericht) often reveal the local approach. Timing matters too: the circumstances when the application is filed are decisive, so a pay rise during the proceedings does not change the value.</p>
<h2>When the value becomes final</h2>
<p>When the application is filed, the court sets a provisional value for the advance on court fees. At the end it fixes the final value by order (section 55 FamGKG), which also binds the lawyers’ bills; any difference is charged or refunded. What the values mean in euros is shown under ${h.a('gerichtskosten-scheidung', 'court fees')} and ${h.a('anwaltskosten-scheidung', 'lawyer fees')}, with an overview on ${h.a('scheidungskosten', 'divorce costs')}.</p>
<p>This explanation of the value of proceedings is general information, not legal advice; in each case the family court (Familiengericht) decides the value.</p>`,
  },
});
