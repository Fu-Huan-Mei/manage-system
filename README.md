## 友情提示

> 1. **快速体验项目**：[在线访问地址](http://www.toponlineweb.top) 。
> 2. **项目交流**：想要交流项目的朋友，可以加入[3533643117](#QQ号) 。
> 
## 前言

`manager-system`项目致力于打造一个完整的后台管理系统，采用现阶段流行技术实现。

## 项目介绍

`manager-system`项目是一个商城的后台管理系统，采用Docker容器化部署。后台管理系统包含后台面板、商品管理、用户管理、订单管理、管理员管理、系统设置、分销模块、统计报表等模块。

### 项目演示

#### 后台管理系统

前端项目`manager-system`地址：https://github.com/Fu-Huan-Mei/manage-system.git

项目演示地址： [http://www.toponlineweb.top](http://www.toponlineweb.top)  

项目展示：

![后台首页](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172600838.png)

![商品管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172041072.png)

![分类管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172710489.png)

![规格管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172753720.png)

![优惠券管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172839732.png)

![用户列表](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620172935712.png)

![会员等级](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173019226.png)

![订单列表](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173107439.png)

![评价管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173138101.png)

![管理员管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173243891.png)

![权限管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173317870.png)

![角色管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173415804.png)

![基础设置](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173500279.png)

![交易设置](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173605301.png)

![分销员管理](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173632126.png)

![分销设置](C:\Users\86157\AppData\Roaming\Typora\typora-user-images\image-20230620173703860.png)



### 组织结构

``` lua
mall
├── mall-common -- 工具类及通用代码
├── mall-mbg -- MyBatisGenerator生成的数据库操作代码
├── mall-security -- SpringSecurity封装公用模块
├── mall-admin -- 后台商城管理系统接口
├── mall-search -- 基于Elasticsearch的商品搜索系统
├── mall-portal -- 前台商城系统接口
└── mall-demo -- 框架搭建时的测试代码
```

### 技术选型

#### 后端技术

| 技术                 | 说明                | 官网                                           |
| -------------------- | ------------------- | ---------------------------------------------- |
| SpringBoot           | Web应用开发框架      | https://spring.io/projects/spring-boot         |
| SpringSecurity       | 认证和授权框架      | https://spring.io/projects/spring-security     |
| MyBatis              | ORM框架             | http://www.mybatis.org/mybatis-3/zh/index.html |
| MyBatisGenerator     | 数据层代码生成器     | http://www.mybatis.org/generator/index.html    |
| Elasticsearch        | 搜索引擎            | https://github.com/elastic/elasticsearch       |
| RabbitMQ             | 消息队列            | https://www.rabbitmq.com/                      |
| Redis                | 内存数据存储         | https://redis.io/                              |
| MongoDB              | NoSql数据库         | https://www.mongodb.com                        |
| LogStash             | 日志收集工具        | https://github.com/elastic/logstash            |
| Kibana               | 日志可视化查看工具  | https://github.com/elastic/kibana              |
| Nginx                | 静态资源服务器      | https://www.nginx.com/                         |
| Docker               | 应用容器引擎        | https://www.docker.com                         |
| Jenkins              | 自动化部署工具      | https://github.com/jenkinsci/jenkins           |
| Druid                | 数据库连接池        | https://github.com/alibaba/druid               |
| OSS                  | 对象存储            | https://github.com/aliyun/aliyun-oss-java-sdk  |
| MinIO                | 对象存储            | https://github.com/minio/minio                 |
| JWT                  | JWT登录支持         | https://github.com/jwtk/jjwt                   |
| Lombok               | Java语言增强库      | https://github.com/rzwitserloot/lombok         |
| Hutool               | Java工具类库        | https://github.com/looly/hutool                |
| PageHelper           | MyBatis物理分页插件 | http://git.oschina.net/free/Mybatis_PageHelper |
| Swagger-UI           | API文档生成工具      | https://github.com/swagger-api/swagger-ui      |
| Hibernator-Validator | 验证框架            | http://hibernate.org/validator                 |

#### 前端技术

| 技术       | 说明                  | 官网                                   |
| ---------- | --------------------- | -------------------------------------- |
| Vue        | 前端框架              | https://vuejs.org/                     |
| Vue-router | 路由框架              | https://router.vuejs.org/              |
| Vuex       | 全局状态管理框架      | https://vuex.vuejs.org/                |
| Element    | 前端UI框架            | https://element.eleme.io               |
| Axios      | 前端HTTP框架          | https://github.com/axios/axios         |
| v-charts   | 基于Echarts的图表框架 | https://v-charts.js.org/               |
| Js-cookie  | cookie管理工具        | https://github.com/js-cookie/js-cookie |
| nprogress  | 进度条控件            | https://github.com/rstacruz/nprogress  |

#### 移动端技术

| 技术         | 说明             | 官网                                    |
| ------------ | ---------------- | --------------------------------------- |
| Vue          | 核心前端框架     | https://vuejs.org                       |
| Vuex         | 全局状态管理框架 | https://vuex.vuejs.org                  |
| uni-app      | 移动端前端框架   | https://uniapp.dcloud.io                |
| mix-mall     | 电商项目模板     | https://ext.dcloud.net.cn/plugin?id=200 |
| luch-request | HTTP请求框架     | https://github.com/lei-mu/luch-request  |

#### 架构图

##### 系统架构图

![系统架构图](http://img.macrozheng.com/mall/project/re_mall_system_arch.jpg)

##### 业务架构图

![系统架构图](http://img.macrozheng.com/mall/project/mall_business_arch.png)

#### 模块介绍

##### 后台管理系统 `mall-admin`

- 商品管理：[功能结构图-商品.jpg](document/resource/mind_product.jpg)
- 订单管理：[功能结构图-订单.jpg](document/resource/mind_order.jpg)
- 促销管理：[功能结构图-促销.jpg](document/resource/mind_sale.jpg)
- 内容管理：[功能结构图-内容.jpg](document/resource/mind_content.jpg)
- 用户管理：[功能结构图-用户.jpg](document/resource/mind_member.jpg)

##### 前台商城系统 `mall-portal`

[功能结构图-前台.jpg](document/resource/mind_portal.jpg)

#### 开发进度

![项目开发进度图](http://img.macrozheng.com/mall/project/re_mall_dev_flow.jpg)

## 环境搭建

### 开发工具

| 工具          | 说明                | 官网                                            |
| ------------- | ------------------- | ----------------------------------------------- |
| IDEA          | 开发IDE             | https://www.jetbrains.com/idea/download         |
| RedisDesktop  | redis客户端连接工具 | https://github.com/qishibo/AnotherRedisDesktopManager  |
| Robomongo     | mongo客户端连接工具 | https://robomongo.org/download                  |
| SwitchHosts   | 本地host管理        | https://oldj.github.io/SwitchHosts/             |
| X-shell       | Linux远程连接工具   | http://www.netsarang.com/download/software.html |
| Navicat       | 数据库连接工具      | http://www.formysql.com/xiazai.html             |
| PowerDesigner | 数据库设计工具      | http://powerdesigner.de/                        |
| Axure         | 原型设计工具        | https://www.axure.com/                          |
| MindMaster    | 思维导图设计工具    | http://www.edrawsoft.cn/mindmaster              |
| ScreenToGif   | gif录制工具         | https://www.screentogif.com/                    |
| ProcessOn     | 流程图绘制工具      | https://www.processon.com/                      |
| PicPick       | 图片处理工具        | https://picpick.app/zh/                         |
| Snipaste      | 屏幕截图工具        | https://www.snipaste.com/                       |
| Postman       | API接口调试工具      | https://www.postman.com/                        |
| Typora        | Markdown编辑器      | https://typora.io/                              |

### 开发环境

| 工具          | 版本号 | 下载                                                         |
| ------------- | ------ | ------------------------------------------------------------ |
| JDK           | 1.8    | https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html |
| Mysql         | 5.7    | https://www.mysql.com/                                       |
| Redis         | 7.0    | https://redis.io/download                                    |
| MongoDB       | 5.0    | https://www.mongodb.com/download-center                      |
| RabbitMQ      | 3.10.5 | http://www.rabbitmq.com/download.html                        |
| Nginx         | 1.22   | http://nginx.org/en/download.html                            |
| Elasticsearch | 7.17.3 | https://www.elastic.co/downloads/elasticsearch               |
| Logstash      | 7.17.3 | https://www.elastic.co/cn/downloads/logstash                 |
| Kibana        | 7.17.3 | https://www.elastic.co/cn/downloads/kibana                   |

### 搭建步骤

> Windows环境部署

- Windows环境搭建请参考：[mall在Windows环境下的部署](https://www.macrozheng.com/mall/deploy/mall_deploy_windows.html);
- 注意：只启动mall-admin,仅需安装Mysql、Redis即可;
- 克隆`mall-admin-web`项目，并导入到IDEA中完成编译：[前端项目地址](https://github.com/macrozheng/mall-admin-web);
- `mall-admin-web`项目的安装及部署请参考：[mall前端项目的安装与部署](https://www.macrozheng.com/mall/deploy/mall_deploy_web.html) 。

> Docker环境部署

- 使用虚拟机安装CentOS7.6请参考：[虚拟机安装及使用Linux，看这一篇就够了](https://www.macrozheng.com/tool/linux_install.html);
- Docker环境的安装请参考：[开发者必备Docker命令](https://www.macrozheng.com/mall/reference/linux_command.html);
- 本项目Docker镜像构建请参考：[使用Maven插件为SpringBoot应用构建Docker镜像](https://www.macrozheng.com/project/maven_docker_fabric8.html);
- 本项目在Docker容器下的部署请参考：[mall在Linux环境下的部署（基于Docker容器）](https://www.macrozheng.com/mall/deploy/mall_deploy_docker.html);
- 本项目使用Docker Compose请参考： [mall在Linux环境下的部署（基于Docker Compose）](https://www.macrozheng.com/mall/deploy/mall_deploy_docker_compose.html);
- 本项目在Linux下的自动化部署请参考：[mall在Linux环境下的自动化部署（基于Jenkins）](https://www.macrozheng.com/mall/deploy/mall_deploy_jenkins.html);

> 相关环境部署

- ELK日志收集系统的搭建请参考：[SpringBoot应用整合ELK实现日志收集](https://www.macrozheng.com/mall/reference/mall_tiny_elk.html);
- 使用MinIO存储文件请参考：[前后端分离项目，如何优雅实现文件存储](https://www.macrozheng.com/mall/technology/minio_use.html);
- 读写分离解决方案请参考：[你还在代码里做读写分离么，试试这个中间件吧](https://www.macrozheng.com/project/gaea.html);
- Redis集群解决方案请参考：[Docker环境下秒建Redis集群](https://www.macrozheng.com/blog/redis_cluster.html) 。


