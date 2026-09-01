# Interactive Vocabulary — *Plural: Português pluricêntrico*

Interactive vocabulary practice for Units 1–15 of *Plural: Português pluricêntrico*.

This static web app was created for vocabulary review and pronunciation practice and is designed to run on GitHub Pages or inside an LMS through links or embeds.

**Flashcard page created by Ellen Nagasawa**  
Website: https://ellennagasawa.github.io

Selected and adapted content is based on *Plural: Português pluricêntrico* and has been reorganized for interactive vocabulary practice.

Book:
https://escholarship.org/uc/item/9zs4s2p8

Live vocabulary app:
https://ellennagasawa.github.io/fast-portuguese-vocabulary/

---

## Features

- Interactive flashcards for Units 1–15
- Portuguese → English and English → Portuguese directions
- Unit selector
- Category selector
- Card navigation and shuffle
- Progress tracking
- “Já sei” and “Praticar novamente” self-check options
- Progress saved locally in the browser
- Direct links to individual units with the `?unit=` parameter
- Pronunciation support with the browser's `SpeechSynthesisUtterance` API
- Portuguese voice selector when compatible voices are available
- Responsive layout for desktop and mobile devices
- Static architecture suitable for GitHub Pages

---

## Repository structure

```text
fast-portuguese-vocabulary/
├── index.html
├── app.js
├── styles.css
├── README.md
├── canvas-embeds.txt
└── data/
    ├── unit1.js
    ├── unit2.js
    ├── unit3.js
    ├── unit4.js
    ├── unit5.js
    ├── unit6.js
    ├── unit7.js
    ├── unit8.js
    ├── unit9.js
    ├── unit10.js
    ├── unit11.js
    ├── unit12.js
    ├── unit13.js
    ├── unit14.js
    └── unit15.js
```

Each `unitN.js` file contains the permanent dataset for that unit.

The main application files are:

- `index.html` — page structure and interface
- `styles.css` — visual design and responsive layout
- `app.js` — flashcard behavior, filtering, progress, URL state, and pronunciation
- `data/unitN.js` — vocabulary content for each unit

---

## Direct links to units

The app reads the `unit` query parameter from the URL.

Main page:

```text
https://ellennagasawa.github.io/fast-portuguese-vocabulary/
```

Examples:

```text
https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=1
https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=2
https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=3
...
https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=15
```

A direct unit link opens that unit automatically, but the unit selector remains available so users can move between units.

This is useful for linking a specific unit from Canvas or another LMS.

---

## Pronunciation

The flashcards include a **🔊 Ouvir em português** button.

Pronunciation is generated in the user's browser through the Web Speech API, using `SpeechSynthesisUtterance`.

The app searches for voices identified as Portuguese and gives preference to `pt-BR` when available. Users can select another available Portuguese voice through the voice selector.

No audio files are stored in this repository for this feature.

### Important limitations

Speech synthesis is intended as pronunciation support, not as a definitive phonetic model.

The voice and pronunciation may vary depending on:

- browser;
- operating system;
- device;
- installed speech voices;
- language and voice implementation provided by the platform.

As a result:

- pronunciation quality and naturalness may vary;
- different users may hear different voices;
- some words or expressions may be pronounced imperfectly;
- the synthesized voice does not represent all varieties of Portuguese.

Students should use the audio as an additional practice resource and compare it with the authentic voices, recordings, and materials used in the course.

---

## Progress tracking

The app uses the browser's `localStorage` to save self-check progress.

The following actions are stored locally:

- **Já sei**
- **Praticar novamente**

Important characteristics:

- no login is required;
- progress is not sent to GitHub;
- progress remains on the student's current browser/device;
- clearing browser storage may erase saved progress;
- changing units does not erase progress from other units.

This feature is intended for informal self-monitoring rather than grading.

---

## Dataset format

Each unit dataset is stored in its corresponding JavaScript file inside `data/`.

A typical entry contains fields such as:

```js
{
  pt: "Olá!",
  en: "Hello!",
  category: "Saudações",
  example: "Olá! Como vai?",
  note: ""
}
```

The exact fields may vary according to the needs of the unit.

The pronunciation feature reads the Portuguese text directly from the `pt` field, so no separate audio field is required.

---

## Adding or editing vocabulary

To edit a unit:

1. Open the corresponding file in `data/`.
2. Add, remove, or revise entries while preserving the JavaScript structure.
3. Commit the changes to the GitHub repository.
4. Wait for GitHub Pages to publish the updated version.
5. Refresh the live site.

When adding new entries, keep Portuguese text in the `pt` field so the pronunciation button can read it correctly.

---

## Adding a new unit

The current project already contains permanent datasets for Units 1–15.

If the project is expanded beyond Unit 15, the new dataset should follow the same architecture:

```text
data/unit16.js
```

The new unit must also be registered in the application so that it appears in the selector and can be opened through:

```text
?unit=16
```

---

## GitHub Pages

The site is published through GitHub Pages.

Current live address:

https://ellennagasawa.github.io/fast-portuguese-vocabulary/

After changes are committed to the publishing branch, GitHub Pages may take a short time to update.

If the live page still shows an older version after a successful commit, a hard refresh may help:

- macOS: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

---

## Canvas and LMS use

The vocabulary app can be linked directly from Canvas using the main page or a unit-specific URL.

Example:

```text
https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=2
```

Because the application is hosted independently on GitHub Pages, updates to the site automatically become available through existing Canvas links.

The file `canvas-embeds.txt` may be used to keep reusable Canvas link/embed snippets associated with the project.

---

## Browser compatibility

The core flashcard application uses standard HTML, CSS, and JavaScript.

The pronunciation feature requires browser support for:

- `speechSynthesis`
- `SpeechSynthesisUtterance`

If speech synthesis is unavailable, the vocabulary cards can still be used normally; only the pronunciation feature is affected.

Available Portuguese voices may differ significantly across browsers and operating systems.

---

## Privacy

The application does not require user accounts.

Self-check progress is stored locally in the user's browser with `localStorage`.

The speech synthesis feature is invoked through the browser's built-in Web Speech functionality. The project itself does not store recordings or pronunciation data.

---

## Content and attribution

This resource is an interactive vocabulary adaptation associated with:

*Plural: Português pluricêntrico*

Fernandes, Eugênia; de Oliveira Silva, Leonardo; Almeida, Camila; Mello, Tatiana.

The book is available at:

https://escholarship.org/uc/item/9zs4s2p8

The flashcard page was created by **Ellen Nagasawa**.

Website:

https://ellennagasawa.github.io

The vocabulary selection, organization, interface, and interactive practice format were adapted for this digital resource.

---

## Maintenance notes

When updating the project:

- keep `index.html`, `app.js`, and `styles.css` compatible with one another;
- preserve the `data/` folder and all unit datasets;
- test at least one unit-specific URL after structural changes;
- test the pronunciation button in more than one browser when modifying speech functionality;
- verify that the page still works on mobile;
- avoid replacing only one of the main application files when a change depends on coordinated updates to the interface, JavaScript, and CSS.

For major interface changes, it is safest to update `index.html`, `app.js`, and `styles.css` together.

