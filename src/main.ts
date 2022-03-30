import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App).use(createPinia()).use(router).mount('#app')
