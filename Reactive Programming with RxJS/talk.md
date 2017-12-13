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


