import { Observable } from 'node_modules/rxjs/bundles/Rx.js'

export const time$ = Observable.merge( Observable.of(true)
                                     , Observable.interval(1000)
                                     ).map(() => Date.now() / 1000)
