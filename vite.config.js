import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
// path 是nodejs的内置模块
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    //设置别名
    alias:{
      //~表示src目录
      "~":path.resolve(__dirname,"src")
    }
  },
  //解决跨域问题
  server:{
    proxy:{
      // 选项写法:用 '/api'代替这个域名
      '/api': {
        //将前端地址： http://127.0.0.1:5173/代理到后端地址：http://localhost:3000/api
        target: 'http://ceshi13.dishait.cn',//使用/api代替这个域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [vue(),WindiCSS()],

})
