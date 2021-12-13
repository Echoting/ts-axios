import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/utils'

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2?: AxiosRequestConfig
): AxiosRequestConfig {
    let result = Object.create(null)
    let strategyMap = Object.create(null)

    if (!config2) {
        config2 = {}
    }

    const strategyKeysFromValue2 = ['url', 'params', 'data']
    const strategyKeysDeepMerge = ['headers', 'auth']

    strategyKeysFromValue2.forEach(key => {
        strategyMap[key] = mergeStrategyKeysFromValue2
    })

    strategyKeysDeepMerge.forEach(key => {
        strategyMap[key] = mergeStrategyKeysDeep
    })

    for (let key in config2) {
        mergeField(key)
    }

    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }

    function mergeField(key: string): void {
        const strategyFunc = strategyMap[key] || mergeStrategyDefault

        result[key] = strategyFunc(config1[key], config2![key])
    }

    function mergeStrategyKeysFromValue2(value1: any, value2: any): any {
        if (typeof config2 !== 'undefined') {
            return value2
        }
    }

    function mergeStrategyDefault(value1: any, value2: any): any {
        return typeof value2 !== 'undefined' ? value2 : value1
    }

    function mergeStrategyKeysDeep(value1: any, value2: any): any {
        if (isPlainObject(value1)) {
            return deepMerge(value1, value2)
        }

        if (typeof value1 !== 'undefined') {
            return value1
        }

        if (isPlainObject(value2)) {
            return deepMerge(value2)
        }

        if (typeof value2 !== 'undefined') {
            return value2
        }
    }

    return result
}
