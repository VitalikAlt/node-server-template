class Queue {
    constructor() {
        this.queue = [];
    }

    push(el) {
        return this.queue.push(el);
    }

    pop() {
        return this.queue.pop();
    }

    shift() {
        return this.queue.shift();
    }

    unshift(el) {
        return this.queue.unshift(el);
    }

    get length() {
        return this.queue.length;
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = Queue;