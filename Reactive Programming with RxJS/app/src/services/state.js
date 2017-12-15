import { time$ } from 'src/services/time.js'

import { Observable
       , BehaviorSubject
       } from 'node_modules/rxjs/bundles/Rx.js'

const activeTaskSubject = new BehaviorSubject(null)

const hashchange$ = Observable.fromEvent(window, 'hashchange')
	.pluck('target', 'location', 'hash')
	.map(hash => hash.replace('#', ''))

export const activeScreen$ = Observable.merge( Observable.of(window.location.hash)
                                                         .map(hash => hash.replace('#', ''))
                                             , hashchange$
                                             )

export const bindTaskSelectStream = task$ => task$.subscribe(activeTaskSubject)
export const activeTask$ = Observable.from(activeTaskSubject)


const activeTimerSubject = new BehaviorSubject({ running: false, since: null })
export const bindTimerStartStream = start$ =>
	time$.sample(start$)
	     .map(t => ({ running: true, since: t }))
	     .subscribe(activeTimerSubject)

export const bindTimerStopStream = stop$ =>
	stop$.map(() => ({ running: false, since: null }))
	     .subscribe(activeTimerSubject)

export const activeTimer$ = Observable.from(activeTimerSubject)

// debug
activeScreen$.subscribe(t => console.log('Active screen: ', t))
activeTask$.subscribe(t => console.log('Active task: ', t))
activeTimer$.subscribe(t => console.log('Active timer: ', t))
