<template>
    <!--后台布局：侧边菜单-->
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <!--菜单项：default-active="2" 表示默认选中菜单中的第二个菜单项-->
        <el-menu unique-opened default-active="2" class="border-0" @select="handleSelect" 
        :collapse="isCollapse" :collapse-transition="false" :default-active="defaultActive">

           <!--一级菜单下带有二级菜单-->
            <template v-for="(item, index) in asideMenus" :key="index">

                <!--:index="item.name"保证在当前菜单组件中的唯一性-->
                <!--如果是带有子菜单的菜单项：使用 <el-sub-menu> 组件来显示它的子菜单-->
                <!--一级菜单-->
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <!--具名插槽：自定义菜单项的`标题`部分-->
                    <template #title>
                        <!--动态图标-->
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <!--文本-->
                        <span>{{ item.name }}</span>
                    </template>
                    <!--二级菜单-->
                    <!--:index="item2.frontpath"保证在整个菜单中的唯一性-->
                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <!--文本-->
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <!--只有一级菜单项-->
                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>

            </template>
        </el-menu>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex';
const store = useStore();
const router = useRouter();
const route = useRoute();

//当前选中的标签导航或菜单项
const defaultActive = ref(route.path);

//监听路由变化:修复标签导航和菜单联动问题（组件内路由守卫）
onBeforeRouteUpdate((to, from) => {
    //标签导航或菜单项的选中状态与当前路由路径保持一致
    defaultActive.value = to.path;
})

//是否折叠:true->折叠；false->展开
//计算store.state.asideWidth变量是否等于'250px'，如果是，则isCollapse为false，否则为true
const isCollapse = computed(() => !(store.state.asideWidth == '250px'));

//获取侧边栏的菜单项：每当 store.state.menus 发生变化时，asideMenus 就会重新计算
const asideMenus = computed(() => store.state.menus);

//参数e就是frontpath的属性值
const handleSelect = (e) => {
    //路由直接进行跳转：点击“后台面板”跳转“主控台"路由，点击商品管理->跳转 "商品管理"
    router.push(e);
}
</script>
<style scoped>
.f-menu {
    transition: all 0.2s;
    width: 250px;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    /*超出部分要滚动*/
    @apply shadow-md fixed bg-light-50;
}

.f-menu::-webkit-scrollbar {
    width: 0px;/*去除滚动条*/
}
</style>