export function filterDirections(directions, category) {
  return category === "all" ? directions : directions.filter((item) => item.category === category);
}

export function calculateQuizResult(questions, answers) {
  const totals = {};
  answers.forEach((optionIndex, questionIndex) => {
    const option = questions[questionIndex]?.options[optionIndex];
    if (!option) return;
    Object.entries(option.scores).forEach(([id, value]) => {
      totals[id] = (totals[id] ?? 0) + value;
    });
  });
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([id, score]) => ({ id, score }));
}

export function getDirection(directions, id) {
  return directions.find((item) => item.id === id) ?? directions[0];
}
