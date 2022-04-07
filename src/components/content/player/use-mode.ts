import { computed } from 'vue'

import { useStore } from '@/store'

import { PLAY_MODE } from '@/assets/ts/constant'

export default function useMode() {
  const store = useStore()

  const modeIcon = computed(() => {
    const playMode = store.playMode
    return playMode === PLAY_MODE.SEQUENCE ? 'icon-sequence' : playMode === PLAY_MODE.RANDOM ? 'icon-random' : 'icon-loop'
  })

  const changeMode = () => {
    const mode = (store.playMode + 1) % 3
    store.changeMode(mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
