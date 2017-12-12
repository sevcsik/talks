import { Observable
       , BehaviorSubject 
       } from 'node_modules/rxjs/bundles/Rx.js'

const activeTaskSubject = new BehaviorSubject()

export const attachTaskSelectStream = task$ => task$.subscribe(activeTaskSubject)

export const activeTask$ = Observable.from(activeTaskSubject)

const hashchange$ = Observable.fromEvent(window, 'hashchange')
	.pluck('target', 'location', 'hash')
	.map(hash => hash.replace('#', ''))

export const activeScreen$ = Observable.merge( Observable.from([window.location.hash])
                                                         .map(hash => hash.replace('#', ''))
                                             , hashchange$
                                             )

// debug
activeTask$.do(t => console.log(`Active task: `, t)).subscribe()
activeScreen$.do(t => console.log(`Active screen: `, t)).subscribe()
