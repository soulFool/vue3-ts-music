/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'create-keyframe-animation' {
  export function registerAnimation({ name: string, animation: any, presets: any }): void
  export function runAnimation(el: Element, name: string, callbackFn: any): void
  export function unregisterAnimation(name: string): void
}
