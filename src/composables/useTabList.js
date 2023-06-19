import { ref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
import { router } from '~/router/index.js';
export function useTabList() {
    const route = useRoute();
    const cookie = useCookies();

    //存储当前激活标签页:如果路由路径发生改变，activeTab 也会自动更新，从而保证了`当前激活的标签页`始终与`当前路由`匹配
    const activeTab = ref(route.path);

    //初始化导航标签页数组：title显示`标签页`的文本，path 表示该标签页对应的`路由路径`
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }
    ]);

    //点击 tab 新增按钮时触发
    function addTab(tab) {
        //当前Tab标签页列表中没有这个新的标签页
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1;
        //如果tabList 中不存在路由路径等于 tab.path 的`标签页`，可以将`要添加的标签页`添加到` tabList 数组`中
        if (noTab) {
            //将新标签页添加到标签列表中
            tabList.value.push(tab);
        }
        //将新标签页存储在cookie中，刷新后新标签页就不会消失
        cookie.set("tabList", tabList.value);
    }


    //初始化标签导航列表(解决页面刷新新增标签消失的问题):从cookie种拿到TabList列表
    function initTabList() {
        //cookie 来判断是否存在之前保存的标签页列表
        let tbs = cookie.get("tabList")
        //如果存在则将其值赋给 tabList 变量，使页面`重新加载`后`恢复`之前`打开的标签页`
        if (tbs) {
            tabList.value = tbs
        }
    }
    initTabList()

    //增加标签导航
    onBeforeRouteUpdate((to, from) => {
        //添加的新标签页处于激活状态
        activeTab.value = to.path;
        //添加新标签导航（路由）（获取要添加的标签导航标题和标签导航路径）
        addTab({
            title: to.meta.title,
            path: to.path
        })
    });

    //点击已添加的横向标签页后，浏览器中的路径也会自动更新到当前标签页（path自动更新)
    const changeTab = (t) => {
        // console.log(t);//t表示path
        activeTab.value = t;
        router.push(t);
    };

    //删除（关闭标签导航）
    //参数t，表示要关闭的标签页的路径
    const removeTab = (t) => {
        // console.log(t);//t表示path
        //tabList是一个数组，包含所有导航标签页的信息，每个标签页都有一个路径属性path
        let tabs = tabList.value
        //activeTab表示当前激活的标签页的路径
        let a = activeTab.value
        //判断当前关闭标签页是否为当前激活标签页
        if (a == t) {
            //获取每个导航标签页
            tabs.forEach((tab, index) => {
                //如果关闭的标签页是当前激活的标签页
                if (tab.path == t) {
                    //就找到下一个或上一个标签页并自动跳转
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    //如果有
                    if (nextTab) {
                        //即将跳转到达的路径赋值给当前激活标签页
                        a = nextTab.path
                    }
                }
            })
        }
        //如果存在下一个或上一个标签页，就将它的路径赋值给activeTab，以便自动跳转
        activeTab.value = a
        //只要不是要关闭的标签页，就可以保留在标签页数组中：函数会更新activeTab和tabList的值
        tabList.value = tabList.value.filter(tab => tab.path != t)
        //将更新后的tabList存储在cookie中，以便在页面刷新后能够恢复之前打开的标签页
        cookie.set("tabList", tabList.value)
    };

    //删除（关闭标签导航）
    const handleClose = (c) => {
        //关闭全部标签页（清除所有）
        if (c == 'clearAll') {
            //路由路径：切换首页
            activeTab.value = "/";
            //标签导航栏数组的值：过滤只剩下首页
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
        //关闭其它标签页
        } else if (c == 'clearOther') {
            //过滤只剩下首页和当前激活页
            tabList.value = tabList.value.filter(tab => {
                // console.log('tab=', tab);
                return tab.path == "/" || tab.path == activeTab.value
            })
            //保留首页和当前激活页的标签页
            // tabList.value = keepTabs
            //将更新后的 tabList 存储在 cookie 中，以便在页面刷新后能够恢复之前打开的标签页
            cookie.set("tabList", tabList.value)
        }
    };

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}