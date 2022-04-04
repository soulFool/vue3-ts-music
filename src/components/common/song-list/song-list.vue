<template>
  <ul class="song-list">
    <li class="item" v-for="song in songs" :key="song.id">
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import type { ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'song-list',
  props: {
    songs: {
      type: Array as PropType<ISingerDetail[]>,
      default: () => []
    }
  },
  setup() {
    const getDesc = (song: ISingerDetail) => {
      return `${song.singer}·${song.album}`
    }

    return {
      getDesc
    }
  }
})
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
