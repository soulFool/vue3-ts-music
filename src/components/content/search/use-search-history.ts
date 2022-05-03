import { useStore } from '@/store'

import { save, remove, clear } from '@/assets/ts/array-store'
import { SEARCH_KEY } from '@/assets/ts/constant'

export default function useSearchHistory() {
  const maxLen = 200

  const store = useStore()

  const saveSearch = (query: string) => {
    const searches = save(
      query,
      SEARCH_KEY,
      (item: string) => {
        return item === query
      },
      maxLen
    )
    store.searchHistory = searches
  }

  const deleteSearch = (query: string) => {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    store.searchHistory = searches
  }

  const clearSearch = () => {
    const searches = clear(SEARCH_KEY)
    store.searchHistory = searches
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
