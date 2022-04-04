<template>
  <div class="singer-detail"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'

import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'

import type { ISingerGroupItem } from '@/views/type'

export default defineComponent({
  name: 'singer-detail',
  props: {
    singer: {
      type: Object as PropType<ISingerGroupItem>,
      required: true
    }
  },
  setup(props) {
    onMounted(async () => {
      const result = await getSingerDetail(props.singer)
      const songs = await processSongs(result.songs)
      console.log(songs)
    })

    return {}
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
