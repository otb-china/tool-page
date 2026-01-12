import {
    createRouter,
    createWebHashHistory,
    type RouteRecordRaw
} from "vue-router"

export const fixRoutes: RouteRecordRaw[] = [
    {path: "/", component: () => import("../views/index.vue")},
    {path: "/survey", component: () => import("../views/survey.vue")},
    {path: "/form", component: () => import("../views/form.vue")},
    {path: "/crud", component: () => import("../views/crud.vue")}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: fixRoutes
})
export default router
