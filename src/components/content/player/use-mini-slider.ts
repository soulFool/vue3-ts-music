import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'

// 引入 BScroll 和 Slide
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { useStore } from '@/store'

import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'

BScroll.use(Slide)

export default function useMiniSlider() {
  const store = useStore()
  const slider = ref<BScrollType>()
  const sliderWrapperRef = ref<HTMLDivElement>()

  const sliderShow = computed(() => {
    return !store.fullScreen && !!store.playlist
  })

  onMounted(() => {
    let sliderVal: BScrollType
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value!, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })

          sliderVal.on('slidePageChanged', (page: { x: number; y: number; pageX: number; pageY: number }) => {
            store.currentIndex = page.pageX
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(store.currentIndex, 0, 0)
      }
    })

    watch(
      () => store.currentIndex,
      (newIndex) => {
        if (sliderVal && sliderShow.value) {
          sliderVal.goToPage(newIndex, 0, 0)
        }
      }
    )

    watch(
      () => store.playlist,
      async (newList) => {
        if (sliderVal && sliderShow.value && newList.length) {
          await nextTick()
          sliderVal.refresh()
        }
      }
    )
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
