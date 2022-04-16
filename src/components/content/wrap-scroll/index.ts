import { defineComponent, h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'

import { useStore } from '@/store'

import Scroll from '@/components/common/scroll/scroll.vue'

import type { ComponentPublicInstance } from 'vue'

export default defineComponent({
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx: ComponentPublicInstance) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, {
        onScroll: (e: Event) => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const store = useStore()
    const scrollRef = ref<InstanceType<typeof Scroll>>()

    const scroll = computed(() => {
      return scrollRef.value!.scroll
    })

    watch(
      () => store.playlist,
      async () => {
        await nextTick()
        scroll.value!.refresh()
      }
    )

    return {
      scrollRef,
      scroll
    }
  }
})
