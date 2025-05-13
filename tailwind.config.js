/*
 * @Author: chenjie
 * @Date: 2025-05-13 11:30:58
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-13 17:02:06
 * @FilePath: \project3\tailwind.config.js
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,vue}',
    './src/pages/**/*.{vue,js,ts}',
    // './src/components/**/*.{vue,js,ts}',
    // './App.{vue,js}',
    // './*.{vue,js}',
    // './uni_modules/**/*.{vue,js,ts}',
  ],
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
  plugins: [],
  // presets: [
  //   require('tailwindcss-rem2px-preset').createPreset({
  //     // 32 意味着 1rem = 32rpx
  //     fontSize: 32,
  //     // 转化的单位,可以变成 px / rpx
  //     unit: 'rpx',
  //   }),
  // ],
};
