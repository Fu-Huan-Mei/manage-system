<template>
    <!--后台首页：导航区-->
    <el-container>

        <!--头部-->
        <el-header>
            <f-header></f-header>
        </el-header>

        <!--中下部分-->
        <el-container>

            <!--侧边-->
            <el-aside :width="$store.state.asideWidth" class="el-aside">
                <f-menu></f-menu>
            </el-aside>

            <!-- 主容器-->
            <el-main>

                <!--左侧：标签导航-->
                <f-tag-list></f-tag-list>

                <!--中间：主要内容：切换路由： v-slot="{ Component }"可以拿到点击之后切换的不同组件-->
                <router-view v-slot="{ Component }" >
                    <transition name="fade">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
                
            </el-main>
            
        </el-container>
    </el-container>
</template>
<script setup>
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "./components/FTagList.vue";
</script>
<style scoped>
.el-aside{
    transition:all 0.2s ;
}
.fade-enter-from{
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
}
.fade-leave-from{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
    transition: all 0.3s;
}
.fade-enter-active{
    transition-delay: 0.3s;
}
</style>