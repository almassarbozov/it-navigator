import { directions, quizQuestions } from "./data.js";
import { calculateQuizResult, filterDirections, getDirection } from "./core.js";

const grid = document.querySelector("#direction-grid");
const dialog = document.querySelector("#direction-dialog");
const dialogContent = document.querySelector("#dialog-content");
const quizCard = document.querySelector("#quiz-card");
const roadmapSelect = document.querySelector("#roadmap-select");
const timeline = document.querySelector("#timeline");

function renderDirections(filter = "all") {
  const items = filterDirections(directions, filter);
  grid.innerHTML = items.map((item) => `
    <button class="direction-card" data-id="${item.id}" type="button">
      <span class="card-top"><span class="direction-icon">${item.icon}</span><span class="level">${item.level}</span></span>
      <span class="card-title">${item.title}</span>
      <span class="card-description">${item.short}</span>
      <span class="skill-list">${item.skills.slice(0, 3).map((skill) => `<span>${skill}</span>`).join("")}</span>
      <span class="card-link">Подробнее <span aria-hidden="true">↗</span></span>
    </button>`).join("");
}

function openDirection(id) {
  const item = getDirection(directions, id);
  dialogContent.innerHTML = `
    <p class="eyebrow">${item.level}</p>
    <h2 id="dialog-title">${item.icon} ${item.title}</h2>
    <p class="dialog-lead">${item.short}</p>
    <h3>Чем занимаются</h3>
    <ul>${item.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
    <h3>Базовые навыки</h3>
    <div class="skill-list">${item.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
    <div class="project-box"><strong>Попробуй:</strong> ${item.project}</div>
    <p>Может подойти, если ${item.fit}.</p>
    <button class="button primary dialog-roadmap" data-id="${item.id}" type="button">Показать план старта</button>`;
  dialog.showModal();
}

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
  renderDirections(button.dataset.filter);
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".direction-card");
  if (card) openDirection(card.dataset.id);
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
  const roadmapButton = event.target.closest(".dialog-roadmap");
  if (roadmapButton) {
    roadmapSelect.value = roadmapButton.dataset.id;
    renderRoadmap(roadmapButton.dataset.id);
    dialog.close();
    document.querySelector("#roadmap").scrollIntoView({ behavior: "smooth" });
  }
});

let quizStep = 0;
const answers = [];

function renderQuiz() {
  const question = quizQuestions[quizStep];
  quizCard.innerHTML = `
    <div class="quiz-progress"><span>Вопрос ${quizStep + 1} из ${quizQuestions.length}</span><span>${Math.round(((quizStep + 1) / quizQuestions.length) * 100)}%</span></div>
    <div class="progress-track"><span style="width:${((quizStep + 1) / quizQuestions.length) * 100}%"></span></div>
    <h3>${question.text}</h3>
    <div class="quiz-options">${question.options.map((option, index) => `<button type="button" data-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${option.label}</button>`).join("")}</div>`;
}

function renderQuizResult() {
  const ranked = calculateQuizResult(quizQuestions, answers).slice(0, 3);
  const winner = getDirection(directions, ranked[0].id);
  quizCard.innerHTML = `
    <p class="eyebrow">Твой ориентир</p>
    <div class="result-icon">${winner.icon}</div>
    <h3>${winner.title}</h3>
    <p>${winner.short}</p>
    <div class="result-list">${ranked.map((result, index) => {
      const direction = getDirection(directions, result.id);
      return `<div><span>${index + 1}. ${direction.title}</span><strong>${result.score} баллов</strong></div>`;
    }).join("")}</div>
    <div class="result-actions">
      <button class="button primary" id="result-roadmap" type="button">План для меня</button>
      <button class="button ghost" id="quiz-restart" type="button">Пройти ещё раз</button>
    </div>`;
  document.querySelector("#result-roadmap").addEventListener("click", () => {
    roadmapSelect.value = winner.id;
    renderRoadmap(winner.id);
    document.querySelector("#roadmap").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelector("#quiz-restart").addEventListener("click", () => {
    quizStep = 0;
    answers.length = 0;
    renderQuiz();
  });
}

quizCard.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option]");
  if (!option) return;
  answers[quizStep] = Number(option.dataset.option);
  quizStep += 1;
  if (quizStep < quizQuestions.length) renderQuiz();
  else renderQuizResult();
});

function renderRoadmap(id) {
  const item = getDirection(directions, id);
  timeline.innerHTML = item.weeks.map((step, index) => `
    <li><span class="week">Неделя ${index + 1}</span><div><h3>${step}</h3><p>${index === 3 ? `Результат: ${item.project}` : "Занимайся 30–60 минут в день и фиксируй вопросы."}</p></div></li>`).join("");
}

roadmapSelect.innerHTML = directions.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
roadmapSelect.addEventListener("change", () => renderRoadmap(roadmapSelect.value));

renderDirections();
renderQuiz();
renderRoadmap(directions[0].id);
