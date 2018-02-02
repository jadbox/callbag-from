const fromPromise = require('callbag-from-promise');
const fromObs = require('callbag-from-obs');
const fromEvent = require('callbag-from-event');
const fromIter = require('callbag-from-iter');


const fromAny = (source, name) => {
    if (source.then) return fromPromise(source);
    else if (source.subscribe) return fromObs(source);
    else if (source.addEventListener) return fromEvent(source, name);
    else if (source != null && Symbol !== 'undefined' && typeof source[Symbol.iterator] === 'function') return fromIter(source);
    else throw new Error('cannot match object type: supported objests are Promises, Observables, Events, Iterables');
};

module.exports = fromAny;