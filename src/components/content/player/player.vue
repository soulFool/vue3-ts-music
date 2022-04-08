<template>
  <div class="player">
    <div class="normal-player" v-show="store.fullScreen">
      <div class="background">
        <img :src="store.currentSong.pic" alt="图片" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ store.currentSong.name }}</h1>
        <h2 class="subtitle">{{ store.currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i @click="toggleFavorite(store.currentSong)" :class="getFavoriteIcon(store.currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'

import { useStore } from '@/store'
import useMode from './use-mode'
import useFavorite from './use-favorite'

import type { ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'player',
  setup() {
    // data
    const store = useStore()
    const audioRef = ref<HTMLAudioElement>()
    const songReady = ref(false)

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // computed
    const playIcon = computed(() => {
      return store.playing ? 'icon-pause' : 'icon-play'
    })

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    // watch
    watch(
      () => store.currentSong,
      (newSong: ISingerDetail) => {
        if (!newSong.id || !newSong.url) {
          return
        }
        songReady.value = false
        const audioEl = audioRef.value
        audioEl!.src = newSong.url
        audioEl!.play()
      }
    )

    watch(
      () => store.playing,
      (newPlaying: boolean) => {
        if (!songReady.value) {
          return
        }
        const audioEl = audioRef.value
        newPlaying ? audioEl!.play() : audioEl!.pause()
      }
    )

    // methods
    const goBack = () => {
      store.fullScreen = false
    }

    const togglePlay = () => {
      if (!songReady.value) {
        return
      }
      store.playing = !store.playing
    }

    const pause = () => {
      store.playing = false
    }

    const prev = () => {
      const playlist = store.playlist
      const currentIndex = store.currentIndex
      const playing = store.playing
      if (!songReady.value || !playlist) {
        return
      }
      if (playlist.length === 1) {
        loop()
      } else {
        let index = currentIndex - 1
        if (index === -1) {
          index = playlist.length - 1
        }
        store.currentIndex = index
        if (!playing) {
          store.playing = true
        }
      }
    }

    const next = () => {
      const playlist = store.playlist
      const currentIndex = store.currentIndex
      const playing = store.playing
      if (!songReady.value || !playlist) {
        return
      }
      if (playlist.length === 1) {
        loop()
      } else {
        let index = currentIndex + 1
        if (index === playlist.length) {
          index = 0
        }
        store.currentIndex = index
        if (!playing) {
          store.playing = true
        }
      }
    }

    const loop = () => {
      const audioEl = audioRef.value
      audioEl!.currentTime = 0
      audioEl!.play()
    }

    const ready = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    return {
      store,
      audioRef,
      playIcon,
      disableCls,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
