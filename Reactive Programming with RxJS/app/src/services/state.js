import { Observable } from 'node_modules/rxjs/bundles/Rx.js'

export const state$ = Observable.merge( Observable.from([{ state: history.state
                                                         , currentTarget: window
                                                         }])
                                      , Observable.fromEvent(window, 'popstate')
                                      )
	.map(e => ({ state: e.state
	           , name: e.currentTarget.location.hash.replace('#', '')
	           }))
	.do(s => console.log('state changed:', s))
