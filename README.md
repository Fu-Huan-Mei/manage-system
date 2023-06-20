## 友情提示

> 1. **快速体验项目**：[在线访问地址](http://www.toponlineweb.top) 。
> 2. **项目交流**：想要交流项目的朋友，可以加入[3533643117](#QQ号) 。
> 
## 前言

`manager-system`项目致力于打造一个完整的后台管理系统，采用现阶段流行技术实现。

## 项目介绍

`manager-system`项目是一个商城后台管理系统的前端项目，基于Vue+Element实现，采用Docker容器化部署。主要包含后台面板、商品管理、用户管理、订单管理、管理员管理、系统设置、分销模块、统计报表等功能。

### 项目演示

前端项目`manager-system`地址：https://github.com/Fu-Huan-Mei/manage-system.git

项目在线演示地址： [http://www.toponlineweb.top](http://www.toponlineweb.top)  

项目展示：


### 技术选型

| 技术              | 说明                  | 官网                                                         |
| ----------------- | --------------------- | ------------------------------------------------------------ |
| Vue               | 前端框架              | [https://vuejs.org/](https://vuejs.org/)                     |
| Vue-router        | 路由框架              | [https://router.vuejs.org/](https://router.vuejs.org/)       |
| Vuex              | 全局状态管理框架      | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)           |
| Element           | 前端UI框架            | [https://element.eleme.io/](https://element.eleme.io/)       |
| Axios             | 前端HTTP框架          | [https://github.com/axios/axios](https://github.com/axios/axios) |
| v-charts          | 基于Echarts的图表框架 | [https://v-charts.js.org/](https://v-charts.js.org/)         |
| Js-cookie         | cookie管理工具        | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie) |
| nprogress         | 进度条控件            | [https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress) |
| vue-element-admin | 项目脚手架参考        | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) |

### 项目布局

``` lua
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── login -- 登录页
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    └── sms -- 营销模块页面
```

## 搭建步骤
- 下载node并安装：[https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi);
- 该项目为前后端分离项目，访问本地访问接口需搭建后台环境，搭建请参考后端项目[传送门](https://github.com/macrozheng/mall);
- 访问在线接口无需搭建后台环境，只需将`config/dev.env.js`文件中的`BASE_API`改为[https://admin-api.macrozheng.com](https://admin-api.macrozheng.com)即可;
- 如果你对接的是[mall-swarm](https://github.com/macrozheng/mall-swarm) 微服务后台的话，所有接口都需要通过网关访问，需要将`config/dev.env.js`文件中的`BASE_API`改为[http://localhost:8201/mall-admin](http://localhost:8201/mall-admin) ；
- 克隆源代码到本地，使用IDEA打开，并完成编译;
- 在IDEA命令行中运行命令：`npm install`,下载相关依赖;
- 在IDEA命令行中运行命令：`npm run dev`,运行项目;
- 访问地址：[http://localhost:8090](http://localhost:8090) 即可打开后台管理系统页面;
- 具体部署过程请参考：[mall前端项目的安装与部署](https://www.macrozheng.com/mall/deploy/mall_deploy_web.html)
- 前端自动化部署请参考：[使用Jenkins一键打包部署前端应用，就是这么6！](https://www.macrozheng.com/mall/reference/jenkins_vue.html)

