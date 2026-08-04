# docs/README.md

# Entwicklerhandbuch

Willkommen bei **Korak po korak**.

Diese Dokumentation richtet sich ausschließlich an Personen, die an der Entwicklung des Projekts arbeiten.

Sie beschreibt nicht den Kurs selbst, sondern die Regeln, nach denen der Kurs entwickelt wird.

---

# Projektziel

Korak po korak ist ein interaktiver Reaktivierungskurs für Erwachsene.

Der Schwerpunkt liegt nicht auf dem Erlernen neuer Grammatik.

Der Schwerpunkt liegt auf der Reaktivierung bereits vorhandener Sprachkenntnisse und dem spontanen Sprechen im Alltag.

---

# Projektstruktur

```text
kroatischkurs/

docs/
css/
js/
data/
audio/
img/

index.html
lesson.html
README.md
```

---

# Dokumentation

## philosophie.md

Warum dieses Projekt existiert.

Die grundsätzliche Vision.

---

## didaktik.md

Didaktische Regeln.

Wie unterrichten wir?

Wie lernt unsere Zielgruppe?

---

## roadmap.md

Entwicklungsstand.

Geplante Versionen.

Geplante Lektionen.

---

## designsystem.md

Farben

Schriften

Komponenten

Bedienkonzept

Animationen

UI-Regeln

---

## ideen.md

Alle Ideen.

Keine Bewertung.

Keine Reihenfolge.

Nichts geht verloren.

---

## lerntagebuch.md

Dokumentiert jede Version.

Welche Änderungen wurden vorgenommen?

Warum wurden sie vorgenommen?

Welche Erkenntnisse gab es?

---

# Architektur

Der Kurs besteht aus zwei Ebenen.

## 1. Plattform

Die Plattform enthält alle wiederverwendbaren Komponenten.

Zum Beispiel:

- Navigation
- Dialogkarten
- Wortkarten
- Audio
- Übungen
- Fortschritt
- Notizen
- Lern-Gedächtnis

Diese Komponenten werden nur einmal entwickelt.

---

## 2. Inhalte

Die Inhalte bestehen ausschließlich aus den eigentlichen Lektionen.

Sie verwenden die vorhandenen Komponenten.

Dadurch muss neuer Code möglichst selten geschrieben werden.

---

# Grundsatz

**Code wird wiederverwendet.**

Neue Lektionen sollen überwiegend aus Inhalten bestehen.

Nicht aus neuer Programmierung.

---

# Versionsverwaltung

Jede größere Änderung erhält eine neue Versionsnummer.

Beispiel:

Version 0.1

Grundgerüst

---

Version 0.2

Dokumentation

---

Version 0.3

Neue Plattform

---

Version 0.4

Lern-Gedächtnis

---

Version 0.5

Neue Übungen

---

Version 1.0

Erste veröffentlichte Version

---

# Entwicklungsablauf

Neue Funktionen entstehen immer in derselben Reihenfolge.

1.

Idee

↓

2.

Dokumentation

↓

3.

Entwicklung

↓

4.

Test

↓

5.

Verbesserung

↓

6.

Veröffentlichung

---

# Qualität

Vor jeder neuen Funktion wird geprüft:

Hilft sie dabei,

den Lernenden schneller zum spontanen Sprechen zu bringen?

Wenn nicht,

wird sie nicht entwickelt.

---

# Coding Style

- möglichst wenig doppelter Code
- kleine Funktionen
- gut lesbare Namen
- Kommentare nur dort, wo sie notwendig sind
- Komponenten wiederverwenden
- Mobile First
- Barrierefreiheit berücksichtigen

---

# Designprinzipien

- ruhig
- hochwertig
- freundlich
- klar
- keine Reizüberflutung

Die Inhalte stehen immer im Mittelpunkt.

Nicht die Technik.

---

# Testprinzip

Neue Funktionen werden sofort praktisch getestet.

Nicht theoretisch.

Die Testperson arbeitet mit echten Lektionen.

Verbesserungen werden unmittelbar übernommen.

---

# Zielgruppe

Der Kurs richtet sich an Erwachsene,

die bereits Vorkenntnisse besitzen,

aber Schwierigkeiten beim spontanen Sprechen haben.

Alle Entscheidungen orientieren sich an dieser Zielgruppe.

---

# Leitsatz des Projekts

> Nicht lang schnacken.
>
> Einfach macken.

Dieser Satz erinnert uns daran,

Ideen möglichst schnell in funktionierende Lösungen umzusetzen.

Perfektion entsteht durch viele kleine Verbesserungen,

nicht durch endlose Planung.
