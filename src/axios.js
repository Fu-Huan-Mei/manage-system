//引入axios请求库：可以通过向 axios 传递相关配置来创建请求
import axios from 'axios';
import { toast } from '~/composables/util.js';
import {getToken} from "~/composables/auth.js"
// import { useCookies } from '@vueuse/integrations/useCookies';
import store from "./store/index.js";
//自定义配置新建一个 axios 实例：可以通过向 axios 传递相关配置来创建请求
const service = axios.create({
    //域名
    // baseURL:'/api'
    baseURL:import.meta.env.VITE_APP_BASE_API
})

// 添加请求拦截器
service.interceptors.request.use(
  //当前请求的配置对象，可以在请求发送之前对其进行一些修改
    function (config) {
      //在发送请求之前做些什么：往header自动添加token
      //获取token:const token = cookie.get("admin-token")
      const token = getToken();
      //如果有token
      if(token){
        //将客户端存储的 token 添加到请求头中，以便服务器能够识别客户端的身份和状态
        config.headers["token"] = token;
      };
      //将修改后的请求配置对象返回，以确保修改能够被应用到发送的请求中
      return config;
   }, 
   function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
   });

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应成功的数据做点什么：从服务器返回的响应数据中获取 data 属性值
    return response.request.responseType==="blob" ? response.data: response.data.data;
  }, 
  function (error) {
    // 对请求错误做些什么：从错误对象的 response 属性中获取到服务器返回的错误信息，并进行处理
    const msg = error.response.data.msg || '请求失败';
    //如果服务器返回的错误信息为“非法token,请先登录！”
    if(msg === "非法token,请先登录！"){
      //调用 store.dispatch("logout") 方法来`清除`客户端`存储的 token`
      store.dispatch("logout")
      .finally(() =>{ 
        //刷新页面以便用户重新登录
        location.reload()
      });
    }
    // 对响应错误做点什么:统一做错误提示信息
    toast(msg,'error');
    console.log('msg=',msg, typeof msg)
    //将请求错误作为 Promise 的 rejection 值进行传递，以便在 Promise 链中进行错误处理
    return Promise.reject(error);
  });
export default service