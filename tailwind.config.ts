/*
 * @Author: chenjie
 * @Date: 2025-05-14 22:28:55
 * @LastEditors: orangeed 1208917130@qq.com
 * @LastEditTime: 2025-05-14 22:35:40
 * @FilePath: \uni-app-vite-vue3-tailwind-vscode-template\tailwind.config.ts
 */
import type { Config } from 'tailwindcss'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'
import cssMacro from 'weapp-tailwindcss/css-macro'
import { isMp } from './platform'

export default <Config>{
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      transitionProperty: {
        width: 'width',
        height: 'height',
        spacing: 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'in-out-smooth': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
      },
    },
  },
  // https://weapp-tw.icebreaker.top/docs/quick-start/uni-app-css-macro
  plugins: [
    cssMacro({
      variantsMap: {
        'wx': 'MP-WEIXIN',
        '-wx': {
          value: 'MP-WEIXIN',
          negative: true,
        },
        // 定义多个条件判断
        // mv: {
        //   value: 'H5 || MP-WEIXIN'
        // },
        // '-mv': {
        //   value: 'H5 || MP-WEIXIN',
        //   negative: true
        // }
      },
    }),
    iconsPlugin({
      // 在这里可以选择你要使用的 icon, 更多详见:
      // https://icon-sets.iconify.design/
      collections: getIconCollections(['svg-spinners', 'mdi']),
    }),
  ],
  corePlugins: {
    // 小程序去使用 h5 的 preflight 和响应式 container 没有意义
    preflight: !isMp,
    container: !isMp,
  },
}
