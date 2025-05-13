import { createSSRApp } from 'vue';
// import router from './router';
import '@arco-design/web-vue/dist/arco.css';
import './styles/arco.scss';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import App from './App.vue';
export function createApp() {
  const app = createSSRApp(App);
  //   app.use(router);
  app.use(mavonEditor);
  //   app.mount('#app');
  return {
    app,
  };
}
