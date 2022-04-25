<template>
  <div class="top-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading" rank></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { getTopDetail } from '@/service/top-list'

import createDetailComponent from '@/assets/ts/create-detail-component'
import { TOP_KEY } from '@/assets/ts/constant'

import MusicList from '@/components/content/music-list/music-list.vue'

import type { ITopListItem } from './type'

export default defineComponent({
  name: 'top-detail',
  components: {
    MusicList
  },
  props: {
    top: {
      type: Object as PropType<ITopListItem>,
      required: true
    }
  },
  setup(props) {
    const { songs, pic, title, loading } = createDetailComponent(props.top, TOP_KEY, getTopDetail)

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
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
