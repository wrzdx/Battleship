export default class Ship {
    constructor(length) {
        this.length = length;
        this.hitCount = 0;
    }

    hit() {
        if (this.hitCount < this.length) {
            this.hitCount++;
        }
    }

    isSunk() {
        return this.hitCount >= this.length;
    }
}