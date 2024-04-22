import Vue, { ObjectDirective } from 'vue'

interface Scrollbar extends ObjectDirective {
  install(vue: typeof Vue): void
}

declare const scrollbar: Scrollbar

export default scrollbar