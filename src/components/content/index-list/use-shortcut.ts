import { ref, computed } from 'vue'

import scroll from '@/components/common/scroll/scroll.vue'

import type { Ref } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'
import type { IIndexListProps } from './type'

export default function useShortcut(props: IIndexListProps, groupRef: Ref<HTMLUListElement>) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref<InstanceType<typeof scroll>>()

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {
    y1: 0,
    y2: 0,
    anchorIndex: 0
  }

  function onShortcutTouchStart(e: TouchEvent) {
    const anchorIndex = parseInt((e.target as HTMLElement).dataset.index!)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e: TouchEvent) {
    touch.y2 = e.touches[0].pageY
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index: number) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value!.scroll as BScrollType
    scroll.scrollToElement(targetEl as HTMLElement, 0, false, false)
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
