import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/common/loading/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/image/default.svg')
  })
  .directive('loading', loadingDirective)
  .mount('#app')
