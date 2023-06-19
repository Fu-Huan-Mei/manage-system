//权限验证
import {router,addRoutes} from "~/router";
import { getToken } from "~/composables/auth.js";
import { toast,showFullLoading,hideFullLoading } from "~/composables/util.js";
import store from './store/index.js';

//防止重复加载getInfo
let hasGetInfo = false;

//全局前置路由守卫：路由跳转前
router.beforeEach(async (to, from, next) => {
    //显示loading
    showFullLoading();

   //获取token
   const token = getToken();

   //没有登录，强制跳转为登录页
   if(!token && to.path != "/login"){
    toast("请先登录","error");
    return next({path:"/login"});
   };

   //防止重复登录（不能再次回到登录页）
   if(token && to.path === "/login"){
    toast("请勿重复登录","error");
    //如果已经登录，就在当前页，当前页强制回到首页
    return next({ path:from.path ? from.path:"/"});
   };

   //默认没有新的路由
    let hasNewRoutes = false;
   //如果用户登录，自动获取用户信息,解决刷新首页数据消失
   if(token && !hasGetInfo ){
        //获取菜单数据  ，通过{menus}来解构
        let { menus } = await store.dispatch("getinfo");
        //防止重复调用 getinfo 动作，这可能会导致不必要的网络请求和处理
        hasGetInfo = true;
        //有新路由来动态添加路由
        hasNewRoutes = addRoutes(menus);
      
    }


    //获取页面标题：如果 to.meta.title 存在且不为空，则将其赋值给 title，否则将空字符串赋值给 title。最后，将 -开心网 附加在 title 的末尾，作为网页标题的后缀
    let title = (to.meta.title ? to.meta.title : "") +  "-口水吧";
    //设置(修改)页面标题
    document.title = title;
    //手动导航指定路由（解决页面刷新出现404页面的错误）
    // next() 
    hasNewRoutes ? next(to.fullPath) : next();
});

//全局后置路由守卫:路由跳转后
router.afterEach((to, from) => hideFullLoading())