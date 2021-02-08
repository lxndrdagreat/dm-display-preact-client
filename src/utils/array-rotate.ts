
interface Array<T> {
  rotate(n: number): Array<T>;
}

Array.prototype.rotate = function(n) {
  return this.slice(n, this.length).concat(this.slice(0, n));
}
