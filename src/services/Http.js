import axios from "axios"

export default function Http(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create()

        //request 拦截器
        instance.interceptors.request.use(
            config => {
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )

        // response 拦截器
        instance.interceptors.response.use((response) => {
                return response
            },
            error => {
                return Promise.reject(error)
            }
        )

        //请求处理
        instance(options).then(response => {
            resolve(response)
            return false
        }).catch(error => {
            reject(error)
        })
    })
}
