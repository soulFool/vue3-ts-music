<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <!-- better-scroll 只对第一个元素生效，所以使用一个容器包裹这两部分 -->
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- 由于数据传入是异步的，而且 better-scroll/slide 在初始化的时候要求至少有一条以上的数据，所以用 v-if 使元素先不渲染 -->
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in albums" :key="item.id">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" alt="图片" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'

import { getRecommend } from '@/service/recommend'

import Slider from '@/components/common/slider/slider.vue'
import Scroll from '@/components/content/wrap-scroll'

import type { IRecommendAlbumsItem, IRecommendSlidersItem } from './type'
import type { IRecommendResult } from '@/service/type'

export default defineComponent({
  name: 'recommend',
  components: {
    Slider,
    Scroll
  },
  setup() {
    // 其实这里用 options API 更好，只不过这个项目是为了练习 Vue3
    // 而且好像在哪里听说过，全部使用 composition API，打包的时候就不会打包 options API 的部分，代码体积会减小，故这个项目将全部使用 composition API
    const sliders = ref<IRecommendSlidersItem[]>([])
    const albums = ref<IRecommendAlbumsItem[]>([])

    const loading = computed(() => !sliders.value.length && !albums.value.length)

    onMounted(async () => {
      // 这个赋值必须写在 onMounted 里面，如果写在 setup 里面，会报 parentNode 为 null 的错，parentNode 都是 dom 元素
      // debugger 之后发现 slider 的 dom 没有被渲染，所以报错
      const result = await getRecommend()
      sliders.value = (result as IRecommendResult).sliders
      albums.value = (result as IRecommendResult).albums
    })

    return {
      sliders,
      albums,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
