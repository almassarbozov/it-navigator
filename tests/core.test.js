import test from "node:test";
import assert from "node:assert/strict";
import { calculateQuizResult, filterDirections, getDirection } from "../src/core.js";

const sample = [
  { id: "front", category: "build" },
  { id: "data", category: "analyze" }
];

test("filterDirections возвращает все элементы", () => {
  assert.equal(filterDirections(sample, "all").length, 2);
});

test("filterDirections фильтрует по категории", () => {
  assert.deepEqual(filterDirections(sample, "build"), [sample[0]]);
});

test("calculateQuizResult суммирует и сортирует баллы", () => {
  const questions = [
    { options: [{ scores: { front: 2, data: 1 } }] },
    { options: [{ scores: { data: 3 } }] }
  ];
  assert.deepEqual(calculateQuizResult(questions, [0, 0]), [
    { id: "data", score: 4 },
    { id: "front", score: 2 }
  ]);
});

test("getDirection использует первый элемент как запасной", () => {
  assert.equal(getDirection(sample, "unknown").id, "front");
});
