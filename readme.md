# callbag-from

Convert a Promise, Event, Observable, or Iterable to a callbag listenable source. This simply wraps existing conversion utilities and autodetects which one to use.

`npm install callbag-from`

## examples

Convert an Event (https://github.com/staltz/callbag-from-event)

```js
const from = require('callbag-from');
const observe = require('callbag-observe');

const source = from(document.body, 'click');

observe(x => console.log(x)(source); // MouseEvent ...
                                     // MouseEvent ...
```

Convert a Promise (https://github.com/staltz/callbag-from-promise)

```js
const from = require('callbag-from');
const observe = require('callbag-observe');

const source = from(
  fetch('http://jsonplaceholder.typicode.com/users/1')
    .then(res => res.json())
);

observe(user => console.log(user.name))(source); // Leanne Graham
```

Convert an Observable (https://github.com/staltz/callbag-from-obs)

```js
const Rx = require('rxjs');
const from = require('callbag-from');
const observe = require('callbag-observe');

const source = from(Rx.Observable.interval(1000).take(4));

observe(x => console.log(x)(source); // 0
                                     // 1
                                     // 2
                                     // 3
```

Convert an Iterable (https://github.com/staltz/callbag-from-iter)

```js
const from = require('callbag-from');
const iterate = require('callbag-iterate');

const source = from([10, 20, 30, 40]);

source(0, iterate(x => console.log(x)); // 10
                                        // 20
                                        // 30
                                        // 40
```
