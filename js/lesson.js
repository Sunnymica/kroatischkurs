const params = new URLSearchParams(location.search);
const lessonId = Number(params.get("id") || 1);
const lesson = window.KPK_LESSONS?.[lessonId] || window.KPK_LESSONS?.[1];

let phase = Number(localStorage.getItem(`kpk_lesson_${lesson.id}_phase`) || 0);
if (!lesson.phases.length) phase = 0;

const els = {
  number: document.getElementById("lessonNumber"),
  title: document.getElementById("lessonTitle"),
  eyebrow: document.getElementById("lessonEyebrow"),
  headline: document.getElementById("lessonHeadline"),
  intro: document.getElementById("lessonIntro"),
  phaseLabel: document.getElementById("phaseLabel"),
  progress: document.getElementById("lessonProgressBar"),
  nav: document.getElementById("phaseNav"),
  content: document.getElementById("lessonContent"),
  toast: document.getElementById("toast")
};

document.title = `${lesson.title} – Korak po korak`;
els.number.textContent = `Lektion ${lesson.id}`;
els.title.textContent = lesson.title;
els.eyebrow.textContent = lesson.eyebrow;
els.headline.textContent = lesson.headline;
els.intro.textContent = lesson.intro;

document.getElementById("resetLesson").addEventListener("click", () => {
  localStorage.removeItem(`kpk_lesson_${lesson.id}_phase`);
  phase = 0;
  render();
  showToast("Lektion neu gestartet");
});

function speak(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Sprachausgabe wird von diesem Browser nicht unterstützt.");
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hr-HR";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function savePhase() {
  localStorage.setItem(`kpk_lesson_${lesson.id}_phase`, String(phase));
}

function goTo(next) {
  phase = Math.max(0, Math.min(next, lesson.phases.length - 1));
  savePhase();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function completeLesson() {
  const completed = JSON.parse(localStorage.getItem("kpk_completed") || "[]");
  if (!completed.includes(lesson.id)) {
    completed.push(lesson.id);
    localStorage.setItem("kpk_completed", JSON.stringify(completed));
  }
  showToast("Lektion abgeschlossen 🎉");
}

function renderNav() {
  els.nav.innerHTML = lesson.phases.map((p, i) => `
    <button class="phase-button ${i === phase ? "active" : ""} ${i < phase ? "done" : ""}"
      type="button" data-phase="${i}">
      ${i + 1}. ${p.label}
    </button>`).join("");

  els.nav.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.phase)));
  });
}

function navButtons(isLast = false) {
  return `
    <div class="actions">
      <button class="button button--ghost" type="button" id="prevPhase" ${phase === 0 ? "disabled" : ""}>← Zurück</button>
      <button class="button button--primary" type="button" id="nextPhase">
        ${isLast ? "Lektion abschließen" : "Weiter"}
      </button>
    </div>`;
}

function attachNav(isLast = false) {
  document.getElementById("prevPhase")?.addEventListener("click", () => goTo(phase - 1));
  document.getElementById("nextPhase")?.addEventListener("click", () => {
    if (isLast) {
      completeLesson();
      location.href = "index.html";
    } else {
      goTo(phase + 1);
    }
  });
}

function renderDialogue(p) {
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div class="dialogue">
        ${p.dialogue.map(line => `
          <div class="bubble">
            <span class="bubble__speaker">${line.speaker}</span>
            <span class="bubble__hr">${line.hr}</span>
            <span class="bubble__de">${line.de}</span>
            <button class="speak-button" type="button" data-speak="${line.hr.replaceAll('"', '&quot;')}">▶ Anhören</button>
          </div>`).join("")}
      </div>
      ${navButtons()}
    </article>`;
  els.content.querySelectorAll("[data-speak]").forEach(btn =>
    btn.addEventListener("click", () => speak(btn.dataset.speak))
  );
  attachNav();
}

function renderVocabulary(p) {
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div class="vocab-grid">
        ${p.words.map(w => `
          <div class="vocab-card">
            <strong>${w.hr}</strong>
            <span>${w.de}</span>
            <p>„${w.example}“</p>
            <button class="speak-button" type="button" data-speak="${w.hr}">▶ Anhören</button>
          </div>`).join("")}
      </div>
      ${navButtons()}
    </article>`;
  els.content.querySelectorAll("[data-speak]").forEach(btn =>
    btn.addEventListener("click", () => speak(btn.dataset.speak))
  );
  attachNav();
}

