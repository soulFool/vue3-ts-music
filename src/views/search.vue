<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll class="search-content" ref="scrollRef" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">{{ item.key }}</li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm ref="confirmRef" text="是否清空所有搜索历史" confirm-btn-text="清空" @confirm="clearSearch"></confirm>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-song="selectSong" @select-singer="selectSinger"></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import storage from 'good-storage'

import { SINGER_KEY } from '@/assets/ts/constant'

import { getHotKeys } from '@/service/search'

import useSearchHistory from '@/components/content/search/use-search-history'

import SearchInput from '@/components/content/search/search-input.vue'
import Suggest from '@/components/content/search/suggest.vue'
import SearchList from '@/components/common/search-list/search-list.vue'
import Scroll from '@/components/content/wrap-scroll'
import Confirm from '@/components/common/confirm/confirm.vue'

import type { IHotKeysResult, IHotKeys } from '@/service/type'
import type { ISingerGroupItem, ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const scrollRef = ref<InstanceType<typeof Scroll>>()
    const confirmRef = ref<InstanceType<typeof Confirm>>()
    const query = ref('')
    const hotKeys = ref<IHotKeys[]>()
    const selectedSinger = ref<ISingerGroupItem>()

    const searchHistory = computed(() => store.searchHistory)

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    getHotKeys().then((result) => {
      hotKeys.value = (result as IHotKeysResult).hotKeys
    })

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    const addQuery = (key: string) => {
      query.value = key
    }

    const selectSong = (song: ISingerDetail) => {
      saveSearch(query.value)
      store.addSong(song)
    }

    const selectSinger = (singer: ISingerGroupItem) => {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)

      router.push({ path: `/search/${singer.mid}` })
    }

    const showConfirm = () => {
      confirmRef.value!.show()
    }

    function cacheSinger(singer: ISingerGroupItem) {
      storage.session.set(SINGER_KEY, singer)
    }

    function refreshScroll() {
      scrollRef.value!.scroll!.refresh()
    }

    return {
      scrollRef,
      confirmRef,
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      addQuery,
      selectSong,
      selectSinger,
      showConfirm,
      // searchHistory
      deleteSearch,
      clearSearch
    }
  }
})
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
