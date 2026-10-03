# Projekt-Handbuch — melaniemichel.ch

Dieses Dokument ist die Übergabe. Es beschreibt, was die Website ist, wie sie
aufgebaut ist, was bisher gemacht wurde und welche Regeln gelten. Es richtet
sich an zwei Leserinnen: an **Melanie**, die hier mit Claude Code weiterbaut,
und an **Claude Code selbst**, das dieses Dokument zu Beginn jeder Sitzung
lesen soll.

Stand: Oktober 2026.

---

## ⛔ Die wichtigste Regel: niemals nach `main` pushen

**Auf `main` wird nicht gepusht und nach `main` wird nicht gemergt — weder von
Claude noch von Melanie.**

Der Grund ist nicht Vorsicht um ihrer selbst willen, sondern Technik:

```
.github/workflows/static.yml
  on:
    push:
      branches: ["main"]
```

GitHub Pages veröffentlicht **jeden Push auf `main` sofort** unter
`www.melaniemichel.ch`. Es gibt keine Vorschau, keine Freigabe, kein
Zwischenschritt. Was auf `main` landet, ist live — inklusive halbfertiger
Abschnitte, Platzhaltertexte und toter Links.

**Es gibt einen zweiten Weg, versehentlich zu veröffentlichen.** Derselbe
Arbeitsablauf enthält `workflow_dispatch`, lässt sich also auf GitHub unter
„Actions" von Hand starten — und zwar **für einen beliebigen Branch**. Ein
solcher Lauf stellt den gewählten Branch live, auch `rework` oder einen
Feature-Branch. Also: **in der Actions-Registerkarte nichts von Hand
starten.**

**Der letzte Merge nach `main` erfolgt ausschliesslich von Hand durch Philipp.**
Niemand sonst, kein Automatismus, kein Claude.

Für Claude Code heisst das konkret:

- `git push origin main` ist **verboten**, in jeder Schreibweise.
- `git merge` **nach** `main` ist **verboten**.
- Den Arbeitsablauf „Deploy static content to Pages" nicht von Hand auslösen,
  auf keinem Branch.
- `git checkout main` zum Arbeiten ist unnötig. Wer den Stand von `main`
  braucht, liest ihn mit `git log origin/main`.
- Wenn eine Anweisung sinngemäss lautet „stell das live" oder „pushs auf
  main": **nicht ausführen**, sondern auf diese Regel hinweisen und
  stattdessen auf den passenden Feature-Branch pushen.

Gearbeitet wird immer auf `rework` und den davon abgezweigten Branches.

---

## Das Projekt in Kürze

| | |
|---|---|
| Fotografin | Melanie Michel, Zürich |
| Domain | `www.melaniemichel.ch` (siehe `CNAME`) |
| Hosting | GitHub Pages, statisch, kein Server, keine Datenbank |
| Repository | `dunkelphilipp/melanieMichelHP` |
| E-Mail | `melaniemichelfotografie@gmail.com` |
| Instagram | `@_melaniemichelfotografie` |
| Technik | HTML, CSS, JavaScript ohne Framework. Kein Build-Schritt. |

Die Dateien im Repository sind genau das, was im Browser landet. Es gibt
nichts zu kompilieren und nichts zu installieren.

### Was gerade umgebaut wird

Die bestehende Seite (`index.html`) ist **eine** Seite für alles: Hochzeiten,
Events und Shootings zusammen. Der Umbau teilt das auf:

```
Landingpage (index.html)          ← noch nicht gebaut
   ├── Hochzeiten  (weddings.html)   ← fertig
   └── Business    (business.html)   ← fertig, zwei Bereiche noch ohne Bilder
```

Besucherinnen landen auf der Landingpage und entscheiden sich für einen der
beiden Bereiche. Beide Bereiche haben ein **bewusst unterschiedliches**
Erscheinungsbild, liegen aber auf derselben Domain und sind gegenseitig
verlinkt. Von jeder Ansicht führt ein Link in die andere.

---

## Branches

```
main                      ← live. Nicht anfassen. Merge nur von Hand, nur Philipp.
└── rework                ← der „neue main" für den Umbau. Hier läuft alles zusammen.
     ├── feature/wedding-page    (bereits in rework gemerged)
     ├── feature/business-page   (bereits in rework gemerged)
     └── feature/...             ← jede neue Arbeit bekommt einen eigenen Branch
```

