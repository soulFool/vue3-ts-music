<template>
  <div class="album">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { getAlbum } from '@/service/recommend'

import createDetailComponent from '@/assets/ts/create-detail-component'
import { ALBUM_KEY } from '@/assets/ts/constant'

import MusicList from '@/components/content/music-list/music-list.vue'

import type { IRecommendAlbumsItem } from '@/views/type'

export default defineComponent({
  name: 'album',
  components: {
    MusicList
  },
  props: {
    album: {
      type: Object as PropType<IRecommendAlbumsItem>,
      required: true
    }
  },
  setup(props) {
    const { songs, pic, title, loading } = createDetailComponent(props.album, ALBUM_KEY, getAlbum)

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
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
