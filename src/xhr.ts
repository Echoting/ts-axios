import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
    const { url, method = 'get', data = null, params = null } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url)
    request.send(data)
}