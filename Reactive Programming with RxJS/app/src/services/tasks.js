import { Observable } from 'node_modules/rxjs/bundles/Rx.js'
import { RxHttpRequest } from 'node_modules/rx-http-request/browser.js'

const API_ROOT = 'http://localhost:5984/rxdemo/_design/rxdemo/_view'

const createProject = (project, tasks) => ({ projectName: project.name, tasks })

export const projects$ = RxHttpRequest.get(`${API_ROOT}/projects`, { json: true })
	.flatMap(res => Observable.from(res.body.rows))
	.pluck('value')
	.map(project => ({ project, tasks$: tasksByProject$(project) }))
	.toArray()

export const tasksByProject$ = p => RxHttpRequest.get(`${API_ROOT}/tasks_by_project?key="${p._id}"`, { json: true })
	.flatMap(res => Observable.from(res.body.rows))
	.pluck('value')
	.toArray()

