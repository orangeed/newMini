/*
 * @Author: chenjie
 * @Date: 2024-09-05 21:14:24
 * @LastEditors: orangeed 1208917130@qq.com
 * @LastEditTime: 2025-04-11 21:39:32
 * @FilePath: \some-project\src\router\index.js
 */
/*
 * @Author: chenjie
 * @File Name: 路由
 * @Date: 2025-03-03 14:58:42
 */
import { createRouter, createWebHistory } from 'vue-router';
import { routerList } from '../enmu';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: routerList.REMOVE_WATERMARK,
    name: routerList.REMOVE_WATERMARK,
    component: () => import('../views/removeWatermark/index.vue'),
  },
  {
    path: routerList.EDIT_IMAGE,
    name: routerList.EDIT_IMAGE,
    component: () => import('../views/editImage/index.vue'),
  },
  {
    path: routerList.MARK_MAP,
    name: routerList.MARK_MAP,
    component: () => import('../views/markmap/index.vue'),
  },
  {
    path: routerList.DUAN_JU,
    name: routerList.DUAN_JU,
    component: () => import('../views/newduanju/index.vue'),
  },
  {
    path: routerList.TO_JSON,
    name: routerList.TO_JSON,
    component: () => import('../views/tojson/index.vue'),
  },
  {
    path: routerList.SHORT_URL,
    name: routerList.SHORT_URL,
    component: () => import('../views/shortUrl/index.vue'),
  },
  {
    path: routerList.PDF2_WORD,
    name: routerList.PDF2_WORD,
    component: () => import('../views/pdf2word/index.vue'),
  },
  {
    path: routerList.DEEN_CODE,
    name: routerList.DEEN_CODE,
    component: () => import('../views/deenCode/index.vue'),
  },
  {
    path: routerList.SOFT,
    name: routerList.SOFT,
    component: () => import('../views/soft/index.vue'),
  },
  {
    path: routerList.VACATION,
    name: routerList.VACATION,
    component: () => import('../views/vacation/index.vue'),
  },
  {
    path: routerList.LOAN,
    name: routerList.LOAN,
    component: () => import('../views/loan/index.vue'),
  },
  {
    path: routerList.DIFF,
    name: routerList.DIFF,
    component: () => import('../views/diff/index.vue'),
  },
  {
    path: routerList.AITOOLS,
    name: routerList.AITOOLS,
    component: () => import('../views/aiTools/index.vue'),
  },
  {
    path: routerList.WXEDITOR,
    name: routerList.WXEDITOR,
    component: () => import('../views/wxEditor/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/errorPage/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
