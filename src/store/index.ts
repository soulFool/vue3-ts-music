import { defineStore } from 'pinia'

import { PLAY_MODE } from '@/assets/ts/constant'

export const useStore = defineStore('main', {
  state: () => ({
    // 歌曲顺序列表
    sequenceList: [],
    // 歌曲播放列表
    playlist: [],
    // 播放状态
    playing: false,
    // 播放模式
    playMode: PLAY_MODE.SEQUENCE,
    // 当前播放索引
    currentIndex: 0,
    // 播放器状态
    fullScreen: false
  }),
  getters: {
    currentSong: (state) => {
      return state.playlist[state.currentIndex]
    }
  },
  actions: {
    selectPlay(list: any, index: number) {
      this.playMode = PLAY_MODE.SEQUENCE
      this.sequenceList = list
      this.playing = true
      this.fullScreen = true
      /**
       * 现在不考虑随机播放，playlist 和 sequenceList 都是 list
       * */
      this.playlist = list
      this.currentIndex = index
    }
  }
})
