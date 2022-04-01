import { onMounted, onUnmounted, ref } from 'vue'

import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import type { Ref } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef: Ref<HTMLElement>, options: any) {
  const scroll = ref<BScrollType>()

  onMounted(() => {
    // better-scroll 是在初始化的时候，判断能不能滚动
    // 如果使用了 ObserveDOM，better-scroll 就可以自动探测 dom 变化，自动刷新
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })
}
