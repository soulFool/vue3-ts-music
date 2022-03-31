<template>
  <div class="recommend">推荐页面</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { getRecommend } from '@/service/recommend'

export default defineComponent({
  name: 'recommend',
  async setup() {
    const result = await getRecommend()
    console.log(result)

    return {}
  }
})
</script>

<style lang="scss" scoped></style>
