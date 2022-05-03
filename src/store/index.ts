import { defineStore } from 'pinia'

import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/ts/constant'
import { shuffle } from '@/assets/ts/util'
import { load } from '@/assets/ts/array-store'

import type { ISingerDetail } from '@/views/type'

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
    fullScreen: false,
    // 收藏歌曲列表
    favoriteList: load(FAVORITE_KEY),
    // 搜索历史
    searchHistory: load(SEARCH_KEY)
  }),
  getters: {
    currentSong: (state) => {
      return state.playlist[state.currentIndex] || {}
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
    },
    randomPlay(list: any) {
      this.playMode = PLAY_MODE.RANDOM
      this.sequenceList = list
      this.playing = true
      this.fullScreen = true
      this.playlist = shuffle(list)
      this.currentIndex = 0
    },
    changeMode(mode: number) {
      const currentId = (this.currentSong as ISingerDetail).id
      if (mode === PLAY_MODE.RANDOM) {
        this.playlist = shuffle(this.sequenceList)
      } else {
        this.playlist = this.sequenceList
      }
      const index = this.playlist.findIndex((song: ISingerDetail) => {
        return song.id === currentId
      })

      this.currentIndex = index
      this.playMode = mode
    },
    removeSong(song: ISingerDetail) {
      const sequenceList = this.sequenceList.slice()
      const playlist = this.playlist.slice()

      const sequenceIndex = findIndex(sequenceList, song)
      const playIndex = findIndex(playlist, song)
      if (sequenceIndex < 0 || playIndex < 0) {
        return
      }

      sequenceList.splice(sequenceIndex, 1)
      playlist.splice(playIndex, 1)

      if (playIndex < this.currentIndex || this.currentIndex === playlist.length) {
        this.currentIndex--
      }

      this.sequenceList = sequenceList
      this.playlist = playlist
      if (!playlist.length) {
        this.playing = false
      }
    },
    clearSongList() {
      this.sequenceList = []
      this.playlist = []
      this.currentIndex = 0
      this.playing = false
    },
    addSong(song: ISingerDetail) {
      const playlist = this.playlist.slice()
      const sequenceList = this.sequenceList.slice()
      let currentIndex = this.currentIndex
      const playIndex = findIndex(playlist, song)

      if (playIndex > -1) {
        currentIndex = playIndex
      } else {
        ;(playlist as ISingerDetail[]).push(song)
        currentIndex = playlist.length - 1
      }

      const sequenceIndex = findIndex(sequenceList, song)
      if (sequenceIndex === -1) {
        ;(sequenceList as ISingerDetail[]).push(song)
      }

      this.sequenceList = sequenceList
      this.playlist = playlist
      this.currentIndex = currentIndex
      this.playing = true
      this.fullScreen = true
    }
  }
})

function findIndex(list: ISingerDetail[], song: ISingerDetail) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
