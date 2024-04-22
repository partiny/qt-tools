### 安装

```bash
# npm 安装
npm install i qt-vue3-directives

# pnpm 安装
pnpm install i qt-vue3-directives
```

### 使用指令

#### 滚动条美化：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { scrollbar } from 'qt-vue3-directives'

const app = createApp(App)

// 指令注册，方式一：
app.directive('scrollbar', scrollbar)
// 指令注册，方式二：
// scrollbar.install(app)
```

```typescript
// demo.vue
// 注意：v-scrollbar 所在的元素一定要有以下 position 属性之一：relative、absolute、fixed、sticky
<div v-scrollbar>
  // ...
</div>
```
