<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">{{ item.key }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { getHotKeys } from '@/service/search'

import SearchInput from '@/components/content/search/search-input.vue'

import type { IHotKeysResult, IHotKeys } from '@/service/type'

export default defineComponent({
  name: 'search',
  components: {
    SearchInput
  },
  setup() {
    const query = ref('')
    const hotKeys = ref<IHotKeys[]>()

    getHotKeys().then((result) => {
      hotKeys.value = (result as IHotKeysResult).hotKeys
    })

    const addQuery = (key: string) => {
      query.value = key
    }

    return {
      query,
      hotKeys,
      addQuery
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
}
</style>
