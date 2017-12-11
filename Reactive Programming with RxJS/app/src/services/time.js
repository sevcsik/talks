export const time$ = Rx.Observable.interval(1000).map(() => Date.now() / 1000)
