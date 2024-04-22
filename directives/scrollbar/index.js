
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './index.css'
import { dom } from '../tools'

function handleScroll(el, modifiers) {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, {})
  }

  if (modifiers && modifiers.always && !dom.hasClass(el, 'v-scroll--always')) {
    dom.addClass(el, 'v-scroll--always')
  }
  if (modifiers && modifiers.single && !dom.hasClass(el, 'v-scroll--single')) {
    dom.addClass(el, 'v-scroll--single')
  }
}

const scrollbar = {
  mounted(el, binding) {
    const postionAllowable = ['relative', 'absolute', 'fixed', 'sticky']
    if (!postionAllowable.includes(window.getComputedStyle(el, null).position)) {
      console.error(`scrollbar指令所在的容器必须包含以下position属性：${postionAllowable.join('、')}`)
    }
    
    handleScroll(el, binding.modifiers)
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    handleScroll(el, binding.modifiers)
  },
  unmounted(el) {
    el._ps_ && el._ps_.destroy();
  },
  install(Vue) {
    Vue.directive('scrollbar', scrollbar)
  }
};

export default scrollbar;