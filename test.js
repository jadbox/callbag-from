const test = require('tape');
const from = require('./index');

// Promises
test('it converts a resolved promise and observes it', t => {
    t.plan(8);
    const source = from(Promise.resolve(42));

    const downwardsExpectedTypes = [
        [0, 'function'],
        [1, 'number'],
        [2, 'undefined'],
    ];
    const downwardsExpected = [42];

    let talkback;
    source(0, function observe(type, data) {
        const et = downwardsExpectedTypes.shift();
        t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
        t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

        if (type === 0) {
            talkback = data;
            return;
        }
        if (type === 1) {
            const e = downwardsExpected.shift();
            t.deepEquals(data, e, 'downwards data is expected: ' + e);
        }
    });

    setTimeout(() => {
        t.pass('nothing else happens');
        t.end();
    }, 400);
});

test('it converts a resolved promise and iterates it', t => {
    t.plan(8);
    const source = from(Promise.resolve(42));

    const downwardsExpectedTypes = [
        [0, 'function'],
        [1, 'number'],
        [2, 'undefined'],
    ];
    const downwardsExpected = [42];

    let talkback;
    source(0, function iterate(type, data) {
        const et = downwardsExpectedTypes.shift();
        t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
        t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

        if (type === 0) {
            talkback = data;
            return;
        }
        if (type === 1) {
            const e = downwardsExpected.shift();
            t.deepEquals(data, e, 'downwards data is expected: ' + e);
            talkback(1);
        }
    });

    setTimeout(() => {
        t.pass('nothing else happens');
        t.end();
    }, 400);
});

// Observable

test('it converts a sync finite subscribable', (t) => {
    t.plan(14);
    const source = from({
        subscribe: (observer) => {
            for (let i = 0; i < 3; i++) {
                observer.next(i);
            }
            observer.complete();
        }
    });

    const downwardsExpectedTypes = [
        [0, 'function'],
        [1, 'number'],
        [1, 'number'],
        [1, 'number'],
        [2, 'undefined']
    ];

    const downwardsExpected = [0, 1, 2];

    let talkback;
    source(0, function observe(type, data) {
        const et = downwardsExpectedTypes.shift();
        t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
        t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

        if (type === 0) {
            talkback = data;
            return;
        }
        if (type === 1) {
            const e = downwardsExpected.shift();
            t.deepEquals(data, e, 'downwards data is expected: ' + e);
        }
    });

    setTimeout(() => {
        t.equals(downwardsExpectedTypes.length, 0, 'everything expected happened');
        t.end();
    }, 100);
});

// Event

test('it converts from (fake) DOM node events', (t) => {
    t.plan(14);
    const elem = {
        added: false,
        id: null,

        addEventListener: (name, listener) => {
            t.equals(name, 'click', 'addEventListener for click');
            this.added = true;
            let i = 0;
            this.id = setInterval(() => listener((++i) * 10));
        },

        removeEventListener: (name, listener) => {
            t.equals(name, 'click', 'removeEventListener for click');
            this.added = false;
            clearInterval(this.id);
        }
    }

    const source = from(elem, 'click');

    const downwardsExpectedType = [
        [0, 'function'],
        [1, 'number'],
        [1, 'number'],
        [1, 'number']
    ];

    const downwardsExpected = [10, 20, 30];

    function makeSink(type, data) {
        let talkback;
        return (type, data) => {
            const et = downwardsExpectedType.shift();
            t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
            t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
            if (type === 0) {
                talkback = data;
            }
            if (type === 1) {
                const e = downwardsExpected.shift();
                t.equals(data, e, 'downwards data is expected: ' + e);
            }
            if (downwardsExpected.length === 0) {
                talkback(2);
            }
        };
    }

    const sink = makeSink();
    source(0, sink);

    setTimeout(() => {
        t.pass('nothing else happens after dispose()');
        t.end();
    }, 700);
});

// Iterable

test('it sends array items (iterable) to a puller sink', t => {
    t.plan(13);
    const source = from([10, 20, 30]);

    const downwardsExpectedTypes = [
        [0, 'function'],
        [1, 'number'],
        [1, 'number'],
        [1, 'number'],
        [2, 'undefined'],
    ];
    const downwardsExpected = [10, 20, 30];

    let talkback;
    source(0, (type, data) => {
        const et = downwardsExpectedTypes.shift();
        t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
        t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

        if (type === 0) {
            talkback = data;
            talkback(1);
            return;
        }
        if (type === 1) {
            const e = downwardsExpected.shift();
            t.equals(data, e, 'downwards data is expected: ' + e);
            talkback(1);
        }
    });
});