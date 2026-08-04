# Release 0.3 – Plattform

## Ziel

Aus einzelnen Lernmaterialien wird eine zusammenhängende, navigierbare Lernplattform. Die didaktische Einheit bleibt die Lektion; die Plattform ergänzt sie um Lernstand, Wiederholung, Notizbuch und Transfer.

## Kernentscheidungen

1. **Lokaler Lernstand:** keine Anmeldung und kein Backend in Version 0.3.
2. **Sprechen vor Schreiben:** Übungen fordern zunächst lautes Produzieren; Texteingaben dienen als Stütze.
3. **Muster statt Regeltafel:** Grammatik erscheint als wiederverwendbarer Satzbaustein.
4. **Fehler als Wiederholungsauftrag:** wiederholte Fehlversuche werden ins Lernmemory übernommen.
5. **Transfer als Pflichtphase:** jede Lektion endet mit einer kleinen echten Sprechhandlung.

## Technischer Stand

- statisches HTML/CSS/JavaScript
- gemeinsame Datenquelle `data/lessons.js`
- gemeinsamer Zustand in `localStorage`
- keine externen Bibliotheken oder Schriftdateien
- bereit für GitHub Pages
