import storage from 'good-storage'

function inertArray(arr: any[], val: any, compare: (item: any) => void, maxLen?: number) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr: any[], compare: (item: any) => void) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item: any, key: string, compare: (item: any) => void, maxLen?: number) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key: string, compare: (item: any) => void) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key: string) {
  return storage.get(key, [])
}

export function clear(key: string) {
  storage.remove(key)
  return []
}
