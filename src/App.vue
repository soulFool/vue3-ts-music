<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle"></router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
  <player></player>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

import { useStore } from '@/store'

import Header from '@/components/content/header/header.vue'
import Tab from '@/components/content/tab/tab.vue'
import Player from '@/components/content/player/player.vue'

export default defineComponent({
  name: 'App',
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  setup() {
    const store = useStore()

    const viewStyle = computed(() => {
      const bottom = store.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    })

    return {
      viewStyle
    }
  }
})
</script>

<style lang="scss"></style>
