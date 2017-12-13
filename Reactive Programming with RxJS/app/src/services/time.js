import { Observable, Subject } from 'node_modules/rxjs/bundles/Rx.js'

export const INTERVAL = 1000

export const time$ = Observable.merge( Observable.of(true)
                                     , Observable.interval(INTERVAL)
                                     ).map(() => Date.now() / INTERVAL)
