import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import lazyPlugin from 'vue3-lazy'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/image/default.svg')
  })
  .mount('#app')