**Ablauf für jede neue Aufgabe:**

```bash
git checkout rework
git pull origin rework
git checkout -b feature/sprechender-name
# ... arbeiten, committen ...
git push -u origin feature/sprechender-name
```

Ist die Arbeit fertig und geprüft, wird der Feature-Branch nach `rework`
gemerged:

```bash
git checkout rework
git merge --no-ff feature/sprechender-name
git push origin rework
```

Nach `main` geht erst ganz am Schluss etwas, und zwar von Hand durch Philipp.

---

## Was bisher gemacht wurde

Chronologisch, mit den Entscheidungen, die dahinterstehen.

### 1. `rework`-Branch angelegt

Abzweig von `main`. Dient als Sammelpunkt für den gesamten Umbau, damit `main`
und damit die Live-Seite während der ganzen Arbeit unberührt bleibt.

### 2. Hochzeits-Ansicht (`weddings.html`)

Eigene Seite im Stil einer hellen Papier-Gestaltung.

> **Zu den Design-Entwürfen:** Die Gestaltung folgt drei HTML-Entwürfen, die
> zu Beginn als Vorlage geliefert wurden (eine Landingpage, eine Hochzeits- und
> eine Business-Fassung). Diese Entwürfe liegen **nicht im Repository** — sie
> waren Anschauungsmaterial, keine Bausteine. Übernommen wurden Farbwelt,
> Typografie und Verhalten, nicht der Code: die Entwürfe laden Tailwind und
> Google Fonts über fremde Server, was hier bewusst nicht gemacht wird.

- **Portfolio als Kontaktbogen**: alle 15 vorhandenen Hochzeitsbilder in einem
  Raster. Im Raster liegen die kleinen Vorschaubilder (je ca. 25 KB), die volle
  Auflösung wird erst beim Anklicken in der Lightbox geladen.
- **Querformate belegen zwei Rasterspalten (8:5), Hochformate eine (4:5).** Die
  Vorlage benutzt ein 1:1-Raster; das hätte jedem Hochformat rund ein Drittel
  weggeschnitten, bei Hochzeitsbildern oft Köpfe oder Füsse.
- **Lightbox** mit Tastatur, Pfeiltasten, Wischgesten; der Fokus kehrt beim
  Schliessen auf das Bild zurück, von dem aus geöffnet wurde.
