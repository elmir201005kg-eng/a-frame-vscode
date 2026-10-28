// Syntax transforms cannot provide APIs missing in Safari 15.4. Install these
// before hydration and before loading the Radix collection used by our selects.
if (typeof Array.prototype.toSorted !== "function") {
  Object.defineProperty(Array.prototype, "toSorted", {
    configurable: true,
    writable: true,
    value: function<T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
      return Array.from(this).sort(compareFn);
    },
  });
}

if (!("size" in URLSearchParams.prototype)) {
  Object.defineProperty(URLSearchParams.prototype, "size", {
    configurable: true,
    get(this: URLSearchParams) {
      let count = 0;
      this.forEach(() => { count++; });
      return count;
    },
  });
}
