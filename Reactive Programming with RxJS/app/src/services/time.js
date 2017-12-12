import { Observable } from 'node_modules/rxjs/bundles/Rx.js'

export const time$ = Observable.interval(1000).map(() => Date.now() / 1000)
