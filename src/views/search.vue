<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import SearchInput from '@/components/content/search/search-input.vue'

export default defineComponent({
  name: 'search',
  components: {
    SearchInput
  },
  setup() {
    const query = ref('')

    return {
      query
    }
  }
})
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
}
</style>
