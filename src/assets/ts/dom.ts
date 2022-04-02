export function addClass(el: HTMLElement, className: string) {
  // 不希望重复添加，所以进行判断
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el: HTMLElement, className: string) {
  // remove 不需要判断，因为删除一个没有的 className 也不会有任何问题
  el.classList.remove(className)
}
