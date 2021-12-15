/** @template T */
export default class Heap {
  /** @readonly @type {T[]} */
  #heap = [];

  /**
   * @template T
   * @param {Iterable<T>} nodes
   * @returns {Heap<T>}
   */
  static from(nodes) {
    /** @type {Heap<T>} */
    const heap = new this();

    for (const node of nodes) {
      heap.add(node);
    }

    return heap;
  }

  /** @type {readonly T[]} */
  get nodes() {
    return this.#heap;
  }

  get size() {
    return this.#heap.length;
  }

  /**
   * @param {T} node
   */
  add(node) {
    this.#heap.push(node);

    if (this.#heap.length !== 1) {
      let currentIndex = this.#heap.length - 1;
      const nextIndex = Math.trunc(currentIndex / 2);

      while (
        currentIndex !== 0 &&
        this.#heap[currentIndex] < this.#heap[nextIndex]
      ) {
        const currentNode = this.#heap[currentIndex];
        this.#heap[currentIndex] = this.#heap[nextIndex];
        this.#heap[nextIndex] = currentNode;

        currentIndex = nextIndex;
      }
    }
  }

  pop() {
    if (this.#heap.length === 0) {
      return undefined;
    }

    if (this.#heap.length === 1) {
      return this.#heap.pop();
    }

    const smallest = this.#heap[0];

    this.#heap[0] = this.#heap[this.#heap.length - 1];
    this.#heap.length -= 1;

    let parentIndex = 0;

    for (;;) {
      const leftChildIndex = parentIndex * 2;
      const rightChildIndex = leftChildIndex + 1;

      if (this.#heap.length - 1 < rightChildIndex) {
        break;
      }

      const parentNode = this.#heap[parentIndex];
      const leftChildNode = this.#heap[leftChildIndex];
      const rightChildNode = this.#heap[rightChildIndex];

      if (!(leftChildNode < parentNode) && !(rightChildNode < parentNode)) {
        break;
      }

      if (leftChildNode < rightChildNode) {
        this.#heap[parentIndex] = leftChildNode;
        this.#heap[leftChildIndex] = parentNode;
        parentIndex = leftChildIndex;
      } else {
        this.#heap[parentIndex] = rightChildNode;
        this.#heap[rightChildIndex] = parentNode;
        parentIndex = rightChildIndex;
      }
    }

    return smallest;
  }

  [Symbol.iterator]() {
    return this.#heap[Symbol.iterator]();
  }
}
