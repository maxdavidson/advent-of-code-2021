import { expect, test } from "@jest/globals";
import Heap from "./Heap.js";

test("insert", () => {
  const heap = new Heap();

  heap.add(10);
  expect(heap.nodes).toEqual([10]);

  heap.add(23);
  expect(heap.nodes).toEqual([10, 23]);

  heap.add(36);
  expect(heap.nodes).toEqual([10, 23, 36]);

  heap.add(18);
  expect(heap.nodes).toEqual([10, 18, 36, 23]);
});

test("remove", () => {
  const heap = Heap.from([10, 23, 36, 32, 38, 45, 57]);

  expect(heap.nodes).toEqual([10, 23, 36, 32, 38, 45, 57]);

  expect(heap.pop()).toBe(10);
  expect(heap.nodes).toEqual([23, 32, 36, 57, 38, 45]);
});
