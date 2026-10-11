import { defineGuide } from '../../lib/guide-types';
import { pKonto } from '../../lib/engine/pfaendung';
import { P, DE, EN } from '../../lib/fmt';

/** Geschützte Guthaben aus dem Motor (§§ 899, 902 ZPO), nie von Hand. */
const Z = P.pfaendung;
const M = P.pkonto.uebertrag_monate;
const KG = P.kindergeld.monat;
const allein = pKonto(0, 0);
const paar = pKonto(1, 0);
const mutter = pKonto(2, 2);
const gross = pKonto(4, 3);
/** Übertrag: im Juli nur 1.240 € verbraucht. */
const verbraucht = 1240;
const rest = allein.summe - verbraucht;
/** Haushalte für die Übersicht: [Unterhaltspflichten, Kinder mit Kindergeld, Beschreibung de, Beschreibung en]. */
const FAELLE: Array<[number, number, string, string]> = [
  [0, 0, 'allein, keine Unterhaltspflicht', 'single, no dependants'],
  [1, 0, 'Ehegatte ohne Einkommen', 'spouse without income'],
  [1, 1, 'alleinerziehend, ein Kind', 'single parent, one child'],
  [2, 2, 'alleinerziehend, zwei Kinder', 'single parent, two children'],
  [3, 2, 'Ehegatte und zwei Kinder', 'spouse and two children'],
  [4, 3, 'Ehegatte und drei Kinder', 'spouse and three children'],
];

