<!--
 * @Author: chenjie
 * @Date: 2025-05-15 09:34:11
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-15 16:28:38
 * @FilePath: \project3\src\App.vue
-->
<script setup>
import { createNavBarContext } from './utils/useNavBarHeight.ts'

createNavBarContext() // 提供全局导航栏高度
</script>

<style lang="scss">
@use 'tailwindcss/base';
@use 'tailwindcss/components';
@use 'tailwindcss/utilities';

/*  #ifdef  H5  */
svg {
  display: initial;
}

/*  #endif  */

// @layer components {
//   .raw-btn {
//     // 注意 after: 后面不能加任何空格，有些格式化工具可能会在这里自动加一个空格
//     @apply after:border-none inline-flex items-center gap-2 rounded text-sm font-semibold transition-all;
//   }

//   .btn {
//     // 使用上面定义的 raw-btn
//     @apply raw-btn bg-gradient-to-r from-[#9e58e9] to-blue-500 px-2 py-1 text-white;
//   }
// }
</style>
