import { computed } from 'vue'

import { useStore } from '@/store'

import { PLAY_MODE } from '@/assets/ts/constant'

export default function useMode() {
  const store = useStore()

  const modeIcon = computed(() => {
    const playMode = store.playMode
    return playMode === PLAY_MODE.SEQUENCE ? 'icon-sequence' : playMode === PLAY_MODE.RANDOM ? 'icon-random' : 'icon-loop'
  })

  const modeText = computed(() => {
    const playMode = store.playMode
    return playMode === PLAY_MODE.SEQUENCE ? '顺序播放' : playMode === PLAY_MODE.RANDOM ? '随机播放' : '单曲循环'
  })

  const changeMode = () => {
    const mode = (store.playMode + 1) % 3
    store.changeMode(mode)
  }

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
