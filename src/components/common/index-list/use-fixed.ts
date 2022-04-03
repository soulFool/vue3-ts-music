import { ref, watch, computed, nextTick } from 'vue'

import { IIndexListProps } from './type'

export default function useFixed(props: IIndexListProps) {
  const TITLE_HEIGHT = 30
  const groupRef = ref<HTMLUListElement>()
  const listHeights = ref<number[]>([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    console.log(scrollY.value)
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  watch(
    () => props.data,
    async () => {
      await nextTick()
      // 数据变化之后，在这个回调函数内部 dom 还是没有开始变化，所以要在前面加一个 nextTick
      calculate()
    }
  )

  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    const list = groupRef.value?.children
    const listHeightsVal = listHeights.value
    let height = 0

    // 将数组的 length 设置为 0，可以直接清空数组，不懂的话建议买一本红宝书瞅瞅
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list!.length; i++) {
      height += list![i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos: { x: number; y: number }) {
    // 因为 better-scroll 向下滚动的 y 是负值，所以是 -pos.y
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    fixedTitle,
    fixedStyle,
    onScroll
  }
}
