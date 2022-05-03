<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div v-show="!query">
          <switches v-model="currentIndex" :items="['最近播放', '搜索历史']"></switches>
          <div class="list-wrapper">
            <scroll class="list-scroll" ref="scrollRef" v-if="currentIndex === 0">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="selectSongBySongList"></song-list>
              </div>
            </scroll>
            <scroll class="list-scroll" ref="scrollRef" v-if="currentIndex === 1">
              <div class="list-inner">
                <search-list :searches="searchHistory" :show-delete="false" @select="addQuery"></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" :show-singer="false" @select-song="selectSongBySuggest"></suggest>
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useStore } from '@/store'

import useSearchHistory from '@/components/content/search/use-search-history'

import SearchInput from '@/components/content/search/search-input.vue'
import Suggest from '@/components/content/search/suggest.vue'
import Switches from '@/components/common/switches/switches.vue'
import Scroll from '@/components/common/scroll/scroll.vue'
import SongList from '@/components/common/song-list/song-list.vue'
import SearchList from '@/components/common/search-list/search-list.vue'
import Message from '@/components/common/message/message.vue'

import type { ISingerDetail, ISongListSelectItem } from '@/views/type'

export default defineComponent({
  name: 'add-song',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref<InstanceType<typeof Scroll>>()
    const messageRef = ref<InstanceType<typeof Message>>()

    const { saveSearch } = useSearchHistory()

    const searchHistory = computed(() => store.searchHistory)
    const playHistory = computed(() => store.playHistory)

    watch(query, async () => {
      await nextTick()
      refreshScroll()
    })

    const show = async () => {
      visible.value = true

      await nextTick()
      refreshScroll()
    }

    const hide = () => {
      visible.value = false
    }

    const addQuery = (key: string) => {
      query.value = key
    }

    const selectSongBySongList = (selectItem: ISongListSelectItem) => {
      addSong(selectItem.song)
    }

    const selectSongBySuggest = (song: ISingerDetail) => {
      addSong(song)
      saveSearch(query.value)
    }

    function refreshScroll() {
      scrollRef.value!.scroll!.refresh()
    }

    function addSong(song: ISingerDetail) {
      store.addSong(song)
      showMessage()
    }

    function showMessage() {
      messageRef.value!.show()
    }

    return {
      visible,
      query,
      currentIndex,
      scrollRef,
      messageRef,
      searchHistory,
      playHistory,
      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest
    }
  }
})
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
