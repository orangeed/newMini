/*
 * @Author: chenjie
 * @Date: 2025-05-15 09:34:11
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-15 17:36:52
 * @FilePath: \project3\src\main.ts
 */
import * as Pinia from 'pinia'
import { createSSRApp } from 'vue'
import App from './App.vue'
import CostomNavBar from './components/navbar/index.vue'
import './styles/arco.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.component('CostomNavBar', CostomNavBar)

  return {
    app,
    Pinia,
  }
}
