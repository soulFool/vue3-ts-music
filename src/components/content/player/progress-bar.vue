<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef"></div>
      <div class="progress-btn-wrapper" @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend.prevent="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

const progressBtnWidth = 16

export default defineComponent({
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  setup(props, { emit }) {
    const progressBarRef = ref<HTMLDivElement>()
    const progressRef = ref<HTMLDivElement>()
    const offset = ref(0)

    const touch = {
      x1: 0,
      beginWidth: 0
    }

    watch(
      () => props.progress,
      (newProgress) => {
        setOffset(newProgress)
      }
    )

    const onTouchStart = (e: TouchEvent) => {
      touch.x1 = e.touches[0].pageX
      touch.beginWidth = progressRef.value!.clientWidth
    }

    const onTouchMove = (e: TouchEvent) => {
      const delta = e.touches[0].pageX - touch.x1
      const tempWidth = touch.beginWidth + delta
      const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      offset.value = barWidth * progress
      emit('progress-changing', progress)
    }

    const onTouchEnd = () => {
      const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
      const progress = progressRef.value!.clientWidth / barWidth
      emit('progress-changed', progress)
    }

    const onClick = (e: PointerEvent) => {
      const rect = progressBarRef.value!.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      emit('progress-changed', progress)
    }

    const setOffset = (progress: number) => {
      const barWidth = progressBarRef.value!.clientWidth - progressBtnWidth
      offset.value = barWidth * progress
    }

    return {
      progressBarRef,
      progressRef,
      offset,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick,
      setOffset
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      width: v-bind("offset + 'px'");
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      transform: v-bind("'translate3d(' + offset + 'px, 0, 0)'");
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
