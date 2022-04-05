import type { ISingerDetail } from '@/views/type'

export interface IMainState {
  sequenceList: ISingerDetail[]
  playlist: ISingerDetail[]
  playing: boolean
  playMode: number
  currentIndex: number
  fullScreen: boolean
}

export interface IMainGetters {
  currentSong: ISingerDetail
}

export interface IMainActions {
  selectPlay: (list: any[], index: number) => void
}
