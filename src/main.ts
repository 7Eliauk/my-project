import { createApp } from 'vue'
import App from './App.vue'
import router from './router' //注册路由实例 （易忘）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
