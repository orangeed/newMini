/*
 * @Author: chenjie
 * @Date: 2025-05-13 10:03:36
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-13 11:40:27
 * @FilePath: \project3\vite.config.js
 */
import { defineConfig } from 'vite';
// import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';
import tailwindcss from 'tailwindcss';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';

export default defineConfig({
  plugins: [
    uni(),
    // vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    uniTailwind(),
  ],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: '@import "@/styles/var.scss";'
    //   },
    // },
    postcss: {
      plugins: [tailwindcss('./tailwind.config.js')],
    },
  },
});
