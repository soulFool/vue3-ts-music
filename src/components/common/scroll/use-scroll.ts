import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import type { Ref, SetupContext } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'
import type { IScrollProps } from './type'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef: Ref<HTMLElement>, options: IScrollProps, { emit }: SetupContext) {
  const scroll = ref<BScrollType>()

  onMounted(() => {
    // better-scroll 是在初始化的时候，判断能不能滚动
    // 如果使用了 ObserveDOM，better-scroll 就可以自动探测 dom 变化，自动刷新
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    }))

    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos: { x: number; y: boolean }) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  onActivated(() => {
    scroll.value?.enable()
    scroll.value?.refresh()
  })

  onDeactivated(() => {
    scroll.value?.disable()
  })

  return scroll
}
