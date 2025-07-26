export default class Ship {
  constructor(length) {
    this.length = length;
    this.hitParts = [];
  }

  hit(x, y) {
    const alreadyHit = this.hitParts.some(
      ([hitX, hitY]) => hitX === +x && hitY === +y
    );
    if (!alreadyHit && this.hitParts.length < this.length) {
      this.hitParts.push([+x, +y]);
      return true;
    }

    return false;
  }

  isSunk() {
    return this.hitParts.length === this.length;
  }
}
