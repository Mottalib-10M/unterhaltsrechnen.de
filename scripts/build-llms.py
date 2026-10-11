#!/usr/bin/env python3
"""Erzeugt public/llms.txt aus dem Build (RECETTE §21). Aufruf: npm run build && python3 scripts/build-llms.py && npm run build"""
import glob, html, json, os, re
SITE = re.search(r'SITE_URL = "([^"]+)"', open('src/data/site-config.ts').read()).group(1)
PF = len(json.load(open('tests/fixtures/pfaendung-2026-monat.json'))['zeilen'])
rows = {'de': [], 'en': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# Unterhaltsrechnen', '',
       '> Unabhängige Seite von Radif Partners auf Deutsch und Englisch: Düsseldorfer Tabelle 2026 als anklickbare Tabelle und Rechner (mehrere Kinder, Bedarfskontrollbetrag, Mangelfall nach Anmerkung C, Wechselmodell, erweiterter Umgang nach BGH XII ZB 415/25), Ehegatten-, Trennungs-, Volljährigen- und Elternunterhalt, Unterhaltsvorschuss, Scheidungskosten nach FamGKG und RVG (Tabellen seit Juni 2025), Verfahrenskostenhilfe, Zugewinn- und Versorgungsausgleich, Pfändungstabelle ab 1. Juli 2026 (' + str(PF) + ' Zeilen der amtlichen Monatstabelle getestet), P-Konto, gesetzliche Erbfolge, Pflichtteil und Erbschaftsteuer.', '',
       'Alle Berechnungen laufen im Browser; keine Datenerhebung, keine Vermittlung an Kanzleien. Ergebnisse sind allgemeine Berechnungen nach amtlichen Werten, keine Rechtsberatung.', '']
for lang, titel in (('de', '## Seiten auf Deutsch'), ('en', '## Pages in English')):
    out.append(titel); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt:', sum(len(v) for v in rows.values()), 'Seiten')