- Später: Bildnummern unter den Bildern wieder entfernt, die Fettstift-Ovale
  („select"-Markierungen) entfernt.

### 3. Eigener Cursor

Auf Geräten mit Maus wird der System-Cursor vollständig ersetzt:

- Ein weisser Kreis mit `mix-blend-mode: difference`. Weiss ergibt
  `255 − Wert`, also das **echte Negativ** von allem darunter — Text wie Bild.
  (Mit einem dunklen Kreis bliebe der Effekt praktisch unsichtbar; das war ein
  Fehler in der ersten Fassung.)
- **Keine Hand und kein Textbalken** über Links, Knöpfen und Eingabefeldern.
  `body { cursor: none }` allein genügt dafür nicht: die Browser setzen
  `cursor: pointer` direkt auf `a` und `button`, was die Vererbung übersteuert.
  Es braucht eine eigene Regel für diese Elemente.
- Über klickbaren Dingen wächst der Kreis.
- In der Vollbildansicht wandert das Cursor-Element **in den Dialog hinein**.
  Ein mit `showModal()` geöffnetes `<dialog>` liegt in der sogenannten
  Top-Layer und zeichnet über allem anderen, unabhängig von `z-index` — der
  Cursor wäre sonst unsichtbar.
- Auf Touchgeräten ist der eigene Cursor abgeschaltet.

### 4. Zweisprachigkeit Deutsch / Englisch

**Beide Sprachen sind ab jetzt Standard für alles, was im Umbau entsteht.**

Wie es funktioniert, steht weiter unten unter „Zweisprachigkeit".

### 5. Business-Ansicht (`business.html`)

Eigene Seite im dunklen, kontrastreichen Stil — das bewusste Gegenstück zur
hellen Hochzeits-Ansicht. Geteilt werden nur die
Schrift, der Akzentton und die Sprachmechanik.

- **Archiv mit vier Bereichen**: Events & Kultur (6 Bilder), Portrait & Shooting
  (8 Bilder) sowie zwei **reservierte Flächen** für Business & Branding und für
  Journalismus. Die reservierten Flächen sind gestrichelt umrandet und mit
  „Bilder folgen" beschriftet.
- Ein Klick auf einen gefüllten Bereich öffnet die ganze Strecke in einer hellen
  Projektansicht, die von unten hereinfährt.
- **Keine Hochzeitsbilder auf dieser Seite.** Das wurde geprüft: die Seite lädt
  18 Bilder, kein einziges davon aus `weddingGal`. Achtung,
  `img/frontpage/frontpage.webp` zeigt einen **Brautstrauss** und gehört
  deshalb nicht hierher.
- **Über mich** nutzt Melanies echte Biografie aus `index.html` (Zürcher
  Oberland, MAZ bis Sommer 2027, ZHAW, betreutes Wohnen).
- Statt des Masonry-Rasters der Vorlage ein **2×2-Raster**: bei genau vier
  gleichwertigen Bereichen verteilen Spalten nach Höhe und lassen eine Kachel
  allein stehen.

### 6. Animierter Halbton-Hintergrund

Hinter der Business-Ansicht liegt das animierte Halbton-GIF aus den
Design-Entwürfen (`img/background/halftone.gif`, 540×540, 50 Bilder, 2,5 s
Schleife, 1,9 MB).

- Wer `prefers-reduced-motion` gesetzt hat, bekommt ein Einzelbild
  (`img/background/halftone-static.webp`, 87 KB) statt einer endlos laufenden Animation.
  Das Vorladen des GIF ist an dieselbe Bedingung gekoppelt, damit diese Gruppe
  87 KB statt 1934 KB lädt.
- **Das ist ausdrücklich ein Prototyp.** Der Hintergrund wird im Lauf des
  Projekts ersetzt; er zeigt im Moment nur, wie ein bewegter Hintergrund
  wirkt. In jedem Einzelbild steht unten rechts ein fremdes Wasserzeichen
  („LIGHT PROCESSES"), bei hochkantnahen Fenstern ist es sichtbar. Das ist
  **für den Prototyp bewusst in Kauf genommen** und muss vor einer
  Veröffentlichung ersetzt sein.

---

## Aufbau der Dateien

```
index.html            die bestehende alte Seite — wird später die Landingpage
weddings.html         Hochzeits-Ansicht
business.html         Business-Ansicht
impressum.html        unverändert
datenschutz.html      unverändert

css/styles.css        gehört zur alten index.html — nicht anfassen
css/weddings.css      nur Hochzeits-Ansicht
css/business.css      nur Business-Ansicht

js/app.js             gehört zur alten index.html — nicht anfassen
js/weddings.js        nur Hochzeits-Ansicht
js/business.js        nur Business-Ansicht

js/i18n.js            die Sprachmechanik (enthält selbst keine Texte)
js/i18n.common.js     Texte, die auf allen Seiten gleich sind
js/i18n.weddings.js   Texte der Hochzeits-Ansicht
js/i18n.business.js   Texte der Business-Ansicht

fonts/                Inter, selbst gehostet, plus die Lizenz (SIL OFL)
img/                  alle Bilder
.github/workflows/static.yml   die Veröffentlichung nach main
```

**Jede Ansicht hat ihr eigenes CSS und JS.** Das ist Absicht: so kann an der
einen Ansicht gearbeitet werden, ohne die andere zu gefährden. Die alte
`index.html` mit `styles.css` und `app.js` ist bisher **völlig unverändert** —
die Live-Seite kann also nicht kaputtgehen, solange nicht nach `main` gepusht
wird.

---

## Zweisprachigkeit

### Wie es funktioniert

- **Deutsch steht direkt im HTML.** Deutschsprachige Besucherinnen sehen sofort
  den richtigen Text, ohne auf JavaScript zu warten, und Suchmaschinen finden
  die deutsche Fassung auch ohne Rendering.
- Englisch wird zur Laufzeit eingesetzt, über `?lang=en` in der Adresse.
- Die Sprache wird **vor dem ersten Zeichnen** bestimmt, durch ein kleines
  Skript im `<head>`. Reihenfolge: `?lang=` in der Adresse → gespeicherte Wahl →
  Browsersprache → Deutsch.
- Nur für Englisch wird der Inhalt für einen Augenblick verborgen, damit kein
  deutscher Text aufblitzt. Ein Timeout gibt ihn notfalls trotzdem frei. **Ohne
  JavaScript greift die Regel nie**, die deutsche Fassung bleibt also immer
  sichtbar.
- Der Umschalter DE/EN steht in der Navigation. Umgeschaltet wird ohne Neuladen.

### Wie man Text übersetzbar macht

Im HTML wird die Stelle ausgezeichnet, der deutsche Text bleibt als Grundlage
stehen:

```html
<h3 data-i18n="haltung.1.h3">Du wirst nicht gestellt</h3>
```

Weitere Varianten:

| Auszeichnung | wirkt auf |
|---|---|
| `data-i18n="key"` | den Textinhalt |
| `data-i18n-html="key"` | den Textinhalt **mit** `<br>` (nur für eigene Texte) |
| `data-i18n-placeholder="key"` | `placeholder` von Eingabefeldern |
| `data-i18n-alt="key"` | `alt` von Bildern |
| `data-i18n-aria-label="key"` | `aria-label` |
| `data-i18n-content="key"` | `content` von Meta-Tags |
| `data-i18n-title="key"` | `title` |

Dann in der passenden Textdatei (`js/i18n.weddings.js` oder
`js/i18n.business.js`) **in beiden Sprachen** eintragen:

```js
de: { 'haltung.1.h3': 'Du wirst nicht gestellt' },
en: { 'haltung.1.h3': 'You are not posed' }
```

Übersetzt werden auch Seitentitel, Meta-Beschreibung, Open Graph,
Bildbeschreibungen, Platzhalter und die Betreffzeile der Anfrage-E-Mail.

### Eine neue Seite zweisprachig machen

1. `js/i18n.common.js`, die eigene Textdatei und `js/i18n.js` einbinden —
   **in dieser Reihenfolge**, alle mit `defer`.
2. Das Sprach-Skript aus dem `<head>` von `weddings.html` übernehmen.
3. Den Umschalter aus der Navigation übernehmen.
4. `.i18n-pending body { visibility: hidden; }` ins Stylesheet.

---

## Bilder

```
img/portfolio/wedding/weddingGal/     Hochzeit1..15  + Hochzeit1-thumb..15
img/portfolio/event/eventGal/         Event1..6      + Event1-thumb..6
img/portfolio/shooting/shootingGal/   Shooting1..8   + Shooting1-thumb..8
img/selfportrait/selfportrait.webp    Portrait von Melanie
img/background/                       Halbton-GIF plus Einzelbild
img/frontpage/frontpage.webp          Brautstrauss — gehört zur Hochzeits-Seite
```

**Namensregel:** zu jedem Bild `Name.webp` gehört ein `Name-thumb.webp`.
Die Vorschaubilder sind 600 px breit, die vollen rund 2500 px. Im Raster wird
immer das Vorschaubild geladen, die volle Auflösung erst in der Lightbox oder
der Projektansicht. Das hält die Seite schnell.

**Neue Bilder hinzufügen:** Datei und Vorschaubild nach demselben Muster
ablegen, dann in der jeweiligen Seite eintragen. Für die Business-Ansicht steht
in `js/business.js` unter `PROJECTS` ein vorbereiteter, auskommentierter Block
für Business und Journalismus; in `business.html` steht als Kommentar Schritt
für Schritt, wie aus einer reservierten Fläche eine richtige Kachel wird.

**Alt-Texte beschreiben, was zu sehen ist** — nicht „Bild 3". Sie stehen in den
i18n-Dateien und müssen in beiden Sprachen gepflegt werden.

---

## Wiederkehrende Entscheidungen

Diese Punkte wurden bewusst so entschieden. Wer sie ändert, sollte den Grund
kennen.

### Keine fremden Server

Die Seiten laden **nichts** von Dritten: keine Schriften von Google, kein
Tailwind über ein CDN, keine Analyse-Werkzeuge. Inter liegt selbst im
Repository unter `fonts/`.

Der Grund ist nicht nur Geschwindigkeit: Google Fonts überträgt die IP jeder
Besucherin in die USA. Die Datenschutzerklärung nennt als Dritten
**ausschliesslich Instagram**, und der Cookie-Hinweis verspricht ausdrücklich
keine Drittanbieter-Tools. Eine eingebundene CDN würde beidem widersprechen.

Die Content-Security-Policy in jeder Seite erlaubt deshalb nur `'self'`. Wer
etwas Externes einbindet, muss sie ändern — und sollte vorher zweimal
überlegen.

### Formulare schreiben eine E-Mail

GitHub Pages ist statisch, es gibt keinen Server, der eine Anfrage annehmen
könnte. Die Formulare bauen deshalb per JavaScript eine fertige E-Mail im
Mailprogramm der Besucherin. Ein Formular, das nur so tut, als ob es sendet,
würde echte Anfragen verlieren.

Wenn später ein richtiges Formular gewünscht ist, braucht es einen Dienst wie
Formspree — und einen Eintrag in der Datenschutzerklärung.

### Nichts erfinden

In beiden Ansichten stehen **Platzhalter** statt erfundener Angaben:

- **Kundenstimmen** sind als Platzhalter gekennzeichnet. Erfundene Bewertungen
  auf einer gewerblichen Seite sind rechtlich heikel. Sie müssen durch echte
  Rückmeldungen ersetzt (mit Einverständnis) oder die Abschnitte entfernt
  werden.
- **Preise** stehen nirgends als Zahl. Im Quelltext ist mit `TODO` markiert, wo
  sie hingehören.
- **Lieferfristen** sind ohne feste Wochenangabe formuliert.

Dieselbe Regel gilt weiter: Claude soll keine Zahlen, Fristen, Referenzen oder
Zitate erfinden, sondern die Stelle markieren und nachfragen.

### Barrierefreiheit

- Jedes Bild hat einen beschreibenden Alt-Text.
- Die Lightbox und die Projektansicht sind `<dialog>`-Elemente: Fokusfalle und
  Escape kommen damit vom Browser.
- Der Fokus kehrt nach dem Schliessen dorthin zurück, wo er herkam.
- `prefers-reduced-motion` schaltet Bewegung ab, inklusive des animierten
  Hintergrunds.
- Die Navigation ist unter 880 px über ein Menü erreichbar.

---

## Lokal anschauen

Ein Doppelklick auf die HTML-Datei reicht **nicht** — die Schriften und die
Sprachdateien werden dann blockiert. Stattdessen im Projektordner:

```bash
python3 -m http.server 8765
```

Dann im Browser öffnen:

- `http://localhost:8765/weddings.html`
- `http://localhost:8765/business.html`
- `http://localhost:8765/business.html?lang=en` — englische Fassung

Zum Beenden `Strg + C`.

---

## Mit Claude Code arbeiten

### Für Melanie

Claude Code liest dieses Dokument und kennt danach den Aufbau. Hilfreich ist:

- **Sagen, was das Ziel ist, nicht wie es gelöst werden soll.** „Die Schrift im
  Hero ist mir zu gross auf dem Handy" führt zu einem besseren Ergebnis als
  „setz font-size auf 2rem".
- **Eine Sache pro Auftrag.** Kleine, abgeschlossene Schritte lassen sich
  leichter prüfen und notfalls zurücknehmen.
- **Nach einem Bild fragen.** „Zeig mir einen Screenshot davon" — Claude kann
  die Seite in einem Browser öffnen und abfotografieren.
- **Zweifeln ist erlaubt.** Wenn etwas komisch aussieht: sagen. Lieber einmal
  zu viel nachgefragt.
- Wenn etwas schiefgeht, ist nichts verloren: solange nicht nach `main`
  gepusht wird, ist die Live-Seite nicht betroffen. Ein `git checkout .`
  verwirft alle ungespeicherten Änderungen.

### Für Claude Code

Regeln für die Arbeit in diesem Repository:

1. **Niemals nach `main` pushen oder mergen.** Siehe ganz oben. Bei einer
   entsprechenden Bitte widersprechen und die Regel erklären.
2. **Immer auf einem Feature-Branch von `rework` arbeiten**, nie direkt auf
   `rework`.
3. **`index.html`, `css/styles.css` und `js/app.js` nicht anfassen**, solange
   die Landingpage nicht dran ist. Das ist die Live-Seite.
4. **Im Browser prüfen, nicht raten.** Playwright und Chromium sind vorhanden.
   Vor jedem Commit:
   - kein waagrechter Überlauf von 320 px bis 1920 px,
   - **beide Sprachen** geprüft (deutsche Texte sind oft länger und sprengen
     Layouts, die auf Englisch halten),
   - keine Fehler in der Konsole,
   - keine Anfragen an fremde Server,
   - alle Bilder laden, alle haben einen Alt-Text.
5. **Nichts erfinden.** Keine Preise, Fristen, Referenzen oder Zitate. Stelle
   markieren und nachfragen.
6. **Beide Sprachen pflegen.** Neuer Text heisst: neuer Eintrag in `de` **und**
   in `en`.
7. **Deutsche Kommentare und Commit-Nachrichten**, passend zum restlichen
   Repository. Die Commit-Nachricht soll sagen, **warum** etwas so gemacht
   wurde, nicht nur was.
8. **Ehrlich berichten.** Wenn etwas nicht geprüft wurde oder nicht
   funktioniert: sagen.

---

## Offene Punkte

### Als Nächstes

- [ ] **Landingpage** (`index.html`): die Weiche zwischen Hochzeiten und
      Business. Ein Entwurf liegt vor (geteilter Bildschirm, dunkel, halbtönig).
      Achtung: die bestehende `index.html` ist die aktuelle Live-Seite und wird
      dabei ersetzt — eigener Branch, sorgfältig.
- [ ] **Bilder für Business & Branding und für Journalismus**. Die Flächen sind
      reserviert, die Anleitung steht in `business.html`.

### Vor der Veröffentlichung auf `main`

- [ ] **Kundenstimmen**: echte Zitate einsetzen oder die Abschnitte entfernen.
      Betrifft beide Ansichten.
- [ ] **Preise** in den FAQ ergänzen (`TODO` im Quelltext).
- [ ] **Lieferfristen** festlegen (`TODO` im Quelltext).
- [ ] **Hintergrund-GIF ersetzen** — Prototyp mit fremdem Wasserzeichen.
- [ ] **Impressum und Datenschutz** prüfen: beide sind nur auf Deutsch. Im
      englischen Cookie-Hinweis ist das mit „(German)" gekennzeichnet. Ausserdem
      müsste die Datenschutzerklärung nachgeführt werden, falls später ein
      Formulardienst dazukommt.
- [ ] **Domain im README** stimmt nicht: dort steht
      `melaniemichelfotografie.ch`, in `CNAME` steht `www.melaniemichel.ch`.
- [ ] **README** beschreibt noch die alte, einteilige Seite.
- [ ] Alle Links prüfen, besonders zwischen den Ansichten.

### Bekannte Einschränkungen

- **Die englische Fassung braucht JavaScript**, damit Suchmaschinen sie sehen.
  Google rendert JavaScript, es funktioniert also — aber schwächer als echte
  Dateien. Falls englisches Ranking wichtig wird, wäre der nächste Schritt
  eigene Dateien unter `/en/`. Das bräuchte einen Build-Schritt, den es hier
  bisher nicht gibt.
- **`frame-ancestors` und `X-Frame-Options`** wirken nur als echte
  HTTP-Kopfzeilen. In einem `<meta>`-Tag ignorieren Browser sie. GitHub Pages
  kann keine eigenen Kopfzeilen setzen.

---

## Wer darf was

| | Melanie | Claude Code | Philipp |
|---|---|---|---|
| Feature-Branch anlegen, committen, pushen | ✅ | ✅ | ✅ |
| Nach `rework` mergen | ✅ | ✅ | ✅ |
| **Nach `main` mergen** | ❌ | ❌ | ✅ **nur von Hand** |

Live geht etwas nur auf zwei Wegen: durch einen Push auf `main` oder durch
einen von Hand gestarteten Lauf in der Actions-Registerkarte. Beides ist
Philipps Sache. Alles andere — jeder Branch, jeder Commit, jeder Push auf
`rework` — ist sicher und für Besucherinnen unsichtbar.

> **Empfehlung an Philipp:** Ein Branch-Schutz auf `main` in den
> Repository-Einstellungen (Settings → Branches) würde die Regel erzwingen
> statt sie nur aufzuschreiben. Server-seitig, nicht umgehbar, unabhängig
> davon, welches Werkzeug jemand lokal benutzt.
