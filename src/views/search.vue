<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">{{ item.key }}</li>
        </ul>
      </div>
    </div>
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
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import storage from 'good-storage'

import { SINGER_KEY } from '@/assets/ts/constant'

import { getHotKeys } from '@/service/search'

import SearchInput from '@/components/content/search/search-input.vue'
import Suggest from '@/components/content/search/suggest.vue'

import type { IHotKeysResult, IHotKeys } from '@/service/type'
import type { ISingerGroupItem, ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'search',
  components: {
    SearchInput,
    Suggest
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const query = ref('')
    const hotKeys = ref<IHotKeys[]>()
    const selectedSinger = ref<ISingerGroupItem>()

    getHotKeys().then((result) => {
      hotKeys.value = (result as IHotKeysResult).hotKeys
    })

    const addQuery = (key: string) => {
      query.value = key
    }

    const selectSong = (song: ISingerDetail) => {
      store.addSong(song)
    }

    const selectSinger = (singer: ISingerGroupItem) => {
      selectedSinger.value = singer
      cacheSinger(singer)

      router.push({ path: `/search/${singer.mid}` })
    }

    function cacheSinger(singer: ISingerGroupItem) {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      selectedSinger,
      addQuery,
      selectSong,
      selectSinger
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
