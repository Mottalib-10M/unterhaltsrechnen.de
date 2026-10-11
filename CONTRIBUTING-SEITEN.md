# Ajouter ou étoffer une page de Unterhaltsrechnen (unterhaltsrechnen.de)

Notice pour les agents qui prolongent le site (droit de la famille allemand en chiffres, de + en).
À lire en entier avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §3, §6, §7, §9.3, §11, §17.4, §21, §22, §26).

## Principe : une page = un fichier

- `src/content/guides/<id>.ts` : guide ou page « par revenu » (groupe `betrag`) ;
- `src/content/rechner/<id>.ts` : page outil (champ `tool`).

Le fichier porte les deux langues (`de`, `en`) : slug, titre, description, H1, chapeau, bloc citable
(`resume`), FAQ, corps, sources, mini-simulateur, pages liées. Routes (`src/i18n/routes.ts`), menus et
pied de page (`src/i18n/nav.ts`, par `group`), sitemap, hreflang et schémas lisent ces fichiers seuls.
**Aucun fichier du cœur à modifier pour ajouter une page.** Modèle : `src/content/rechner/kindesunterhalt-rechner.ts`.
Liste fermée des pages prévues : `tests/planned-ids.json`.

Un mini-simulateur = un fichier `src/lib/minis/<kind>.ts`, chargé automatiquement ; il appelle le moteur,
jamais un calcul refait à côté. Outils communs : `src/lib/minis/_kit.ts`.

## Les données

| Fichier | Contenu | Origine |
|---|---|---|
| `src/data/params-2026.json` | Toutes les valeurs 2026 (DT, Selbstbehalte, Kindergeld, UVG, Pfändung, FamGKG, RVG, PKH, VersAusglG, Erbrecht, ErbStG) et la table `sources` | à la main, chaque bloc relu sur sa source (`_quelle`) |
| `tests/fixtures/pfaendung-2026-monat.json` | Toutes les lignes de la table mensuelle de la Pfändungsfreigrenzenbekanntmachung 2026 | extrait du PDF officiel (`research/pf2026.txt`) |
| `tests/fixtures/famgkg-anlage2.json`, `rvg-anlage2.json` | Anlage 2 FamGKG et RVG (BGBl. 2025 I Nr. 109) | gesetze-im-internet.de |
| `research/` | Textes officiels lus : DT 2025 et 2026, Leitlinien NRW 2026, BGH XII ZB 565/15 et XII ZB 415/25 | OLG Düsseldorf, BGH |

## Le moteur (`src/lib/engine/`)

| Fichier | Rôle |
|---|---|
| `dt.ts` | Groupes, Altersstufen, Zahlbetrag, Bedarfskontrollbetrag, Mangelfall (Anm. C), Rang 4, erweiterter Umgang |
| `unterhalt.ts` | Ehegatten-/Trennungsunterhalt (45 %), Volljährige (Haftungsquote), Wechselmodell, Elternunterhalt, Unterhaltsvorschuss |
| `kosten.ts` | Gebühren FamGKG § 28 et RVG § 13, Verfahrenswert §§ 43, 44, 50, Scheidungskosten, PKH § 115 ZPO |
| `pfaendung.ts` | § 850c ZPO (mois, semaine, jour), P-Konto §§ 899, 902 ZPO |
| `vermoegen.ts` | Zugewinnausgleich, Versorgungsausgleich (Geringfügigkeit § 18) |
| `erbe.ts` | Gesetzliche Erbfolge, Pflichtteil, Pflichtteilsergänzung, Erbschaftsteuer (Härteausgleich) |

Tests : `tests/engine.test.ts` (chaque Zahlbetrag de la DT, l'exemple de l'Anm. C, chaque ligne de la
Pfändungstabelle, chaque valeur des Anlagen 2) et `tests/pages.test.ts` (forme des pages).

## Mise à jour annuelle

1. Décembre : nouvelle Düsseldorfer Tabelle et Leitlinien NRW (valables au 1er janvier). Mettre à jour
   les blocs `dt`, `selbstbehalt`, `ehegatte`, `leitlinien`, `mindestunterhalt`, déplacer l'ancienne table
   dans `dt2025` (renommer), relire `kindergeld`.
2. Printemps : Pfändungsfreigrenzenbekanntmachung (valable au 1er juillet) : bloc `pfaendung`, puis
   régénérer `tests/fixtures/pfaendung-<année>-monat.json` à partir du PDF.
3. Bezugsgröße (`versorgungsausgleich`), PKHB (`pkh`), tables de frais si le législateur les change.
4. `npx vitest run` puis tous les contrôles.

## Règles propres à ce site

- **Aucun chiffre juridique en dur** : `h.P` dans le corps, `P` et `DE`/`EN` (`src/lib/fmt.ts`) ailleurs ;
  les exemples sont des appels au moteur en tête de fichier.
- **Allemand : pas de numéros pointés** (« Nr. 13.1 ») : `typo-nbsp.mjs` les prend pour des décimales.
  Écrire « Nummer 13 Absatz 1 der Leitlinien ».
- **Pas de conseil juridique individuel**, pas de mise en relation avec des avocats. On peut citer la
  Beistandschaft gratuite du Jugendamt et les Schuldnerberatungsstellen.
- **Pratique judiciaire variable** (abattement pour enfants dans le Verfahrenswert, Vermögenszuschlag,
  Wohnvorteil…) : jamais présentée comme une règle ; dans les calculateurs, ce sont des champs libres.
- **Pages « betrag »** : les nombres sont neutralisés par `check-unique` ; chaque page doit avoir un angle
  et une structure propres, sinon elles dépassent 30 % de similarité.
- **Anglais** : pour un expatrié qui vit en Allemagne, terme allemand entre parenthèses à la première occurrence.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/unterhaltsrechnen.de
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build                       # inclut typo-nbsp et check-snippets
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py . ; python3 scripts/check-cookies.py .
python3 scripts/check-liens.py dist ; python3 scripts/check-snippets.py .
node scripts/check-legal.mjs . ; node scripts/check-sources.mjs .
node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check ; node scripts/check-url-propre.mjs dist
node scripts/check-layout.mjs dist
```

Serveur local : port 4406 (`npm run preview`). Pour l'arrêter : `lsof -ti tcp:4406 | xargs kill`.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne toucher ni à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Aucune identité personnelle : l'éditeur est Radif Partners. Aucun lien vers un autre site du portefeuille.
- Elterngeld, Kindergeld-Antrag et aides sociales : hors périmètre (déjà traités ailleurs dans le portefeuille).
