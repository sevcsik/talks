# Reactive Programming with RxJS

**ITrend Meetup, 2017-12-13**

*Andras Sevcsik <br> <andras.sevcsik@finastra.com> <br>* 
*Senior Software Engineer <br>*
*Finastra Digital*

---

## How did we get here?

- Javascript is (mostly) single-threaded ➡️ event-based I/O
- Async I/O evolved: Continuations ➡️ Promises ➡️ Async functions
- Streaming I/O not much: still using events, perhaps pipes

---

## Examples of Streaming I/O

- Bash-likes
- Gulp
- Big data
- Excel

Streams are the fundamental building blocks of Reactive Programming (RP).

---

## Reactive Programming

- Closely related to functional programming (➡️ FRP)
- Shares the merits of FP
	- No side-effects
	- Immutability
	- No inconsistent state
	- Declarative approach

---

## Reactive Programming

Premises:
- Everything is a stream: data, user input, time, state
- All functionality can be implemented by transforming and combining these streams

Requirements:
- Reactive parts must remain purely functional (no side-effects)
- Non-reactive parts of the application should be minimised and isolated

---

## Reactive Extensions

- A toolkit for manipulating streams
- Available for numerous languages (Java, Python, .NET, etc.)
- Project started by Microsoft (an asynchronous version of LINQ)

---

## RxJS Basics

### Observable
The most basic building block of RxJS. It represents a stream. Operators, such as `map`, `pluck`, `reduce` are methods of this class, and calling them produces a new Observable.

Observables can be subscribed to with the `subscribe` method. If an Observer is "cold", it doesn't do anything until it has at least one subscription.

Usually we don't create observables directly, but use observables provided by Rx, or other libraries (e.g. RxHttpRequest).

```js
const hash$ = 
	Rx.Observable.fromEvent(window, 'hashchange')
	             .pluck('target', 'location', 'hash')
	             .subscribe(hash => console.log('hash: ', hash))
```

---

## RxJS Basics

### Observer

An object which can receive items. It has to implement at least an `onNext` method which will be called by the connected Observable when a new item is emitted.

Observers can be attached to Observables using the `subscribe` method. When we subscribe to an Observable using a callback function, we implicitly create an Observable.

```js
const hashObserver = 
	Rx.Observer.create( value => console.log('Got value', value)
	                  , error => console.error('Got error', error)
	                  , () => console.log('Completed.'))
hash$.subscribe(o)
```

---

## RxJS Basics

### Subject

A bridge which can be used to connect Observables. They are both Observers and Observables, so they can receive and emit values.

There are different Subject subclasses available, such as BehaviorSubject, which emits the last emitted value of the Observable, resulting in a Promise-like behaviour.

When building an API, subjects should not be exposed directly as it would allow the consumers to inject values to the stream.

```js
const hashSubject$ = new Rx.BehaviorSubject('#default')
hash$.subscribe(hashSubject$)
hashSubject$.subscribe(console.log)
// logs '#default', or the most recent hash

export Observable.from(hashSubject$)
```

---

## Demo application

- A simple time tracker, built with RxJS and Polymer
- Has a simple CouchDB backend to store tasks
- Fully reactive
- It can log time to different tasks and switch between tasks

---

## That's all folks!

Links:
	- Reactive Extensions: http://reactivex.io/
	- RxJS API docs: http://reactivex.io/rxjs/
	- Presentation and the demo app: https://github.com/sevcsik/talks
