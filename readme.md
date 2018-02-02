# callbag-from

Convert a Promise, Event, Observable, or Iterable to a callbag listenable source. This simple wraps existing convertion utilities and autodetects which one to use.

`npm install callbag-from`

## examples

Convert an Event (https://github.com/staltz/callbag-from-event)

```js
const fromEvent = require('callbag-from-event');
const observe = require('callbag-observe');

const source = fromEvent(document.body, 'click');

observe(x => console.log(x)(source); // MouseEvent ...
                                     // MouseEvent ...
```

Convert a Promise (https://github.com/staltz/callbag-from-promise)

```js
const fromPromise = require('callbag-from-promise');
const observe = require('callbag-observe');

const source = fromPromise(
  fetch('http://jsonplaceholder.typicode.com/users/1')
    .then(res => res.json())
);

observe(user => console.log(user.name))(source); // Leanne Graham
```

Convert an Observable (https://github.com/staltz/callbag-from-obs)

```js
const Rx = require('rxjs');
const fromObs = require('callbag-from-obs');
const observe = require('callbag-observe');

const source = fromObs(Rx.Observable.interval(1000).take(4));

observe(x => console.log(x)(source); // 0
                                     // 1
                                     // 2
                                     // 3
```

Convert an Iterable (https://github.com/staltz/callbag-from-iter)

```js
const fromIter = require('callbag-from-iter');
const iterate = require('callbag-iterate');

const source = fromIter([10, 20, 30, 40]);

source(0, iterate(x => console.log(x)); // 10
                                        // 20
                                        // 30
                                        // 40
```
