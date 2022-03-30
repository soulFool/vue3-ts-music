<template>
  <m-header></m-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '@/components/content/header/header.vue'

export default defineComponent({
  name: 'App',
  components: {
    MHeader: Header
  }
})
</script>

<style lang="scss"></style>
