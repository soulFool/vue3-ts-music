<template>
  <div class="suggest" ref="rootRef" v-loading:[loadingText]="loading && !noResult" v-no-result:[noResultText]="noResult">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'

import { search } from '@/service/search'
import { processSongs } from '@/service/song'

import usePullUpLoad from './use-pull-up-load'

import type { ISearchResult } from '@/service/type'
import type { ISingerDetail, ISingerGroupItem } from '@/views/type'
import { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

export default defineComponent({
  name: 'suggest',
  props: {
    query: {
      type: String,
      required: true
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singer = ref<ISingerGroupItem | null>()
    const songs = ref<ISingerDetail[]>([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { scroll, rootRef, isPullUpLoad } = usePullUpLoad(searchMore, preventPullUpLoad)

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )

    async function searchFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs((result as ISearchResult).songs)
      singer.value = (result as ISearchResult).singer
      hasMore.value = (result as ISearchResult).hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs((result as ISearchResult).songs))
      hasMore.value = (result as ISearchResult).hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable() {
      if ((scroll.value as BScrollType).maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    const selectSong = (song: ISingerDetail) => {
      emit('select-song', song)
    }

    const selectSinger = (singer: ISingerGroupItem) => {
      emit('select-singer', singer)
    }

    return {
      singer,
      songs,
      loadingText,
      noResultText,
      loading,
      noResult,
      pullUpLoading,
      selectSong,
      selectSinger,
      // pullUpLoad
      rootRef
    }
  }
})
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
