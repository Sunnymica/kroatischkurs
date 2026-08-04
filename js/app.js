const lessons = [
  {
    id: 1,
    title: "Begegnung auf der Straße",
    subtitle: "Begrüßen, Wetter, Spaziergang",
    duration: "15–20 Min.",
    status: "ready"
  },
  {
    id: 2,
    title: "Vor dem Haus und im Garten",
    subtitle: "Pflanzen, Gießen, kurze Nachbarschaftsgespräche",
    duration: "15–20 Min.",
    status: "soon"
  },
  {
    id: 3,
    title: "Im Supermarkt",
    subtitle: "Bezahlen, reagieren, freundlich verabschieden",
    duration: "15–20 Min.",
    status: "soon"
  }
];

const completed = JSON.parse(localStorage.getItem("kpk_completed") || "[]");
const grid = document.getElementById("lessonGrid");

grid.innerHTML = lessons.map(lesson => {
  const isDone = completed.includes(lesson.id);
  const isReady = lesson.status === "ready";
  return `
    <article class="lesson-card card ${isReady ? "" : "lesson-card--locked"}">
      <span class="lesson-card__number">Lektion ${lesson.id}</span>
      <h3>${lesson.title}</h3>
      <p>${lesson.subtitle}</p>
      <div class="lesson-card__meta">
        <span class="pill">${lesson.duration}</span>
        <span class="pill">${isDone ? "✓ abgeschlossen" : isReady ? "bereit" : "in Vorbereitung"}</span>
      </div>
      ${isReady
        ? `<a class="button ${isDone ? "button--secondary" : "button--primary"}" href="lesson.html?id=${lesson.id}">
             ${isDone ? "Noch einmal" : "Lektion beginnen"}
           </a>`
        : `<span class="button button--ghost" aria-disabled="true">Demnächst</span>`}
    </article>`;
}).join("");

document.getElementById("courseProgressText").textContent = `${completed.length} von ${lessons.length} Lektionen`;
document.getElementById("courseProgressBar").style.width = `${(completed.length / lessons.length) * 100}%`;
