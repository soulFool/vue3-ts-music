<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <!-- 由于数据传入是异步的，而且 better-scroll/slide 在初始化的时候要求至少有一条以上的数据，所以用 v-if 使元素先不渲染 -->
        <slider v-if="sliders.length" :sliders="sliders"></slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { getRecommend } from '@/service/recommend'

import Slider from '@/components/common/slider/slider.vue'

export default defineComponent({
  name: 'recommend',
  components: {
    Slider
  },
  data() {
    return {
      sliders: []
    }
  },
  async created() {
    const result = await getRecommend()
    this.sliders = result.sliders
  }
})
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
