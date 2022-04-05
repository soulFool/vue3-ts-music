<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, computed } from 'vue'

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
    const songs = ref<ISingerDetail[]>([])
    const loading = ref(true)

    const pic = computed(() => {
      return props.singer && props.singer.pic
    })
    const title = computed(() => {
      return props.singer && props.singer.name
    })

    onMounted(async () => {
      const result = await getSingerDetail(props.singer)
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
