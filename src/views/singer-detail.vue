<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import storage from 'good-storage'

import { SINGER_KEY } from '@/assets/ts/constant'

import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'

import MusicList from '@/components/content/music-list/music-list.vue'

import type { ISingerGroupItem, ISingerDetail } from './type'
import type { ISingerDetailResult } from '@/service/type'

export default defineComponent({
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object as PropType<ISingerGroupItem>,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const songs = ref<ISingerDetail[]>([])
    const loading = ref(true)

    const computedSinger = computed(() => {
      let ret = null
      const singer = props.singer
      if (singer) {
        ret = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && cachedSinger.mid === route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    })
    const pic = computed(() => {
      const computedSingerVal = computedSinger.value
      return computedSingerVal && computedSingerVal.pic
    })
    const title = computed(() => {
      const computedSingerVal = computedSinger.value
      return computedSingerVal && computedSingerVal.name
    })

    onMounted(async () => {
      if (!computedSinger.value) {
        const path = route.matched[0].path
        await router.push({
          path
        })
        return
      }
      const result = await getSingerDetail(computedSinger.value)
      songs.value = await processSongs((result as ISingerDetailResult).songs)
      loading.value = false
    })

    return {
      songs,
      pic,
      title,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
