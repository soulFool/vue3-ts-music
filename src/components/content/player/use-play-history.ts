import { useStore } from '@/store'

import { PLAY_KEY } from '@/assets/ts/constant'
import { save } from '@/assets/ts/array-store'

import type { ISingerDetail } from '@/views/type'

export default function usePlayHistory() {
  const store = useStore()

  const maxLen = 200

  const savePlay = (song: ISingerDetail) => {
    const songs = save(
      song,
      PLAY_KEY,
      (item: ISingerDetail) => {
        return item.id === song.id
      },
      maxLen
    )

    store.playHistory = songs
  }

  return {
    savePlay
  }
}
