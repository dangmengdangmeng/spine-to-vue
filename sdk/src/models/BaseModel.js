import Http from "../services/Http"
import Helper from "../helper"

export default class BaseModel {
    constructor(data = null) {
        if (data != null) {
            if (data instanceof Object) {
                let properties = Object.getOwnPropertyNames(data)
                properties.forEach(property => {
                    let key = Helper.toHump(property)
                    this[key] = data[property]
                })
            } else {
                throw "data is not object"
            }
        }
        // 白名单
    }

    static index(url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('request url is required')
                return
            }
            let _this = this
            Http({
                method: 'get',
                url,
                params
            }).then(function (response) {
                if (!response.data.data && response.data) {
                    if (response.data instanceof Array) {
                        let items = []
                        response.data.map(item => items.push(new _this(item)))
                        resolve(items)
                    } else {
                        resolve(response.data)
                    }
                }
                let data = response.data.data
                let items = []
                data && data.forEach(function (data) {
                    const item = new _this(data)
                    items.push(item)
                })
                resolve(items)
            }).catch(function (error) {
                reject(error)
            })
        })
    }

    static show(url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('request url is required')
                return
            }
            let _this = this
            Http({
                method: 'get',
                url,
                params
            }).then(function (response) {
                if (!response.data) return

                if (!response.data.data && response.data) {
                    const item = new _this(response.data)
                    resolve(item)
                }
                let data = response.data.data
                if (data.constructor === Array) {
                    let items = []
                    data && data.forEach(function (data) {
                        const item = new _this(data)
                        items.push(item)
                    })
                    resolve(items)
                } else {
                    const item = new _this(data)
                    resolve(item)
                }
            }).catch(function (error) {
                reject(error)
            })
        })
    }

    static save(method, url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('request url is required')
                return
            }
            if (method !== 'PUT' && method !== 'POST') {
                reject('method is not support')
                return
            }

            // if (method === 'PUT' && !Object.keys(params).length) {
            //     resolve(true)
            //     return
            // }
            let options = {
                method,
                url,
            }
            if (method === 'POST') {
                options.data = params
            } else {
                options.params = params
            }
            Http(options).then(function (response) {
                resolve(response.headers.location)
            }).catch(error => {
                reject(error)
            })
        })
    }

    static delete(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('request url is required')
                return
            }
            Http({
                method: 'delete',
                url,
            }).then(function () {
                resolve(true)
            }).catch(function (error) {
                reject(error)
            })
        })
    }

}