function renderPatterns(p) {
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div class="pattern-list">
        ${p.patterns.map(x => `
          <div class="pattern">
            <strong>${x.hr}</strong><br>
            <span>${x.de}</span>
            <button class="speak-button" type="button" data-speak="${x.hr}">▶ Anhören</button>
          </div>`).join("")}
      </div>
      <div class="tip">💡 ${p.tip}</div>
      ${navButtons()}
    </article>`;
  els.content.querySelectorAll("[data-speak]").forEach(btn =>
    btn.addEventListener("click", () => speak(btn.dataset.speak))
  );
  attachNav();
}

function renderQuiz(p) {
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div class="response-card"><strong>${p.question}</strong></div>
      <div class="choice-list">
        ${p.choices.map((c, i) => `<button class="choice" type="button" data-choice="${i}">${c}</button>`).join("")}
      </div>
      <div id="quizFeedback" class="tip" hidden></div>
      ${navButtons()}
    </article>`;

  els.content.querySelectorAll("[data-choice]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.choice);
      els.content.querySelectorAll("[data-choice]").forEach(b => b.disabled = true);
      btn.classList.add(i === p.answer ? "correct" : "wrong");
      if (i !== p.answer) {
        els.content.querySelector(`[data-choice="${p.answer}"]`).classList.add("correct");
      }
      const feedback = document.getElementById("quizFeedback");
      feedback.hidden = false;
      feedback.textContent = i === p.answer ? "Richtig. Genau so reagierst du." : "Fast. Die passende Antwort ist grün markiert.";
    });
  });
  attachNav();
}

function renderBuilder(p) {
  let result = [];
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div id="builderOutput" class="sentence-builder" aria-live="polite"></div>
      <div id="builderTokens" class="sentence-builder">
        ${p.tokens.map((t, i) => `<button class="token" type="button" data-token="${i}">${t}</button>`).join("")}
      </div>
      <div class="actions">
        <button id="builderReset" class="button button--ghost" type="button">Neu</button>
        <button id="builderCheck" class="button button--secondary" type="button">Prüfen</button>
      </div>
      <div id="builderFeedback" class="tip" hidden></div>
      ${navButtons()}
    </article>`;

  const output = document.getElementById("builderOutput");
  const feedback = document.getElementById("builderFeedback");

  els.content.querySelectorAll("[data-token]").forEach(btn => {
    btn.addEventListener("click", () => {
      result.push(btn.textContent);
      btn.classList.add("used");
      btn.disabled = true;
      output.textContent = result.join(" ");
    });
  });

  document.getElementById("builderReset").addEventListener("click", () => {
    result = [];
    output.textContent = "";
    feedback.hidden = true;
    els.content.querySelectorAll("[data-token]").forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("used");
    });
  });

  document.getElementById("builderCheck").addEventListener("click", () => {
    const built = result.join(" ").replace(/\s+\./g, ".").trim();
    feedback.hidden = false;
    feedback.textContent = built === p.answer
      ? "Richtig: „I ja uživam u šetnji.“"
      : `Noch nicht ganz. Lösung: ${p.answer}`;
  });
  attachNav();
}

function renderTransfer(p) {
  els.content.innerHTML = `
    <article class="phase-card card">
      <h2>${p.title}</h2>
      <p class="lead">${p.lead}</p>
      <div class="response-card">
        <strong>${p.prompt}</strong>
        <p>Hilfe: ${p.help}</p>
        <textarea placeholder="Du kannst deine Antwort hier notieren …"></textarea>
      </div>
      <div class="actions">
        <button id="showSample" class="button button--ghost" type="button">Beispiel zeigen</button>
        <button class="button button--secondary" type="button" data-speak="${p.sample}">▶ Antwort anhören</button>
      </div>
      <div id="sampleBox" class="tip" hidden>
        <strong>${p.sample}</strong><br>${p.challenge}
      </div>
      ${navButtons(true)}
    </article>`;
  document.getElementById("showSample").addEventListener("click", () => {
    document.getElementById("sampleBox").hidden = false;
  });
  els.content.querySelector("[data-speak]").addEventListener("click", e => speak(e.currentTarget.dataset.speak));
  attachNav(true);
}

function render() {
  if (!lesson.phases.length) {
    els.phaseLabel.textContent = "In Vorbereitung";
    els.progress.style.width = "0";
    els.nav.innerHTML = "";
    els.content.innerHTML = `
      <article class="phase-card card">
        <h2>Diese Lektion ist noch nicht freigeschaltet.</h2>
        <p class="lead">Zuerst testen wir Lektion 1. Danach bauen wir diese Einheit aus.</p>
        <a class="button button--primary" href="index.html">Zur Übersicht</a>
      </article>`;
    return;
  }

  const p = lesson.phases[phase];
  els.phaseLabel.textContent = `Phase ${phase + 1} von ${lesson.phases.length}`;
  els.progress.style.width = `${((phase + 1) / lesson.phases.length) * 100}%`;
  renderNav();

  const renderers = {
    dialogue: renderDialogue,
    vocabulary: renderVocabulary,
    patterns: renderPatterns,
    quiz: renderQuiz,
    builder: renderBuilder,
    transfer: renderTransfer
  };
  renderers[p.type](p);
}

render();
