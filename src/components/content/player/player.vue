<template>
  <div class="player" v-show="store.playlist.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
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
        <div class="middle" @touchstart.prevent="onMiddleTouchStart" @touchmove.prevent="onMiddleTouchMove" @touchend.prevent="onMiddleTouchEnd">
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img class="image" ref="cdImageRef" :class="cdCls" :src="store.currentSong.pic" alt="图片" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p class="text" :class="{ current: currentLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="line.num">
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ formatTime(store.currentSong.duration) }}</span>
          </div>
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
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'

import { PLAY_MODE } from '@/assets/ts/constant'
import { useStore } from '@/store'
import { formatTime } from '@/assets/ts/util'
import useMode from '@/components/content/player/use-mode'
import useFavorite from '@/components/content/player/use-favorite'
import useCd from '@/components/content/player/use-cd'
import useLyric from '@/components/content/player/use-lyric'
import useMiddleInteractive from '@/components/content/player/use-middle-interactive'
import useAnimation from '@/components/content/player/use-animation'
import usePlayHistory from '@/components/content/player/usePlayHistory'

import ProgressBar from './progress-bar.vue'
import Scroll from '@/components/common/scroll/scroll.vue'
import MiniPlayer from './mini-player.vue'

import type { ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
    // data
    const store = useStore()
    const audioRef = ref<HTMLAudioElement>()
    const barRef = ref<InstanceType<typeof ProgressBar>>()
    const songReady = ref(false)
    const currentTime = ref(0)

    let progressChanging = false

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdRef, cdImageRef, cdCls } = useCd()
    const { currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricScrollRef, lyricListRef, playLyric, stopLyric } = useLyric(
      songReady,
      currentTime
    )
    const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
    const { savePlay } = usePlayHistory()

    // computed
    const playIcon = computed(() => {
      return store.playing ? 'icon-pause' : 'icon-play'
    })

    const progress = computed(() => {
      return currentTime.value / (store.currentSong as ISingerDetail).duration
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
        currentTime.value = 0
        songReady.value = false
        const audioEl = audioRef.value
        audioEl!.src = newSong.url
        audioEl!.play()
        store.playing = true
      }
    )

    watch(
      () => store.playing,
      (newPlaying: boolean) => {
        if (!songReady.value) {
          return
        }
        const audioEl = audioRef.value
        if (newPlaying) {
          audioEl!.play()
          playLyric()
        } else {
          audioEl!.pause()
          stopLyric()
        }
      }
    )

    watch(
      () => store.fullScreen,
      async (newFullScreen) => {
        if (newFullScreen) {
          await nextTick()
          barRef.value!.setOffset(progress.value)
        }
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
      }
    }

    const next = () => {
      const playlist = store.playlist
      const currentIndex = store.currentIndex
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
      }
    }

    const loop = () => {
      const audioEl = audioRef.value
      audioEl!.currentTime = 0
      audioEl!.play()
      store.playing = true
    }

    const ready = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
      savePlay(store.currentSong)
    }

    const error = () => {
      songReady.value = true
    }

    const updateTime = (e: Event) => {
      if (!progressChanging) {
        currentTime.value = (e.target as HTMLAudioElement).currentTime
      }
    }

    const onProgressChanging = (progress: number) => {
      progressChanging = true
      currentTime.value = (store.currentSong as ISingerDetail).duration * progress
      playLyric()
      stopLyric()
    }

    const onProgressChanged = (progress: number) => {
      progressChanging = false
      audioRef.value!.currentTime = currentTime.value = (store.currentSong as ISingerDetail).duration * progress
      if (!store.playing) {
        store.playing = true
      }
      playLyric()
    }

    const end = () => {
      currentTime.value = 0
      if (store.playMode === PLAY_MODE.LOOP) {
        loop()
      } else {
        next()
      }
    }

    return {
      store,
      audioRef,
      barRef,
      currentTime,
      playIcon,
      progress,
      disableCls,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // cd
      cdRef,
      cdImageRef,
      cdCls,
      // lyric
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      // middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
