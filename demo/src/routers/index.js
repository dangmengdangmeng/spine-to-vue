import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: "Index",
        component: () => import('../views/Index')
    },
]

export default new Router({
    mode: 'history',
    base: '/',
    routes
})

