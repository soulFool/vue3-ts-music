import { ComponentPublicInstance } from 'vue'

export interface IVueInstance {
  instance: ComponentPublicInstance
}

export type IVueElInstance = HTMLElement & IVueInstance
