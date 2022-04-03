<template>
  <div class="scroll" ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import useScroll from './use-scroll'

import type { Ref } from 'vue'

export default defineComponent({
  name: 'scroll',
  props: {
    /**
     * 都是 BScroll 的配置，不懂看官网
     */
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: {
    scroll(pos: { x: number; y: number }) {
      return Math.abs(pos.x) * Math.abs(pos.y) >= 0
    }
  },
  setup(props, context) {
    const rootRef = ref<HTMLElement>()
    useScroll(rootRef as Ref<HTMLElement>, props, context)

    return {
      rootRef
    }
  }
})
</script>

<style lang="scss" scoped></style>
