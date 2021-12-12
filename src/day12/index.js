import { lines } from "../utils.js";

/**
 * @param {string} input
 */
function parseInput(input) {
  /** @type {Record<string, Set<string>>} */
  const adjecentNodes = {};

  for (const line of lines(input)) {
    const [a, b] = line.trim().split("-", 2);
    (adjecentNodes[a] ??= new Set()).add(b);
    (adjecentNodes[b] ??= new Set()).add(a);
  }

  const nodeMasks = Object.fromEntries(
    Object.keys(adjecentNodes).map((node, index) => [node, 1 << index]),
  );

  const START_NODE = "start";
  const END_NODE = "end";

  return {
    startNode: nodeMasks[START_NODE],
    endNode: nodeMasks[END_NODE],
    upperCaseNodes: Object.keys(nodeMasks).reduce(
      (mask, node) =>
        node === node.toUpperCase() ? mask | nodeMasks[node] : mask,
      0,
    ),
    adjecentNodes: Object.fromEntries(
      Object.keys(nodeMasks)
        .filter(node => node !== END_NODE)
        .map(node => [
          nodeMasks[node],
          Array.from(adjecentNodes[node])
            .filter(node => node !== START_NODE)
            .map(adjecentNode => nodeMasks[adjecentNode]),
        ]),
    ),
  };
}

/**
 * @param {string} input
 */
export function part1(input) {
  const { startNode, endNode, upperCaseNodes, adjecentNodes } =
    parseInput(input);

  let count = 0;

  (function visit(node, visitedNodes) {
    if (node === endNode) {
      count += 1;
    } else {
      for (const nextNode of adjecentNodes[node]) {
        if (
          (upperCaseNodes & nextNode) !== 0 ||
          (visitedNodes & nextNode) === 0
        ) {
          visit(nextNode, visitedNodes | nextNode);
        }
      }
    }
  })(startNode, 0);

  return count;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const { startNode, endNode, upperCaseNodes, adjecentNodes } =
    parseInput(input);

  let count = 0;

  (function visit(node, visitedNodes, hasVisitedNodeTwice) {
    if (node === endNode) {
      count += 1;
    } else {
      for (const nextNode of adjecentNodes[node]) {
        if (
          (upperCaseNodes & nextNode) !== 0 ||
          (visitedNodes & nextNode) === 0
        ) {
          visit(nextNode, visitedNodes | nextNode, hasVisitedNodeTwice);
        } else if (!hasVisitedNodeTwice) {
          visit(nextNode, visitedNodes | nextNode, true);
        }
      }
    }
  })(startNode, 0, false);

  return count;
}