export default defineGuide({
  id: 'p-konto',
  group: 'pfaendung',
  order: 16,
  mini: 'pkonto',
  related: ['pfaendungsfreigrenze', 'pfaendungstabelle', 'pfaendungsrechner', 'kindergeld-anrechnung', 'unterhaltsvorschuss'],
  sources: ['zpo899', 'zpo902', 'pfaendBek2026', 'estg66'],
  de: {
    slug: 'p-konto',
    nav: 'P-Konto',
    card: 'Freibetrag auf dem Pfändungsschutzkonto ab Juli 2026, Erhöhungen, Kindergeld, Übertrag und Bescheinigung.',
    title: 'P-Konto Freibetrag 2026: Pfändungsschutzkonto ab 1. Juli',
    description: `P-Konto Freibetrag 2026: ab 1. Juli ${DE.eur(allein.grund)} Grundfreibetrag, Erhöhung für Unterhalt, Kindergeld obendrauf, Übertrag in ${M} Folgemonate, Bescheinigungen.`,
    h1: 'P-Konto 2026: wie viel Guthaben bei einer Kontopfändung geschützt ist',
    intro: 'Was das Pfändungsschutzkonto schützt, wie sich der Freibetrag erhöht und wie nicht verbrauchtes Geld in die Folgemonate wandert.',
    resume: `Auf einem Pfändungsschutzkonto (P-Konto) bleibt ab dem 1. Juli 2026 ein Guthaben von ${DE.eur(allein.grund)} je Kalendermonat pfändungsfrei. Das ist der monatliche Grundfreibetrag der Lohnpfändung von ${DE.eur(Z.monat.grundfreibetrag, 2)}, nach § 899 ZPO auf volle ${DE.eur(P.pkonto.rundung)} aufgerundet. Zahlen Sie einer Person gesetzlich Unterhalt, kommen nach § 902 ZPO ${DE.eur(Z.monat.erste_person, 2)} hinzu, für die zweite bis fünfte Person je ${DE.eur(Z.monat.weitere_person, 2)}. Kindergeld von ${DE.eur(KG)} je Kind ist zusätzlich geschützt, außer das Kind selbst pfändet wegen Unterhalts. Eine Alleinerziehende mit zwei Kindern und Kindergeld kommt so auf ${DE.eur(mutter.summe, 2)} im Monat. Was in einem Monat vom Freibetrag nicht verbraucht wird, bleibt in den ${M} folgenden Kalendermonaten zusätzlich geschützt. Den Grundfreibetrag gewährt die Bank von selbst; Erhöhungsbeträge erst, wenn eine Bescheinigung vorliegt, etwa von der Familienkasse, dem Arbeitgeber oder einer anerkannten Schuldnerberatungsstelle. Jede Person darf nur ein P-Konto haben.`,
    faqs: [
      { q: 'Wie hoch ist der P-Konto Freibetrag ab Juli 2026 ohne Kinder?', a: `${DE.eur(allein.grund)} je Kalendermonat. Grundlage ist der Grundfreibetrag der Lohnpfändung von ${DE.eur(Z.monat.grundfreibetrag, 2)}, den § 899 Abs. 1 ZPO für das Konto auf den nächsten vollen Zehn-Euro-Betrag aufrundet. Der Wert wird jedes Jahr zum 1. Juli zusammen mit der Pfändungstabelle angepasst; bis Ende Juni 2026 galt der niedrigere Vorjahreswert. Die Bank stellt den neuen Betrag ohne Antrag ein.` },
      { q: 'Wie schnell kann ich mein Girokonto nach einer Pfändung in ein P-Konto umwandeln?', a: `Ist das Guthaben bereits gepfändet, muss die Bank das Konto ab dem Beginn des vierten Geschäftstags nach Ihrem Verlangen als P-Konto führen (§ 850k Abs. 2 ZPO). Wird innerhalb eines Monats nach Zustellung des Überweisungsbeschlusses umgewandelt, wirkt der Schutz auch für das gepfändete Guthaben (§ 899 Abs. 1 ZPO). Auch ein Konto im Minus kann umgewandelt werden, danach aber nur noch auf Guthabenbasis.` },
      { q: 'Ist Kindergeld auf dem P-Konto immer geschützt?', a: `Kindergeld ist nach § 902 Satz 1 Nr. 5 ZPO zusätzlich zum Freibetrag geschützt, ${DE.eur(KG)} je Kind im Monat. Die Ausnahme: Pfändet gerade das Kind, für das es gezahlt wird, wegen seines Unterhalts, ist es nicht geschützt. Damit die Bank den Betrag freigibt, brauchen Sie eine Bescheinigung der Familienkasse oder einer anderen berechtigten Stelle.` },
      { q: 'Was passiert mit dem P-Konto Guthaben, das ich im Monat nicht ausgebe?', a: `Es verfällt nicht. Nicht verbrauchtes geschütztes Guthaben bleibt in den ${M} folgenden Kalendermonaten zusätzlich zum dann geltenden Freibetrag geschützt (§ 899 Abs. 2 ZPO). Abgebucht wird jeweils zuerst das Geld, das am frühesten gutgeschrieben wurde. So lässt sich etwa für eine Jahresabrechnung von Strom oder Nebenkosten über einige Monate ansparen, ohne dass der Gläubiger zugreift.` },
      { q: 'Wie lange gilt eine P-Konto Bescheinigung bei der Bank?', a: `Solange sie ausgestellt ist; eine unbefristete Bescheinigung muss die Bank zwei Jahre lang beachten und darf danach eine neue verlangen, früher nur bei konkreten Zweifeln (§ 903 Abs. 2 ZPO). Ab dem zweiten Geschäftstag nach Vorlage muss sie die Angaben umsetzen. Ausstellen dürfen Familienkasse, Sozialleistungsträger, Arbeitgeber oder eine geeignete Stelle wie eine anerkannte Schuldnerberatung.` },
      { q: 'Gilt der P-Konto Freibetrag, wenn wegen Unterhaltsschulden gepfändet wird?', a: `Nicht in der normalen Höhe. Bei Pfändung wegen gesetzlichen Unterhalts tritt an die Stelle der Beträge nach §§ 899 und 902 ZPO der Betrag, den das Vollstreckungsgericht im Pfändungsbeschluss belassen hat (§ 906 Abs. 1 ZPO). Diesen Beschluss legen Sie der Bank vor. Auf Antrag kann das Gericht einen abweichenden Betrag festsetzen, wenn der belassene Betrag nicht passt.` },
    ],
    body: (h) => `<h2>Was ein P-Konto ist und wer es bekommt</h2>
<p>Ein Pfändungsschutzkonto ist ein gewöhnliches Girokonto mit einer Zusatzvereinbarung. Jede natürliche Person kann von ihrer Bank jederzeit verlangen, ein dort geführtes Zahlungskonto als P-Konto zu führen (§ 850k Abs. 1 ZPO), auch wenn es gerade im Minus ist. Danach läuft es nur noch auf Guthabenbasis. Pro Person ist ein einziges P-Konto erlaubt; bei der Umwandlung versichern Sie, kein weiteres zu haben.</p>
<p>Wird ein Konto gepfändet, ohne P-Konto zu sein, ist zunächst das gesamte Guthaben blockiert. Wird es innerhalb eines Monats nach Zustellung des Überweisungsbeschlusses umgewandelt, gilt der Schutz rückwirkend auch für dieses Guthaben (${h.src('zpo899', '§ 899 Abs. 1 ZPO')}).</p>
<h2>Grundfreibetrag ab 1. Juli 2026</h2>
<p>Das Konto übernimmt den Grundfreibetrag der Lohnpfändung aus der ${h.src('pfaendBek2026', 'Pfändungsfreigrenzenbekanntmachung 2026')}, ${h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)}, rundet ihn aber auf volle ${h.eur(h.P.pkonto.rundung)} auf. Ab Juli 2026 können Sie deshalb in jedem Kalendermonat über ${h.eur(allein.grund)} verfügen, gleich woher das Geld stammt: Lohn, Rente, Arbeitslosengeld oder eine Überweisung von Verwandten. Der Schutz gilt pro Kalendermonat, nicht pro Zahlungseingang.</p>
<h2>Erhöhungsbeträge: Unterhalt, Kindergeld, Sozialleistungen</h2>
<p>Über den Grundfreibetrag hinaus nennt ${h.src('zpo902', '§ 902 ZPO')} Beträge, die zusätzlich frei bleiben. Die wichtigsten für Familien:</p>
<ul>
<li>die Erhöhungen der Lohnpfändung für Personen, denen Sie gesetzlich Unterhalt gewähren: ${h.eur(h.P.pfaendung.monat.erste_person, 2)} für die erste, ${h.eur(h.P.pfaendung.monat.weitere_person, 2)} für jede weitere bis zur fünften,</li>
<li>dieselben Beträge für Menschen, für die Sie Grundsicherung nach dem SGB II oder Sozialhilfe in einer Bedarfsgemeinschaft entgegennehmen, ohne ihnen unterhaltspflichtig zu sein, etwa für das Kind des neuen Partners,</li>
<li>Kindergeld nach dem ${h.src('estg66', 'Einkommensteuergesetz')} von ${h.eur(h.P.kindergeld.monat)} je Kind und andere gesetzliche Geldleistungen für Kinder, außer das Kind pfändet selbst wegen Unterhalts,</li>
<li>Sozialleistungen, die einen Mehraufwand wegen eines Körper- oder Gesundheitsschadens ausgleichen, sowie einmalige Sozialleistungen (§ 54 SGB I),</li>
<li>Leistungen der Bundesstiftung Mutter und Kind.</li>
</ul>
${h.table(['Haushalt', 'Grundfreibetrag', 'Erhöhung Unterhalt', 'Kindergeld', 'geschützt im Monat'],
  FAELLE.map(([p, k, de]) => { const r = pKonto(p, k); return [de, h.eur(r.grund), h.eur(r.erhoehung, 2), h.eur(r.kindergeld), h.eur(r.summe, 2)]; }),
  'P-Konto ab 1. Juli 2026, vom Motor berechnet', ['l', 'r', 'r', 'r', 'r'])}
<p>Ein Kind zählt also doppelt: einmal als unterhaltsberechtigte Person, einmal über das Kindergeld. Eine Mutter mit zwei Kindern hat ${h.eur(mutter.summe, 2)} geschützt, ein Paar mit drei Kindern, bei dem nur ein Elternteil verdient und das Konto führt, ${h.eur(gross.summe, 2)}.</p>
<h2>Die Bescheinigung: ohne sie nur der Grundbetrag</h2>
<p>Den Grundfreibetrag stellt die Bank von sich aus ein. Erhöhungsbeträge darf sie dagegen an den Gläubiger auszahlen, bis Sie ihr nachweisen, dass das Guthaben geschützt ist (§ 903 Abs. 1 ZPO). Den Nachweis führen Sie mit einer Bescheinigung. Ausstellen dürfen sie:</p>
<ul>
<li>die Familienkasse, das Jobcenter oder ein anderer Sozialleistungsträger,</li>
<li>der Arbeitgeber,</li>
<li>eine geeignete Person oder Stelle nach der Insolvenzordnung, in der Praxis vor allem anerkannte Schuldnerberatungsstellen.</li>
</ul>
<p>Stellen, die Leistungen auf Ihr Konto überweisen, sind auf Antrag zur Bescheinigung verpflichtet. Die Bank muss sie ab dem zweiten Geschäftstag nach Vorlage beachten; unbefristete Bescheinigungen gelten für sie zwei Jahre.</p>
<h2>Übertrag in die Folgemonate</h2>
<p>Was vom geschützten Betrag in einem Monat übrig bleibt, verfällt nicht. Nach § 899 Abs. 2 ZPO bleibt es in den ${h.num(h.P.pkonto.uebertrag_monate)} folgenden Kalendermonaten zusätzlich geschützt. Beispiel: Ein Alleinstehender gibt im Juli nur ${h.eur(verbraucht)} aus. Die restlichen ${h.eur(rest)} kann er im August, September oder Oktober neben dem dann geltenden Freibetrag von ${h.eur(allein.grund)} nutzen. Abgebucht wird immer zuerst das älteste Guthaben, damit das Angesparte nicht unbemerkt über die Frist hinausläuft.</p>
<h2>Unterhaltspfändung und Einwände gegen den Betrag</h2>
<p>Pfändet ein Kind oder ein früherer Ehegatte wegen Unterhalts, gelten die Standardbeträge nicht. An ihre Stelle tritt der Betrag, den das Vollstreckungsgericht im Beschluss belassen hat (§ 906 Abs. 1 ZPO). Auch sonst kann das Gericht auf Antrag einen abweichenden Freibetrag festsetzen, wenn eine Vorschrift das vorsieht.</p>
<p>Wer meint, die Bank habe falsch gerechnet, muss das ihr gegenüber spätestens bis zum Ende des sechsten Kalendermonats nach der jeweiligen Berechnung geltend machen (§ 899 Abs. 3 ZPO). Später geht es nur, wenn die Verspätung nicht vom Kontoinhaber zu vertreten ist.</p>
<p>Wie viel vom Lohn schon beim Arbeitgeber gepfändet werden darf, zeigt die ${h.a('pfaendungstabelle', 'Pfändungstabelle')}; den Lohn und das Konto zusammen rechnet der ${h.a('pfaendungsrechner', 'Pfändungsrechner')}. Diese Seite zum P-Konto ist allgemeine Information, keine Rechtsberatung; Bescheinigungen stellen Schuldnerberatungsstellen in der Regel kostenlos aus.</p>`,
  },
  en: {
    slug: 'protected-account',
    nav: 'Protected account (P-Konto)',
    card: 'The protected balance on a German P-Konto from July 2026, increases, child benefit, carry-over and certificates.',
    title: 'P-Konto Germany 2026: Protected Account Allowance from July',
    description: `P-Konto 2026: from 1 July ${EN.eur(allein.grund)} a month protected, more for dependants, child benefit on top, unused balance kept ${M} months, certificate rules explained.`,
    h1: 'The German P-Konto in 2026: how much money in your account is safe from garnishment',
    intro: 'What a garnishment-protection account (Pfändungsschutzkonto) shields, how the allowance rises with a family, and how unused money rolls over.',
    resume: `A German garnishment-protection account (Pfändungsschutzkonto, P-Konto) keeps ${EN.eur(allein.grund)} per calendar month out of a creditor’s reach from 1 July 2026. That is the ${EN.eur(Z.monat.grundfreibetrag, 2)} basic wage exemption rounded up to the next full ${EN.eur(P.pkonto.rundung)}, as section 899 of the Code of Civil Procedure (ZPO) requires. If you support someone by law, section 902 ZPO adds ${EN.eur(Z.monat.erste_person, 2)} for the first person and ${EN.eur(Z.monat.weitere_person, 2)} for each of the second to fifth. Child benefit (Kindergeld) of ${EN.eur(KG)} per child is protected on top, unless the child itself is enforcing maintenance. A single parent with two children receiving child benefit can therefore keep ${EN.eur(mutter.summe, 2)} a month. Money not spent stays protected for the next ${M} calendar months. The bank applies the basic amount automatically, but increases only once it has a certificate, for example from the Familienkasse, your employer or a recognised debt advice service. Each person may hold only one P-Konto.`,
    faqs: [
      { q: 'How much does a German P-Konto protect from July 2026 if I have no dependants?', a: `${EN.eur(allein.grund)} per calendar month. It mirrors the basic wage exemption of ${EN.eur(Z.monat.grundfreibetrag, 2)}, which section 899(1) ZPO rounds up to the next full ten euros for bank accounts. The figure changes every 1 July together with the wage garnishment table, and banks apply the new amount without any request from you.` },
      { q: 'My German account has been frozen by a creditor: how fast can it become a P-Konto?', a: `If the balance is already garnished, the bank must run the account as a P-Konto from the start of the fourth business day after you ask (section 850k(2) ZPO). Converting within one month of the order being served also protects the frozen balance (section 899(1) ZPO). An overdrawn account qualifies too, but afterwards it runs only in credit, without an overdraft.` },
      { q: 'Is child benefit paid into a P-Konto always safe?', a: `Kindergeld is protected in addition to the basic allowance under section 902 no. 5 ZPO, ${EN.eur(KG)} per child a month. The exception is a garnishment by the very child it is paid for, enforcing that child’s own maintenance. To have the amount released, give the bank a certificate from the family benefits office (Familienkasse) or another authorised body.` },
      { q: 'Can I turn my P-Konto back into a normal German account once the debt is settled?', a: `Yes. Section 850k(5) ZPO lets the account holder ask the bank to run the P-Konto again as an ordinary account without protection, giving at least four business days’ notice to the end of a month. The rest of your contract with the bank stays as it was, so an overdraft facility would have to be agreed anew.` },
      { q: 'What happens to P-Konto money I do not spend in a month?', a: `It stays protected for the next ${M} calendar months on top of the allowance for those months (section 899(2) ZPO). Payments are always charged against the oldest protected money first. This lets you set aside part of the allowance for a larger bill such as an annual utilities settlement without exposing it to the creditor.` },
      { q: 'Who issues the certificate a bank needs for a higher P-Konto allowance?', a: `Section 903 ZPO allows the family benefits office, the job centre or another benefits agency, your employer, or a suitable person or body under the Insolvency Code, in practice mostly recognised debt advice services. The bank must act on it from the second business day after you hand it in. A certificate without an end date binds the bank for two years.` },
    ],
    body: (h) => `<h2>What a P-Konto is</h2>
<p>A P-Konto is your ordinary current account with an added protection agreement. Any individual can ask their bank at any time to run an existing account this way (section 850k(1) ZPO), even when it is overdrawn; from then on it works only in credit. Each person may have one P-Konto and must confirm to the bank that there is no other.</p>
<p>For newcomers to Germany the trigger is often an account suddenly blocked after a court order arrives at the bank. Without a P-Konto the whole balance is frozen. Converting within a month of the order being served extends the protection to that frozen balance (${h.src('zpo899', 'section 899(1) ZPO')}).</p>
<h2>The basic allowance from 1 July 2026</h2>
<p>The account takes the basic wage exemption from the ${h.src('pfaendBek2026', '2026 Garnishment Limits Notice')}, ${h.eur(h.P.pfaendung.monat.grundfreibetrag, 2)}, and rounds it up to full ${h.eur(h.P.pkonto.rundung)}. From July 2026 you can therefore use ${h.eur(allein.grund)} in each calendar month, whatever the source: salary, pension, unemployment benefit or money from relatives. Protection works per calendar month, not per incoming payment.</p>
<h2>Increases: dependants, child benefit, social payments</h2>
<p>${h.src('zpo902', 'Section 902 ZPO')} lists amounts that stay free on top. The ones that matter most to families:</p>
<ul>
<li>the wage-garnishment increases for people you support by law: ${h.eur(h.P.pfaendung.monat.erste_person, 2)} for the first, ${h.eur(h.P.pfaendung.monat.weitere_person, 2)} for each further one up to five,</li>
<li>the same amounts for household members whose basic income support under Social Code II or social assistance you receive without owing them maintenance, such as a new partner’s child,</li>
<li>child benefit under the ${h.src('estg66', 'Income Tax Act')}, ${h.eur(h.P.kindergeld.monat)} per child, and other statutory payments for children, unless that child is the creditor for its own support,</li>
<li>social payments that offset extra costs caused by a physical or health impairment, and one-off social payments (section 54 Social Code I),</li>
<li>grants from the federal Mother and Child foundation.</li>
</ul>
${h.table(['Household', 'Basic', 'Dependants', 'Child benefit', 'Protected per month'],
  FAELLE.map(([p, k, , en]) => { const r = pKonto(p, k); return [en, h.eur(r.grund), h.eur(r.erhoehung, 2), h.eur(r.kindergeld), h.eur(r.summe, 2)]; }),
  'P-Konto from 1 July 2026, computed by the engine', ['l', 'r', 'r', 'r', 'r'])}
<p>A child therefore counts twice, once as a dependant and once through child benefit. A couple with one earner, a spouse at home and no children keep ${h.eur(paar.summe, 2)}; a mother of two keeps ${h.eur(mutter.summe, 2)}.</p>
<h2>The certificate</h2>
<p>The basic allowance is automatic. Increases are not: until you prove the money is protected, the bank may pay it to the creditor (section 903(1) ZPO). Proof means a certificate (Bescheinigung) from:</p>
<ul>
<li>the family benefits office, the job centre or another benefits agency,</li>
<li>your employer,</li>
<li>a suitable person or body under the Insolvency Code, in practice mostly recognised debt advice services (Schuldnerberatung).</li>
</ul>
<p>Bodies that pay benefits into your account must issue one on request. The bank has to apply it from the second business day after you present it, and treats an open-ended certificate as valid for two years.</p>
<h2>Carrying money over</h2>
<p>Protected money you do not spend is not lost. Under section 899(2) ZPO it remains protected for the following ${h.num(h.P.pkonto.uebertrag_monate)} calendar months, in addition to the allowance for those months. Suppose a single account holder spends only ${h.eur(verbraucht)} in July: the remaining ${h.eur(rest)} can still be used in August, September or October alongside the ${h.eur(allein.grund)} of each month. Payments always draw on the oldest money first.</p>
<h2>Maintenance creditors and disputes</h2>
<p>When a child or former spouse garnishes the account for maintenance, the standard figures give way to the amount the enforcement court left you in its order (section 906(1) ZPO). On application the court can also set a different allowance where a statute provides for one.</p>
<p>If you think the bank got the protected amount wrong, you must tell it by the end of the sixth calendar month after that calculation (section 899(3) ZPO); later objections succeed only if the delay was not your fault.</p>
<p>How much of your salary can be taken before it reaches the account is in the ${h.a('pfaendungstabelle', 'garnishment table')}; the ${h.a('pfaendungsrechner', 'garnishment calculator')} shows wage and account side by side. This page on the P-Konto is general information, not legal advice; debt advice services usually issue certificates free of charge.</p>`,
  },
});
