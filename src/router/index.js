import { createRouter, createWebHashHistory } from "vue-router";
//登录页
import Login from '~/pages/login.vue';
//404页面
import NotFound from '~/pages/404.vue';

//文件？？
import Document from '~/pages/document.vue';
//研报？？
import Report from '~/pages/report.vue';

//后台首页
import Index from '~/pages/index.vue';
//后台布局
import Admin from "~/layout/admin.vue";
//商城管理
import GoodList from '~/pages/goods/list.vue';
//分类列表
import CategoryList from '~/pages/category/list.vue';
//用户列表
import UserList from '~/pages/user/list.vue';
//订单列表
import OrderList from '~/pages/order/list.vue';
//评价列表
import  CommentList from '~/pages/comment/list.vue';
//图库列表
import ImageList from '~/pages/image/list.vue';
//公告列表
import NoticeList from '~/pages/notice/list.vue';
//配置列表
import SettingBase from '~/pages/setting/base.vue';
// 优惠券列表
import CouponList from '~/pages/coupon/list.vue';
//管理员列表
import ManagerList from '~/pages/manager/list.vue';
//菜单权限
import AccessList from '~/pages/access/list.vue';
//角色管理
import RoleList from  '~/pages/role/list.vue';
//商品规格管理
import SkusList from  '~/pages/skus/list.vue';
//会员等级
import LevelList from  '~/pages/level/list.vue';
//支付设置
import SettingBuy from '~/pages/setting/buy.vue';
//物流设置
import SettingShip from '~/pages/setting/ship.vue';
//分销员管理
import DistributionIndex from '~/pages/distribution/index.vue';
//分销设置
import DistributionSetting from '~/pages/distribution/setting.vue';

//通用路由，所有用户共享
const routes = [
    {//默认路由
        path: '/',
        name: 'admin',
        component: Admin
    },
    {//登录页路由 /login，渲染 Login 组件
        path: '/login',
        component: Login,
        meta: {
            title: "登录页"
        }
    },// 将匹配所有内容并将其放在 `$route.params.pathMatch` 
    { //当用户访问任意未匹配到的路径时，会重定向到 /404 路径，并渲染 NotFound 组件
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },

    { //文件？？
        path: '/document',
        name: 'Document',
        component: Document
    },

    { //研报？？
        path: '/report',
        name: 'Report',
        component: Report
    }
    
];

//动态路由，菜单动态添加:通过`菜单路径`来匹配`路由项`，从而实现`动态路由的添加`
const asyncRoutes = [
    {
        path: '/',
        name:'/',
        component: Index,
        meta: {
            title: "后台首页"
        }
    },
    {
        path: '/goods/list',
        name:'/goods/list',
        component: GoodList,
        meta: {
            title: "商城管理"
        }
    },
    {
        path: '/category/list',
        name:'/category/list',
        component: CategoryList,
        meta: {
            title: "分类列表"
        }
    },
     {
        path: '/user/list',
        name:'/user/list',
        component: UserList,
        meta: {
            title: "用户列表"
        }
    },
    {
        path: '/order/list',
        name:'/order/list',
        component: OrderList,
        meta: {
            title: "订单列表"
        }
    },
    {
        path: '/comment/list',
        name:'/comment/list',
        component: CommentList,
        meta: {
            title: "评价列表"
        }
    },
    {
       path: '/image/list',
       name:'/image/list',
       component:ImageList,
       meta: {
           title: "图库列表"
       }
   },
   {
       path: '/notice/list',
       name:'/notice/list',
       component: NoticeList,
       meta: {
           title: "公告列表"
       }
   },
   {
       path: '/setting/base',
       name:'/setting/base',
       component:SettingBase,
       meta: {
           title: "配置列表"
       }
   },
   {
       path: '/coupon/list',
       name:'/coupon/list',
       component:CouponList,
       meta: {
           title: "优惠券列表"
       }
   },
   {
       path: '/manager/list',
       name:'/manager/list',
       component:ManagerList,
       meta: {
           title: "管理员管理"
       }
   },
   {
       path: '/access/list',
       name:'/access/list',
       component: AccessList,
       meta: {
           title: "菜单权限管理"
       }
   },
   {
       path: '/role/list',
       name:'/role/list',
       component:RoleList,
       meta: {
           title: "角色管理"
       }
   },
   {
       path: '/skus/list',
       name:'/skus/list',
       component:SkusList,
       meta: {
           title: "规格管理"
       }
   },
   {
       path: '/level/list',
       name:'/level/list',
       component:LevelList,
       meta: {
           title: "会员等级"
       }
   },
   {
       path: '/setting/buy',
       name:'/setting/buy',
       component:SettingBuy,
       meta: {
           title: "交易设置"
       }
   },
   {
       path: '/setting/ship',
       name:'/setting/ship',
       component:SettingShip,
       meta: {
           title: "物流设置"
       }
   },
   {
       path: '/distribution/index',
       name:'/distribution/index',
       component:DistributionIndex,
       meta: {
           title: "分销员管理"
       }
   },
   {
       path: '/distribution/setting',
       name:'/distribution/setting',
       component:DistributionSetting,
       meta: {
           title: "分销设置"
       }
   }
];

//创建路由实例
export const router = createRouter({
    history: createWebHashHistory(),
    routes
});

//动态添加路由
export function addRoutes(menus){
    // 是否有新的路由
    let hasNewRoutes = false;
    //根据传入的菜单项动态生成路由
    const findAndAddRoutesByMenus = (arr) => {
        //获取菜单项
        arr.forEach( e => {
            //获取后端传过来的菜单项的路径 e.frontpath
            //获取当前路由项:o表示 asyncRoutes 数组中的每一个路由项,检查当前元素 o 的 path 属性是否等于 e.frontPath 的值
            let item = asyncRoutes.find( o => o.path == e.frontpath  );
            //如果有这个路由并且未注册过该路由 iem.path和item.name相等
            if(item && !router.hasRoute(item.path)){
                //动态添加嵌套路由：给Admin组件子路由：当用户访问匹配到这些路由的路径时，`相应的组件`将会被渲染
                router.addRoute("admin",item)
                hasNewRoutes = true
            }
            //如果存在子菜单并且长度>0，就表示有子路由
            if(e.child && e.child.length > 0){
                //传入子菜单的路由
                findAndAddRoutesByMenus(e.child);
            }
        })
    }
    //调用方法
    findAndAddRoutesByMenus(menus);
    //查看现有路由
    return hasNewRoutes;
};