<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches" :key="item" @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select', 'delete'],
  setup(props, { emit }) {
    const selectItem = (item: string) => {
      emit('select', item)
    }

    const deleteItem = (item: string) => {
      emit('delete', item)
    }

    return {
      selectItem,
      deleteItem
    }
  }
})
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
