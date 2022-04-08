import { useStore } from '@/store'

import { FAVORITE_KEY } from '@/assets/ts/constant'
import { save, remove } from '@/assets/ts/array-store'

import type { ISingerDetail } from '@/views/type'

export default function useFavorite() {
  const store = useStore()
  const maxLen = 100

  const getFavoriteIcon = (song: ISingerDetail) => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  const toggleFavorite = (song: ISingerDetail) => {
    let list: any
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.favoriteList = list

    function compare(item: any) {
      return item.id === song.id
    }
  }

  function isFavorite(song: ISingerDetail) {
    return (
      store.favoriteList.findIndex((item: ISingerDetail) => {
        return item.id === song.id
      }) > -1
    )
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
