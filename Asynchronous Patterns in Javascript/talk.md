# Asynchronous Patterns in JavaScript

<img src="images/slido.svg" style="float: right; height: 400px">
**Finastra Digital Front-end Community Meetup #1, 2017-12-04**

*Andras Sevcsik <br> <andras.sevcsik@finastra.com> <br> Senior Software Engineer*

Questions: https://sli.do #5547


---

## Why Async?

.center[<img src="images/event-loop.jpg" height="200">]

- JavaScript is predominantly has single-threaded implementations
- The browser runs the UI thread in the same thread as the scripts
- The browser manages virtually every I/O operation in the background (non-blocking I/O)
- 👍 Less performance overhead, most performance-critical tasks are offloaded to the runtime, handled by native code
- 👍 We don't have to worry about thread-safety
- 👎 Requires a different way of thinking

*Image courtesy of [softwareengineeringdaily.com][event-loop-image-src]*


---

## The Traditional Way with Blocking I/O

```js
import request from 'sync-request'

let content
try {
	content = request('GET', 'filename')
	consume(content)
} catch (e) {
	handleError(e)
}

function consume(content) { [...] }
function handleError(error) { [...] }
```
---
## The Beginning: Events

```js
const xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = () => {
	if (xhttp.readyState == 4)
		if (xhttp.status > 200) consume(this.responseText)
		else handleError(this.responseText)
}
xhttp.open("GET", "filename", true)
xhttp.send()
```
👎 No standard way to handle async - each event emitter has their own set of events

👎 Callback hell

---
## Continuation-passing Style <br> (aka. Node.js style)

```js
import request from 'request'

request.get('filename', (error, response, body) => {
	if (error) handleError(error)
	else consume(body)
})
```
👍 De facto standard pattern, so libraries like [async](https://github.com/caolan/async) or [q](https://github.com/kriskowal/) can build on it

👍 A tangible use case of higher-order functions

👎 Errors have to be handled in each callback

👎 Still a callback hell without libraries

---
## Promises
```js
fetch('filename').then( ({ body }) => consume(body)
                      , handleError
                      )
```
👍 Standard: Promises/A+, later included in ES6

👍 A tangible use case of monads

👍 Natively supported by browsers (except IE, but can be polyfilled)


---
## Composing Promises

```js
Promise.all([fetch('resource1'), fetch('resource2')])
	.then(([ response1, response2 ]) =>
		fetch(`resource3?a=${response1.body.a}`
		             + `&b=${response2.body.b}`))
	.then(response => consume(response.body), handleError)
```
👍 Can be composed (solves the callback hell problem)

👍 Exception-like error handling

---
## Composing Promises

```js
Promise.all([ fetch('resource1').then(null, () => 'fallback1')
            , fetch('resource2').then(null, () => 'fallback2')
            ])
	.then(([ response1, response2 ]) =>
		fetch(`resource3?a=${response1.body.a}`
		             + `&b=${response2.body.b}`))
	.then(response => consume(response.body), handleError)
```

---
## Reusing Promises

```js
import delay from 'timeout-as-promise'

const resourceP = fetch('resource').catch( ({ body }) => body
                                         , () => 'fallback')

resourceP.then(value => console.log(`The value is ${value}`))
resourceP.then(value => console.log(`The value is still ${value}`))

delay(5000).then(() => resourceP)
           .then(value => console.log(`Yep, still ${value}`))
```

- `fetch` will be invoked only once
- The callbacks are called instantly if the promise is already resolved

** Promises provide an abstraction over sync and async. **

---

## Coroutines (Generators)

```js
function *co() {
	let resource1, resource2
	try {
		resource1 = (yield fetch('resource1')).body.content
		resource2 = (yield fetch('resource2')).body.content
	} catch (error) { resource1 = resource2 = 1 }

	return resource1 + resource2;
}

function execute(coroutine) {
	const it = coroutine();
	const iterate = ({ value: result }) =>
		result instanceof Promise
			? result.then( resolved => iterate(it.next(resolved))
						 , error => iterate(it.throw(error)))
			: result
	return iterate(it.next());
}

execute(co).then(consume, handleError)
```

---

## Coroutines (Generators)

👍 Almost the same as if using blocking I/O

👍 Uses real exception handling language elements

👍 It's trivial to compose Promises sequentially, and other combinators like `all` or `race` are still available

👍 Generator functions are included in ES6 (available everywhere except IE)

👎 The actual implementation of `execute` has to be provided (e.g. `koa.js`)

---

## Async Functions

```js
async function do() {
	let resource1, resource2

	try {
		resource1 = (await fetch('resource1')).body.content
		resource2 = (await fetch('resource2')).body.content
	} catch (error) {
		resource1 = resource2 = 1
	}

	return resource1 + resource2;
}

do().then(consume, handleError)
```

👍 Works like generators, but with a grammar specialised for Promise return values

👍 Standardised in ES7, no library needed

---

## Reactive Extensions for JavaScript (RxJS)

```js
import { Rx } from 'rxjs/Rx'
import { RxHttpRequest } from '@akanass/rx-http-request'

Rx.Observable.merge([ RxHttpRequest.get('resource1')
                    , RxHttpRequest.get('resource2')
                    ])
	.pluck('body', 'content')
	.catch(() => Rx.Observable.from([1, 1]))
	.reduce((acc, value) => acc + value)
	.subscribe(consume, handleError)
```

👍 Compatible with promises (can be converted back and forth)

👍 Functional operators over async values

👍 Lazy (the whole chain is only executed if there is at least one subscriber)

---

## Streaming with RxJS

```js
const counter$ = Rx.Observable.interval(500).take(10)

counter$
	.subscribe( count => console.log(`Count: ${count}`)
	          , null
	          , () => console.log('Finished counting up'))

counter$
	.map(count => 10 - count)
	.subscribe( remaining => console.log(`Countdown: ${remaining}`)
	          , null
	          , () => console.log('Finished counting down'))
```

---

## Streaming with RxJS

👍 Abstracts the difference between a single value and multiple values

👍 Fulfills use cases of events and asynchronous calls

👍 Utility functions to create Observables from WebSocket, DOM Events, timers, etc.

👍 Supports common streaming operations, such as throttling, sampling

👍 **Paradigm shift: functional reactive programming**

---

## Summary

Events, callbacks < cromises < coroutines, async functions < RxJS

Questions: https://sli.do #5547

.center[<img src="images/slido.svg" style="height: 400px">]

[event-loop-image-src]: https://softwareengineeringdaily.com/2015/07/15/nodejs-and-the-distinction-between-microservices-and-soa/
[koa]: http://koajs.com/
