import type { ComponentPublicInstance } from 'vue'

export interface IVueInstance<T> {
  instance: ComponentPublicInstance<T>
}

export type IVueElInstance<T> = HTMLElement & IVueInstance<T>
