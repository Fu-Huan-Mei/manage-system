//引入createApp创建应用
import { createApp } from 'vue';
//引入ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// import 'element-plus/lib/theme-chalk/index.css';
// import './style.css';
//引入根组件App
import App from './App.vue';
import { router } from './router/index.js';
import store from './store/index.js';
//全局引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
// //计算首屏加载时间
// window.onload = function(){
//   console.log("计算首屏加载时间=",performance.timing.domComplete-performance.timing.navigationStart);
//   let observer = new Performance((list)=>{
//     //list：监听性能数据

//   });
//   observer.observe({entryTypes:['navigation']});
// };
app.use(store);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
import 'virtual:windi.css';
import "./permission.js";
//将NProgress的CSS样式文件导入到应用程序中，以便可以使用NProgress库的功能，并正确地渲染进度条
import "nprogress/nprogress.css";
import permission from "~/directives/permission.js";
app.use(permission);
app.mount('#app');

