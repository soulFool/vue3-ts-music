import { onMounted, onUnmounted, ref } from 'vue'

// 引入 BScroll 和 Slide
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import type { Ref } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

// 给 BScroll 注册插件
BScroll.use(Slide)

// 参数必须是 ref 对象，不能直接传入 ref 的 value，因为这样传入的参数不是响应式的
export default function useSlider(wrapper: Ref<HTMLElement>) {
  const slider = ref<BScrollType>()
  const currentPageIndex = ref<number>()

  onMounted(() => {
    // 在挂载时初始化
    const sliderVal = (slider.value = new BScroll(wrapper.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    }))

    sliderVal.on('slideWillChange', (page: any) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    // 在卸载时销毁
    slider.value?.destroy()
  })

  return {
    slider,
    currentPageIndex
  }
}
