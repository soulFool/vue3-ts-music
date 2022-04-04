import { get } from './base'

import type { ISongResult } from './type'
import type { ISingerDetail } from '@/views/type'

export function processSongs(songs: ISingerDetail[]) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get<ISongResult>('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = (result as ISongResult).map
    return songs
      .map((song) => {
        song.url = map[song.mid]
        return song
      })
      .filter((song) => {
        return song.url.includes('vkey')
      })
  })
}
