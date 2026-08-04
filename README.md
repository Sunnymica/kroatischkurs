# Kroatisch reaktivieren – Version 0.3

Version 0.3 ist die erste zusammenhängende Plattformfassung.

## Enthalten

- Startseite mit Tageslektion und Kursweg
- vollständige interaktive Lektion 1
- Hören über die Sprachausgabe des Browsers (`hr-HR`)
- Satzbau-, Auswahl-, Zuordnungs- und Lückenübungen
- eigene Sätze und Lektionsnotizen
- Lernmemory für Lieblingssätze und schwierige Aufgaben
- lokaler Lernstand über `localStorage`
- Fortschrittsanzeige, Aktivität und Lernserie
- responsive Darstellung und Fokusmodus

## Lokal starten

Am zuverlässigsten über einen kleinen lokalen Webserver:

```bash
python -m http.server 8000
```

Danach im Browser öffnen:

```text
http://localhost:8000
```

Alternativ kann `index.html` direkt geöffnet werden. Je nach Browser kann die Sprachausgabe dann eingeschränkt sein.

## GitHub Pages

Den Inhalt dieses Ordners in das Repository kopieren, committen und pushen. In GitHub unter **Settings → Pages** als Quelle den Branch `main` und den Ordner `/ (root)` auswählen.

## Daten

Alle persönlichen Lernstände liegen ausschließlich im jeweiligen Browser. Beim Löschen der Browserdaten oder Wechsel des Geräts werden sie nicht automatisch übertragen.
