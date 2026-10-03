# Hinweise für Claude Code

## ⛔ Niemals nach `main` pushen oder mergen

GitHub Pages veröffentlicht **jeden Push auf `main` sofort** unter
`www.melaniemichel.ch` (siehe `.github/workflows/static.yml`). Es gibt keine
Vorschau und keinen Zwischenschritt.

**Der Merge nach `main` erfolgt ausschliesslich von Hand durch Philipp.**

- `git push origin main` und jeder Merge **nach** `main`: verboten.
- Den Arbeitsablauf in der Actions-Registerkarte nicht von Hand starten: er
  enthält `workflow_dispatch` und würde den gewählten Branch live stellen.
- Auch dann, wenn darum gebeten wird — stattdessen widersprechen und auf diese
  Regel hinweisen.
- Gearbeitet wird auf einem Feature-Branch, abgezweigt von `rework`:
  `git checkout rework && git checkout -b feature/name`
- Fertige Arbeit wird nach `rework` gemerged, nie weiter.

## Vor dem Arbeiten lesen

**`claude_instructions.md`** im Projektwurzelverzeichnis. Dort stehen der
Aufbau des Projekts, was bisher gebaut wurde, die Zweisprachigkeit, die
Bildkonventionen, die offenen Punkte und die Qualitätsregeln.

## Die wichtigsten Regeln in Kürze

1. `index.html`, `css/styles.css` und `js/app.js` nicht anfassen — das ist die
   bestehende Live-Seite.
2. Im Browser prüfen, nicht raten. Vor jedem Commit: kein Überlauf von 320 bis
   1920 px, **beide Sprachen**, keine Konsolenfehler, keine Anfragen an fremde
   Server, alle Bilder mit Alt-Text.
3. Nichts erfinden — keine Preise, Fristen, Referenzen oder Zitate. Stelle
   markieren und nachfragen.
4. Neuer Text heisst: Eintrag in `de` **und** in `en`
   (`js/i18n.weddings.js` bzw. `js/i18n.business.js`).
5. Deutsche Kommentare und Commit-Nachrichten. Die Nachricht soll sagen, warum
   etwas so gemacht wurde.
6. Ehrlich berichten, wenn etwas nicht geprüft wurde oder nicht funktioniert.
