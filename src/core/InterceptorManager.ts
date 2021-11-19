import { RejectFn, ResolveFn } from '../types'

interface Interceptor<T> {
    resolve: ResolveFn<T>
    reject?: RejectFn
}

export default class InterceptorManager<T> {
    private interceptor: (Interceptor<T> | null)[]
    constructor() {
        this.interceptor = []
    }

    use(resolve: ResolveFn<T>, reject?: RejectFn): number {
        this.interceptor.push({
            resolve,
            reject
        })

        return this.interceptor.length - 1
    }

    eject(id: number): void {
        if (this.interceptor[id]) {
            this.interceptor[id] = null
        }
    }

    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptor.forEach(interceptorItem => {
            if (interceptorItem) {
                fn(interceptorItem)
            }
        })
    }
}
