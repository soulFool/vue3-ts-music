<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import storage from 'good-storage'

import { SINGER_KEY } from '@/assets/ts/constant'

import { getSingerList } from '@/service/singer'

import IndexList from '@/components/common/index-list/index-list.vue'

import type { ISingerListResult } from '@/service/type'
import type { ISingerGroup, ISingerGroupItem } from './type'

export default defineComponent({
  name: 'singer',
  components: {
    IndexList
  },
  setup() {
    const router = useRouter()
    const singers = ref<ISingerGroup[]>([])
    const selectedSinger = ref<ISingerGroupItem>()

    const selectSinger = (singer: ISingerGroupItem) => {
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/singer/${singer.mid}`
      })
    }

    const cacheSinger = (singer: ISingerGroupItem) => {
      storage.session.set(SINGER_KEY, singer)
    }

    onMounted(async () => {
      const result = await getSingerList()
      singers.value = (result as ISingerListResult).singers
    })

    return {
      singers,
      selectedSinger,
      selectSinger
    }
  }
})
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
