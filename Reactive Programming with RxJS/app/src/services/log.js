import { activeTask$
       , activeTimer$
       } from 'src/services/state.js'
import { time$
       , INTERVAL
       } from 'src/services/time.js'

import { Observable } from 'node_modules/rxjs/bundles/Rx.js'
import { RxHttpRequest } from 'node_modules/rx-http-request/browser.js'

const API_ROOT = 'http://localhost:5984/rxdemo'

export const logEntries$ = time$
	.combineLatest(activeTask$, activeTimer$)
	.filter(([p1, p2, activeTimer]) => activeTimer.running)
	.map(([time, activeTask, aciveTimer$]) =>
		({ task: activeTask
		 , timestamp: time
		 , duration: INTERVAL
		 }))

export const getTotalTimeByTask$ = task => logEntries$
	.filter(logEntry => task._id === logEntry.task._id)
	.scan((totalTime, logEntry) => totalTime + logEntry.duration, 0)

logEntries$
	.map(({ task
	      , timestamp
	      , duration }) => ({ task: task._id
	                        , timestamp
	                        , type: 'logEntry'
	                        , duration }))
	.flatMap(doc => RxHttpRequest.put( `${API_ROOT}/${doc.timestamp}_${doc.task}`
	                                 , { body: doc, json: true }))
	.subscribe()

// debug
logEntries$.subscribe(l => console.log('Log entry: ', l))
