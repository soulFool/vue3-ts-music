import { createApp } from 'vue'
import Loading from './loading.vue'

import type { DirectiveBinding } from 'vue'
import type { IVueElInstance } from './type'

const loadingDirective = {
  mounted(el: IVueElInstance, binding: DirectiveBinding) {
    const app = createApp(Loading)
    el.instance = app.mount(document.createElement('div'))

    if (binding.value) {
      append(el)
    }
  },
  updated(el: IVueElInstance, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el: IVueElInstance) {
  el.appendChild(el.instance.$el)
}

function remove(el: IVueElInstance) {
  el.removeChild(el.instance.$el)
}

export default loadingDirective
