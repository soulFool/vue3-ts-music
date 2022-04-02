import { createApp } from 'vue'
import Loading from './loading.vue'
import { addClass, removeClass } from '@/assets/ts/dom'

import type { DirectiveBinding } from 'vue'
import type { IVueElInstance } from './type'

const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el: IVueElInstance<InstanceType<typeof Loading>>, binding: DirectiveBinding) {
    const app = createApp(Loading)
    const instance: any = app.mount(document.createElement('div'))
    el.instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el: IVueElInstance<InstanceType<typeof Loading>>, binding: DirectiveBinding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el: IVueElInstance<InstanceType<typeof Loading>>) {
  const style = getComputedStyle(el)
  if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

function remove(el: IVueElInstance<InstanceType<typeof Loading>>) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
