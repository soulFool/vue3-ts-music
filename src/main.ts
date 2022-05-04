import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/common/loading/directive'
import noResultDirective from '@/components/common/no-result/directive'
import { load, saveAll } from '@/assets/ts/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/ts/constant'
import { processSongs } from '@/service/song'
import { useStore } from '@/store'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/image/default.svg')
  })
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')

const store = useStore()
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    ;(store.favoriteList as any[]) = songs
    saveAll(songs, FAVORITE_KEY)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    ;(store.playHistory as any[]) = songs
    saveAll(songs, PLAY_KEY)
  })
}
