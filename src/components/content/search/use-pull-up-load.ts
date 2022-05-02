import { onMounted, onUnmounted, ref } from 'vue'

import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'

import type { ComputedRef } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData: () => void, preventPullUpLoad: ComputedRef<boolean>) {
  const scroll = ref<BScrollType>()
  const rootRef = ref<HTMLDivElement>()
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value!, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }))

    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
