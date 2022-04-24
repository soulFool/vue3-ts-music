import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import storage from 'good-storage'

import { processSongs } from '@/service/song'

import type { ISingerDetail, ISingerGroupItem, IRecommendAlbumsItem } from '@/views/type'
import type { ISingerDetailResult } from '@/service/type'

export default function createDetailComponent(
  data: ISingerGroupItem | IRecommendAlbumsItem,
  key: string,
  fetch: (val: any) => Promise<void | ISingerDetailResult | undefined>
) {
  const route = useRoute()
  const router = useRouter()
  const songs = ref<ISingerDetail[]>([])
  const loading = ref(true)

  const computedData = computed(() => {
    let ret = null
    if (data) {
      ret = data
    } else {
      const cached = storage.session.get(key)
      if (cached && (cached.mid || cached.id + '') === route.params.id) {
        ret = cached
      }
    }
    return ret
  })
  const pic = computed(() => {
    const computedDataVal = computedData.value
    return computedDataVal && computedDataVal.pic
  })
  const title = computed(() => {
    const computedDataVal = computedData.value
    return computedDataVal && (computedDataVal.name || computedDataVal.title)
  })

  onMounted(async () => {
    const computedDataVal = computedData.value
    if (!computedDataVal) {
      const path = route.matched[0].path
      await router.push({
        path
      })
      return
    }
    const result = await fetch(computedDataVal)
    songs.value = await processSongs((result as ISingerDetailResult).songs)
    loading.value = false
  })

  return {
    songs,
    pic,
    title,
    loading
  }
}
