<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" ref="bgImageRef">
      <div class="filter"></div>
    </div>
    <scroll class="list" v-loading="loading" v-no-result:[noResultText]="noResult" :probe-type="3" @scroll="onScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from '@/store'

import SongList from '@/components/common/song-list/song-list.vue'
import Scroll from '@/components/common/scroll/scroll.vue'

import type { ISingerDetail } from '@/views/type'

export default defineComponent({
  name: 'music-list',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array as PropType<ISingerDetail[]>,
      default: () => []
    },
    title: {
      type: String,
      required: true
    },
    pic: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      require: true,
      default: true
    },
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  setup(props) {
    const RESERVED_HEIGHT = 44

    const router = useRouter()
    const store = useStore()
    const bgImageRef = ref<HTMLDivElement>()
    const imageHeight = ref(0)
    const scrollY = ref(0)
    const maxTranslateY = ref(0)

    const noResult = computed(() => !props.loading && !props.songs.length)

    const bgImageStyle = computed(() => {
      const scrollYVal = scrollY.value
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0

      if (scrollYVal > maxTranslateY.value) {
        zIndex = 10
        paddingTop = '0'
        height = RESERVED_HEIGHT
        translateZ = 1
      }

      let scale = 1
      if (scrollY.value < 0) {
        scale = 1 + Math.abs(scrollY.value / imageHeight.value)
      }

      return {
        zIndex,
        paddingTop,
        height: `${height}px`,
        bgUrl: `url(${props.pic})`,
        transform: `scale(${scale}) translateZ(${translateZ}px)`
      }
    })

    const filterStyle = computed(() => {
      let blur = 0
      const scrollYVal = scrollY.value
      const imageHeightVal = imageHeight.value
      if (scrollYVal > 0) {
        blur = Math.min(maxTranslateY.value / imageHeightVal, scrollYVal / imageHeightVal) * 20
      }
      return {
        blur: `blur(${blur}px)`
      }
    })

    const goBack = () => {
      router.back()
    }

    const onScroll = (pos: { x: number; y: number }) => {
      scrollY.value = -pos.y
    }

    const selectItem = (value: { song: ISingerDetail; index: number }) => {
      store.selectPlay(props.songs, value.index)
    }

    onMounted(() => {
      imageHeight.value = bgImageRef.value!.clientHeight
      maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
    })

    return {
      bgImageRef,
      imageHeight,
      noResult,
      bgImageStyle,
      filterStyle,
      goBack,
      onScroll,
      selectItem
    }
  }
})
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    z-index: v-bind('bgImageStyle.zIndex');
    padding-top: v-bind('bgImageStyle.paddingTop');
    height: v-bind('bgImageStyle.height');
    background-image: v-bind('bgImageStyle.bgUrl');
    transform: v-bind('bgImageStyle.transform');
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
      backdrop-filter: v-bind('filterStyle.blur');
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    top: v-bind("imageHeight + 'px'");
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
