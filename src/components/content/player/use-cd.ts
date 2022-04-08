import { ref, computed, watch } from 'vue'

import { useStore } from '@/store'

export default function useCd() {
  const store = useStore()
  const cdRef = ref<HTMLDivElement>()
  const cdImageRef = ref<HTMLImageElement>()

  const cdCls = computed(() => {
    return store.playing ? 'playing' : ''
  })

  watch(
    () => store.playing,
    (newPlaying) => {
      if (!newPlaying) {
        syncTransform(cdRef.value!, cdImageRef.value!)
      }
    }
  )

  function syncTransform(wrapper: HTMLDivElement, inner: HTMLImageElement) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdRef,
    cdImageRef,
    cdCls
  }
}
