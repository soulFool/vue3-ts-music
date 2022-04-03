import { ref, computed } from 'vue'

import scroll from '@/components/common/scroll/scroll.vue'

import type { Ref } from 'vue'
import type { BScroll as BScrollType } from '@better-scroll/core/dist/types/BScroll'
import type { IIndexListProps } from './type'

export default function useShortcut(props: IIndexListProps, groupRef: Ref<HTMLUListElement>) {
  const scrollRef = ref<InstanceType<typeof scroll>>()

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  function onShortcutTouchStart(e: Event) {
    const anchorIndex = parseInt((e.target as HTMLElement).dataset.index!)
    const targetEl = groupRef.value.children[anchorIndex]
    const scroll = scrollRef.value!.scroll as BScrollType
    scroll.scrollToElement(targetEl as HTMLElement, 0, false, false)
  }

  function onShortcutTouchMove(e: Event) {
    const anchorIndex = (e.target as HTMLElement).dataset.index
  }

  function onShortcutTouchEnd(e: Event) {
    const anchorIndex = (e.target as HTMLElement).dataset.index
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
