import { createApp } from 'vue'
import App from './App.vue'
import router from './router' //注册路由实例 （易忘）
// 1. 引入 Element Plus
import ElementPlus from 'element-plus'
// 2. 引入 Element Plus 样式（必须！）
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router)
app.mount('#app')
// 3. 全局注册（必须！）
app.use(ElementPlus)