import {createApp} from 'vue'
import App from './App.vue'
// UI框架
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
// otb-module-plus
import OMP from "otb-module-plus"
import "otb-module-plus/dist/style.css"
// 全局样式
import "otb-module-plus/src/styles/index.scss"
// 路由
import router from "./router/index.ts"

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(ElementPlus).use(OMP);
app.mount("#app")
