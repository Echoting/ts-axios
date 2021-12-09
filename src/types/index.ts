export type Method =
    | 'get'
    | 'GET'
    | 'post'
    | 'POST'
    | 'delete'
    | 'DELETE'
    | 'patch'
    | 'PATCH'
    | 'put'
    | 'PUT'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'

export interface AxiosRequestConfig {
    url?: string
    method?: Method
    params?: any
    data?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]

    cancelToken?: CancelToken
    withCredentials?: boolean

    xsrfCookieName?: string
    xsrfHeaderName?: string

    [propsName: string]: any
}

export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse
}

export interface Axios {
    defaults: AxiosRequestConfig

    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }

    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance

    CancelToken: CancelTokenStatic
    Cancel: CancelStatic
    isCancel: (value: any) => boolean
}

export interface AxiosInterceptorManager<T> {
    // 返回拦截器的id
    use(resolve: ResolveFn<T>, reject?: RejectFn): number

    // 根据id删除拦截器
    eject(id: number): void
}

export interface ResolveFn<T = any> {
    (val: T): T | Promise<T>
}

export interface RejectFn {
    (error: any): any
}

export interface AxiosTransformer {
    (data: any, header?: any): any
}

// CancelToken的实例类型
export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested(): void
}

export interface Canceler {
    (message?: string): void
}

export interface CancelExecutor {
    (cancel: Canceler): void
}

export interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}

// CancelToken类类型
export interface CancelTokenStatic {
    new (executor: CancelExecutor): CancelToken
    source(): CancelTokenSource
}

export interface Cancel {
    message?: string
}
export interface CancelStatic {
    new (message?: string): Cancel
}
