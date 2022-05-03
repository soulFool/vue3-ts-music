<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'message',
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  setup(props) {
    const visible = ref(false)

    let timer: any

    const show = () => {
      visible.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        hide()
      }, props.delay)
    }

    const hide = () => {
      clearTimeout(timer)
      visible.value = false
    }

    return {
      visible,
      show,
      hide
    }
  }
})
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;
  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }
  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
