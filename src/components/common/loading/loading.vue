<template>
  <div class="loading">
    <div class="loading-content">
      <svg width="50" height="50" viewBox="0 0 50 50">
        <!-- stroke-dasharray = 2pir/4 = 2*3.1415926*22/4 = 34 -->
        <circle cx="25" cy="25" r="22" fill="none" stroke-width="3" stroke="#3be6cb" stroke-dasharray="34" stroke-linecap="round">
          <!-- <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 25 25" to="360 25 25" dur="2s" repeatCount="indefinite"></animateTransform> -->
          <!-- 可以使用 values 代替 from 和 to -->
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="0 25 25; 360 25 25"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate attributeName="stroke" values="#3be6cb; #02bcfe; #3be6cb" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="25" r="12" fill="none" stroke-width="3" stroke="#02bcfe" stroke-dasharray="19" stroke-linecap="round">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="360 25 25"
            to="0 25 25"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate attributeName="stroke" values="#02bcfe; #3be6cb; #02bcfe" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'loading',
  setup() {
    const title = ref('正在载入...')

    const setTitle = (val: string) => {
      title.value = val
    }

    return {
      title,
      setTitle
    }
  }
})
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -100%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
