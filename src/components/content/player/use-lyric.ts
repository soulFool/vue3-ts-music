import { ref, watch } from 'vue'
import Lyric from 'lyric-parser'

import { getLyric } from '@/service/song'

import { useStore } from '@/store'

import Scroll from '@/components/common/scroll/scroll.vue'

import type { Ref } from 'vue'
import type { ISingerDetail } from '@/views/type'

export default function useLyric(songReady: Ref<boolean>, currentTime: Ref<number>) {
  const store = useStore()
  const currentLyric = ref<Lyric>()
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref<InstanceType<typeof Scroll>>()
  const lyricListRef = ref<HTMLDivElement>()

  watch(
    () => store.currentSong,
    async (newSong: ISingerDetail) => {
      if (!newSong.url || !newSong.id) {
        return
      }
      stopLyric()
      currentLyric.value = undefined
      currentLineNum.value = 0
      pureMusicLyric.value = ''
      playingLyric.value = ''

      const lyric = await getLyric(newSong)
      newSong.lyric = lyric
      if ((store.currentSong as ISingerDetail).lyric !== lyric) {
        return
      }

      currentLyric.value = new Lyric(lyric, handleLyric)
      const hasLyric = currentLyric.value!.lines.length
      if (hasLyric) {
        if (songReady.value) {
          playLyric()
        }
      } else {
        playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
      }
    }
  )

  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric(params: { lineNum: number; txt: string }) {
    currentLineNum.value = params.lineNum
    playingLyric.value = params.txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (params.lineNum > 5) {
      const lineEl = listEl.children[params.lineNum - 5]
      scrollComp!.scroll!.scrollToElement(lineEl as HTMLElement, 1000, false, false)
    } else {
      scrollComp!.scroll!.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
