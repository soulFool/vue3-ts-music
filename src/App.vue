<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Header from '@/components/content/header/header.vue'
import Tab from '@/components/content/tab/tab.vue'
import Player from '@/components/content/player/player.vue'

export default defineComponent({
  name: 'App',
  components: {
    MHeader: Header,
    Tab,
    Player
  }
})
</script>

<style lang="scss"></style>
