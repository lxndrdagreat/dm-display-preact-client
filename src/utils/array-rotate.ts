
interface Array<T> {
  rotate(n: number): Array<T>;
}

Array.prototype.rotate = function(n) {
  if (this.length > 0) {
    n = n % this.length;
  }
  return this.slice(n, this.length).concat(this.slice(0, n));
}
