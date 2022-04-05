import { createApp, DefineComponent } from 'vue'
import { addClass, removeClass } from '@/assets/ts/dom'

import type { ObjectDirective } from 'vue'

const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp: DefineComponent<any, any, any>): ObjectDirective {
  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const instance: any = app.mount(document.createElement('div'))
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el: any) {
    const name = Comp.name
    const style = getComputedStyle(el)
    if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el: any) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
