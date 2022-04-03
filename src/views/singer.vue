<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers"></index-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { getSingerList } from '@/service/singer'

import IndexList from '@/components/common/index-list/index-list.vue'

import type { ISingerGroup } from './type'

export default defineComponent({
  name: 'singer',
  components: {
    IndexList
  },
  setup() {
    const singers = ref<ISingerGroup[]>([])

    onMounted(async () => {
      const result = await getSingerList()
      singers.value = result.singers
    })

    return {
      singers
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
