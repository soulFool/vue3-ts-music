<template>
  <div class="singer-detail"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'

import { getSingerDetail } from '@/service/singer'

import type { ISingerGroupItem } from '@/views/type'

export default defineComponent({
  name: 'singer-detail',
  props: {
    singer: {
      type: Object as PropType<ISingerGroupItem>,
      required: true
    }
  },
  setup(props) {
    onMounted(async () => {
      const result = await getSingerDetail(props.singer)
      console.log(result)
    })

    return {}
  }
})
</script>

<style lang="scss" scoped></style>
